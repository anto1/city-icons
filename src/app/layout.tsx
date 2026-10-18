import type { Metadata } from 'next';
import { Instrument_Sans } from 'next/font/google';
import './globals.css';
import { FathomAnalytics } from './fathom';
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemedToaster } from '@/components/ThemedToaster';
import iconData from '@/data';
import { JsonLd } from '@/components/JsonLd';
import { TITLE_SUFFIX } from '@/lib/metadata';
import { SITE_NAME, SITE_URL, STUDIO_NAME, STUDIO_ORG, STUDIO_URL } from '@/lib/site';

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
    // The suffix is deliberately short: at 24 characters the old
    // " | City Icons Collection" pushed a third of the city titles past the
    // ~60 characters Google renders, truncating the city name itself.
    default: `Free SVG City Icons – ${cityCount} City Symbols in Line Art`,
    template: `%s${TITLE_SUFFIX}`,
  },
  description: `Line art icons for ${cityCount} cities worldwide — the landmark or symbol that stands for each one, drawn by Studio Partdirector. Search, download and copy free SVG icons.`,
  keywords: ['city icons', 'svg icons', 'line art', 'cities', 'design', 'Studio Partdirector', 'free icons', 'urban design'],
  authors: [{ name: STUDIO_NAME }],
  creator: STUDIO_NAME,
  publisher: STUDIO_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  // Note: no alternates.canonical here — a root-layout canonical would be
  // inherited by any page that forgets its own, silently pointing it at the
  // homepage. Each page declares its own canonical (homepage: page.tsx).
  openGraph: {
    title: SITE_NAME,
    description: `Discover beautiful line art icons representing ${cityCount}+ cities around the world by Studio Partdirector. Browse, search, download, and copy free SVG icons.`,
    siteName: SITE_NAME,
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
    title: SITE_NAME,
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
        <link rel="dns-prefetch" href={STUDIO_URL} />
        <link rel="dns-prefetch" href="https://cdn.usefathom.com" />
        <link rel="dns-prefetch" href="https://github.com" />

        {/* Preconnect to analytics (used by Fathom) */}
        <link rel="preconnect" href="https://cdn.usefathom.com" crossOrigin="anonymous" />

        <JsonLd
          data={{
            '@type': 'WebSite',
            name: SITE_NAME,
            description: 'Discover beautiful line art icons representing cities around the world by Studio Partdirector.',
            url: SITE_URL,
            author: STUDIO_ORG,
            publisher: STUDIO_ORG,
            inLanguage: 'en-US',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_URL}?search={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
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
          <Analytics />
          <div id="main-content">
            {children}
          </div>
          <ThemedToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
