import { Metadata } from 'next';
import Link from 'next/link';
import iconData, { getCountryCounts } from '@/data';
import { StatisticsContent } from './StatisticsContent';
import { PageHeader } from '@/components/PageHeader';
import { IconFooter } from '@/components/IconFooter';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

const baseUrl = 'https://svgcities.com';

// Entities in the dataset that are not UN member states (observer states,
// partially recognized states, and territories). Kept explicit so the UN
// coverage numbers stay honest as the collection grows.
const NON_UN_MEMBERS = new Set([
  'Curaçao',
  'Kosovo',
  'New Caledonia',
  'Palestine',
  'Puerto Rico',
  'Taiwan',
  'Vatican City',
]);

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

  // Categories (every authored record has one; the type is optional only so
  // the slim client-facing GridIcon stays assignable to Icon)
  const categoryCounts: Record<string, number> = {};
  icons.forEach((icon) => {
    const category = icon.category ?? 'Uncategorized';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));

  // UN coverage compares only actual UN member states against the 193 total —
  // the dataset also includes territories and partially recognized states,
  // which must not inflate the percentage.
  const totalWorldCountries = 193;
  const coveredCountries = Object.keys(countryCounts).length;
  const coveredUnMembers = Object.keys(countryCounts).filter(
    (country) => !NON_UN_MEMBERS.has(country)
  ).length;
  const coveragePercentage = Math.round((coveredUnMembers / totalWorldCountries) * 100);

  return {
    totalIcons: icons.length,
    totalCountries: coveredCountries,
    unMemberCountries: coveredUnMembers,
    totalRegions: Object.keys(regionCounts).length,
    coveragePercentage,
    remainingCountries: totalWorldCountries - coveredUnMembers,
    countries: sortedCountries,
    regions: sortedRegions,
    categories: sortedCategories,
    topCountry: sortedCountries[0],
    topRegion: sortedRegions[0],
  };
}

export const metadata: Metadata = {
  title: 'Collection Statistics',
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
    title: 'Collection Statistics',
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
    title: 'Collection Statistics',
    description: 'Explore statistics about our city icons collection.',
    images: [`${baseUrl}/og-image.png`],
  },
};

function generateStructuredData(stats: ReturnType<typeof calculateStats>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'City Icons Statistics',
    description: `Collection of ${stats.totalIcons} city icons from ${stats.totalCountries} countries and territories`,
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
          {/* Visible trail mirrors the BreadcrumbList JSON-LD (Home / Statistics) */}
          <nav aria-label="Breadcrumb" className="text-center mb-8 pt-8">
            <ol className="inline-flex items-center text-sm text-muted-foreground list-none">
              <li className="flex items-center">
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
                <span className="mx-2" aria-hidden="true">/</span>
              </li>
              <li aria-current="page">
                <span className="text-foreground font-medium">Statistics</span>
              </li>
            </ol>
          </nav>

          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Collection Statistics
            </h1>
            <p className="text-lg text-muted-foreground">
              {stats.totalIcons} icons from {stats.totalCountries} countries and territories across {stats.totalRegions} regions
            </p>
          </header>

          <main>
            <StatisticsContent stats={stats} />
          </main>
        </div>
        <IconFooter countries={getCountryCounts()} totalIcons={iconData.length} />
      </div>
    </>
  );
}
