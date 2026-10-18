import { notFound } from 'next/navigation';
import { isIndexableCountry } from '@/lib/seo'
import ClientHome from '@/components/ClientHome';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbList } from '@/lib/breadcrumbs';
import { fitTitle, indexRobots, pageMetadata } from '@/lib/metadata';
import { absoluteUrl, STUDIO_ORG } from '@/lib/site';
import iconData, { getCountryCounts, getFeaturedIcons, getSortedIcons } from '@/data';
import { Icon, toGridIcon } from '@/types';
import { slugify, getIconUrl } from '@/lib/utils';

// Generate all possible country pages at build time (SSG)
export async function generateStaticParams() {
  const countries = [...new Set(iconData.map(icon => icon.country))];
  return countries.map((country) => ({
    country: slugify(country),
  }));
}

// Force static generation — dynamicParams=false returns 404 for unknown slugs
export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = false;

interface PageProps {
  params: Promise<{
    country: string;
  }>;
}

// Generate structured data for country page (limited ItemList for size)
function generateStructuredData(countryName: string, countrySlug: string, countryIcons: Icon[]) {
  const pagePath = `/${countrySlug}`;

  // Limit to first 15 items to keep JSON-LD size reasonable
  const limitedIcons = countryIcons.slice(0, 15);

  return [
    {
      '@type': 'CollectionPage',
      name: `${countryName} City Icons`,
      description: `Discover ${countryIcons.length} beautiful line art icons representing cities in ${countryName}.`,
      url: absoluteUrl(pagePath),
      author: STUDIO_ORG,
      mainEntity: {
        '@type': 'ItemList',
        name: `City Icons from ${countryName}`,
        numberOfItems: countryIcons.length,
        itemListElement: limitedIcons.map((icon, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CreativeWork',
            name: icon.name,
            url: absoluteUrl(getIconUrl(icon)),
          },
        })),
      },
    },
    breadcrumbList([{ name: countryName, path: pagePath }]),
  ];
}

export default async function CountryPage({ params }: PageProps) {
  const { country } = await params;
  const allIcons = getSortedIcons();

  // Filter icons for this country — only these cross to the client
  const countryIcons = allIcons.filter(icon => slugify(icon.country) === country);

  if (countryIcons.length === 0) {
    notFound();
  }

  // Get the country name from the first icon
  const countryName = countryIcons[0].country;

  return (
    <>
      <JsonLd data={generateStructuredData(countryName, country, countryIcons)} />
      <ClientHome
        initialIcons={countryIcons.map(toGridIcon)}
        headerIcons={getFeaturedIcons().map(toGridIcon)}
        footerCountries={getCountryCounts()}
        totalIconCount={allIcons.length}
        countryFilter={countryName}
        hideSearch={true}
      />
    </>
  );
}

// Generate metadata for SEO - uses static icon data (no file I/O)
export async function generateMetadata({ params }: PageProps) {
  const { country } = await params;

  // Filter icons for this country
  const countryIcons = iconData.filter(icon =>
    slugify(icon.country) === country
  );

  if (countryIcons.length === 0) {
    return {
      title: 'Country Not Found',
      description: 'The requested country could not be found.'
    };
  }

  const countryName = countryIcons[0].country;
  const cityWord = countryIcons.length === 1 ? 'city icon' : 'city icons';
  const symbolWord = countryIcons.length === 1 ? 'City Symbol' : 'City Symbols';
  // Same 60-character budget as the city pages; long country names
  // ("Bosnia and Herzegovina") need the shorter forms.
  const title = fitTitle([
    `${countryName} City Icons – ${countryIcons.length} ${symbolWord} in Line Art`,
    `${countryName} City Icons – ${countryIcons.length} ${symbolWord}`,
    `${countryName} City Icons`,
  ]);

  return pageMetadata({
    path: `/${country}`,
    title,
    description: `Discover beautiful line art icons representing cities in ${countryName}. Browse ${countryIcons.length} ${cityWord} from ${countryName} with download and copy functionality.`,
    keywords: `${countryName}, city icons, ${countryIcons.map(icon => icon.city).join(', ')}, SVG icons, line art`,
    imageAlt: `${countryName} city icons`,
    // A country with one or two icons is a thinner restatement of the city
    // page it links to. Keep it crawlable and link-following, but out of the
    // index, so the city page is the one result Google can pick.
    robots: indexRobots(isIndexableCountry(countryIcons)),
  });
}
