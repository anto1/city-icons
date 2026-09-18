import { changelog, changelogCityMatchesIcon, weekToDate } from '@/data/changelog'
import type { Icon } from '@/types'

/**
 * Month an icon first appeared, from the changelog. The same lookup backs the
 * sitemap's lastmod; here it gives the city page a real publication date to
 * show and to put in `datePublished`.
 *
 * Matching goes through changelogCityMatchesIcon so a city holding two icons
 * dates each one separately — a plain "Hanoi" entry belongs to the city's
 * default icon, and only a slug-qualified entry belongs to the second.
 */
export function getIconAddedDate(icon: Icon): { iso: string; label: string } | undefined {
  for (const entry of changelog) {
    if (!entry.cities.some(city => changelogCityMatchesIcon(city, icon))) continue
    const date = weekToDate(entry.week)
    return {
      iso: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }),
    }
  }
  return undefined
}
