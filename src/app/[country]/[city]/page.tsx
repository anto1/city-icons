import { notFound } from 'next/navigation';
import CityPage from '@/components/CityPage';
import { JsonLd } from '@/components/JsonLd';
import { getIconAddedDate } from '@/lib/added-date';
import { breadcrumbList } from '@/lib/breadcrumbs';
import { fitTitle, indexRobots, pageMetadata } from '@/lib/metadata';
import { absoluteUrl, LICENSE_URL, STUDIO_ORG } from '@/lib/site';
import iconData, { getCountryCounts, getSortedIcons } from '@/data';
import { Icon, toGridIcon } from '@/types';
import { findIconBySlugs, slugify, getCitySlug, getLandmark, isCityOnlyName, getIconSvgUrl } from '@/lib/utils';

// Generate all possible city pages at build time (SSG)
export async function generateStaticParams() {
  return iconData.map((icon) => ({
    country: slugify(icon.country),
    city: getCitySlug(icon),
  }));
}

// Force static generation — dynamicParams=false returns 404 for unknown slugs
export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = false;

interface PageProps {
  params: Promise<{
    country: string;
    city: string;
  }>;
}

// Generate structured data for the city icon page
function generateStructuredData(icon: Icon, countrySlug: string, citySlug: string) {
  const pagePath = `/${countrySlug}/${citySlug}`;
  const pageUrl = absoluteUrl(pagePath);
  const svgUrl = absoluteUrl(getIconSvgUrl(icon));

  return [
    // CreativeWork schema for the icon
    {
      '@type': 'CreativeWork',
      name: icon.name,
      description: icon.description,
      url: pageUrl,
      // Google Images reads the licence fields off the ImageObject itself, not
      // off the enclosing CreativeWork — without them here there is no
      // "Licensable" badge, which is the one rich result an icon site can earn.
      image: {
        '@type': 'ImageObject',
        url: svgUrl,
        contentUrl: svgUrl,
        thumbnailUrl: `${pageUrl}/opengraph-image`,
        encodingFormat: 'image/svg+xml',
        name: `${icon.name} icon`,
        description: `SVG icon of ${icon.name} representing ${icon.city}, ${icon.country}`,
        license: LICENSE_URL,
        acquireLicensePage: absoluteUrl('/license'),
        creditText: STUDIO_ORG.name,
        copyrightNotice: STUDIO_ORG.name,
        creator: STUDIO_ORG,
      },
      author: STUDIO_ORG,
      publisher: STUDIO_ORG,
      about: {
        '@type': 'Place',
        name: icon.city,
        containedInPlace: {
          '@type': 'Country',
          name: icon.country,
        },
      },
      keywords: [icon.city, icon.country, 'city icon', 'SVG icon', 'line art', icon.name, ...icon.tags].join(', '),
      inLanguage: 'en-US',
      isAccessibleForFree: true,
      license: LICENSE_URL,
      usageInfo: absoluteUrl('/license'),
      genre: 'Line Art',
    },
    breadcrumbList([
      { name: icon.country, path: `/${countrySlug}` },
      { name: icon.city, path: pagePath },
    ]),
  ];
}

export default async function IconPage({ params }: PageProps) {
  const { country, city } = await params;
  const icons = getSortedIcons();

  // Check if the icon exists
  const icon = findIconBySlugs(country, city, icons);

  if (!icon) {
    notFound();
  }

  // Everything CityPage renders besides the current icon is precomputed here
  // so the full dataset never crosses the server→client boundary.
  const headerIcons = icons
    .filter((i) => i._id !== icon._id)
    .slice(0, 3)
    .map(toGridIcon);

  const relatedIcons = icons
    .filter((i) => i.country === icon.country && i._id !== icon._id)
    .map(toGridIcon);

  // Deterministic "random" icons from other countries, seeded by icon id
  // (same selection the client used to compute — stable across builds)
  const seed = parseInt(icon._id) || 0;
  const exploreIcons = icons
    .filter((i) => i.country !== icon.country)
    .sort((a, b) => {
      const hashA = (parseInt(a._id) * 2654435761 + seed) >>> 0;
      const hashB = (parseInt(b._id) * 2654435761 + seed) >>> 0;
      return hashA - hashB;
    })
    .slice(0, 4)
    .map(toGridIcon);

  return (
    <>
      <JsonLd data={generateStructuredData(icon, country, city)} />
      <CityPage
        icon={icon}
        headerIcons={headerIcons}
        relatedIcons={relatedIcons}
        exploreIcons={exploreIcons}
        footerCountries={getCountryCounts()}
        totalIcons={icons.length}
        addedOn={getIconAddedDate(icon)}
      />
    </>
  );
}

// Generate metadata for SEO - uses static icon data (no file I/O)
export async function generateMetadata({ params }: PageProps) {
  const { country, city } = await params;
  const icon = findIconBySlugs(country, city, iconData);

  if (!icon) {
    return {
      title: 'Icon Not Found',
      description: 'The requested city icon could not be found.'
    };
  }

  // Landmark-first metadata: search demand is landmark-shaped ("Eiffel Tower
  // icon svg", not "Paris icon"). Cities with more than one icon disambiguate
  // via the `slug` field, not the city name, so the name is always clean here.
  // The root layout appends the " | svgcities" template suffix to <title>.
  const baseCity = icon.city;
  const landmark = getLandmark(icon);
  const isCityOnly = isCityOnlyName(icon);
  // "{City} symbol" is where the real demand sits: these pages already rank on
  // queries like "madrid symbol" and "liver bird liverpool", while "city icons
  // svg" has no measurable volume. Keep the landmark first, name the city as a
  // symbol, and keep "SVG icon" for the download intent.
  const title = fitTitle(
    isCityOnly
      ? [`${baseCity} Symbol – SVG Icon`, `${baseCity} Symbol`]
      : [
          `${landmark} – ${baseCity} Symbol SVG Icon`,
          `${landmark} – ${baseCity} Symbol`,
          `${landmark} – ${baseCity}`,
          landmark,
        ]
  );
  const description = isCityOnly
    ? `${baseCity} and the symbol that stands for it, drawn as minimalist line art from ${icon.country}. Free SVG icon — download, copy the code, or export a PNG.`
    : `The ${landmark} is a symbol of ${baseCity}, ${icon.country}, drawn here as minimalist line art. Free SVG icon — download, copy the code, or export a PNG.`;

  return pageMetadata({
    path: `/${country}/${city}`,
    title,
    description,
    keywords: `${landmark}, ${landmark} icon, ${landmark} svg, ${icon.city}, ${icon.country}, city icon, SVG icon, line art, download icon, ${icon.tags.join(', ')}`,
    ogType: 'article',
    // The per-city opengraph-image route supplies the social image
    image: null,
    robots: indexRobots(),
  });
}
