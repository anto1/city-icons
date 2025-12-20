import ClientHome from '@/components/ClientHome';
import iconData from '@/data';
import { slugify } from '@/lib/utils';

const baseUrl = 'https://cities.partdirector.ch';

// Static icon data - no SVG content loading, just metadata
// Icons are displayed via <img> tags pointing to /icons/*.svg (CDN-cached static files)
function getIconsData() {
  // Sort alphabetically by city name
  return [...iconData].sort((a, b) => a.city.localeCompare(b.city));
}

// Force static generation at build time
export const dynamic = 'force-static';
export const revalidate = false;

// Generate structured data for the homepage
function generateStructuredData(icons: typeof iconData) {
  // Get unique countries
  const countries = [...new Set(icons.map(icon => icon.country))].sort();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'City Icons Collection',
    description: 'Discover beautiful line art icons representing cities around the world by Studio Partdirector. Browse 43+ cities with search, download, and copy functionality.',
    url: baseUrl,
    mainEntity: {
      '@type': 'ItemList',
      name: 'City Icon Collection',
      description: `A collection of ${icons.length} beautiful line art icons representing cities from ${countries.length} countries`,
      numberOfItems: icons.length,
      itemListElement: icons.map((icon, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: icon.name,
          description: icon.description || `Icon representing ${icon.city}, ${icon.country}`,
          url: `${baseUrl}/${slugify(icon.country)}/${slugify(icon.city)}`,
          image: `${baseUrl}/icons/${icon.svgFilename}`,
        },
      })),
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
  const icons = getIconsData();
  const structuredData = generateStructuredData(icons);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ClientHome initialIcons={icons} />
    </>
  );
}
