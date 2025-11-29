import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/types';
import { trackEvent } from 'fathom-client';
import { slugify } from '@/lib/utils';

interface IconFooterProps {
  icons: Icon[];
}

export function IconFooter({ icons }: IconFooterProps) {
  const router = useRouter();

  // Get unique countries sorted alphabetically
  const countries = [...new Set(icons.map(icon => icon.country))].sort();

  // Get count of icons per country
  const getCountryCount = (country: string) => {
    return icons.filter(icon => icon.country === country).length;
  };

  return (
    <footer className="py-6 mt-16">
      <div className="container mx-auto px-4 text-center">
        {/* Countries Chips */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            {countries.length} Countries
          </h3>
          <div className="flex flex-wrap justify-center gap-2 max-w-5xl mx-auto">
            {countries.map((country) => {
              const count = getCountryCount(country);
              return (
                <button
                  key={country}
                  onClick={() => {
                    router.push(`/${slugify(country)}`);
                    trackEvent(`COUNTRY_${slugify(country).toUpperCase()}_CLICKED`);
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                    bg-muted/50 text-muted-foreground hover:bg-foreground hover:text-background
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
                  aria-label={`View ${count} icons from ${country}`}
                >
                  {country}
                  <span className="ml-1.5 opacity-60" aria-hidden="true">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
        
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
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="mailto:icons@partdirector.ch?subject=City Request&body=Please add: [City, Country]"
            className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
            onClick={() => trackEvent('MISSING_CITY_CLICKED')}
          >
            Missing your city?
          </a>
          <span className="hidden sm:inline text-sm text-muted-foreground">•</span>
          <Link
            href="/license"
            className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
            onClick={() => trackEvent('LICENSE_LINK_CLICKED')}
          >
            Usage & Licensing
          </Link>
          <span className="hidden sm:inline text-sm text-muted-foreground">•</span>
          <a
            href="https://github.com/anto1/city-icons"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
            onClick={() => trackEvent('GITHUB_LINK_CLICKED')}
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
} 