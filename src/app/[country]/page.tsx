import { notFound } from 'next/navigation';
import ClientHome from '@/components/ClientHome';
import iconData from '@/data';
import { slugify } from '@/lib/utils';

const baseUrl = 'https://cities.partdirector.ch';

// Static icon data - no SVG content loading
function getIconsData() {
  return [...iconData].sort((a, b) => a.city.localeCompare(b.city));
}

// Generate all possible country pages at build time (SSG)
export async function generateStaticParams() {
  const countries = [...new Set(iconData.map(icon => icon.country))];
  return countries.map((country) => ({
    country: slugify(country),
  }));
}

// Force static generation — dynamicParams=false returns 404 for unknown slugs
export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = false;

interface PageProps {
  params: Promise<{
    country: string;
  }>;
}

// Generate structured data for country page (limited ItemList for size)
function generateStructuredData(countryName: string, countrySlug: string, countryIcons: typeof iconData) {
  const pageUrl = `${baseUrl}/${countrySlug}`;
  
  // Limit to first 15 items to keep JSON-LD size reasonable
  const limitedIcons = countryIcons.slice(0, 15);
  
  return [
    // CollectionPage schema
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${countryName} City Icons`,
      description: `Discover ${countryIcons.length} beautiful line art icons representing cities in ${countryName}.`,
      url: pageUrl,
      author: {
        '@type': 'Organization',
        name: 'Studio Partdirector',
        url: 'https://partdirector.ch',
      },
      mainEntity: {
        '@type': 'ItemList',
        name: `City Icons from ${countryName}`,
        numberOfItems: countryIcons.length,
        itemListElement: limitedIcons.map((icon, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CreativeWork',
            name: icon.name,
            url: `${baseUrl}/${slugify(icon.country)}/${slugify(icon.city)}`,
          },
        })),
      },
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
          name: countryName,
          item: pageUrl,
        },
      ],
    },
  ];
}

export default async function CountryPage({ params }: PageProps) {
  const { country } = await params;
  const allIcons = getIconsData();
  
  // Filter icons for this country
  const countryIcons = allIcons.filter(icon => slugify(icon.country) === country);
  
  if (countryIcons.length === 0) {
    notFound();
  }

  // Get the country name from the first icon
  const countryName = countryIcons[0].country;
  const structuredData = generateStructuredData(countryName, country, countryIcons);

  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <ClientHome initialIcons={allIcons} countryFilter={countryName} hideSearch={true} />
    </>
  );
}

// Generate metadata for SEO - uses static icon data (no file I/O)
export async function generateMetadata({ params }: PageProps) {
  const { country } = await params;
  
  // Filter icons for this country
  const countryIcons = iconData.filter(icon => 
    slugify(icon.country) === country
  );
  
  if (countryIcons.length === 0) {
    return {
      title: 'Country Not Found',
      description: 'The requested country could not be found.'
    };
  }

  const countryName = countryIcons[0].country;
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
      siteName: 'City Icons Collection',
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