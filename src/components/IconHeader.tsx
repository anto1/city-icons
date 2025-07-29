import Link from 'next/link';
import { Icon } from '@/types';
import { trackEvent } from 'fathom-client';

interface IconHeaderProps {
  selectedIcon: Icon | null;
  modalOpen: boolean;
  countryFilter?: string;
  filteredIcons: Icon[];
  totalIcons: number;
}

export function IconHeader({ selectedIcon, modalOpen, countryFilter, filteredIcons, totalIcons }: IconHeaderProps) {
  if (selectedIcon && modalOpen) {
    return (
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
          {selectedIcon.name} - {selectedIcon.city}, {selectedIcon.country}
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          {selectedIcon.description || `Icon representing ${selectedIcon.city}, ${selectedIcon.country}`}
        </p>
        <p className="text-base text-muted-foreground">
          Download this high-quality SVG line art icon for your projects.
        </p>
      </div>
    );
  }

  if (countryFilter) {
    return (
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
          {countryFilter} City Icons
        </h1>
        <p className="text-lg text-muted-foreground">
          Line art icons representing cities in {countryFilter} by{' '}
          <a
            href="https://partdirector.ch"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-orange-600 transition-colors underline"
            onClick={() => trackEvent('STUDIO_PARTDIRECTOR_CLICKED')}
          >
            Studio Partdirector
          </a>.
        </p>
        <p className="text-lg text-muted-foreground mt-2">
          Browse {filteredIcons.length} city icons from {countryFilter}.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
        {totalIcons} City Icons
      </h1>
      <p className="text-lg text-muted-foreground">
        Line art icons representing cities around the world by{' '}
        <a
          href="https://partdirector.ch"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:text-orange-600 transition-colors underline"
          onClick={() => trackEvent('STUDIO_PARTDIRECTOR_CLICKED')}
        >
          Studio Partdirector
        </a>.
      </p>
      <p className="text-lg text-muted-foreground mt-2">
        Feeling lucky?{' '}
        <Link
          href="/roulette"
          className="text-foreground hover:text-orange-600 transition-colors underline font-medium"
          onClick={() => trackEvent('ROULETTE_LINK_CLICKED')}
        >
          Spin the roulette
        </Link>
        {' '}and see where you should go this year.
      </p>
    </div>
  );
} 