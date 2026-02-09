import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { FAQContent } from './FAQContent';
import { PageHeader } from '@/components/PageHeader';
import { IconFooter } from '@/components/IconFooter';
import iconData from '@/data';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

const baseUrl = 'https://cities.partdirector.ch';

// Helper component for external links
const ExtLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
);

const faqs = [
  // About the Collection
  {
    question: 'What are City Icons?',
    answer: 'City Icons is a collection of minimalist line art SVG icons representing cities and their famous landmarks from around the world. Each icon captures the essence of a city through its most recognizable architectural feature.',
    plainAnswer: 'City Icons is a collection of minimalist line art SVG icons representing cities and their famous landmarks from around the world. Each icon captures the essence of a city through its most recognizable architectural feature.',
  },
  {
    question: 'Who creates these icons?',
    answer: <>All City Icons are designed by Anton Prokopev, founder and art director of Studio Partdirector. Anton lives in Matosinhos, Portugal — which explains the extensive collection of Portuguese cities! Connect with him on <ExtLink href="https://linkedin.com/in/prokopev/">LinkedIn</ExtLink> or visit <ExtLink href="https://partdirector.ch">partdirector.ch</ExtLink> to see more work.</>,
    plainAnswer: 'All City Icons are designed by Anton Prokopev, founder and art director of Studio Partdirector. Anton lives in Matosinhos, Portugal — which explains the extensive collection of Portuguese cities! Connect with him on LinkedIn at linkedin.com/in/prokopev or visit partdirector.ch to see more work.',
  },
  {
    question: 'Is the project open source?',
    answer: <>Yes! City Icons is open source on GitHub at <ExtLink href="https://github.com/anto1/city-icons">github.com/anto1/city-icons</ExtLink>. You can star the repo, report issues, suggest improvements, or contribute to the codebase. We welcome community involvement!</>,
    plainAnswer: 'Yes! City Icons is open source on GitHub at github.com/anto1/city-icons. You can star the repo, report issues, suggest improvements, or contribute to the codebase. We welcome community involvement!',
  },
  // Using the Icons
  {
    question: 'What format are the icons in?',
    answer: 'All icons are provided as SVG (Scalable Vector Graphics) files. This means they can be scaled to any size without losing quality, making them perfect for any project from small favicons to large banners.',
    plainAnswer: 'All icons are provided as SVG (Scalable Vector Graphics) files. This means they can be scaled to any size without losing quality, making them perfect for any project from small favicons to large banners.',
  },
  {
    question: 'What are the best use cases for City Icons?',
    answer: 'City Icons are perfect for travel websites, booking apps, tourism guides, travel blogs, location-based services, and any project that needs to represent cities visually. They work great as markers on maps, section headers, or decorative elements.',
    plainAnswer: 'City Icons are perfect for travel websites, booking apps, tourism guides, travel blogs, location-based services, and any project that needs to represent cities visually. They work great as markers on maps, section headers, or decorative elements.',
  },
  {
    question: 'How do I download an icon?',
    answer: <>Click on any city icon on the <Link href="/">homepage</Link> to open its detail modal, then use the &quot;Download&quot; button to save the SVG file, or &quot;Copy SVG&quot; to copy the code directly to your clipboard.</>,
    plainAnswer: 'Click on any city icon to open its detail page, then use the "Download" button to save the SVG file, or "Copy SVG" to copy the code directly to your clipboard.',
  },
  // Licensing
  {
    question: 'Are the icons free to use?',
    answer: <>Yes! City Icons are free for personal and educational use. For commercial projects, please <a href="mailto:icons@partdirector.ch">contact us</a> to discuss licensing. See our <Link href="/license">license page</Link> for full details.</>,
    plainAnswer: 'Yes! City Icons are free for personal and educational use. For commercial projects, please contact us at icons@partdirector.ch to discuss licensing and pricing.',
  },
  {
    question: 'Can I modify the icons?',
    answer: <>For personal and educational use, you can modify the icons to suit your needs. For commercial use, please <a href="mailto:icons@partdirector.ch">contact us</a> first to discuss your specific requirements.</>,
    plainAnswer: 'For personal and educational use, you can modify the icons to suit your needs. For commercial use, please contact us first to discuss your specific requirements.',
  },
  {
    question: 'Can I resell the icons or include them in icon packs?',
    answer: 'No, reselling the icons or redistributing them as part of other icon collections is not permitted. The icons are meant for use in your own projects, not for resale.',
    plainAnswer: 'No, reselling the icons or redistributing them as part of other icon collections is not permitted. The icons are meant for use in your own projects, not for resale.',
  },
  // Requesting Icons
  {
    question: 'My city is not included. Can you add it?',
    answer: <>We are constantly expanding our collection! Send us a request at <a href="mailto:icons@partdirector.ch">icons@partdirector.ch</a> with the city name, country, and optionally the landmark you&apos;d like to see represented. We&apos;ll do our best to incorporate iconic and recognizable features.</>,
    plainAnswer: 'We are constantly expanding our collection! Send us a request at icons@partdirector.ch with the city name, country, and optionally the landmark you\'d like to see represented. We\'ll do our best to incorporate iconic and recognizable features.',
  },
  {
    question: 'How often are new icons added?',
    answer: <>We add new city icons regularly, typically in batches of 5-10 icons per week. Check our <Link href="/whats-new">What&apos;s New</Link> page to see the latest additions.</>,
    plainAnswer: 'We add new city icons regularly, typically in batches of 5-10 icons per week. Check our "What\'s New" page to see the latest additions.',
  },
  {
    question: 'Can you create a custom icon for me?',
    answer: <>Sure! Just drop us a line at <a href="mailto:icons@partdirector.ch">icons@partdirector.ch</a> with your request and we&apos;ll get back to you.</>,
    plainAnswer: 'Sure! Just drop us a line at icons@partdirector.ch with your request and we\'ll get back to you.',
  },
  // Features & Community
  {
    question: 'What is the City Roulette feature?',
    answer: <><Link href="/roulette">City Roulette</Link> is a fun feature that randomly selects cities for you. Spin the wheel to discover new destinations — perfect for travel inspiration or when you can&apos;t decide where to go next!</>,
    plainAnswer: 'City Roulette is a fun feature that randomly selects cities for you. Spin the wheel to discover new destinations - perfect for travel inspiration or when you can\'t decide where to go next!',
  },
  {
    question: 'Where can I discuss the icons or give feedback?',
    answer: <>We love hearing from the community! Check out our <ExtLink href="https://reddit.com/r/Cities/comments/1p80aee/made_200_minimalist_city_icons_roast_my_choices/">Reddit thread</ExtLink> where we first shared the collection and got amazing feedback. Feel free to join the discussion, roast our landmark choices, or suggest new cities.</>,
    plainAnswer: 'We love hearing from the community! Check out our Reddit thread at r/Cities where we first shared the collection and got amazing feedback. Feel free to join the discussion, roast our landmark choices, or suggest new cities.',
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
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      name: 'FAQ | City Icons Collection',
      description: 'Frequently asked questions about City Icons - learn about usage, licensing, downloads, and how to request new city icons.',
      url: `${baseUrl}/faq`,
      author: {
        '@type': 'Organization',
        name: 'Studio Partdirector',
        url: 'https://partdirector.ch',
      },
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.plainAnswer,
        },
      })),
    },
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
          name: 'FAQ',
          item: `${baseUrl}/faq`,
        },
      ],
    },
  ];
}

export default function FAQPage() {
  const structuredData = generateStructuredData();

  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <div className="min-h-screen bg-background">
        <PageHeader />
        <div className="container mx-auto px-4 py-8">
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

        </div>
        <IconFooter icons={iconData} />
      </div>
    </>
  );
}
