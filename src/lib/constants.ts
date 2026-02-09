// Animation constants
export const ANIMATION = {
  /** Maximum delay for staggered icon animations (ms) */
  STAGGER_DELAY_MAX: 600,
  /** Delay increment per icon (ms) */
  STAGGER_DELAY_INCREMENT: 20,
  /** Duration for fade transitions (ms) */
  FADE_DURATION: 200,
  /** Duration for scale transitions (ms) */
  SCALE_DURATION: 500,
} as const;

// Grid layout constants
export const GRID = {
  /** Number of columns at different breakpoints */
  COLUMNS: {
    DEFAULT: 2,
    SM: 3,    // 640px+
    MD: 4,    // 768px+
    LG: 5,    // 1024px+
    XL: 6,    // 1280px+
  },
  /** Gap between grid items (in Tailwind units) */
  GAP: 4,
  /** Number of skeleton items to show while loading */
  SKELETON_COUNT: 12,
} as const;

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



