'use client';

import { useCallback, type MouseEvent as ReactMouseEvent } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { trackEvent } from 'fathom-client';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { LAND_PATH, VIEW_H, VIEW_W } from './world-land';
import { MapMarkers } from './MapMarkers';
import type { MapMarker, RegionView } from './types';
import { useMapViewport } from './useMapViewport';

interface WorldMapProps {
  markers: MapMarker[];
  regionViews: RegionView[];
}

/**
 * Pan/zoom world map over an inline SVG basemap — no runtime map library.
 * Gesture handling and view state live in useMapViewport; marker rendering in
 * MapMarkers; the geometry in viewport.ts.
 */
export function WorldMap({ markers, regionViews }: WorldMapProps) {
  const {
    containerRef,
    view,
    gesturing,
    activeRegion,
    zoomAt,
    showRegion,
    resetView,
    focusMarker,
    wasDrag,
    handlers,
  } = useMapViewport();
  const prefersReducedMotion = usePrefersReducedMotion();

  // A drag that ends on top of a marker must not navigate.
  const onMarkerNavigate = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      if (wasDrag()) {
        event.preventDefault();
        return;
      }
      trackEvent('MAP_MARKER_CLICKED');
    },
    [wasDrag]
  );

  const animate = !prefersReducedMotion && !gesturing;
  const transform = `translate(${(0.5 - view.cx * view.k) * 100}%, ${
    (0.5 - view.cy * view.k) * 100
  }%) scale(${view.k})`;

  return (
    <div>
      {/* Region shortcuts — the primary way into dense areas, especially on
          small screens where world-level markers are too tight to tap */}
      <div
        role="group"
        aria-label="Zoom to a region"
        className="mb-4 flex flex-wrap justify-center gap-2"
      >
        {regionViews.map((region) => (
          <button
            key={region.label}
            type="button"
            onClick={() => {
              trackEvent('MAP_REGION_VIEW_CLICKED');
              showRegion(region);
            }}
            aria-pressed={activeRegion === region.label}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 ${
              activeRegion === region.label
                ? 'bg-foreground text-background'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {region.label}
            {region.count > 0 && (
              <span className="ml-1 opacity-60" aria-hidden="true">
                {region.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Keyboard users can jump past the ~300 marker links */}
      <a
        href="#map-city-list"
        className="sr-only focus:not-sr-only focus:absolute focus:z-30 focus:rounded-md focus:border focus:border-border focus:bg-background focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip map markers to city list
      </a>

      <div
        ref={containerRef}
        aria-label="Interactive world map of all city icons"
        className="relative h-[64vw] max-h-[420px] w-full cursor-grab touch-pan-y select-none overflow-hidden rounded-xl border border-border bg-background active:cursor-grabbing md:h-auto md:max-h-none md:aspect-[1000/361]"
        style={{ touchAction: view.k > 1.01 ? 'none' : 'pan-y' }}
        {...handlers}
        onScroll={(event) => {
          // Browsers scroll overflow:hidden boxes when focusing off-screen
          // children, which would break the transform illusion — undo it
          // (focus handling pans instead).
          event.currentTarget.scrollTo(0, 0);
        }}
      >
        {/* Centerer: a world-aspect stage, vertically centered in viewports
            that are taller than the world strip (phones) */}
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2"
          style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
        >
          {/* Stage: everything inside shares one transform */}
          <div
            className="absolute inset-0"
            style={{
              transform,
              transformOrigin: '0 0',
              transition: animate ? 'transform 0.35s ease' : undefined,
            }}
          >
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d={LAND_PATH}
                fillRule="evenodd"
                strokeWidth={1.1 / view.k}
                strokeLinejoin="round"
                className="fill-muted stroke-muted-foreground/50"
              />
            </svg>
            <MapMarkers
              markers={markers}
              k={view.k}
              animate={animate}
              activeRegion={activeRegion}
              onNavigate={onMarkerNavigate}
              onMarkerFocus={focusMarker}
            />
          </div>
        </div>

        {/* Zoom controls */}
        <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-lg border border-border bg-background/90 shadow-sm backdrop-blur-sm">
          <button
            type="button"
            onClick={() => zoomAt(1.6)}
            aria-label="Zoom in"
            className="p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:bg-muted focus-visible:text-foreground"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => zoomAt(1 / 1.6)}
            aria-label="Zoom out"
            className="border-t border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:bg-muted focus-visible:text-foreground"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={resetView}
            aria-label="Reset map view"
            className="border-t border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:bg-muted focus-visible:text-foreground"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Drag to pan · pinch, double-click, or use the buttons to zoom · click a
        dot to open its city
      </p>
    </div>
  );
}
