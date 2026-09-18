import { notFound } from 'next/navigation';
import CityPage from '@/components/CityPage';
import { getIconAddedDate } from '@/lib/added-date';
import iconData, { getCountryCounts, getSortedIcons } from '@/data';
import { Icon, toGridIcon } from '@/types';
import { findIconBySlugs, slugify, getCitySlug } from '@/lib/utils';

const baseUrl = 'https://svgcities.com';

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
  const pageUrl = `${baseUrl}/${countrySlug}/${citySlug}`;
  
  return [
    // CreativeWork schema for the icon
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: icon.name,
      description: icon.description || `Icon representing ${icon.city}, ${icon.country}`,
      url: pageUrl,
      // Google Images reads the licence fields off the ImageObject itself, not
      // off the enclosing CreativeWork — without them here there is no
      // "Licensable" badge, which is the one rich result an icon site can earn.
      image: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icons/${icon.svgFilename}`,
        contentUrl: `${baseUrl}/icons/${icon.svgFilename}`,
        thumbnailUrl: `${pageUrl}/opengraph-image`,
        encodingFormat: 'image/svg+xml',
        name: `${icon.name} icon`,
        description: `SVG icon of ${icon.name} representing ${icon.city}, ${icon.country}`,
        license: 'https://creativecommons.org/licenses/by/4.0/',
        acquireLicensePage: `${baseUrl}/license`,
        creditText: 'Studio Partdirector',
        copyrightNotice: 'Studio Partdirector',
        creator: {
          '@type': 'Organization',
          name: 'Studio Partdirector',
          url: 'https://partdirector.ch',
        },
      },
      author: {
        '@type': 'Organization',
        name: 'Studio Partdirector',
        url: 'https://partdirector.ch',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Studio Partdirector',
        url: 'https://partdirector.ch',
      },
      about: {
        '@type': 'Place',
        name: icon.city,
        containedInPlace: {
          '@type': 'Country',
          name: icon.country,
        },
      },
      keywords: [icon.city, icon.country, 'city icon', 'SVG icon', 'line art', icon.name, ...(icon.tags || [])].filter(Boolean).join(', '),
      inLanguage: 'en-US',
      isAccessibleForFree: true,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      usageInfo: `${baseUrl}/license`,
      genre: 'Line Art',
    },
    // BreadcrumbList schema
    {
      '@context': 'https://schema.org',
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
          name: icon.country,
          item: `${baseUrl}/${countrySlug}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: icon.city,
          item: pageUrl,
        },
      ],
    },
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

  const structuredData = generateStructuredData(icon, country, city);

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
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
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

  const pageUrl = `${baseUrl}/${country}/${city}`;

  // Landmark-first metadata: search demand is landmark-shaped ("Eiffel Tower
  // icon svg", not "Paris icon"). Most names are "{City} {Landmark}", so strip
  // a leading city prefix to isolate the landmark. Cities with more than one
  // icon disambiguate via the `slug` field, not the city name, so the name is
  // always clean here. The root layout appends the " | City Icons Collection"
  // template suffix to <title>.
  const baseCity = icon.city;
  const name = icon.name.trim();
  // Strip a leading city prefix, also when the city carries a trailing generic
  // word the icon name leaves off ("Ho Chi Minh City" vs "Ho Chi Minh ...").
  const cityPrefixes = [baseCity, baseCity.replace(/ (City|Town)$/i, '')];
  const stripped = cityPrefixes
    .map(prefix => name.toLowerCase().startsWith(`${prefix.toLowerCase()} `)
      ? name.slice(prefix.length + 1).trim()
      : null)
    .find((v): v is string => v !== null);
  const landmark = stripped ?? name;
  const isCityOnly = landmark.toLowerCase() === baseCity.toLowerCase();
  // "{City} symbol" is where the real demand sits: these pages already rank on
  // queries like "madrid symbol" and "liver bird liverpool", while "city icons
  // svg" has no measurable volume. Keep the landmark first, name the city as a
  // symbol, and keep "SVG icon" for the download intent.
  // Google renders about 60 characters; the " | svgcities" template suffix eats
  // 12 of them. Long landmark names blow past that, so fall back through
  // progressively shorter forms rather than letting the city get truncated off.
  const TITLE_BUDGET = 60 - ' | svgcities'.length;
  const candidates = isCityOnly
    ? [`${baseCity} Symbol – SVG Icon`, `${baseCity} Symbol`]
    : [
        `${landmark} – ${baseCity} Symbol SVG Icon`,
        `${landmark} – ${baseCity} Symbol`,
        `${landmark} – ${baseCity}`,
        landmark,
      ];
  const title = candidates.find(c => c.length <= TITLE_BUDGET) ?? candidates[candidates.length - 1];
  const description = isCityOnly
    ? `${baseCity} and the symbol that stands for it, drawn as minimalist line art from ${icon.country}. Free SVG icon — download, copy the code, or export a PNG.`
    : `The ${landmark} is a symbol of ${baseCity}, ${icon.country}, drawn here as minimalist line art. Free SVG icon — download, copy the code, or export a PNG.`;

  return {
    title,
    description,
    keywords: `${landmark}, ${landmark} icon, ${landmark} svg, ${icon.city}, ${icon.country}, city icon, SVG icon, line art, download icon, ${icon.tags?.join(', ') || ''}`,
    authors: [{ name: 'Studio Partdirector' }],
    creator: 'Studio Partdirector',
    publisher: 'Studio Partdirector',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'City Icons Collection',
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
} 