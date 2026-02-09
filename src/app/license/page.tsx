import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LicenseContent } from './LicenseContent';
import { PageHeader } from '@/components/PageHeader';
import { IconFooter } from '@/components/IconFooter';
import iconData from '@/data';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

const baseUrl = 'https://cities.partdirector.ch';

// SEO metadata for license page
export const metadata: Metadata = {
  title: 'Icon Usage & Licensing | City Icons Collection',
  description: 'Clear guidelines for using City Icons in your projects. Free for personal and educational use. Contact us for commercial licensing inquiries.',
  keywords: 'city icons license, icon usage, free icons license, commercial license, SVG icons terms',
  authors: [{ name: 'Studio Partdirector' }],
  creator: 'Studio Partdirector',
  publisher: 'Studio Partdirector',
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: `${baseUrl}/license`,
  },
  openGraph: {
    title: 'Icon Usage & Licensing | City Icons',
    description: 'Clear guidelines for using City Icons in your projects. Free for personal and educational use.',
    url: `${baseUrl}/license`,
    siteName: 'City Icons Collection',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'City Icons License and Usage Guidelines',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Icon Usage & Licensing | City Icons',
    description: 'Clear guidelines for using City Icons in your projects. Free for personal and educational use.',
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

// Generate structured data for license page
function generateStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Icon Usage & Licensing',
    description: 'Clear guidelines for using City Icons in your projects.',
    url: `${baseUrl}/license`,
    author: {
      '@type': 'Organization',
      name: 'Studio Partdirector',
      url: 'https://partdirector.ch',
    },
    mainEntity: {
      '@type': 'CreativeWork',
      name: 'City Icons License',
      description: 'Free for personal and educational use. Commercial licensing available upon request.',
      creator: {
        '@type': 'Organization',
        name: 'Studio Partdirector',
        url: 'https://partdirector.ch',
      },
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
          name: 'License',
          item: `${baseUrl}/license`,
        },
      ],
    },
  };
}

export default function LicensePage() {
  const structuredData = generateStructuredData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-background">
        <PageHeader />
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb Navigation */}
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
          
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Icon Usage & Licensing
            </h1>
            <p className="text-lg text-muted-foreground">
              Clear guidelines for using our city icons in your projects
            </p>
          </header>

          {/* Main Content */}
          <main>
            <LicenseContent />
          </main>
        </div>
        <IconFooter icons={iconData} />
      </div>
    </>
  );
}
