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

// Icon size constants
export const ICON_SIZE = {
  /** Small icon size (grid items) */
  SM: 56,
  /** Medium icon size (modal preview) */
  MD: 96,
  /** Large icon size (city page) */
  LG: 128,
  /** Header random icons */
  HEADER: 56,
} as const;

// SVG viewBox constant
export const SVG_VIEWBOX = '0 0 120 120';

// Hover effect constants
export const HOVER = {
  /** Maximum scale increase on hover (8% = 0.08) */
  MAX_SCALE_INCREASE: 0.08,
  /** Distance factor for proximity effect */
  PROXIMITY_FACTOR: 0.8,
} as const;

// Search constants
export const SEARCH = {
  /** Maximum number of search suggestions to show */
  MAX_SUGGESTIONS: 5,
  /** Minimum characters for country match */
  MIN_COUNTRY_MATCH_LENGTH: 3,
  /** Common country abbreviations that bypass min length */
  COUNTRY_ABBREVIATIONS: ['usa', 'uk', 'uae'],
} as const;

// External URLs
export const URLS = {
  STUDIO: 'https://partdirector.ch',
  GITHUB: 'https://github.com/anto1/city-icons',
  BASE: 'https://cities.partdirector.ch',
} as const;

// Breakpoints (in pixels) - matches Tailwind defaults
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const;

