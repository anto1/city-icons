import RoulettePage from '@/components/RoulettePage';
import iconData from '@/data';
import { Metadata } from 'next';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

const baseUrl = 'https://svgcities.com';

// SEO metadata
export const metadata: Metadata = {
  title: 'City Roulette - Where Should You Go This Year? | City Icons',
  description: 'Spin the roulette and discover your next travel destination! Get personalized travel suggestions from our collection of beautiful city icons. Where should you go this year?',
  keywords: 'city roulette, travel suggestions, travel destination, city icons, travel planning, random city picker',
  authors: [{ name: 'Studio Partdirector' }],
  creator: 'Studio Partdirector',
  publisher: 'Studio Partdirector',
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: `${baseUrl}/roulette`,
  },
  openGraph: {
    title: 'City Roulette - Where Should You Go This Year?',
    description: 'Spin the roulette and discover your next travel destination! Get personalized travel suggestions from our collection of beautiful city icons.',
    type: 'website',
    url: `${baseUrl}/roulette`,
    siteName: 'City Icons Collection',
    locale: 'en_US',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'City Roulette - Discover your next travel destination',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'City Roulette - Where Should You Go This Year?',
    description: 'Spin the roulette and discover your next travel destination!',
    images: [`${baseUrl}/og-image.png`],
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

// Structured data for the roulette page
function generateStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'City Roulette',
    description: 'Spin the roulette and discover your next travel destination!',
    url: `${baseUrl}/roulette`,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'Studio Partdirector',
      url: 'https://partdirector.ch',
    },
    breadcrumb: {
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
          name: 'City Roulette',
          item: `${baseUrl}/roulette`,
        },
      ],
    },
  };
}

export default function Roulette() {
  const structuredData = generateStructuredData();
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <RoulettePage icons={iconData} />
    </>
  );
} 