'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CountryCount, GridIcon } from '@/types';
import { trackEvent } from 'fathom-client';
import { getIconSvgUrl } from '@/lib/utils';
import { HeaderControls, prefersReducedMotion } from './PageHeader';
import { IconFooter } from '@/components/IconFooter';

interface RoulettePageProps {
  icons: GridIcon[];
}

export default function RoulettePage({ icons }: RoulettePageProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayIcons, setDisplayIcons] = useState<GridIcon[]>([]);
  const [resultMessage, setResultMessage] = useState<string>('');
  // Currently active spin interval — cleared on unmount so a mid-spin
  // navigation doesn't keep firing setState on an unmounted component
  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Track page view on mount
  useEffect(() => {
    trackEvent('ROULETTE_PAGE_VIEWED');
  }, []);

  // Country counts for the shared footer, derived from the icons prop so the
  // server parent's API stays unchanged. Matches getCountryCounts() ordering
  // (unique countries, alphabetical).
  const footerCountries = useMemo<CountryCount[]>(
    () =>
      [
        ...icons.reduce((counts, icon) => {
          counts.set(icon.country, (counts.get(icon.country) ?? 0) + 1);
          return counts;
        }, new Map<string, number>()),
      ]
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([country, count]) => ({ country, count })),
    [icons]
  );

  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
    };
  }, []);

  const getResultMessage = (cities: GridIcon[]) => {
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

  const getDuplicateCities = (cities: GridIcon[]) => {
    const cityNames = cities.map(icon => icon.city);
    return cityNames.filter((city, index) => cityNames.indexOf(city) !== index);
  };

  // Pick `count` icons at distinct random indices (no full-array shuffle)
  const pickDistinctRandomIcons = (count: number): GridIcon[] => {
    const pickedIndices = new Set<number>();
    while (pickedIndices.size < Math.min(count, icons.length)) {
      pickedIndices.add(Math.floor(Math.random() * icons.length));
    }
    return Array.from(pickedIndices, (index) => icons[index]);
  };

  const finishSpin = (result: GridIcon[]) => {
    setDisplayIcons(result);
    setIsSpinning(false);
    setResultMessage(getResultMessage(result));

    // Track result type
    const uniqueCities = new Set(result.map(icon => icon.city));
    if (uniqueCities.size === 1) {
      trackEvent('ROULETTE_RESULT_SAME_CITY');
    } else if (uniqueCities.size === 2) {
      trackEvent('ROULETTE_RESULT_DUPLICATE_CITY');
    } else {
      trackEvent('ROULETTE_RESULT_THREE_DIFFERENT');
    }
  };

  const spinRoulette = () => {
    setIsSpinning(true);
    setResultMessage('');
    trackEvent('ROULETTE_SPIN_STARTED');

    // Generate 3 random icons with increased probability for duplicates
    const random = Math.random();
    let randomIcons: GridIcon[];

    if (random < 0.05) {
      // 5% chance for triple (all same city)
      const [selectedCity] = pickDistinctRandomIcons(1);
      randomIcons = [selectedCity, selectedCity, selectedCity];
    } else if (random < 0.25) {
      // 20% chance for double (2 same cities)
      const [selectedCity] = pickDistinctRandomIcons(1);
      const otherCities = icons.filter(icon => icon.city !== selectedCity.city);
      const secondCity = otherCities.length > 0
        ? otherCities[Math.floor(Math.random() * otherCities.length)]
        : selectedCity;
      randomIcons = [selectedCity, selectedCity, secondCity];
    } else {
      // 75% chance for all different cities
      randomIcons = pickDistinctRandomIcons(3);
    }

    // Reduced motion: skip the ~8s animated spin and show the result immediately
    if (prefersReducedMotion()) {
      finishSpin(randomIcons);
      return;
    }

    // Start the spinning animation with variable speed
    let spinCount = 0;
    const maxSpins = 40;
    const baseInterval = 150;
    const slowDownFactor = 1.5; // How much to slow down

    spinIntervalRef.current = setInterval(() => {
      setDisplayIcons(pickDistinctRandomIcons(3));
      spinCount++;

      // Slow down towards the end
      if (spinCount >= maxSpins * 0.7) {
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
        // Start slower spinning for the final phase
        let finalSpinCount = 0;
        const finalSpins = 10;
        spinIntervalRef.current = setInterval(() => {
          setDisplayIcons(pickDistinctRandomIcons(3));
          finalSpinCount++;

          if (finalSpinCount >= finalSpins) {
            if (spinIntervalRef.current) {
              clearInterval(spinIntervalRef.current);
              spinIntervalRef.current = null;
            }
            finishSpin(randomIcons);
          }
        }, baseInterval * slowDownFactor);
      }
    }, baseInterval);
  };

  const duplicateCities = getDuplicateCities(displayIcons);

  return (
    <div className="min-h-screen bg-background">
      {/* Cherry GridIcon Header */}
      <nav aria-label="Home navigation" className="relative flex justify-center items-center gap-8 py-16">
        <HeaderControls />
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
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8 list-none" role="list">
            {[0, 1, 2].map((index) => (
              <li
                key={index}
                className={`relative p-4 rounded-lg border-2 transition-all duration-300 w-full max-w-xs mx-auto sm:max-w-none ${
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
                      <p className={`text-base font-medium mb-1 ${
                        !isSpinning && duplicateCities.includes(displayIcons[index].city)
                          ? 'text-orange-600'
                          : 'text-foreground'
                      }`}>
                        {displayIcons[index].city}
                      </p>
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

        {/* Result Message - region stays mounted so screen readers announce updates */}
        <section className="text-center mt-8" aria-live="polite">
          {resultMessage && (
            <p className="text-base md:text-xl font-medium text-foreground bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg px-4 md:px-6 py-3 md:py-4 max-w-2xl mx-auto">
              {resultMessage}
            </p>
          )}
        </section>
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

      {/* Footer — shared component (countries nav, credit line, footer links) */}
      <IconFooter countries={footerCountries} totalIcons={icons.length} />
    </div>
  );
} 