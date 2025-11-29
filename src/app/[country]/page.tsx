import { notFound } from 'next/navigation';
import ClientHome from '@/components/ClientHome';
import { Icon } from '@/types';
import fs from 'fs';
import path from 'path';
import iconData from '@/data';
import { slugify } from '@/lib/utils';
import { Metadata } from 'next';

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
  }>;
}

export default async function CountryPage({ params }: PageProps) {
  const { country } = await params;
  const allIcons = await getIconsData();
  
  // Debug: Log the requested country and available countries
  console.log('🔍 Requested country slug:', country);
  const availableCountries = [...new Set(allIcons.map(icon => icon.country))];
  console.log('🔍 Available countries:', availableCountries);
  console.log('🔍 Available country slugs:', availableCountries.map(c => slugify(c)));
  
  // Filter icons for this country - make it case-insensitive
  const countryIcons = allIcons.filter(icon => {
    const iconCountrySlug = slugify(icon.country);
    const match = iconCountrySlug === country;
    console.log(`🔍 Comparing: "${iconCountrySlug}" === "${country}" = ${match}`);
    return match;
  });
  
  console.log('🔍 Found country icons:', countryIcons.length);
  
  if (countryIcons.length === 0) {
    console.log('❌ No icons found for country:', country);
    notFound();
  }

  // Get the country name from the first icon (they should all have the same country)
  const countryName = countryIcons[0].country;
  console.log('✅ Country name:', countryName);

  return <ClientHome initialIcons={allIcons} countryFilter={countryName} hideSearch={true} />;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { country } = await params;
  const allIcons = await getIconsData();
  
  // Filter icons for this country
  const countryIcons = allIcons.filter(icon => 
    slugify(icon.country) === country
  );
  
  if (countryIcons.length === 0) {
    return {
      title: 'Country Not Found',
      description: 'The requested country could not be found.'
    };
  }

  const countryName = countryIcons[0].country;
  const baseUrl = 'https://cities.partdirector.ch';
  const pageUrl = `${baseUrl}/${country}`;
  const description = `Discover beautiful line art icons representing cities in ${countryName}. Browse ${countryIcons.length} city icons from ${countryName} with download and copy functionality.`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${countryName} City Icons`,
    description,
    url: pageUrl,
    mainEntity: {
      '@type': 'Collection',
      name: `City Icons from ${countryName}`,
      description: `A collection of ${countryIcons.length} beautiful line art icons representing cities in ${countryName}`,
      numberOfItems: countryIcons.length,
      item: countryIcons.map(icon => ({
        '@type': 'CreativeWork',
        name: icon.name,
        description: icon.description || `Icon representing ${icon.city}, ${icon.country}`,
        url: `${baseUrl}/${slugify(icon.country)}/${slugify(icon.city)}`,
        image: `${baseUrl}/icons/${icon.svgFilename}`,
        creator: {
          '@type': 'Organization',
          name: 'Studio Partdirector',
          url: 'https://partdirector.ch',
        },
        about: {
          '@type': 'Place',
          name: icon.city,
          containedInPlace: {
            '@type': 'Country',
            name: icon.country,
          },
        },
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: countryName,
          item: pageUrl,
        },
      ],
    },
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
  };

  return {
    title: `${countryName} City Icons | City Icons Collection`,
    description,
    keywords: `${countryName}, city icons, ${countryIcons.map(icon => icon.city).join(', ')}, SVG icons, line art`,
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
      title: `${countryName} City Icons`,
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
          alt: `${countryName} city icons`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${countryName} City Icons`,
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
    other: {
      'application/ld+json': JSON.stringify(structuredData),
    },
  };
} 