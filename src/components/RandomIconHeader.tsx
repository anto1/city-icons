'use client';

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/types';
import { getIconUrl, getIconSvgUrl } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { Github, ArrowUp } from 'lucide-react';
import { trackEvent } from 'fathom-client';

interface RandomIconHeaderProps {
  icons: Icon[];
}

export function RandomIconHeader({ icons }: RandomIconHeaderProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('SCROLL_TO_TOP_CLICKED');
  };

  // Memoize random selection to avoid re-shuffling on every render
  const randomIcons = useMemo(() => {
    return [...icons]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }, [icons]);

  return (
    <nav aria-label="Featured cities" className="relative flex justify-center items-center gap-8 py-16">
      <div className="absolute md:fixed right-4 top-4 md:z-50 flex items-center gap-2">
        <button
          onClick={scrollToTop}
          className={`p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300 ${
            showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
          aria-label="Scroll to top"
          aria-hidden={!showScrollTop}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
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
            alt={`${icon.name} - ${icon.city}, ${icon.country}`}
            width={56}
            height={56}
            className="w-14 h-14 dark:invert"
          />
        </Link>
      ))}
    </nav>
  );
} 