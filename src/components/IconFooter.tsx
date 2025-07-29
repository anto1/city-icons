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

  return (
    <footer className="py-6 mt-16">
      <div className="container mx-auto px-4 text-center">
        {/* Countries List */}
        <div className="mb-6">
          <div className="relative inline-block text-left">
            <select 
              className="text-sm text-muted-foreground bg-transparent border border-muted-foreground/20 rounded px-3 py-1 focus:outline-none focus:border-orange-600 transition-colors cursor-pointer"
              onChange={(e) => {
                if (e.target.value) {
                  router.push(`/${e.target.value}`);
                }
              }}
              value=""
            >
              <option value="">Country: choose</option>
              {[...new Set(icons.map(icon => icon.country))]
                .sort()
                .map((country) => (
                  <option key={country} value={slugify(country)}>
                    {country}
                  </option>
                ))}
            </select>
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