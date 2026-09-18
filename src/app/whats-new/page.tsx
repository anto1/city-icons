import { Metadata } from 'next';
import Link from 'next/link';
import { changelog, getRecentCityCount } from '@/data/changelog';
import { WhatsNewContent } from './WhatsNewContent';
import iconData, { getCountryCounts } from '@/data';
import { toGridIcon } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { IconFooter } from '@/components/IconFooter';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

const baseUrl = 'https://svgcities.com';

export const metadata: Metadata = {
  title: "What's New — Latest City Icons",
  description: 'See the latest city icons added to our collection. Weekly updates with new cities and landmarks from around the world.',
  keywords: 'new city icons, latest icons, icon updates, new svg icons, city icons changelog',
  authors: [{ name: 'Studio Partdirector' }],
  creator: 'Studio Partdirector',
  publisher: 'Studio Partdirector',
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: `${baseUrl}/whats-new`,
  },
  openGraph: {
    title: "What's New — Latest City Icons",
    description: 'See the latest city icons added to our collection.',
    url: `${baseUrl}/whats-new`,
    siteName: 'City Icons Collection',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "What's New - City Icons",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "What's New — Latest City Icons",
    description: 'See the latest city icons added to our collection.',
    images: [`${baseUrl}/og-image.png`],
  },
};

function generateStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: "What's New - City Icons",
    description: 'Latest city icons added to the collection',
    url: `${baseUrl}/whats-new`,
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
          name: "What's New",
          item: `${baseUrl}/whats-new`,
        },
      ],
    },
  };
}

export default function WhatsNewPage() {
  const structuredData = generateStructuredData();
  const recentCount = getRecentCityCount(4);
  const latestCount = changelog.length > 0 ? changelog[0].cities.length : 0;
  const allIcons = iconData.map(toGridIcon);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-background">
        <PageHeader />
        <div className="container mx-auto px-4 py-8">
          {/* Visible trail mirrors the BreadcrumbList JSON-LD (Home / What's New) */}
          <nav aria-label="Breadcrumb" className="text-center mb-8 pt-8">
            <ol className="inline-flex items-center text-sm text-muted-foreground list-none">
              <li className="flex items-center">
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
                <span className="mx-2" aria-hidden="true">/</span>
              </li>
              <li aria-current="page">
                <span className="text-foreground font-medium">What&apos;s New</span>
              </li>
            </ol>
          </nav>

          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              What&apos;s New
            </h1>
            <p className="text-lg text-muted-foreground">
              {recentCount > 0
                ? `${recentCount} new cities added in the last 4 weeks`
                : `${latestCount} new cities in the latest update`}
            </p>
          </header>

          <main>
            <WhatsNewContent changelog={changelog} allIcons={allIcons} />
          </main>
        </div>
        <IconFooter countries={getCountryCounts()} totalIcons={iconData.length} />
      </div>
    </>
  );
}
