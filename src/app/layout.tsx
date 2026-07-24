import type { Metadata } from 'next';
import { Instrument_Sans } from 'next/font/google';
import './globals.css';
import { FathomAnalytics } from './fathom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemedToaster } from '@/components/ThemedToaster';
import iconData from '@/data';

const cityCount = iconData.length;

// Self-hosted variable font (weights 400-700) with automatic preload and
// metric-matched fallback — replaces the @fontsource import, which shipped
// weight 400 only (faux bold) and was discovered late via CSS (FOUT/CLS).
const instrumentSans = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-instrument-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'City Icons Collection',
    template: '%s | City Icons Collection',
  },
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
  // Note: no alternates.canonical here — a root-layout canonical would be
  // inherited by any page that forgets its own, silently pointing it at the
  // homepage. Each page declares its own canonical (homepage: page.tsx).
  openGraph: {
    title: 'City Icons Collection',
    description: `Discover beautiful line art icons representing ${cityCount}+ cities around the world by Studio Partdirector. Browse, search, download, and copy free SVG icons.`,
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
  // Indexing is the default — an explicit "index, follow" here would conflict
  // with Next's automatic noindex on the built 404 page. Only non-default
  // preview directives are declared.
  robots: {
    googleBot: {
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
    <html lang="en" className={instrumentSans.variable} suppressHydrationWarning>
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
          <ThemedToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
