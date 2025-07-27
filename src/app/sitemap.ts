import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://cities.partdirector.ch',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://cities.partdirector.ch/license',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
  ]
} 