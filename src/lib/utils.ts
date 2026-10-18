import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { GridIcon } from '@/types'
import { getCitySlug, slugify } from './slugs.mjs'

export { getCitySlug, slugify }

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Find icon by country and city slugs
export function findIconBySlugs<T extends GridIcon>(countrySlug: string, citySlug: string, icons: T[]): T | null {
  return icons.find(icon =>
    slugify(icon.country) === countrySlug &&
    getCitySlug(icon) === citySlug
  ) || null;
}

// Generate URL for an icon page
export function getIconUrl(icon: GridIcon): string {
  return `/${slugify(icon.country)}/${getCitySlug(icon)}`;
}

// Generate URL for the SVG file (static asset)
export function getIconSvgUrl(icon: Pick<GridIcon, 'svgFilename'>): string {
  return `/icons/${icon.svgFilename}`;
}

/**
 * The landmark part of an icon name. Names are usually "{City} {Landmark}"
 * ("Barcelona Sagrada Familia"), so a leading city prefix is stripped — also
 * when the city carries a trailing generic word the name leaves off
 * ("Ho Chi Minh City" vs "Ho Chi Minh Bến Thành Market"). Names without the
 * prefix are returned whole. Shared by the page title, the "About the …"
 * heading and search suggestions so all three name the same thing.
 */
export function getLandmark(icon: Pick<GridIcon, 'name' | 'city'>): string {
  const name = icon.name.trim();
  const prefixes = [icon.city, icon.city.replace(/ (City|Town)$/i, '')];
  const prefix = prefixes.find((p) => name.toLowerCase().startsWith(`${p.toLowerCase()} `));
  return prefix ? name.slice(prefix.length + 1).trim() : name;
}

/** Whether the icon's name is just its city ("Kostanay"), with no landmark part. */
export function isCityOnlyName(icon: Pick<GridIcon, 'name' | 'city'>): boolean {
  return getLandmark(icon).toLowerCase() === icon.city.toLowerCase();
}

const SHORT_COUNTRY_ALIASES = new Set(['usa', 'uk', 'uae']);

// Score how well an icon matches a free-text query. 0 means no match.
// Higher tiers rank first: city matches beat country/region matches, which
// beat landmark name and tag matches — so a tag hit like "tower" never
// outranks an exact city hit. Short country terms require a prefix match or
// known alias so typing "in" doesn't surface every country containing "in".
// Name/tag matches require 3+ characters so short fragments don't surface
// unrelated landmarks.
export function getIconSearchScore(icon: GridIcon, query: string): number {
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
