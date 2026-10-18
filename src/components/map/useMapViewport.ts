import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import type { MapMarker, RegionView } from './types';
import { clamp, clampView, MAX_K, measureStage, type View } from './viewport';

/**
 * Pan/zoom state of the world map and the gestures that drive it: pointer
 * drag, two-finger pinch, ctrl/⌘+wheel, double-click, region presets, and
 * panning keyboard-focused markers into view. Spread the returned `handlers`
 * on the container element that `containerRef` points at.
 */
export function useMapViewport() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ cx: 0.5, cy: 0.5, k: 1 });
  const [gesturing, setGesturing] = useState(false);
  /** Region preset in effect, or null once the user pans/zooms away from it. */
  const [activeRegion, setActiveRegion] = useState<string | null>('World');

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

  /** Whether the pointer gesture that just ended was a drag, not a click. */
  const wasDrag = useCallback(() => dragDistanceRef.current > 4, []);

  // Keep keyboard focus useful: when a focused marker sits outside the current
  // viewport, pan it to the center so Tab walks the collection visibly.
  const focusMarker = useCallback(
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

  const resetView = () => {
    setActiveRegion('World');
    if (initialViewRef.current) setView(initialViewRef.current);
  };

  const showRegion = (region: RegionView) => {
    if (region.label === 'World' && initialViewRef.current) {
      resetView();
      return;
    }
    setActiveRegion(region.label);
    const container = containerRef.current;
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

  return {
    containerRef,
    view,
    gesturing,
    activeRegion,
    zoomAt,
    showRegion,
    resetView,
    focusMarker,
    wasDrag,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
      onDoubleClick,
    },
  };
}
