import { notFound } from 'next/navigation';
import CityPage from '@/components/CityPage';
import iconData from '@/data';
import { findIconBySlugs, slugify } from '@/lib/utils';

// Static icon data - no SVG content loading
function getIconsData() {
  return [...iconData].sort((a, b) => a.city.localeCompare(b.city));
}

// Generate all possible city pages at build time (SSG)
export async function generateStaticParams() {
  return iconData.map((icon) => ({
    country: slugify(icon.country),
    city: slugify(icon.city),
  }));
}

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

interface PageProps {
  params: Promise<{
    country: string;
    city: string;
  }>;
}

export default async function IconPage({ params }: PageProps) {
  const { country, city } = await params;
  const icons = getIconsData();
  
  // Check if the icon exists
  const icon = findIconBySlugs(country, city, icons);
  
  if (!icon) {
    notFound();
  }

  return <CityPage icon={icon} allIcons={icons} />;
}

// Generate metadata for SEO - uses static icon data (no file I/O)
export async function generateMetadata({ params }: PageProps) {
  const { country, city } = await params;
  const icon = findIconBySlugs(country, city, iconData);
  
  if (!icon) {
    return {
      title: 'Icon Not Found',
      description: 'The requested city icon could not be found.'
    };
  }

  const baseUrl = 'https://cities.partdirector.ch';
  const pageUrl = `${baseUrl}/${country}/${city}`;
  const description = icon.description || `Download the ${icon.name} icon representing ${icon.city}, ${icon.country}. High-quality SVG line art icon for your projects.`;

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
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
        name: icon.country,
        item: `${baseUrl}/${country}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: icon.city,
        item: pageUrl,
      },
    ],
  };

  return {
    title: `${icon.name} - ${icon.city}, ${icon.country} | City Icons`,
    description,
    keywords: `${icon.city}, ${icon.country}, city icon, SVG icon, line art, ${icon.name}, download icon, ${icon.tags?.join(', ') || ''}`,
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
    other: {
      'application/ld+json': JSON.stringify(breadcrumbStructuredData),
    },
  };
} 