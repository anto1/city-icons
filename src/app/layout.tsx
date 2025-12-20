import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import '@fontsource/instrument-sans';
import { FathomAnalytics } from './fathom';

export const metadata: Metadata = {
  title: 'City Icons Collection',
  description: 'Discover beautiful line art icons representing cities around the world by Studio Partdirector. Browse 43+ cities with search, download, and copy functionality. Free SVG icons for designers and developers.',
  keywords: ['city icons', 'svg icons', 'line art', 'cities', 'design', 'Studio Partdirector', 'free icons', 'urban design'],
  authors: [{ name: 'Studio Partdirector' }],
  creator: 'Studio Partdirector',
  publisher: 'Studio Partdirector',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cities.partdirector.ch'),
  alternates: {
    canonical: 'https://cities.partdirector.ch/',
  },

  openGraph: {
    title: 'City Icons Collection',
    description: 'Discover beautiful line art icons representing cities around the world by Studio Partdirector. Browse 43+ cities with search, download, and copy functionality.',
    url: 'https://cities.partdirector.ch',
    siteName: 'City Icons Collection',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'City Icons Collection - Beautiful line art icons representing cities around the world',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'City Icons Collection',
    description: 'Discover beautiful line art icons representing cities around the world by Studio Partdirector.',
    images: ['/og-image.png'],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-instrument-sans">
      <head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://partdirector.ch" />
        <link rel="dns-prefetch" href="https://cdn.usefathom.com" />
        
        {/* Preconnect to analytics (used by Fathom) */}
        <link rel="preconnect" href="https://cdn.usefathom.com" crossOrigin="anonymous" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'City Icons Collection',
              description: 'Discover beautiful line art icons representing cities around the world by Studio Partdirector.',
              url: 'https://cities.partdirector.ch',
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
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://cities.partdirector.ch?search={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="antialiased text-base">
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <FathomAnalytics />
        <main id="main-content">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
