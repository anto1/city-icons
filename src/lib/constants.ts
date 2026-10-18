// Animation constants
export const ANIMATION = {
  /** Maximum delay for staggered icon animations (ms) */
  STAGGER_DELAY_MAX: 600,
  /** Delay increment per icon (ms) */
  STAGGER_DELAY_INCREMENT: 20,
} as const;

// Grid layout constants
export const GRID = {
  /** Number of columns at different breakpoints — must match ICON_GRID_CLASS */
  COLUMNS: {
    DEFAULT: 2,
    SM: 3,    // 640px+
    MD: 4,    // 768px+
    LG: 5,    // 1024px+
    XL: 6,    // 1280px+
  },
  /** Leading grid images loaded eagerly (above-the-fold / LCP candidates) */
  EAGER_LOAD_COUNT: 18,
  /** First grid icons preloaded from the homepage head */
  PRELOAD_ICON_COUNT: 6,
} as const;

/**
 * Classes for every icon-card grid (homepage, country and city pages). The
 * column counts are what IconGrid's proximity hover assumes via GRID.COLUMNS.
 */
export const ICON_GRID_CLASS =
  'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 relative list-none';

// Hover effect constants
export const HOVER = {
  /** Maximum scale increase on hover (8% = 0.08) */
  MAX_SCALE_INCREASE: 0.08,
  /** Distance factor for proximity effect */
  PROXIMITY_FACTOR: 0.8,
} as const;

// Breakpoints (in pixels) - matches Tailwind defaults
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const;

/** Raster size for the client-side PNG export (the common icon default). */
export const PNG_SIZE = 512;
