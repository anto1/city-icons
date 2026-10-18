/**
 * Slim icon shape that crosses the server→client boundary. Excludes
 * `description` and `symbolStory` (the bulk of the dataset — only the city
 * page renders them, server-side) and `category`, which no client component
 * reads. `tags` stays because search matches on name and tags. Shared helpers
 * (URLs, search, landmark) take this type, so both shapes can use them.
 */
export interface GridIcon {
  _id: string;
  name: string;
  city: string;
  country: string;
  region: string;
  tags: string[];
  svgFilename: string;
  /**
   * Explicit URL segment, overriding the slugified city name. Set only when a
   * city has more than one icon, so both get a unique page without polluting
   * the displayed city name. See getCitySlug() in src/lib/slugs.mjs.
   */
  slug?: string;
}

/**
 * Full icon record as authored in src/data/icons/*.json. Keep it server-side
 * (metadata, JSON-LD, statistics, OG images) and map lists to GridIcon via
 * toGridIcon() before passing them to client components.
 */
export interface Icon extends GridIcon {
  category: string;
  description: string;
  /**
   * Why this particular thing stands for the city — the origin of the symbol,
   * not a description of the city. Optional and authored per icon; the city
   * page renders it under the "About the {landmark}" heading, and it is what
   * the page has to say that a stock-icon site does not.
   */
  symbolStory?: string;
}

/** Map a full icon record to the slim client-facing shape. */
export function toGridIcon(icon: Icon): GridIcon {
  return {
    _id: icon._id,
    name: icon.name,
    city: icon.city,
    country: icon.country,
    region: icon.region,
    tags: icon.tags,
    svgFilename: icon.svgFilename,
    ...(icon.slug ? { slug: icon.slug } : {}),
  };
}

/** Per-country icon count for the footer country list. */
export interface CountryCount {
  country: string;
  count: number;
}
