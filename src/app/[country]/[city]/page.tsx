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

  return {
    title: `${icon.name} - ${icon.city}, ${icon.country} | City Icons`,
    description: icon.description || `Icon representing ${icon.city}, ${icon.country}`,
    openGraph: {
      title: `${icon.name} - ${icon.city}, ${icon.country}`,
      description: icon.description || `Icon representing ${icon.city}, ${icon.country}`,
      type: 'website',
    },
  };
} 