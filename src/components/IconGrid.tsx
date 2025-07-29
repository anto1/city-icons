'use client';

import { useState, useRef, useEffect } from 'react';
import { IconGridProps } from '@/types';
import { trackEvent } from 'fathom-client';

// Skeleton component for loading state
function IconSkeleton() {
  return (
    <div className="group cursor-pointer transition-all duration-500 ease-out p-4 rounded-[48px] flex flex-col items-center justify-center animate-pulse" 
         style={{ aspectRatio: '1 / 1' }}>
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="w-14 h-14 bg-muted rounded-lg mb-4"></div>
        <div className="text-center w-full">
          <div className="h-5 bg-muted rounded mb-1"></div>
          <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default function IconGrid({ icons, loading, onIconClick }: IconGridProps) {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const handleMouseLeave = () => {
      setMousePosition(null);
    };

    const grid = gridRef.current;
    if (grid) {
      grid.addEventListener('mousemove', handleMouseMove);
      grid.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (grid) {
        grid.removeEventListener('mousemove', handleMouseMove);
        grid.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  if (loading) {
    return (
      <div 
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 relative"
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <IconSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (icons.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="text-lg text-muted-foreground mb-2">No icons found</div>
        <div className="text-sm text-muted-foreground">Try adjusting your search terms</div>
      </div>
    );
  }

  const getScale = (index: number) => {
    if (!mousePosition || !gridRef.current) return 1;
    
    const rect = gridRef.current.getBoundingClientRect();
    const cols = window.innerWidth >= 1280 ? 6 : window.innerWidth >= 1024 ? 5 : window.innerWidth >= 768 ? 4 : window.innerWidth >= 640 ? 3 : 2;
    const rows = Math.ceil(icons.length / cols);
    
    // Calculate card dimensions
    const cardWidth = rect.width / cols;
    const cardHeight = rect.height / rows;
    
    // Calculate card center position
    const row = Math.floor(index / cols);
    const col = index % cols;
    const cardCenterX = col * cardWidth + cardWidth / 2;
    const cardCenterY = row * cardHeight + cardHeight / 2;
    
    // Calculate distance from mouse to card center
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - cardCenterX, 2) + 
      Math.pow(mousePosition.y - cardCenterY, 2)
    );
    
    // Maximum distance for effect (adjust for desired range)
    const maxDistance = Math.min(cardWidth, cardHeight) * 0.8;
    
    // Calculate scale based on proximity (closer = larger scale)
    if (distance <= maxDistance) {
      const proximity = 1 - (distance / maxDistance);
      const baseScale = 1 + (proximity * 0.08); // Max 8% scale increase
      return Math.max(1, baseScale);
    }
    
    return 1;
  };

  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 relative"
    >
      {icons.map((icon, index) => (
        <div 
          key={icon._id} 
          className="group cursor-pointer hover:cursor-pointer active:cursor-pointer transition-all duration-500 ease-out hover:border-2 hover:border-[#fafafa] p-4 rounded-[48px] flex flex-col items-center justify-center" 
          style={{ 
            aspectRatio: '1 / 1',
            transform: `scale(${getScale(index)})`,
            zIndex: getScale(index) > 1 ? Math.floor(getScale(index) * 10) : 1,
            cursor: 'pointer'
          }} 
          onClick={() => {
            // Track icon click with city data
            trackEvent(`ICON_CLICK_${icon.city.replace(/\s+/g, '_').toUpperCase()}`);
            onIconClick(icon);
          }}
        >
          <div className="flex flex-col items-center justify-center flex-1">
            <div
              className="w-14 h-14 text-muted-foreground group-hover:text-[#E2725B] transition-colors duration-200 flex items-center justify-center mb-4"
              role="img"
              aria-label={`${icon.city} icon representing ${icon.name}`}
              title={`${icon.city}, ${icon.country} - ${icon.name}`}
              dangerouslySetInnerHTML={{
                __html: icon.svgContent
                  .replace(/width="[^"]*"/, 'width="56"')
                  .replace(/height="[^"]*"/, 'height="56"')
                  .replace(/viewBox="[^"]*"/, 'viewBox="0 0 120 120"')
                  .replace(/fill="[^"]*"/g, 'fill="currentColor"')
              }}
            />
            <div className="text-center w-full">
              <h3 className="text-base font-medium text-foreground truncate w-full mb-1">{icon.city}</h3>
              <p className="text-sm text-muted-foreground truncate w-full">{icon.country}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 