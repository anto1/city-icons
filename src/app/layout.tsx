import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import '@fontsource/instrument-sans';
import { FathomAnalytics } from './fathom';
import { ThemeProvider } from '@/components/ThemeProvider';
import iconData from '@/data';

const cityCount = iconData.length;

export const metadata: Metadata = {
  title: 'City Icons Collection',
  description: `Discover beautiful line art icons representing ${cityCount}+ cities around the world by Studio Partdirector. Browse, search, download, and copy free SVG icons for designers and developers.`,
  keywords: ['city icons', 'svg icons', 'line art', 'cities', 'design', 'Studio Partdirector', 'free icons', 'urban design'],
  authors: [{ name: 'Studio Partdirector' }],
  creator: 'Studio Partdirector',
  publisher: 'Studio Partdirector',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://svgcities.com'),
  alternates: {
    canonical: 'https://svgcities.com/',
  },

  openGraph: {
    title: 'City Icons Collection',
    description: `Discover beautiful line art icons representing ${cityCount}+ cities around the world by Studio Partdirector. Browse, search, download, and copy free SVG icons.`,
    url: 'https://svgcities.com',
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
    <html lang="en" className="font-instrument-sans" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* Sitemap discovery */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://partdirector.ch" />
        <link rel="dns-prefetch" href="https://cdn.usefathom.com" />
        <link rel="dns-prefetch" href="https://github.com" />

        {/* Preconnect to analytics (used by Fathom) */}
        <link rel="preconnect" href="https://cdn.usefathom.com" crossOrigin="anonymous" />

        {/* Preload critical assets */}
        <link rel="preload" href="/og-image.png" as="image" type="image/png" />

        {/* Preload first visible icons (alphabetically sorted) */}
        <link rel="preload" href="/icons/gh-accra.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/icons/ae-abu-dhabi.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/icons/nl-amsterdam.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/icons/ad-andorra.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/icons/ws-apia.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/icons/tm-ashgabat.svg" as="image" type="image/svg+xml" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'City Icons Collection',
              description: 'Discover beautiful line art icons representing cities around the world by Studio Partdirector.',
              url: 'https://svgcities.com',
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
              inLanguage: 'en-US',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://svgcities.com?search={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="antialiased text-base">
        <ThemeProvider>
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-lg focus:outline-none"
          >
            Skip to main content
          </a>
          <FathomAnalytics />
          <div id="main-content">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
