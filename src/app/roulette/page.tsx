import RoulettePage from '@/components/RoulettePage';
import iconData, { getCountryCounts } from '@/data';
import { toGridIcon } from '@/types';
import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbList } from '@/lib/breadcrumbs';
import { indexRobots, pageMetadata } from '@/lib/metadata';
import { absoluteUrl, STUDIO_ORG } from '@/lib/site';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

const path = '/roulette';

export const metadata: Metadata = pageMetadata({
  path,
  title: 'City Roulette - Where Should You Go This Year?',
  description: 'Spin the roulette and discover your next travel destination! Get personalized travel suggestions from our collection of beautiful city icons. Where should you go this year?',
  keywords: 'city roulette, travel suggestions, travel destination, city icons, travel planning, random city picker',
  og: { description: 'Spin the roulette and discover your next travel destination! Get personalized travel suggestions from our collection of beautiful city icons.' },
  twitter: { description: 'Spin the roulette and discover your next travel destination!' },
  imageAlt: 'City Roulette - Discover your next travel destination',
  robots: indexRobots(),
});

// Structured data for the roulette page
function generateStructuredData() {
  return {
    '@type': 'WebApplication',
    name: 'City Roulette',
    description: 'Spin the roulette and discover your next travel destination!',
    url: absoluteUrl(path),
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'USD',
    },
    author: STUDIO_ORG,
    breadcrumb: breadcrumbList([{ name: 'City Roulette', path }]),
  };
}

export default function Roulette() {
  return (
    <>
      <JsonLd data={generateStructuredData()} />
      <RoulettePage icons={iconData.map(toGridIcon)} footerCountries={getCountryCounts()} />
    </>
  );
} 