import { Metadata } from 'next';
import iconData from '@/data';
import { StatisticsContent } from './StatisticsContent';
import { ContentPage } from '@/components/ContentPage';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbList } from '@/lib/breadcrumbs';
import { pageMetadata } from '@/lib/metadata';
import { absoluteUrl, STUDIO_ORG } from '@/lib/site';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

const path = '/statistics';

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

export const metadata: Metadata = pageMetadata({
  path,
  title: 'Collection Statistics',
  description: 'Explore statistics about our city icons collection - see coverage by country, region, and discover which areas have the most icons.',
  keywords: 'city icons statistics, icon collection stats, country coverage, svg icons data',
  og: { description: 'Explore statistics about our city icons collection.' },
  imageAlt: 'City Icons Statistics',
});

function generateStructuredData(stats: ReturnType<typeof calculateStats>) {
  return {
    '@type': 'WebPage',
    name: 'City Icons Statistics',
    description: `Collection of ${stats.totalIcons} city icons from ${stats.totalCountries} countries and territories`,
    url: absoluteUrl(path),
    author: STUDIO_ORG,
    breadcrumb: breadcrumbList([{ name: 'Statistics', path }]),
  };
}

export default function StatisticsPage() {
  const stats = calculateStats();

  return (
    <>
      <JsonLd data={generateStructuredData(stats)} />
      <ContentPage
        crumb="Statistics"
        path={path}
        title="Collection Statistics"
        intro={`${stats.totalIcons} icons from ${stats.totalCountries} countries and territories across ${stats.totalRegions} regions`}
      >
        <StatisticsContent stats={stats} />
      </ContentPage>
    </>
  );
}
