import { changelog, changelogCityMatchesIcon, weekToDate } from '@/data/changelog'
import type { GridIcon } from '@/types'

/**
 * Start of the changelog week an icon first appeared in. Backs both the
 * sitemap's <lastmod> and the city page's "Added" date / datePublished.
 *
 * Matching goes through changelogCityMatchesIcon so a city holding two icons
 * dates each one separately — a plain "Hanoi" entry belongs to the city's
 * default icon, and only a slug-qualified entry belongs to the second.
 */
export function getIconAddedWeek(icon: GridIcon): Date | undefined {
  const entry = changelog.find(e => e.cities.some(city => changelogCityMatchesIcon(city, icon)))
  return entry ? weekToDate(entry.week) : undefined
}

/** Month an icon was added, as an ISO date and a "September 2024" label. */
export function getIconAddedDate(icon: GridIcon): { iso: string; label: string } | undefined {
  const date = getIconAddedWeek(icon)
  if (!date) return undefined
  return {
    iso: date.toISOString().slice(0, 10),
    label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }),
  }
}
