'use client';

import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import Link from 'next/link';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { trackEvent } from 'fathom-client';
import { usePrefersReducedMotion } from '@/components/PageHeader';
import { LAND_PATH, VIEW_H, VIEW_W } from './world-land';

/** A city dot on the map. x/y are percentages of the basemap width/height. */
export interface MapMarker {
  id: string;
  city: string;
  country: string;
  url: string;
  x: number;
  y: number;
}

/** A zoom preset: padded bounding box (in %) of one region's markers. */
export interface RegionView {
  label: string;
  count: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

interface WorldMapProps {
  markers: MapMarker[];
  regionViews: RegionView[];
}

// View = world point (cx, cy as fractions of the basemap box) centered in the
// viewport, at zoom k. k=1 renders the whole world at container width.
interface View {
  cx: number;
  cy: number;
  k: number;
}

const MAX_K = 28;
const STAGE_RATIO = VIEW_H / VIEW_W;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Screen-size geometry of the (untransformed) stage box, derived from the
// container: full width, world aspect ratio, vertically centered.
interface StageRect {
  left: number;
  top: number;
  width: number;
  height: number;
  /** Container height / stage height — how much taller the viewport is. */
  viewportAspect: number;
}

function measureStage(container: HTMLElement): StageRect {
  const rect = container.getBoundingClientRect();
  const height = rect.width * STAGE_RATIO;
  return {
    left: rect.left,
    top: rect.top + (rect.height - height) / 2,
    width: rect.width,
    height,
    viewportAspect: rect.height / height,
  };
}

function clampView(view: View, viewportAspect: number): View {
  const k = clamp(view.k, 1, MAX_K);
  // Half the viewport, in world fractions, at this zoom.
  const halfW = 0.5 / k;
  const halfH = Math.min(0.5, viewportAspect / 2 / k);
  return {
    k,
    cx: clamp(view.cx, halfW, 1 - halfW),
    cy: halfH >= 0.5 ? 0.5 : clamp(view.cy, halfH, 1 - halfH),
  };
}

// Markers are memoized so pointer-driven pans (which only change the stage
// transform) never re-render 300 links. They re-render only when zoom changes.
const Markers = memo(function Markers({
  markers,
  k,
  animate,
  onNavigate,
  onMarkerFocus,
}: {
  markers: MapMarker[];
  k: number;
  animate: boolean;
  onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
  onMarkerFocus: (marker: MapMarker) => void;
}) {
  return (
    <>
      {markers.map((marker) => (
        <Link
          key={marker.id}
          href={marker.url}
          prefetch={false}
          className="group absolute block h-0 w-0 hover:z-20 focus-within:z-20"
          style={{
            left: `${marker.x}%`,
            top: `${marker.y}%`,
            transform: `scale(${1 / k})`,
            transition: animate ? 'transform 0.35s ease' : undefined,
          }}
          aria-label={`${marker.city}, ${marker.country}`}
          draggable={false}
          onClick={onNavigate}
          onFocus={() => onMarkerFocus(marker)}
        >
          {/* Hit target around a small dot, counter-scaled with zoom so it
              keeps its screen size: 16px for mouse precision in dense
              clusters, 24px on touch screens */}
          <span className="absolute -left-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full outline-none group-focus-visible:ring-2 group-focus-visible:ring-foreground pointer-coarse:-left-3 pointer-coarse:-top-3 pointer-coarse:h-6 pointer-coarse:w-6">
            <span
              className="h-[7px] w-[7px] rounded-full bg-foreground ring-1 ring-background transition-colors group-hover:bg-orange-600 group-focus-visible:bg-orange-600"
              aria-hidden="true"
            />
          </span>
          <span
            className="pointer-events-none absolute -top-8 left-0 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-0.5 text-xs text-popover-foreground shadow-sm group-hover:block group-focus-visible:block"
            aria-hidden="true"
          >
            {marker.city}
          </span>
        </Link>
      ))}
    </>
  );
});

export function WorldMap({ markers, regionViews }: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ cx: 0.5, cy: 0.5, k: 1 });
  const [gesturing, setGesturing] = useState(false);
  const [activeRegion, setActiveRegion] = useState<string | null>('World');
  const prefersReducedMotion = usePrefersReducedMotion();

  const initialViewRef = useRef<View | null>(null);
  // Active pointers (for pan + two-finger pinch) and drag-distance tracking
  // (so releasing a pan on top of a marker doesn't navigate).
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const dragDistanceRef = useRef(0);

  // Functional update so rapid successive gestures (double-tapping the zoom
  // button, wheel bursts) never operate on a stale view inside one batch.
  const applyView = useCallback((update: (prev: View) => View) => {
    const container = containerRef.current;
    const aspect = container ? measureStage(container).viewportAspect : 1;
    setView((prev) => clampView(update(prev), aspect));
  }, []);

  // On viewports taller than the world strip (phones), start zoomed in enough
  // to fill the height — a deliberate "cover" crop centered on the prime
  // meridian — instead of letterboxing a 130px-tall world.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const { viewportAspect } = measureStage(container);
    const initial = clampView(
      { cx: 0.5, cy: 0.5, k: Math.max(1, viewportAspect) },
      viewportAspect
    );
    initialViewRef.current = initial;
    setView(initial);
  }, []);

  // Zoom by `factor` keeping the world point under (fx, fy) fixed, where
  // fx/fy are fractions of the stage box.
  const zoomAt = useCallback(
    (factor: number, fx = 0.5, fy = 0.5) => {
      applyView((prev) => {
        const k = clamp(prev.k * factor, 1, MAX_K);
        const wx = prev.cx + (fx - 0.5) / prev.k;
        const wy = prev.cy + (fy - 0.5) / prev.k;
        return {
          k,
          cx: wx - (fx - 0.5) / k,
          cy: wy - (fy - 0.5) / k,
        };
      });
      setActiveRegion(null);
    },
    [applyView]
  );

  // Trackpad pinch / ctrl+wheel zoom. Native listener because it must call
  // preventDefault (React registers wheel listeners as passive). Plain wheel
  // is left alone so the page keeps scrolling normally.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const stage = measureStage(container);
      const fx = (event.clientX - stage.left) / stage.width;
      const fy = (event.clientY - stage.top) / stage.height;
      zoomAt(Math.exp(-event.deltaY * 0.01), fx, fy);
    };
    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // Deliberately no setPointerCapture here: capturing on pointerdown would
    // retarget the eventual `click` to the container and break marker
    // navigation. Capture starts in onPointerMove once a real drag begins.
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    dragDistanceRef.current = 0;
    setGesturing(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const pointers = pointersRef.current;
    const previous = pointers.get(event.pointerId);
    if (!container || !previous) return;

    const stage = measureStage(container);
    const next = { x: event.clientX, y: event.clientY };
    dragDistanceRef.current += Math.hypot(next.x - previous.x, next.y - previous.y);
    if (dragDistanceRef.current > 3 && !container.hasPointerCapture(event.pointerId)) {
      container.setPointerCapture(event.pointerId);
    }

    if (pointers.size === 2) {
      // Two-finger pinch: zoom by the distance ratio about the midpoint.
      const [a, b] = [...pointers.entries()].map(([id, p]) =>
        id === event.pointerId ? { id, ...next } : { id, ...p }
      );
      const [pa, pb] = [...pointers.values()];
      const oldDist = Math.hypot(pa.x - pb.x, pa.y - pb.y);
      const newDist = Math.hypot(a.x - b.x, a.y - b.y);
      if (oldDist > 0 && newDist > 0) {
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        zoomAt(
          newDist / oldDist,
          (midX - stage.left) / stage.width,
          (midY - stage.top) / stage.height
        );
      }
    } else if (pointers.size === 1) {
      applyView((prev) => ({
        k: prev.k,
        cx: prev.cx - (next.x - previous.x) / (stage.width * prev.k),
        cy: prev.cy - (next.y - previous.y) / (stage.height * prev.k),
      }));
      if (dragDistanceRef.current > 4) setActiveRegion(null);
    }

    pointers.set(event.pointerId, next);
  };

  const onPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size === 0) setGesturing(false);
  };

  const onDoubleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const stage = measureStage(container);
    zoomAt(2, (event.clientX - stage.left) / stage.width, (event.clientY - stage.top) / stage.height);
  };

  // A drag that ends on top of a marker must not navigate.
  const onMarkerNavigate = useCallback((event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (dragDistanceRef.current > 4) {
      event.preventDefault();
      return;
    }
    trackEvent('MAP_MARKER_CLICKED');
  }, []);

  // Keep keyboard focus useful: when a focused marker sits outside the current
  // viewport, pan it to the center so Tab walks the collection visibly.
  const onMarkerFocus = useCallback(
    (marker: MapMarker) => {
      const container = containerRef.current;
      if (!container) return;
      const { viewportAspect } = measureStage(container);
      applyView((prev) => {
        const fx = (marker.x / 100 - prev.cx) * prev.k + 0.5;
        const fy = ((marker.y / 100 - prev.cy) * prev.k) / viewportAspect + 0.5;
        if (fx >= 0.04 && fx <= 0.96 && fy >= 0.04 && fy <= 0.96) return prev;
        return { k: prev.k, cx: marker.x / 100, cy: marker.y / 100 };
      });
    },
    [applyView]
  );

  const showRegion = (region: RegionView) => {
    const container = containerRef.current;
    trackEvent('MAP_REGION_VIEW_CLICKED');
    setActiveRegion(region.label);
    if (region.label === 'World' && initialViewRef.current) {
      setView(initialViewRef.current);
      return;
    }
    const aspect = container ? measureStage(container).viewportAspect : 1;
    const w = (region.x1 - region.x0) / 100;
    const h = (region.y1 - region.y0) / 100;
    const k = clamp(Math.min(1 / w, aspect / h) * 0.92, 1, MAX_K);
    applyView(() => ({
      k,
      cx: (region.x0 + region.x1) / 200,
      cy: (region.y0 + region.y1) / 200,
    }));
  };

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
            onClick={() => showRegion(region)}
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
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onDoubleClick={onDoubleClick}
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
            <Markers
              markers={markers}
              k={view.k}
              animate={animate}
              onNavigate={onMarkerNavigate}
              onMarkerFocus={onMarkerFocus}
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
            onClick={() => {
              setActiveRegion('World');
              if (initialViewRef.current) setView(initialViewRef.current);
            }}
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
