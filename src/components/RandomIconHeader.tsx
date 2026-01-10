'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/types';
import { getIconUrl, getIconSvgUrl } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { Github } from 'lucide-react';
import { trackEvent } from 'fathom-client';

interface RandomIconHeaderProps {
  icons: Icon[];
}

export function RandomIconHeader({ icons }: RandomIconHeaderProps) {
  // Memoize random selection to avoid re-shuffling on every render
  const randomIcons = useMemo(() => {
    return [...icons]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }, [icons]);

  return (
    <nav aria-label="Featured cities" className="relative flex justify-center items-center gap-8 py-16">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <a
          href="https://github.com/anto1/city-icons"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={() => trackEvent('GITHUB_CLICKED')}
          aria-label="View on GitHub"
        >
          <Github className="w-5 h-5" />
        </a>
        <ThemeToggle />
      </div>
      {randomIcons.map((icon) => (
        <Link
          key={icon._id}
          href={getIconUrl(icon)}
          className="w-14 h-14 cursor-pointer hover:opacity-70 transition-opacity"
          title={`${icon.city}, ${icon.country}`}
          aria-label={`View ${icon.city}, ${icon.country} icon`}
        >
          <Image
            src={getIconSvgUrl(icon)}
            alt=""
            width={56}
            height={56}
            className="w-14 h-14 dark:invert"
          />
        </Link>
      ))}
    </nav>
  );
} 