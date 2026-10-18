'use client';

import { Fragment, useState, useEffect } from 'react';
import Link from 'next/link';
import { CountryCount } from '@/types';
import { trackEvent } from 'fathom-client';
import { slugify } from '@/lib/utils';
import { GITHUB_URL, STUDIO_URL } from '@/lib/site';

interface IconFooterProps {
  /** Unique countries (alphabetical) with icon counts, precomputed server-side. */
  countries: CountryCount[];
  /** Total number of icons in the collection. */
  totalIcons: number;
}

const FOOTER_LINK_CLASS = 'text-sm text-muted-foreground hover:text-orange-600 transition-colors underline';

/** Footer nav: internal pages, the full-collection zip, and external links. */
const FOOTER_LINKS: { label: string; href: string; event: string; kind: 'page' | 'download' | 'external' }[] = [
  { label: 'Press kit', href: '/press', event: 'PRESS_LINK_CLICKED', kind: 'page' },
  { label: "What's New", href: '/whats-new', event: 'WHATS_NEW_CLICKED', kind: 'page' },
  { label: 'World Map', href: '/map', event: 'MAP_LINK_CLICKED', kind: 'page' },
  { label: 'Statistics', href: '/statistics', event: 'STATISTICS_CLICKED', kind: 'page' },
  { label: 'FAQ', href: '/faq', event: 'FAQ_CLICKED', kind: 'page' },
  { label: 'Download All', href: '/city-icons.zip', event: 'DOWNLOAD_ALL_ZIP', kind: 'download' },
  { label: 'License', href: '/license', event: 'LICENSE_LINK_CLICKED', kind: 'page' },
  { label: 'Request City', href: `${GITHUB_URL}/issues/new?template=city-request.yml`, event: 'MISSING_CITY_CLICKED', kind: 'external' },
  { label: 'GitHub', href: GITHUB_URL, event: 'GITHUB_LINK_CLICKED', kind: 'external' },
];

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
            href={STUDIO_URL}
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
          {FOOTER_LINKS.map((link, index) => (
            <Fragment key={link.href}>
              {index > 0 && (
                <span className="hidden sm:inline text-sm text-muted-foreground" aria-hidden="true">•</span>
              )}
              {link.kind === 'page' ? (
                <Link href={link.href} className={FOOTER_LINK_CLASS} onClick={() => trackEvent(link.event)}>
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className={FOOTER_LINK_CLASS}
                  onClick={() => trackEvent(link.event)}
                  {...(link.kind === 'download'
                    ? { download: true }
                    : { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  {link.label}
                </a>
              )}
            </Fragment>
          ))}
        </nav>
      </div>
    </footer>
  );
} 