import { Metadata } from 'next';
import Link from 'next/link';
import iconData, { getCountryCounts } from '@/data';
import { buildMapData } from '@/lib/map-data';
import { WorldMap } from '@/components/map/WorldMap';
import { ContentPage } from '@/components/ContentPage';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbList } from '@/lib/breadcrumbs';
import { pageMetadata } from '@/lib/metadata';
import { absoluteUrl, STUDIO_ORG } from '@/lib/site';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

const path = '/map';

export const metadata: Metadata = pageMetadata({
  path,
  title: 'World Map of City Icons',
  description: `Explore all ${iconData.length} city icons plotted on a minimalist world map. Zoom into any region and jump straight to a city's icon page.`,
  keywords: 'city icons map, world map, svg icons by location, cities world map',
  og: { description: `All ${iconData.length} city icons plotted on a minimalist world map.` },
  imageAlt: 'City Icons World Map',
});

function generateStructuredData(totalIcons: number, totalCountries: number) {
  return {
    '@type': 'WebPage',
    name: 'City Icons World Map',
    description: `Interactive world map of ${totalIcons} city icons from ${totalCountries} countries and territories`,
    url: absoluteUrl(path),
    author: STUDIO_ORG,
    breadcrumb: breadcrumbList([{ name: 'World Map', path }]),
  };
}

export default function MapPage() {
  const { markers, regionViews, citiesByRegion } = buildMapData();
  const countryCounts = getCountryCounts();

  return (
    <>
      <JsonLd data={generateStructuredData(iconData.length, countryCounts.length)} />
      <ContentPage
        crumb="World Map"
        path={path}
        title="World Map"
        intro={`All ${iconData.length} city icons, plotted where they live. Zoom into a region, or browse the list below.`}
        headerClassName="mb-10"
        titleClassName="tracking-tight"
      >
        <div className="mx-auto max-w-5xl">
          <WorldMap markers={markers} regionViews={regionViews} />
        </div>

        {/* Non-visual (and no-JS) path to every destination on the map */}
        <section
          id="map-city-list"
          aria-label="All cities by region"
          className="mx-auto mt-12 max-w-3xl"
        >
          <h2 className="mb-4 text-center text-sm font-medium text-muted-foreground">
            Every city on the map
          </h2>
          <div className="space-y-2">
            {citiesByRegion.map(({ region, cities }) => (
              <details
                key={region}
                className="group rounded-lg border border-border px-4 py-3"
              >
                <summary className="cursor-pointer text-sm font-medium text-foreground marker:text-muted-foreground">
                  {region}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {cities.length} {cities.length === 1 ? 'city' : 'cities'}
                  </span>
                </summary>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 list-none">
                  {cities.map(({ city, country, url }) => (
                    <li key={url}>
                      <Link
                        href={url}
                        prefetch={false}
                        className="text-sm text-muted-foreground underline transition-colors hover:text-orange-600"
                      >
                        {city}
                        <span className="ml-1 text-xs no-underline opacity-60">
                          {country}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </section>
      </ContentPage>
    </>
  );
}
