import { Metadata } from 'next';
import Link from 'next/link';
import iconData, { getCountryCounts } from '@/data';
import { getCoordinate, getIconsMissingCoordinates } from '@/data/coordinates';
import { getIconUrl } from '@/lib/utils';
import { projectToPercent } from '@/components/map/projection';
import { WorldMap, type MapMarker, type RegionView } from '@/components/map/WorldMap';
import { PageHeader } from '@/components/PageHeader';
import { IconFooter } from '@/components/IconFooter';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

const baseUrl = 'https://svgcities.com';

// Region order matches RegionFilter on the homepage.
const REGION_ORDER = [
  'Europe',
  'Asia',
  'North America',
  'South America',
  'Middle East',
  'Africa',
  'Oceania',
  'Central America',
];

interface MapData {
  markers: MapMarker[];
  regionViews: RegionView[];
  citiesByRegion: { region: string; cities: { city: string; country: string; url: string }[] }[];
}

function buildMapData(): MapData {
  // Icons without coordinates are excluded from the map (but not from the
  // city list). Non-empty means the coordinates dataset needs a re-run of
  // scripts/build-city-coordinates.mjs — warn loudly at build time.
  const missing = getIconsMissingCoordinates(iconData);
  if (missing.length > 0) {
    console.warn(
      `[map] ${missing.length} icon(s) have no coordinates and are missing from /map: ` +
        `${missing.map((icon) => icon.city).join(', ')}. ` +
        'Run `node scripts/build-city-coordinates.mjs` to regenerate src/data/coordinates.json.'
    );
  }

  const markers: MapMarker[] = [];
  const regionBounds = new Map<string, { x0: number; y0: number; x1: number; y1: number; count: number }>();

  for (const icon of [...iconData].sort((a, b) => a.city.localeCompare(b.city))) {
    const coordinate = getCoordinate(icon);
    if (!coordinate) continue;
    const { x, y } = projectToPercent(coordinate.lat, coordinate.lng);
    markers.push({
      id: icon._id,
      city: icon.city,
      country: icon.country,
      url: getIconUrl(icon),
      x,
      y,
    });

    const bounds = regionBounds.get(icon.region) ?? { x0: 100, y0: 100, x1: 0, y1: 0, count: 0 };
    bounds.x0 = Math.min(bounds.x0, x);
    bounds.y0 = Math.min(bounds.y0, y);
    bounds.x1 = Math.max(bounds.x1, x);
    bounds.y1 = Math.max(bounds.y1, y);
    bounds.count += 1;
    regionBounds.set(icon.region, bounds);
  }

  const regionViews: RegionView[] = [
    { label: 'World', count: 0, x0: 0, y0: 0, x1: 100, y1: 100 },
    ...REGION_ORDER.filter((region) => regionBounds.has(region)).map((region) => {
      const bounds = regionBounds.get(region)!;
      // Pad the marker bounding box so edge cities are not glued to the frame.
      const padX = Math.max(1.5, (bounds.x1 - bounds.x0) * 0.08);
      const padY = Math.max(1.5, (bounds.y1 - bounds.y0) * 0.08);
      return {
        label: region,
        count: bounds.count,
        x0: Math.max(0, bounds.x0 - padX),
        y0: Math.max(0, bounds.y0 - padY),
        x1: Math.min(100, bounds.x1 + padX),
        y1: Math.min(100, bounds.y1 + padY),
      };
    }),
  ];

  const citiesByRegion = REGION_ORDER.filter((region) =>
    iconData.some((icon) => icon.region === region)
  ).map((region) => ({
    region,
    cities: iconData
      .filter((icon) => icon.region === region)
      .sort((a, b) => a.city.localeCompare(b.city))
      .map((icon) => ({ city: icon.city, country: icon.country, url: getIconUrl(icon) })),
  }));

  return { markers, regionViews, citiesByRegion };
}

export const metadata: Metadata = {
  title: 'World Map',
  description: `Explore all ${iconData.length} city icons plotted on a minimalist world map. Zoom into any region and jump straight to a city's icon page.`,
  keywords: 'city icons map, world map, svg icons by location, cities world map',
  authors: [{ name: 'Studio Partdirector' }],
  creator: 'Studio Partdirector',
  publisher: 'Studio Partdirector',
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: `${baseUrl}/map`,
  },
  openGraph: {
    title: 'World Map | City Icons Collection',
    description: `All ${iconData.length} city icons plotted on a minimalist world map.`,
    url: `${baseUrl}/map`,
    siteName: 'City Icons Collection',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'City Icons World Map',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Map | City Icons Collection',
    description: `All ${iconData.length} city icons plotted on a minimalist world map.`,
    images: [`${baseUrl}/og-image.png`],
  },
};

function generateStructuredData(totalIcons: number, totalCountries: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'City Icons World Map',
    description: `Interactive world map of ${totalIcons} city icons from ${totalCountries} countries and territories`,
    url: `${baseUrl}/map`,
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
          name: 'World Map',
          item: `${baseUrl}/map`,
        },
      ],
    },
  };
}

export default function MapPage() {
  const { markers, regionViews, citiesByRegion } = buildMapData();
  const countryCounts = getCountryCounts();
  const structuredData = generateStructuredData(iconData.length, countryCounts.length);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-background">
        <PageHeader />
        <div className="container mx-auto px-4 py-8">
          {/* Visible trail mirrors the BreadcrumbList JSON-LD (Home / World Map) */}
          <nav aria-label="Breadcrumb" className="text-center mb-8 pt-8">
            <ol className="inline-flex items-center text-sm text-muted-foreground list-none">
              <li className="flex items-center">
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
                <span className="mx-2" aria-hidden="true">/</span>
              </li>
              <li aria-current="page">
                <span className="text-foreground font-medium">World Map</span>
              </li>
            </ol>
          </nav>

          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
              World Map
            </h1>
            <p className="text-lg text-muted-foreground">
              All {iconData.length} city icons, plotted where they live. Zoom
              into a region, or browse the list below.
            </p>
          </header>

          <main>
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
          </main>
        </div>
        <IconFooter countries={countryCounts} totalIcons={iconData.length} />
      </div>
    </>
  );
}
