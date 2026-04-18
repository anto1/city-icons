'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IconGridProps } from '@/types';
import { trackEvent } from 'fathom-client';
import { getIconUrl, getIconSvgUrl } from '@/lib/utils';
import { ANIMATION, GRID, HOVER, BREAKPOINTS } from '@/lib/constants';

// Skeleton component for loading state
function IconSkeleton() {
  return (
    <li className="group cursor-pointer transition-all duration-500 ease-out p-4 rounded-[48px] flex flex-col items-center justify-center animate-pulse list-none" 
         style={{ aspectRatio: '1 / 1' }}>
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="w-14 h-14 bg-muted rounded-lg mb-4" aria-hidden="true"></div>
        <div className="text-center w-full">
          <div className="h-5 bg-muted rounded mb-1" aria-hidden="true"></div>
          <div className="h-4 bg-muted rounded w-3/4 mx-auto" aria-hidden="true"></div>
        </div>
      </div>
    </li>
  );
}

export default function IconGrid({ icons, loading }: IconGridProps) {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  
  useEffect(() => {
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return; // Skip if a frame is already pending
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (gridRef.current) {
          const rect = gridRef.current.getBoundingClientRect();
          setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          });
        }
      });
    };

    const handleMouseLeave = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      setMousePosition(null);
    };

    const grid = gridRef.current;
    if (grid) {
      grid.addEventListener('mousemove', handleMouseMove);
      grid.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (grid) {
        grid.removeEventListener('mousemove', handleMouseMove);
        grid.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Per-mousemove layout constants — computed once per mouse update,
  // not per-card. Keeps the proximity scale O(n) trivial math.
  const scaleLayout = useMemo(() => {
    if (!mousePosition || !gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const width = window.innerWidth;
    const cols =
      width >= BREAKPOINTS.XL ? GRID.COLUMNS.XL
      : width >= BREAKPOINTS.LG ? GRID.COLUMNS.LG
      : width >= BREAKPOINTS.MD ? GRID.COLUMNS.MD
      : width >= BREAKPOINTS.SM ? GRID.COLUMNS.SM
      : GRID.COLUMNS.DEFAULT;
    const rows = Math.ceil(icons.length / cols);
    const cardWidth = rect.width / cols;
    const cardHeight = rect.height / rows;
    const maxDistance = Math.min(cardWidth, cardHeight) * HOVER.PROXIMITY_FACTOR;
    return { cols, cardWidth, cardHeight, maxDistance };
  }, [mousePosition, icons.length]);

  if (loading) {
    return (
      <ul
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 relative list-none"
        aria-label="Loading city icons"
        aria-busy="true"
      >
        {Array.from({ length: GRID.SKELETON_COUNT }).map((_, index) => (
          <IconSkeleton key={index} />
        ))}
      </ul>
    );
  }

  if (icons.length === 0) {
    return (
      <section className="flex flex-col justify-center items-center py-12" aria-label="No results">
        <p className="text-lg text-muted-foreground mb-2">No icons found</p>
        <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
      </section>
    );
  }

  const getScale = (index: number) => {
    if (!mousePosition || !scaleLayout) return 1;
    const { cols, cardWidth, cardHeight, maxDistance } = scaleLayout;

    const row = Math.floor(index / cols);
    const col = index % cols;
    const dx = mousePosition.x - (col * cardWidth + cardWidth / 2);
    const dy = mousePosition.y - (row * cardHeight + cardHeight / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > maxDistance) return 1;
    const proximity = 1 - distance / maxDistance;
    return Math.max(1, 1 + proximity * HOVER.MAX_SCALE_INCREASE);
  };

  return (
    <ul 
      ref={gridRef}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 relative list-none"
      aria-label={`City icons collection - ${icons.length} icons`}
    >
      {icons.map((icon, index) => (
        <li key={icon._id} className="list-none">
          <Link
            href={getIconUrl(icon)}
            className="icon-card-animate group cursor-pointer hover:cursor-pointer active:cursor-pointer transition-all duration-500 ease-out hover:border-2 hover:border-border p-4 rounded-[48px] flex flex-col items-center justify-center h-full" 
            style={{ 
              aspectRatio: '1 / 1',
              transform: `scale(${getScale(index)})`,
              zIndex: getScale(index) > 1 ? Math.floor(getScale(index) * 10) : 1,
              cursor: 'pointer',
              animationDelay: `${Math.min(index * ANIMATION.STAGGER_DELAY_INCREMENT, ANIMATION.STAGGER_DELAY_MAX)}ms`
            }} 
            onClick={() => {
              // Track icon click with city data
              trackEvent(`ICON_CLICK_${icon.city.replace(/\s+/g, '_').toUpperCase()}`);
            }}
            aria-label={`${icon.city}, ${icon.country} - ${icon.name} icon`}
          >
            <article className="flex flex-col items-center justify-center flex-1">
              <div className="w-14 h-14 text-muted-foreground group-hover:text-[#E2725B] transition-colors duration-200 flex items-center justify-center mb-4">
                <Image
                  src={getIconSvgUrl(icon)}
                  alt={`${icon.name} - line art icon of ${icon.city}, ${icon.country}`}
                  title={`${icon.city}, ${icon.country} - ${icon.name}`}
                  width={56}
                  height={56}
                  className="w-14 h-14 opacity-60 group-hover:opacity-100 transition-opacity duration-200 dark:invert"
                  loading="lazy"
                />
              </div>
              <div className="text-center w-full">
                <h3 className="text-base font-medium text-foreground truncate w-full mb-1">{icon.city}</h3>
                <p className="text-sm text-muted-foreground truncate w-full">{icon.country}</p>
              </div>
            </article>
          </Link>
        </li>
      ))}
    </ul>
  );
} 