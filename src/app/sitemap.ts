import { MetadataRoute } from 'next'
import iconData from '@/data'
import { slugify, getCitySlug, getIconSvgUrl } from '@/lib/utils'
import { changelog, changelogCityMatchesIcon, weekToDate } from '@/data/changelog'
import type { Icon } from '@/types'
import { COUNTRY_INDEX_THRESHOLD } from '@/lib/seo'

// Look up an icon's changelog date. Matching goes through
// changelogCityMatchesIcon so a city with two icons dates each separately:
// keying by city+country alone gave the city's original icon whatever week
// its second icon was added, and pushed that date into <lastmod> too.
function getIconDate(icon: Icon): Date | undefined {
  for (const entry of changelog) {
    if (entry.cities.some(city => changelogCityMatchesIcon(city, icon))) {
      return weekToDate(entry.week)
    }
  }
  return undefined
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://svgcities.com'

  // Most recent changelog date for homepage and dynamic pages
  const latestDate = changelog.length > 0 ? weekToDate(changelog[0].week) : undefined

  // Pages whose content has no real modification date get no <lastmod> at all.
  // Emitting an invented one teaches Google to distrust every lastmod we send.

  // Get unique countries that have icons
  const countriesWithIcons = [...new Set(iconData.map(icon => icon.country))]

  // For each country, use the most recent city addition date
  const countryUrls = countriesWithIcons.flatMap(country => {
    const countryIcons = iconData.filter(icon => icon.country === country)
    // Countries below the threshold render a near-duplicate of the single city
    // page they contain and are noindex — see [country]/page.tsx
    if (countryIcons.length < COUNTRY_INDEX_THRESHOLD) return []
    const dates = countryIcons
      .map(icon => getIconDate(icon))
      .filter((d): d is Date => d !== undefined)
    const latestCountryDate = dates.length > 0
      ? new Date(Math.max(...dates.map(d => d.getTime())))
      : undefined
    return [{
      url: `${baseUrl}/${slugify(country)}`,
      lastModified: latestCountryDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }]
  })

  // Generate URLs for all icons with their changelog date
  const iconUrls = iconData.map(icon => ({
    url: `${baseUrl}/${slugify(icon.country)}/${getCitySlug(icon)}`,
    lastModified: getIconDate(icon),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    // The icon is the page's reason to exist; declaring it emits <image:image>
    images: [`${baseUrl}${getIconSvgUrl(icon)}`],
  }))

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: latestDate,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: latestDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/statistics`,
      lastModified: latestDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/map`,
      lastModified: latestDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/whats-new`,
      lastModified: latestDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/license`,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/roulette`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...countryUrls,
    ...iconUrls,
  ]

  // Dedupe by URL so a data mistake can never emit duplicate <loc> entries
  // (first occurrence wins)
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>()
  for (const entry of entries) {
    if (!byUrl.has(entry.url)) {
      byUrl.set(entry.url, entry)
    }
  }
  return [...byUrl.values()]
} 