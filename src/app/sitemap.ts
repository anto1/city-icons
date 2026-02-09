import { MetadataRoute } from 'next'
import iconData from '@/data'
import { slugify } from '@/lib/utils'
import { changelog } from '@/data/changelog'

// Parse ISO week string (e.g. "2025-W02") to a Date
function weekToDate(week: string): Date {
  const match = week.match(/^(\d{4})-W(\d{2})$/)
  if (!match) return new Date('2024-12-16') // fallback to initial collection date
  const year = parseInt(match[1])
  const weekNum = parseInt(match[2])
  // Jan 4 is always in ISO week 1
  const jan4 = new Date(year, 0, 4)
  const dayOfWeek = jan4.getDay() || 7
  const isoWeek1Start = new Date(jan4)
  isoWeek1Start.setDate(jan4.getDate() - dayOfWeek + 1)
  const result = new Date(isoWeek1Start)
  result.setDate(result.getDate() + (weekNum - 1) * 7)
  return result
}

// Build a map of city name -> last modified date from changelog
function buildCityDateMap(): Map<string, Date> {
  const map = new Map<string, Date>()
  for (const entry of changelog) {
    const date = weekToDate(entry.week)
    for (const city of entry.cities) {
      // Use the most recent entry (changelog is newest-first)
      if (!map.has(city)) {
        map.set(city, date)
      }
    }
  }
  return map
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cities.partdirector.ch'
  const cityDateMap = buildCityDateMap()

  // Most recent changelog date for homepage and dynamic pages
  const latestDate = changelog.length > 0 ? weekToDate(changelog[0].week) : new Date('2024-12-16')
  // Static content date
  const staticDate = new Date('2024-12-16')

  // Get unique countries that have icons
  const countriesWithIcons = [...new Set(iconData.map(icon => icon.country))]

  // For each country, use the most recent city addition date
  const countryUrls = countriesWithIcons.map(country => {
    const countryIcons = iconData.filter(icon => icon.country === country)
    const dates = countryIcons
      .map(icon => cityDateMap.get(icon.city))
      .filter((d): d is Date => d !== undefined)
    const latestCountryDate = dates.length > 0
      ? new Date(Math.max(...dates.map(d => d.getTime())))
      : staticDate
    return {
      url: `${baseUrl}/${slugify(country)}`,
      lastModified: latestCountryDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }
  })

  // Generate URLs for all icons with their changelog date
  const iconUrls = iconData.map(icon => ({
    url: `${baseUrl}/${slugify(icon.country)}/${slugify(icon.city)}`,
    lastModified: cityDateMap.get(icon.city) || staticDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
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
      url: `${baseUrl}/whats-new`,
      lastModified: latestDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/license`,
      lastModified: staticDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/roulette`,
      lastModified: staticDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...countryUrls,
    ...iconUrls,
  ]
} 