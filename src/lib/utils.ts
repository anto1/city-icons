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

// Format SVG for consistent display (used only for on-demand SVG loading)
export function formatSvg(svg: string, size: number = 56, useCurrentColor: boolean = true): string {
  let formatted = svg
    .replace(/width="[^"]*"/, `width="${size}"`)
    .replace(/height="[^"]*"/, `height="${size}"`)
    .replace(/viewBox="[^"]*"/, 'viewBox="0 0 120 120"');
  
  if (useCurrentColor) {
    formatted = formatted.replace(/fill="[^"]*"/g, 'fill="currentColor"');
  }
  
  return formatted;
}
