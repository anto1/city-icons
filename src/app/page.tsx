import ClientHome from '@/components/ClientHome';
import iconData from '@/data';

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

// Generate structured data for the homepage (kept small - no full ItemList)
function generateStructuredData(icons: typeof iconData) {
  // Get unique countries
  const countries = [...new Set(icons.map(icon => icon.country))].sort();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'City Icons Collection',
    description: `Discover ${icons.length} beautiful line art icons representing cities from ${countries.length} countries around the world by Studio Partdirector.`,
    url: baseUrl,
    numberOfItems: icons.length,
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
