import RoulettePage from '@/components/RoulettePage';
import iconData from '@/data';
import { Metadata } from 'next';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

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

export default function Roulette() {
  return <RoulettePage icons={iconData} />;
} 