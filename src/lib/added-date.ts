import { changelog, weekToDate } from '@/data/changelog'
import type { Icon } from '@/types'

/**
 * Month an icon first appeared, from the changelog. The same lookup backs the
 * sitemap's lastmod; here it gives the city page a real publication date to
 * show and to put in `datePublished`.
 */
export function getIconAddedDate(icon: Icon): { iso: string; label: string } | undefined {
  for (const entry of changelog) {
    const hit = entry.cities.some(city =>
      typeof city === 'string'
        ? city.toLowerCase() === icon.city.toLowerCase()
        : city.city.toLowerCase() === icon.city.toLowerCase() &&
          city.country.toLowerCase() === icon.country.toLowerCase()
    )
    if (!hit) continue
    const date = weekToDate(entry.week)
    return {
      iso: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }),
    }
  }
  return undefined
}
