import { MetadataRoute } from 'next'
import iconData from '@/data/icons.json'
import { slugify } from '@/lib/utils'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cities.partdirector.ch'
  
  // Get unique countries that have icons
  const countriesWithIcons = [...new Set(iconData.map(icon => icon.country))]
  
  // Generate URLs for all icons
  const iconUrls = iconData.map(icon => ({
    url: `${baseUrl}/${slugify(icon.country)}/${slugify(icon.city)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Generate URLs for country pages
  const countryUrls = countriesWithIcons.map(country => ({
    url: `${baseUrl}/${slugify(country)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/license`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/roulette`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...countryUrls,
    ...iconUrls,
  ]
} 