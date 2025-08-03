'use client';

import { useEffect } from 'react';
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
    datePublished: icon.createdAt || '2024-01-01',
    dateModified: icon.updatedAt || '2024-01-01',
    image: `${baseUrl}/icons/${icon.svgFilename}`,
    keywords: `${icon.city}, ${icon.country}, city icon, SVG icon, line art`,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    license: `${baseUrl}/license`,
  };

  useEffect(() => {
    // Remove any existing structured data script
    const existingScript = document.querySelector('script[data-structured-data]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create and inject the structured data script in the head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-structured-data', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup function to remove the script when component unmounts
    return () => {
      const scriptToRemove = document.querySelector('script[data-structured-data]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [icon._id]); // Re-run when icon changes

  return null; // This component doesn't render anything
} 