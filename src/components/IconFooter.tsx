import Link from 'next/link';
import { Icon } from '@/types';
import { trackEvent } from 'fathom-client';
import { slugify } from '@/lib/utils';

interface IconFooterProps {
  icons: Icon[];
}

export function IconFooter({ icons }: IconFooterProps) {
  // Get unique countries sorted alphabetically
  const countries = [...new Set(icons.map(icon => icon.country))].sort();

  // Get count of icons per country
  const getCountryCount = (country: string) => {
    return icons.filter(icon => icon.country === country).length;
  };

  return (
    <footer className="py-6 mt-16" role="contentinfo">
      <div className="container mx-auto px-4 text-center">
        {/* Countries Navigation */}
        <nav aria-label="Browse by country" className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            {countries.length} Countries
            <span className="ml-2 text-xs opacity-60">
              ({195 - countries.length} left to add)
            </span>
          </h2>
          <ul className="flex flex-wrap justify-center gap-2 max-w-5xl mx-auto list-none">
            {countries.map((country) => {
              const count = getCountryCount(country);
              return (
                <li key={country}>
                  <Link
                    href={`/${slugify(country)}`}
                    onClick={() => trackEvent(`COUNTRY_${slugify(country).toUpperCase()}_CLICKED`)}
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
          {icons.length} icons ©{' '}
          <a
            href="https://partdirector.ch"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-orange-600 transition-colors underline"
            onClick={() => trackEvent('STUDIO_PARTDIRECTOR_FOOTER_CLICKED')}
          >
            Studio Partdirector
          </a>
          , 2025
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
          <Link
            href="/license"
            className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
            onClick={() => trackEvent('LICENSE_LINK_CLICKED')}
          >
            License
          </Link>
          <span className="hidden sm:inline text-sm text-muted-foreground" aria-hidden="true">•</span>
          <a
            href="mailto:icons@partdirector.ch?subject=City Request&body=Please add: [City, Country]"
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