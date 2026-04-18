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

// Find icon by country and city slugs
export function findIconBySlugs(countrySlug: string, citySlug: string, icons: Icon[]): Icon | null {
  return icons.find(icon => 
    slugify(icon.country) === countrySlug && 
    slugify(icon.city) === citySlug
  ) || null;
}

// Generate URL for an icon page
export function getIconUrl(icon: Icon): string {
  return `/${slugify(icon.country)}/${slugify(icon.city)}`;
}

// Generate URL for the SVG file (static asset)
export function getIconSvgUrl(icon: Icon): string {
  return `/icons/${icon.svgFilename}`;
}

const SHORT_COUNTRY_ALIASES = new Set(['usa', 'uk', 'uae']);

// Whether an icon matches a free-text query. Short country terms require a
// prefix match or known alias so typing "in" doesn't surface every country
// containing "in".
export function iconMatchesQuery(icon: Icon, query: string): boolean {
  const term = query.toLowerCase().trim();
  if (!term) return true;

  const city = icon.city.toLowerCase();
  if (city.includes(term)) return true;

  const country = icon.country.toLowerCase();
  const validCountryMatch =
    term.length >= 3 || SHORT_COUNTRY_ALIASES.has(term) || country.startsWith(term);
  if (country.includes(term) && validCountryMatch) return true;

  return icon.region.toLowerCase().includes(term);
}

