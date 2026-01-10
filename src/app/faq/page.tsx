import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { FAQContent } from './FAQContent';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

const baseUrl = 'https://cities.partdirector.ch';

const faqs = [
  {
    question: 'What are City Icons?',
    answer: 'City Icons is a collection of minimalist line art SVG icons representing cities and their famous landmarks from around the world. Each icon captures the essence of a city through its most recognizable architectural feature.',
  },
  {
    question: 'Are the icons free to use?',
    answer: 'Yes! City Icons are free for personal and educational use. For commercial projects, please contact us at icons@partdirector.ch to discuss licensing options.',
  },
  {
    question: 'What format are the icons in?',
    answer: 'All icons are provided as SVG (Scalable Vector Graphics) files. This means they can be scaled to any size without losing quality, making them perfect for any project from small favicons to large banners.',
  },
  {
    question: 'Can I modify the icons?',
    answer: 'For personal and educational use, you can modify the icons to suit your needs. For commercial use, please contact us first to discuss your specific requirements.',
  },
  {
    question: 'How do I download an icon?',
    answer: 'Click on any city icon to open its detail page, then use the "Download" button to save the SVG file, or "Copy SVG" to copy the code directly to your clipboard.',
  },
  {
    question: 'My city is not included. Can you add it?',
    answer: 'We are constantly expanding our collection! Send us a request at icons@partdirector.ch with the city name and country, and we\'ll consider adding it to our collection.',
  },
  {
    question: 'How often are new icons added?',
    answer: 'We add new city icons regularly, typically in batches of 5-10 icons per week. Check our "What\'s New" page to see the latest additions.',
  },
  {
    question: 'Can I request a specific landmark for a city?',
    answer: 'Yes! When requesting a new city, feel free to suggest which landmark you\'d like to see represented. We\'ll do our best to incorporate iconic and recognizable features.',
  },
  {
    question: 'What is the City Roulette feature?',
    answer: 'City Roulette is a fun feature that randomly selects cities for you. Spin the wheel to discover new destinations - perfect for travel inspiration or when you can\'t decide where to go next!',
  },
  {
    question: 'Who creates these icons?',
    answer: 'All City Icons are designed by Studio Partdirector, a design studio focused on creating beautiful, minimalist graphics. Visit partdirector.ch to learn more about our work.',
  },
];

export const metadata: Metadata = {
  title: 'FAQ | City Icons Collection',
  description: 'Frequently asked questions about City Icons - learn about usage, licensing, downloads, and how to request new city icons.',
  keywords: 'city icons faq, icon questions, svg icons help, city icons usage, icon licensing questions',
  authors: [{ name: 'Studio Partdirector' }],
  creator: 'Studio Partdirector',
  publisher: 'Studio Partdirector',
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: `${baseUrl}/faq`,
  },
  openGraph: {
    title: 'FAQ | City Icons Collection',
    description: 'Frequently asked questions about City Icons - learn about usage, licensing, and downloads.',
    url: `${baseUrl}/faq`,
    siteName: 'City Icons Collection',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'City Icons FAQ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ | City Icons Collection',
    description: 'Frequently asked questions about City Icons.',
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
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export default function FAQPage() {
  const structuredData = generateStructuredData();

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
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about City Icons
            </p>
          </header>

          <main>
            <FAQContent faqs={faqs} />
          </main>

          <footer className="py-6 mt-16" role="contentinfo">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Still have questions?{' '}
                <a
                  href="mailto:icons@partdirector.ch"
                  className="text-foreground hover:text-orange-600 transition-colors underline"
                >
                  Contact us
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
