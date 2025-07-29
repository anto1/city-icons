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

// Generate URL for an icon
export function getIconUrl(icon: Icon): string {
  return `/${slugify(icon.country)}/city/${slugify(icon.city)}`;
}
