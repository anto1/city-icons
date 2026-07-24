'use client';

import { useState, useEffect } from 'react';
import { Github, ArrowUp } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { trackEvent } from 'fathom-client';

/** Check the user's motion preference at call time (safe on the server). */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Reactive version of prefersReducedMotion — tracks live preference changes. */
export function usePrefersReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
}

/**
 * Shared top-right header controls: scroll-to-top, GitHub link, theme toggle.
 * Used by PageHeader, RandomIconHeader, CityPage, and RoulettePage.
 */
export function HeaderControls() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past the first viewport height
      setShowScrollTop(window.scrollY > window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
    trackEvent('SCROLL_TO_TOP_CLICKED');
  };

  return (
    <div className="absolute md:fixed right-4 top-4 md:z-50 flex items-center gap-2">
      {/* Scroll to top button - only visible after scrolling */}
      <button
        onClick={scrollToTop}
        inert={!showScrollTop}
        className={`p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        aria-label="Scroll to top"
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
  );
}

export function PageHeader() {
  return (
    <>
      {/* Spacer for fixed header on desktop */}
      <div className="hidden md:block h-14" />

      <HeaderControls />
    </>
  );
}
