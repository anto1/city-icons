// Pure geometry of the /map viewport: no React, no DOM state.
import { VIEW_H, VIEW_W } from './world-land';

/**
 * World point (cx, cy as fractions of the basemap box) centered in the
 * viewport, at zoom k. k=1 renders the whole world at container width.
 */
export interface View {
  cx: number;
  cy: number;
  k: number;
}

export const MAX_K = 28;
const STAGE_RATIO = VIEW_H / VIEW_W;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Screen-size geometry of the (untransformed) stage box, derived from the
 * container: full width, world aspect ratio, vertically centered.
 */
export interface StageRect {
  left: number;
  top: number;
  width: number;
  height: number;
  /** Container height / stage height — how much taller the viewport is. */
  viewportAspect: number;
}

export function measureStage(container: HTMLElement): StageRect {
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

/** Keep the zoom in range and the visible window inside the world. */
export function clampView(view: View, viewportAspect: number): View {
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
