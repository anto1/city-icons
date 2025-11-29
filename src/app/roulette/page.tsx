import RoulettePage from '@/components/RoulettePage';
import { Icon } from '@/types';
import fs from 'fs';
import path from 'path';
import iconData from '@/data';
import { Metadata } from 'next';

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

  return iconsWithSvg;
}

// SEO metadata
export const metadata: Metadata = {
  title: 'City Roulette - Where Should You Go This Year? | City Icons',
  description: 'Spin the roulette and discover your next travel destination! Get personalized travel suggestions from our collection of beautiful city icons. Where should you go this year?',
  keywords: 'city roulette, travel suggestions, travel destination, city icons, travel planning, random city picker',
  openGraph: {
    title: 'City Roulette - Where Should You Go This Year?',
    description: 'Spin the roulette and discover your next travel destination! Get personalized travel suggestions from our collection of beautiful city icons.',
    type: 'website',
    url: 'https://city-icons.com/roulette',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'City Roulette - Where Should You Go This Year?',
    description: 'Spin the roulette and discover your next travel destination!',
  },
};

export default async function Roulette() {
  const icons = await getIconsData();

  return <RoulettePage icons={icons} />;
} 