'use client';

import { Icon } from '@/types';
import { getIconUrl } from '@/lib/utils';

interface StructuredDataProps {
  icon: Icon;
}

export default function StructuredData({ icon }: StructuredDataProps) {
  const baseUrl = 'https://cities.partdirector.ch';
  const pageUrl = getIconUrl(icon);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: icon.name,
    description: icon.description || `Icon representing ${icon.city}, ${icon.country}`,
    url: `${baseUrl}${pageUrl}`,
    author: {
      '@type': 'Organization',
      name: 'Studio Partdirector',
      url: 'https://partdirector.ch',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Studio Partdirector',
      url: 'https://partdirector.ch',
    },
    datePublished: icon.createdAt,
    dateModified: icon.updatedAt,
    image: `${baseUrl}/icons/${icon.svgFilename}`,
    keywords: `${icon.city}, ${icon.country}, city icon, SVG icon, line art`,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    license: `${baseUrl}/license`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
} 