import { notFound } from 'next/navigation';
import ClientHome from '@/components/ClientHome';
import { Icon } from '@/types';
import fs from 'fs';
import path from 'path';
import iconData from '@/data/icons.json';
import { slugify } from '@/lib/utils';

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
  
  // Filter icons for this country
  const countryIcons = allIcons.filter(icon => 
    slugify(icon.country) === country
  );
  
  if (countryIcons.length === 0) {
    notFound();
  }

  // Get the country name from the first icon (they should all have the same country)
  const countryName = countryIcons[0].country;

  return <ClientHome initialIcons={allIcons} countryFilter={countryName} />;
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
  };
} 