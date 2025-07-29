import { notFound } from 'next/navigation';
import ClientHome from '@/components/ClientHome';
import { Icon } from '@/types';
import fs from 'fs';
import path from 'path';
import iconData from '@/data/icons.json';
import { findIconBySlugs } from '@/lib/utils';

// Server-side function to load SVG content
async function loadSvgContent(filename: string): Promise<string> {
  try {
    const svgPath = path.join(process.cwd(), 'public', 'icons', filename);
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    return svgContent;
  } catch (error) {
    console.error('Error loading SVG:', error);
    return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/></svg>';
  }
}

// Server-side data preparation
async function getIconsData(): Promise<Icon[]> {
  const iconsWithSvg = await Promise.all(
    iconData.map(async (icon) => {
      const svgContent = await loadSvgContent(icon.svgFilename);
      return {
        ...icon,
        svgContent
      };
    })
  );

  // Sort alphabetically by city name
  return iconsWithSvg.sort((a, b) => a.city.localeCompare(b.city));
}

interface PageProps {
  params: Promise<{
    country: string;
    city: string;
  }>;
}

export default async function IconPage({ params }: PageProps) {
  const { country, city } = await params;
  const icons = await getIconsData();
  
  // Check if the icon exists
  const icon = findIconBySlugs(country, city, icons);
  
  if (!icon) {
    notFound();
  }

  return <ClientHome initialIcons={icons} />;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { country, city } = await params;
  const icons = await getIconsData();
  const icon = findIconBySlugs(country, city, icons);
  
  if (!icon) {
    return {
      title: 'Icon Not Found',
      description: 'The requested city icon could not be found.'
    };
  }

  const baseUrl = 'https://cities.partdirector.ch';
  const pageUrl = `${baseUrl}/${country}/${city}`;
  const description = icon.description || `Download the ${icon.name} icon representing ${icon.city}, ${icon.country}. High-quality SVG line art icon for your projects.`;

  return {
    title: `${icon.name} - ${icon.city}, ${icon.country} | City Icons`,
    description,
    keywords: `${icon.city}, ${icon.country}, city icon, SVG icon, line art, ${icon.name}, download icon`,
    authors: [{ name: 'Studio Partdirector' }],
    creator: 'Studio Partdirector',
    publisher: 'Studio Partdirector',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${icon.name} - ${icon.city}, ${icon.country}`,
      description,
      url: pageUrl,
      siteName: 'City Icons',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${icon.city} city icon`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${icon.name} - ${icon.city}, ${icon.country}`,
      description,
      images: [`${baseUrl}/og-image.png`],
      creator: '@partdirector',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Generate structured data for SEO
export async function generateStructuredData({ params }: PageProps) {
  const { country, city } = await params;
  const icons = await getIconsData();
  const icon = findIconBySlugs(country, city, icons);
  
  if (!icon) {
    return null;
  }

  const baseUrl = 'https://cities.partdirector.ch';
  const pageUrl = `${baseUrl}/${country}/${city}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: icon.name,
    description: icon.description || `Icon representing ${icon.city}, ${icon.country}`,
    url: pageUrl,
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
} 