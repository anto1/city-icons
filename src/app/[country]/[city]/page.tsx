import { notFound } from 'next/navigation';
import CityPage from '@/components/CityPage';
import iconData from '@/data';
import { findIconBySlugs, slugify } from '@/lib/utils';

const baseUrl = 'https://cities.partdirector.ch';

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

// Force static generation — dynamicParams=false returns 404 for unknown slugs
export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = false;

interface PageProps {
  params: Promise<{
    country: string;
    city: string;
  }>;
}

// Generate structured data for the city icon page
function generateStructuredData(icon: typeof iconData[0], countrySlug: string, citySlug: string) {
  const pageUrl = `${baseUrl}/${countrySlug}/${citySlug}`;
  
  return [
    // CreativeWork schema for the icon
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: icon.name,
      description: icon.description || `Icon representing ${icon.city}, ${icon.country}`,
      url: pageUrl,
      image: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icons/${icon.svgFilename}`,
        contentUrl: `${baseUrl}/icons/${icon.svgFilename}`,
        encodingFormat: 'image/svg+xml',
        name: `${icon.name} icon`,
        description: `SVG icon of ${icon.name} representing ${icon.city}, ${icon.country}`,
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
      about: {
        '@type': 'Place',
        name: icon.city,
        containedInPlace: {
          '@type': 'Country',
          name: icon.country,
        },
      },
      keywords: [icon.city, icon.country, 'city icon', 'SVG icon', 'line art', icon.name, ...(icon.tags || [])].filter(Boolean).join(', '),
      inLanguage: 'en-US',
      isAccessibleForFree: true,
      license: `${baseUrl}/license`,
      genre: 'Line Art',
    },
    // BreadcrumbList schema
    {
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
          item: `${baseUrl}/${countrySlug}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: icon.city,
          item: pageUrl,
        },
      ],
    },
  ];
}

export default async function IconPage({ params }: PageProps) {
  const { country, city } = await params;
  const icons = getIconsData();
  
  // Check if the icon exists
  const icon = findIconBySlugs(country, city, icons);
  
  if (!icon) {
    notFound();
  }

  const structuredData = generateStructuredData(icon, country, city);

  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <CityPage icon={icon} allIcons={icons} />
    </>
  );
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

  const pageUrl = `${baseUrl}/${country}/${city}`;
  const description = icon.description || `Download the ${icon.name} icon representing ${icon.city}, ${icon.country}. High-quality SVG line art icon for your projects.`;

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
      siteName: 'City Icons Collection',
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${icon.name} - ${icon.city}, ${icon.country}`,
      description,
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