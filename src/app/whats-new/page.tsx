import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { changelog, getRecentCityCount } from '@/data/changelog';
import { WhatsNewContent } from './WhatsNewContent';
import iconData from '@/data';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

const baseUrl = 'https://cities.partdirector.ch';

export const metadata: Metadata = {
  title: "What's New | City Icons Collection",
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
    title: "What's New | City Icons Collection",
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
    title: "What's New | City Icons Collection",
    description: 'See the latest city icons added to our collection.',
    images: [`${baseUrl}/og-image.png`],
    creator: '@partdirector',
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

function generateStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: "What's New - City Icons",
    description: 'Latest city icons added to the collection',
    url: `${baseUrl}/whats-new`,
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
  const allIcons = iconData;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <nav aria-label="Breadcrumb" className="text-center mb-8">
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
              What&apos;s New
            </h1>
            <p className="text-lg text-muted-foreground">
              {recentCount} new cities added in the last 4 weeks
            </p>
          </header>

          <main>
            <WhatsNewContent changelog={changelog} allIcons={allIcons} />
          </main>

          <footer className="py-6 mt-16" role="contentinfo">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Want a specific city?{' '}
                <a
                  href="mailto:icons@partdirector.ch?subject=City Request"
                  className="text-foreground hover:text-orange-600 transition-colors underline"
                >
                  Request it here
                </a>
              </p>
              <p className="text-sm text-foreground">
                © Studio Partdirector, 2025
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
