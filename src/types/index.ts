/**
 * Slim icon shape that crosses the server→client boundary. Excludes
 * `description` (the bulk of the dataset — it is only rendered for the
 * current icon on its own city page) and `category`, which no client
 * component reads. `tags` stays because search matches on name and tags.
 */
export interface GridIcon {
  _id: string;
  name: string;
  city: string;
  country: string;
  region: string;
  tags: string[];
  svgFilename: string;
}

/**
 * Full icon record as authored in src/data/icons/*.json. Keep it server-side
 * (metadata, JSON-LD, statistics, OG images) and map lists to GridIcon via
 * toGridIcon() before passing them to client components. `category` is typed
 * optional so GridIcon stays assignable to Icon-typed helpers shared with
 * client code — every authored record has it.
 */
export interface Icon extends GridIcon {
  category?: string;
  description?: string;
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
  };
}

/** Per-country icon count for the footer country list. */
export interface CountryCount {
  country: string;
  count: number;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  allIcons?: GridIcon[];
}

export interface IconGridProps {
  icons: GridIcon[];
}
