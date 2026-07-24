import type { Metadata } from 'next';
import ClientHome from '@/components/ClientHome';
import iconData, { getCountryCounts, getFeaturedIcons, getSortedIcons } from '@/data';
import { Icon, toGridIcon } from '@/types';
import { getIconSvgUrl } from '@/lib/utils';
import { GRID } from '@/lib/constants';

const baseUrl = 'https://svgcities.com';

// Force static generation at build time
export const dynamic = 'force-static';
export const revalidate = false;

// Homepage-specific metadata: the canonical and og:url live here (not in the
// root layout) so future pages can't inherit a homepage canonical by omission.
// openGraph is not deep-merged with the layout's, so all fields are restated.
export const metadata: Metadata = {
  alternates: {
    canonical: `${baseUrl}/`,
  },
  openGraph: {
    title: 'City Icons Collection',
    description: `Discover beautiful line art icons representing ${iconData.length}+ cities around the world by Studio Partdirector. Browse, search, download, and copy free SVG icons.`,
    url: baseUrl,
    siteName: 'City Icons Collection',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'City Icons Collection - Beautiful line art icons representing cities around the world',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

// Generate structured data for the homepage (kept small - no full ItemList)
function generateStructuredData(icons: Icon[]) {
  // Get unique countries
  const countries = [...new Set(icons.map(icon => icon.country))].sort();

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'City Icons Collection',
    description: `Discover ${icons.length} beautiful line art icons representing cities from ${countries.length} countries around the world by Studio Partdirector.`,
    url: baseUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: icons.length,
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
}

export default function Home() {
  // Static icon data - no SVG content loading, just metadata.
  // Icons are displayed via <img> tags pointing to /icons/*.svg (CDN-cached static files)
  const icons = getSortedIcons();
  const structuredData = generateStructuredData(icons);

  return (
    <>
      {/* Preload the first visible grid icons — derived from the sorted
          dataset so the list can't drift; React hoists these into <head> */}
      {icons.slice(0, GRID.PRELOAD_ICON_COUNT).map((icon) => (
        <link
          key={icon._id}
          rel="preload"
          href={getIconSvgUrl(icon)}
          as="image"
          type="image/svg+xml"
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ClientHome
        initialIcons={icons.map(toGridIcon)}
        headerIcons={getFeaturedIcons().map(toGridIcon)}
        footerCountries={getCountryCounts()}
        totalIconCount={icons.length}
      />
    </>
  );
}
