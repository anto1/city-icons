'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { IconGridProps } from '@/types';
import { trackEvent } from 'fathom-client';
import { ANIMATION, GRID, HOVER, BREAKPOINTS } from '@/lib/constants';
import { usePrefersReducedMotion } from './PageHeader';
import { IconCard } from './IconCard';

interface ExtendedIconGridProps extends IconGridProps {
  searchQuery?: string;
  selectedRegion?: string | null;
  onClearFilters?: () => void;
}

// Mirrors SearchBar's SEARCH_PERFORMED debounce so intermediate keystrokes
// don't each register as a failed search
const NO_RESULTS_TRACK_DEBOUNCE_MS = 800;

export default function IconGrid({ icons, searchQuery, selectedRegion, onClearFilters }: ExtendedIconGridProps) {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  // Callback-ref state so the mouse listeners re-attach whenever the <ul>
  // remounts (e.g. after an empty search result unmounts the grid)
  const [gridEl, setGridEl] = useState<HTMLUListElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Skip the proximity scale effect entirely under reduced motion:
    // with transitions clamped to ~0ms it degrades to frame-to-frame jitter
    if (!gridEl || prefersReducedMotion) {
      setMousePosition(null);
      return;
    }

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return; // Skip if a frame is already pending
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const rect = gridEl.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      });
    };

    const handleMouseLeave = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      setMousePosition(null);
    };

    gridEl.addEventListener('mousemove', handleMouseMove);
    gridEl.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      gridEl.removeEventListener('mousemove', handleMouseMove);
      gridEl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [gridEl, prefersReducedMotion]);

  // Per-mousemove layout constants — computed once per mouse update,
  // not per-card. Keeps the proximity scale O(n) trivial math.
  const scaleLayout = useMemo(() => {
    if (!mousePosition || !gridEl) return null;
    const rect = gridEl.getBoundingClientRect();
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
  }, [mousePosition, icons.length, gridEl]);

  const trimmedQuery = searchQuery?.trim() ?? '';
  const hasSearch = trimmedQuery.length > 0;
  const hasRegion = Boolean(selectedRegion);

  // Track searches that end with no results — the honest "please add this
  // city" signal. Debounced and deduped so each distinct settled query fires
  // exactly once, not on every keystroke/render.
  const lastNoResultsQuery = useRef<string | null>(null);
  const noResults = icons.length === 0;
  useEffect(() => {
    if (!noResults || !trimmedQuery || lastNoResultsQuery.current === trimmedQuery) {
      return;
    }
    const timeout = setTimeout(() => {
      lastNoResultsQuery.current = trimmedQuery;
      trackEvent('SEARCH_NO_RESULTS');
    }, NO_RESULTS_TRACK_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [noResults, trimmedQuery]);

  const emptyStateHint = hasSearch && hasRegion
    ? `No matches for “${searchQuery}” in ${selectedRegion}`
    : hasRegion
    ? `No matches in ${selectedRegion}`
    : hasSearch
    ? `No matches for “${searchQuery}” — try adjusting your search terms`
    : 'Try adjusting your search terms';

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
    <>
      {/* Announce result changes to screen readers */}
      <p role="status" className="sr-only">
        {icons.length === 0
          ? 'No icons found'
          : `${icons.length} ${icons.length === 1 ? 'icon' : 'icons'} found`}
      </p>

      {icons.length === 0 ? (
        <section className="flex flex-col justify-center items-center py-12" aria-label="No results">
          <p className="text-lg text-muted-foreground mb-2">No icons found</p>
          <p className="text-sm text-muted-foreground">{emptyStateHint}</p>
          {onClearFilters && (hasSearch || hasRegion) && (
            <button
              onClick={onClearFilters}
              className="mt-4 px-4 py-2 rounded-full text-sm font-medium bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
            >
              Clear search and filters
            </button>
          )}
        </section>
      ) : (
        <ul
          ref={setGridEl}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 relative list-none"
          aria-label={`City icons collection - ${icons.length} icons`}
        >
          {icons.map((icon, index) => (
            <li key={icon._id} className="list-none">
              <IconCard
                icon={icon}
                className="icon-card-animate"
                style={{
                  transform: `scale(${getScale(index)})`,
                  zIndex: getScale(index) > 1 ? Math.floor(getScale(index) * 10) : 1,
                  cursor: 'pointer',
                  animationDelay: `${Math.min(index * ANIMATION.STAGGER_DELAY_INCREMENT, ANIMATION.STAGGER_DELAY_MAX)}ms`
                }}
                onClick={() => {
                  // Aggregate event (queryable total) + per-city breakdown
                  trackEvent('ICON_CLICK');
                  trackEvent(`ICON_CLICK_${icon.city.replace(/\s+/g, '_').toUpperCase()}`);
                }}
                ariaLabel={`${icon.city}, ${icon.country} - ${icon.name} icon`}
                imageAlt={`${icon.name} - line art icon of ${icon.city}, ${icon.country}`}
                imageTitle={`${icon.city}, ${icon.country} - ${icon.name}`}
                // Load the first grid rows eagerly (LCP candidates),
                // lazy-load the rest as they scroll into view
                imageLoading={index < GRID.EAGER_LOAD_COUNT ? 'eager' : 'lazy'}
                hoverTint
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
