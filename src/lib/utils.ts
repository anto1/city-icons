import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Icon } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert text to URL-friendly slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ł/g, 'l')
    .replace(/đ/g, 'd')
    .replace(/ø/g, 'o')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// URL segment for an icon's city page. Defaults to the slugified city name,
// but an icon may override it with an explicit `slug` when a city has more
// than one icon (e.g. Hanoi's Turtle Tower vs its Temple of Literature) —
// this keeps the displayed city name clean while the URLs stay unique.
export function getCitySlug(icon: Icon): string {
  return icon.slug ?? slugify(icon.city);
}

// Find icon by country and city slugs
export function findIconBySlugs(countrySlug: string, citySlug: string, icons: Icon[]): Icon | null {
  return icons.find(icon =>
    slugify(icon.country) === countrySlug &&
    getCitySlug(icon) === citySlug
  ) || null;
}

// Generate URL for an icon page
export function getIconUrl(icon: Icon): string {
  return `/${slugify(icon.country)}/${getCitySlug(icon)}`;
}

// Generate URL for the SVG file (static asset)
export function getIconSvgUrl(icon: Icon): string {
  return `/icons/${icon.svgFilename}`;
}

const SHORT_COUNTRY_ALIASES = new Set(['usa', 'uk', 'uae']);

// Score how well an icon matches a free-text query. 0 means no match.
// Higher tiers rank first: city matches beat country/region matches, which
// beat landmark name and tag matches — so a tag hit like "tower" never
// outranks an exact city hit. Short country terms require a prefix match or
// known alias so typing "in" doesn't surface every country containing "in".
// Name/tag matches require 3+ characters so short fragments don't surface
// unrelated landmarks.
export function getIconSearchScore(icon: Icon, query: string): number {
  const term = query.toLowerCase().trim();
  if (!term) return 0;

  const city = icon.city.toLowerCase();
  if (city === term) return 100;
  if (city.startsWith(term)) return 90;
  if (city.includes(term)) return 80;

  const country = icon.country.toLowerCase();
  const validCountryMatch =
    term.length >= 3 || SHORT_COUNTRY_ALIASES.has(term) || country.startsWith(term);
  if (country.includes(term) && validCountryMatch) return 70;

  if (icon.region.toLowerCase().includes(term)) return 60;

  if (term.length >= 3) {
    if (icon.name.toLowerCase().includes(term)) return 50;
    if (icon.tags.some(tag => tag.toLowerCase().includes(term))) return 40;
  }

  return 0;
}

// Whether an icon matches a free-text query (empty query matches everything).
export function iconMatchesQuery(icon: Icon, query: string): boolean {
  if (!query.trim()) return true;
  return getIconSearchScore(icon, query) > 0;
}

