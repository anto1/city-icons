import ClientHome from '@/components/ClientHome';
import { Icon } from '@/types';
import fs from 'fs';
import path from 'path';
import iconData from '@/data';

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

export default async function Home() {
  const icons = await getIconsData();

  return <ClientHome initialIcons={icons} />;
}
