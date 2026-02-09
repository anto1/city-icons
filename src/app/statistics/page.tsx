import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import iconData from '@/data';
import { StatisticsContent } from './StatisticsContent';
import { PageHeader } from '@/components/PageHeader';
import { IconFooter } from '@/components/IconFooter';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

const baseUrl = 'https://svgcities.com';

// Calculate statistics
function calculateStats() {
  const icons = iconData;

  // Countries with icon counts
  const countryCounts: Record<string, number> = {};
  icons.forEach((icon) => {
    countryCounts[icon.country] = (countryCounts[icon.country] || 0) + 1;
  });

  // Region counts
  const regionCounts: Record<string, number> = {};
  icons.forEach((icon) => {
    regionCounts[icon.region] = (regionCounts[icon.region] || 0) + 1;
  });

  // Sort countries by count
  const sortedCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([country, count]) => ({ country, count }));

  // Sort regions by count
  const sortedRegions = Object.entries(regionCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([region, count]) => ({ region, count }));

  // Categories
  const categoryCounts: Record<string, number> = {};
  icons.forEach((icon) => {
    categoryCounts[icon.category] = (categoryCounts[icon.category] || 0) + 1;
  });

  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));

  // Total countries in the world (UN members)
  const totalWorldCountries = 193;
  const coveredCountries = Object.keys(countryCounts).length;
  const coveragePercentage = Math.round((coveredCountries / totalWorldCountries) * 100);

  return {
    totalIcons: icons.length,
    totalCountries: coveredCountries,
    totalRegions: Object.keys(regionCounts).length,
    coveragePercentage,
    remainingCountries: totalWorldCountries - coveredCountries,
    countries: sortedCountries,
    regions: sortedRegions,
    categories: sortedCategories,
    topCountry: sortedCountries[0],
    topRegion: sortedRegions[0],
  };
}

export const metadata: Metadata = {
  title: 'Statistics | City Icons Collection',
  description: 'Explore statistics about our city icons collection - see coverage by country, region, and discover which areas have the most icons.',
  keywords: 'city icons statistics, icon collection stats, country coverage, svg icons data',
  authors: [{ name: 'Studio Partdirector' }],
  creator: 'Studio Partdirector',
  publisher: 'Studio Partdirector',
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: `${baseUrl}/statistics`,
  },
  openGraph: {
    title: 'Statistics | City Icons Collection',
    description: 'Explore statistics about our city icons collection.',
    url: `${baseUrl}/statistics`,
    siteName: 'City Icons Collection',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'City Icons Statistics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Statistics | City Icons Collection',
    description: 'Explore statistics about our city icons collection.',
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

function generateStructuredData(stats: ReturnType<typeof calculateStats>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'City Icons Statistics',
    description: `Collection of ${stats.totalIcons} city icons from ${stats.totalCountries} countries`,
    url: `${baseUrl}/statistics`,
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
          name: 'Statistics',
          item: `${baseUrl}/statistics`,
        },
      ],
    },
  };
}

export default function StatisticsPage() {
  const stats = calculateStats();
  const structuredData = generateStructuredData(stats);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-background">
        <PageHeader />
        <div className="container mx-auto px-4 py-8">
          <nav aria-label="Breadcrumb" className="text-center mb-8 pt-8">
            <ol className="inline-flex items-center text-sm text-muted-foreground list-none">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                  Back to Icons
                </Link>
              </li>
            </ol>
          </nav>

          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Collection Statistics
            </h1>
            <p className="text-lg text-muted-foreground">
              {stats.totalIcons} icons from {stats.totalCountries} countries across {stats.totalRegions} regions
            </p>
          </header>

          <main>
            <StatisticsContent stats={stats} />
          </main>
        </div>
        <IconFooter icons={iconData} />
      </div>
    </>
  );
}
