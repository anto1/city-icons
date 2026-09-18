import type { Icon } from '@/types'

/**
 * A country page renders the same grid as the homepage, so a country holding
 * only one or two icons is a thinner copy of the city page it links to. Those
 * are kept out of the index (and out of the sitemap) while still being linked
 * and crawlable, so they pass link equity on to the city pages.
 */
export const COUNTRY_INDEX_THRESHOLD = 3

export function isIndexableCountry(iconsInCountry: Icon[]): boolean {
  return iconsInCountry.length >= COUNTRY_INDEX_THRESHOLD
}
