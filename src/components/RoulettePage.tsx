'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/types';
import { Button } from '@/components/ui/button';
import { trackEvent } from 'fathom-client';
import Link from 'next/link';

interface RoulettePageProps {
  icons: Icon[];
}

export default function RoulettePage({ icons }: RoulettePageProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIcons, setSelectedIcons] = useState<Icon[]>([]);
  const [displayIcons, setDisplayIcons] = useState<Icon[]>([]);
  const [resultMessage, setResultMessage] = useState<string>('');

  // Track page view on mount
  useEffect(() => {
    trackEvent('ROULETTE_PAGE_VIEWED');
  }, []);

  const getResultMessage = (cities: Icon[]) => {
    const cityNames = cities.map(icon => icon.city);
    const uniqueCities = [...new Set(cityNames)];
    
    if (uniqueCities.length === 1) {
      return `No doubt — you have to go to ${uniqueCities[0]}.`;
    } else if (uniqueCities.length === 2) {
      const duplicates = cityNames.filter((city, index) => cityNames.indexOf(city) !== index);
      const uniqueCity = uniqueCities.find(city => city !== duplicates[0]);
      return `Looks like the universe is hinting at ${duplicates[0]}. Time to book that trip.`;
    } else {
      return "Three solid picks. You've got options.";
    }
  };

  const getDuplicateCities = (cities: Icon[]) => {
    const cityNames = cities.map(icon => icon.city);
    const duplicates = cityNames.filter((city, index) => cityNames.indexOf(city) !== index);
    return duplicates;
  };

  const spinRoulette = () => {
    setIsSpinning(true);
    setResultMessage('');
    trackEvent('ROULETTE_SPIN_STARTED');

    // Generate 3 random icons with increased probability for duplicates
    const random = Math.random();
    let randomIcons: Icon[];
    
    console.log('Random value:', random); // Debug
    
    if (random < 0.05) {
      // 5% chance for triple (all same city)
      const shuffled = [...icons].sort(() => Math.random() - 0.5);
      const selectedCity = shuffled[0];
      randomIcons = [selectedCity, selectedCity, selectedCity];
      console.log('TRIPLE - All same city:', selectedCity.city); // Debug
    } else if (random < 0.25) {
      // 20% chance for double (2 same cities)
      const shuffled = [...icons].sort(() => Math.random() - 0.5);
      const selectedCity = shuffled[0];
      const otherCities = shuffled.filter(icon => icon.city !== selectedCity.city);
      const secondCity = otherCities[0];
      randomIcons = [selectedCity, selectedCity, secondCity];
      console.log('DOUBLE - Two same cities:', selectedCity.city, 'and', secondCity.city); // Debug
    } else {
      // 75% chance for all different cities
      const shuffled = [...icons].sort(() => Math.random() - 0.5);
      randomIcons = shuffled.slice(0, 3);
      console.log('THREE DIFFERENT - Cities:', randomIcons.map(icon => icon.city)); // Debug
    }
    
    setSelectedIcons(randomIcons);

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
              const duplicates = cityNames.filter((city, index) => cityNames.indexOf(city) !== index);
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

  // Debug: Log the current state
  console.log('Selected icons:', selectedIcons.map(icon => icon.city));
  console.log('Display icons:', displayIcons.map(icon => icon.city));
  console.log('Duplicate cities:', duplicateCities);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 md:mb-8">
          <div className="mb-2 md:mb-4">
            <Link
              href="/"
              className="text-sm md:text-base text-muted-foreground hover:text-orange-600 transition-colors underline"
              onClick={() => trackEvent('ROULETTE_BACK_TO_CITIES_CLICKED')}
            >
              ← Back to cities
            </Link>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2 md:mb-4 mt-4 md:mt-8">
            Where Should You Go This Year?
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground mb-4 md:mb-8">
            Click the button to spin the globe and get your travel picks for the year.
          </p>
        </div>

        {/* Roulette Cards */}
        <div className="grid grid-cols-3 gap-2 md:gap-6 max-w-4xl mx-auto mb-4 md:mb-8">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`relative p-2 md:p-6 rounded-[48px] border-2 transition-all duration-300 w-full aspect-[3/2.1] md:aspect-[3/4] ${
                isSpinning 
                  ? 'border-orange-400 bg-orange-50 animate-pulse' 
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex flex-col items-center justify-center h-full">
                {displayIcons[index] ? (
                  <>
                    <div className="w-14 h-14 md:w-16 md:h-16 text-foreground mb-1 md:mb-4 flex items-center justify-center">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: displayIcons[index].svgContent
                            .replace(/width="[^"]*"/, 'width="100%"')
                            .replace(/height="[^"]*"/, 'height="100%"')
                            .replace(/viewBox="[^"]*"/, 'viewBox="0 0 120 120"')
                            .replace(/fill="[^"]*"/g, `fill="${!isSpinning && duplicateCities.includes(displayIcons[index].city) ? '#e2725b' : 'currentColor'}"`)
                        }}
                      />
                    </div>
                    <h3 className={`text-base md:text-xl font-bold mb-0.5 md:mb-2 ${
                      !isSpinning && duplicateCities.includes(displayIcons[index].city)
                        ? 'text-orange-600'
                        : 'text-foreground'
                    }`}>
                      {displayIcons[index].city}
                    </h3>
                    <p className="text-xs md:text-base text-muted-foreground">
                      {displayIcons[index].country}
                    </p>
                  </>
                ) : (
                  <div className="text-center flex flex-col items-center justify-center h-full">
                    <div className="w-14 h-14 md:w-16 md:h-16 text-foreground mb-1 md:mb-4 flex items-center justify-center">
                      <img 
                        src="/cherry.svg" 
                        alt="Cherry" 
                        className="w-full h-full"
                      />
                    </div>
                    <h3 className="text-base md:text-xl font-bold text-foreground mb-0.5 md:mb-2">
                      Cherry
                    </h3>
                    <p className="text-xs md:text-base text-muted-foreground">
                      Fruit
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Spin Button - Now below cards */}
        <div className="text-center mb-4 md:mb-8">
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
          <div className="text-center mt-4 md:mt-8">
            <p className="text-base md:text-xl font-medium text-foreground bg-orange-50 border border-orange-200 rounded-lg px-4 md:px-6 py-3 md:py-4 max-w-2xl mx-auto">
              {resultMessage}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-6 mt-16">
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
            <span className="text-sm text-muted-foreground">•</span>
            <Link
              href="/license"
              className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
              onClick={() => trackEvent('LICENSE_LINK_CLICKED')}
            >
              Usage & Licensing
            </Link>
            <span className="text-sm text-muted-foreground">•</span>
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
    </div>
  );
} 