import ClientHome from '@/components/ClientHome';
import iconData from '@/data';

// Static icon data - no SVG content loading, just metadata
// Icons are displayed via <img> tags pointing to /icons/*.svg (CDN-cached static files)
function getIconsData() {
  // Sort alphabetically by city name
  return [...iconData].sort((a, b) => a.city.localeCompare(b.city));
}

// Force static generation at build time
export const dynamic = 'force-static';
export const revalidate = false;

export default function Home() {
  const icons = getIconsData();

  return <ClientHome initialIcons={icons} />;
}
