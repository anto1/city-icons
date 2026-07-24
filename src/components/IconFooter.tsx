'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CountryCount } from '@/types';
import { trackEvent } from 'fathom-client';
import { slugify } from '@/lib/utils';

interface IconFooterProps {
  /** Unique countries (alphabetical) with icon counts, precomputed server-side. */
  countries: CountryCount[];
  /** Total number of icons in the collection. */
  totalIcons: number;
}

// Copyright year rendered after mount: the statically generated HTML bakes in
// the build-time year, so computing it during render would hydrate-mismatch
// for any view after Dec 31 before a rebuild. suppressHydrationWarning covers
// the pre-effect frame; the effect then swaps in the visitor's current year.
function CopyrightYear() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return <span suppressHydrationWarning>{year ?? new Date().getFullYear()}</span>;
}

export function IconFooter({ countries, totalIcons }: IconFooterProps) {
  return (
    <footer className="py-6 mt-16" role="contentinfo">
      <div className="container mx-auto px-4 text-center">
        {/* Countries Navigation */}
        <nav aria-label="Browse by country" className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            {countries.length} Countries &amp; Territories
            <span className="ml-2 text-xs opacity-60">
              (more on the way)
            </span>
          </h2>
          <ul className="flex flex-wrap justify-center gap-2 max-w-5xl mx-auto list-none">
            {countries.map(({ country, count }) => {
              return (
                <li key={country}>
                  <Link
                    href={`/${slugify(country)}`}
                    onClick={() => {
                      // Aggregate event (queryable total) + per-country breakdown
                      trackEvent('COUNTRY_CLICKED');
                      trackEvent(`COUNTRY_${slugify(country).toUpperCase()}_CLICKED`);
                    }}
                    className="inline-block px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                      bg-muted/50 text-muted-foreground hover:bg-foreground hover:text-background
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
                    aria-label={`View ${count} icons from ${country}`}
                  >
                    {country}
                    <span className="ml-1.5 opacity-60" aria-hidden="true">{count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <p className="text-sm text-foreground mb-2">
          {totalIcons} icons ©{' '}
          <a
            href="https://partdirector.ch"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-orange-600 transition-colors underline"
            onClick={() => trackEvent('STUDIO_PARTDIRECTOR_FOOTER_CLICKED')}
          >
            Studio Partdirector
          </a>
          , <CopyrightYear />
        </p>
        <nav aria-label="Footer links" className="flex flex-wrap gap-x-4 gap-y-2 justify-center items-center">
          <Link
            href="/whats-new"
            className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
            onClick={() => trackEvent('WHATS_NEW_CLICKED')}
          >
            What&apos;s New
          </Link>
          <span className="hidden sm:inline text-sm text-muted-foreground" aria-hidden="true">•</span>
          <Link
            href="/map"
            className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
            onClick={() => trackEvent('MAP_LINK_CLICKED')}
          >
            World Map
          </Link>
          <span className="hidden sm:inline text-sm text-muted-foreground" aria-hidden="true">•</span>
          <Link
            href="/statistics"
            className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
            onClick={() => trackEvent('STATISTICS_CLICKED')}
          >
            Statistics
          </Link>
          <span className="hidden sm:inline text-sm text-muted-foreground" aria-hidden="true">•</span>
          <Link
            href="/faq"
            className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
            onClick={() => trackEvent('FAQ_CLICKED')}
          >
            FAQ
          </Link>
          <span className="hidden sm:inline text-sm text-muted-foreground" aria-hidden="true">•</span>
          <a
            href="/city-icons.zip"
            download
            className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
            onClick={() => trackEvent('DOWNLOAD_ALL_ZIP')}
          >
            Download All
          </a>
          <span className="hidden sm:inline text-sm text-muted-foreground" aria-hidden="true">•</span>
          <Link
            href="/license"
            className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
            onClick={() => trackEvent('LICENSE_LINK_CLICKED')}
          >
            License
          </Link>
          <span className="hidden sm:inline text-sm text-muted-foreground" aria-hidden="true">•</span>
          <a
            href="https://github.com/anto1/city-icons/issues/new?template=city-request.yml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
            onClick={() => trackEvent('MISSING_CITY_CLICKED')}
          >
            Request City
          </a>
          <span className="hidden sm:inline text-sm text-muted-foreground" aria-hidden="true">•</span>
          <a
            href="https://github.com/anto1/city-icons"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
            onClick={() => trackEvent('GITHUB_LINK_CLICKED')}
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
} 