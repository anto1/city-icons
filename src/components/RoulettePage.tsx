'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Icon } from '@/types';
import { trackEvent } from 'fathom-client';
import { getIconSvgUrl } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { Github, ArrowUp } from 'lucide-react';

interface RoulettePageProps {
  icons: Icon[];
}

export default function RoulettePage({ icons }: RoulettePageProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayIcons, setDisplayIcons] = useState<Icon[]>([]);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Track page view on mount
  useEffect(() => {
    trackEvent('ROULETTE_PAGE_VIEWED');
  }, []);

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

  const getResultMessage = (cities: Icon[]) => {
    const cityNames = cities.map(icon => icon.city);
    const uniqueCities = [...new Set(cityNames)];
    
    if (uniqueCities.length === 1) {
      return `No doubt — you have to go to ${uniqueCities[0]}.`;
    } else if (uniqueCities.length === 2) {
      const duplicates = cityNames.filter((city, index) => cityNames.indexOf(city) !== index);
      return `Looks like the universe is hinting at ${duplicates[0]}. Time to book that trip.`;
    } else {
      return "Three solid picks. You've got options.";
    }
  };

  const getDuplicateCities = (cities: Icon[]) => {
    const cityNames = cities.map(icon => icon.city);
    return cityNames.filter((city, index) => cityNames.indexOf(city) !== index);
  };

  const spinRoulette = () => {
    setIsSpinning(true);
    setResultMessage('');
    trackEvent('ROULETTE_SPIN_STARTED');

    // Generate 3 random icons with increased probability for duplicates
    const random = Math.random();
    let randomIcons: Icon[];
    
    if (random < 0.05) {
      // 5% chance for triple (all same city)
      const shuffled = [...icons].sort(() => Math.random() - 0.5);
      const selectedCity = shuffled[0];
      randomIcons = [selectedCity, selectedCity, selectedCity];
    } else if (random < 0.25) {
      // 20% chance for double (2 same cities)
      const shuffled = [...icons].sort(() => Math.random() - 0.5);
      const selectedCity = shuffled[0];
      const otherCities = shuffled.filter(icon => icon.city !== selectedCity.city);
      const secondCity = otherCities[0];
      randomIcons = [selectedCity, selectedCity, secondCity];
    } else {
      // 75% chance for all different cities
      const shuffled = [...icons].sort(() => Math.random() - 0.5);
      randomIcons = shuffled.slice(0, 3);
    }
    
    // Start the spinning animation with variable speed
    let spinCount = 0;
    const maxSpins = 40;
    const baseInterval = 150;
    const slowDownFactor = 1.5; // How much to slow down
    
    const spinInterval = setInterval(() => {
      const tempIcons = [...icons].sort(() => Math.random() - 0.5).slice(0, 3);
      setDisplayIcons(tempIcons);
      spinCount++;

      // Slow down towards the end
      if (spinCount >= maxSpins * 0.7) {
        clearInterval(spinInterval);
        // Start slower spinning for the final phase
        let finalSpinCount = 0;
        const finalSpins = 10;
        const finalInterval = setInterval(() => {
          const tempIcons = [...icons].sort(() => Math.random() - 0.5).slice(0, 3);
          setDisplayIcons(tempIcons);
          finalSpinCount++;

          if (finalSpinCount >= finalSpins) {
            clearInterval(finalInterval);
            setDisplayIcons(randomIcons);
            setIsSpinning(false);
            const message = getResultMessage(randomIcons);
            setResultMessage(message);
            
            // Track result type
            const cityNames = randomIcons.map(icon => icon.city);
            const uniqueCities = [...new Set(cityNames)];
            
            if (uniqueCities.length === 1) {
              trackEvent('ROULETTE_RESULT_SAME_CITY');
            } else if (uniqueCities.length === 2) {
              trackEvent('ROULETTE_RESULT_DUPLICATE_CITY');
            } else {
              trackEvent('ROULETTE_RESULT_THREE_DIFFERENT');
            }
          }
        }, baseInterval * slowDownFactor);
      }
    }, baseInterval);
  };

  const duplicateCities = getDuplicateCities(displayIcons);

  return (
    <div className="min-h-screen bg-background">
      {/* Cherry Icon Header */}
      <nav aria-label="Home navigation" className="relative flex justify-center items-center gap-8 py-16">
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
        <Link href="/" className="w-14 h-14 text-foreground hover:opacity-80 transition-opacity" aria-label="Go to home page">
          <Image
            src="/cherry.svg"
            alt=""
            width={56}
            height={56}
            className="dark:invert"
          />
        </Link>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
            Where Should You Go This Year?
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Click the button to spin the globe and get your travel picks for the year.
          </p>
        </header>

        {/* Roulette Cards */}
        <section aria-label="Travel destination picks" aria-live="polite" aria-busy={isSpinning}>
          <ul className="grid grid-cols-3 gap-4 max-w-4xl mx-auto mb-8 list-none" role="list">
            {[0, 1, 2].map((index) => (
              <li
                key={index}
                className={`relative p-4 rounded-lg border-2 transition-all duration-300 w-full ${
                  isSpinning
                    ? 'border-orange-400 bg-orange-50 dark:bg-orange-950 animate-pulse'
                    : 'border-border bg-card'
                }`}
                style={{ aspectRatio: '1 / 1' }}
              >
                <article className="flex flex-col items-center justify-center h-full">
                  {displayIcons[index] ? (
                    <>
                      <div className={`w-14 h-14 mb-4 flex items-center justify-center transition-all duration-300 ${
                        !isSpinning && duplicateCities.includes(displayIcons[index].city)
                          ? 'brightness-75 sepia saturate-200 hue-rotate-[340deg]'
                          : ''
                      }`}>
                        <Image
                          src={getIconSvgUrl(displayIcons[index])}
                          alt={`${displayIcons[index].name} - ${displayIcons[index].city}`}
                          width={56}
                          height={56}
                          className="w-14 h-14 dark:invert"
                        />
                      </div>
                      <h2 className={`text-base font-medium mb-1 ${
                        !isSpinning && duplicateCities.includes(displayIcons[index].city)
                          ? 'text-orange-600'
                          : 'text-foreground'
                      }`}>
                        {displayIcons[index].city}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {displayIcons[index].country}
                      </p>
                    </>
                  ) : (
                    <div className="text-center flex flex-col items-center justify-center h-full">
                      <div className="w-14 h-14 mb-4 flex items-center justify-center">
                        <Image
                          src="/cherry.svg"
                          alt=""
                          width={56}
                          height={56}
                          className="dark:invert"
                        />
                      </div>
                      <p className="text-base font-medium text-foreground mb-1">
                        Cherry
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Fruit
                      </p>
                    </div>
                  )}
                </article>
              </li>
            ))}
          </ul>
        </section>

        {/* Spin Button - Now below cards */}
        <div className="text-center mb-8">
          <Button 
            onClick={spinRoulette}
            disabled={isSpinning}
            className="px-6 md:px-12 py-4 md:py-6 text-base md:text-2xl font-bold bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
          >
            {isSpinning ? 'Spinning...' : 'Where Should I Go?'}
          </Button>
        </div>

        {/* Result Message */}
        {resultMessage && (
          <section className="text-center mt-8" aria-live="assertive">
            <p className="text-base md:text-xl font-medium text-foreground bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg px-4 md:px-6 py-3 md:py-4 max-w-2xl mx-auto">
              {resultMessage}
            </p>
          </section>
        )}
      </main>

      {/* Back to Cities Link */}
      <nav className="text-center py-4" aria-label="Page navigation">
        <Link
          href="/"
          className="text-sm md:text-base text-muted-foreground hover:text-orange-600 transition-colors underline"
          onClick={() => trackEvent('ROULETTE_BACK_TO_CITIES_CLICKED')}
        >
          ← Back to cities
        </Link>
      </nav>

      {/* Footer */}
      <footer className="py-6 mt-16" role="contentinfo">
        <div className="container mx-auto px-4 text-center">
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
            , {new Date().getFullYear()}
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
    </div>
  );
} 