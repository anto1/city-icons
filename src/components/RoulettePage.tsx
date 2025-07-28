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

  const spinRoulette = () => {
    setIsSpinning(true);
    trackEvent('ROULETTE_SPIN');

    // Generate 3 random icons
    const shuffled = [...icons].sort(() => Math.random() - 0.5);
    const randomIcons = shuffled.slice(0, 3);
    setSelectedIcons(randomIcons);

    // Start the spinning animation
    let spinCount = 0;
    const maxSpins = 20; // Number of spins before settling
    const spinInterval = setInterval(() => {
      const tempIcons = [...icons].sort(() => Math.random() - 0.5).slice(0, 3);
      setDisplayIcons(tempIcons);
      spinCount++;

      if (spinCount >= maxSpins) {
        clearInterval(spinInterval);
        setDisplayIcons(randomIcons);
        setIsSpinning(false);
      }
    }, 100); // Spin every 100ms
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            City Roulette
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Spin the roulette to discover random cities from around the world
          </p>
          
          {/* Spin Button */}
          <Button 
            onClick={spinRoulette}
            disabled={isSpinning}
            className="px-8 py-3 text-lg font-semibold bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
          >
            {isSpinning ? 'Spinning...' : 'Spin the Roulette!'}
          </Button>
        </div>

        {/* Roulette Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 w-full aspect-[2/3] ${
                isSpinning 
                  ? 'border-orange-400 bg-orange-50 animate-pulse' 
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex flex-col items-center justify-center h-full">
                {displayIcons[index] ? (
                  <>
                    <div className="w-16 h-16 text-foreground mb-4">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: displayIcons[index].svgContent
                            .replace(/width="[^"]*"/, 'width="64"')
                            .replace(/height="[^"]*"/, 'height="64"')
                            .replace(/viewBox="[^"]*"/, 'viewBox="0 0 120 120"')
                        }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {displayIcons[index].city}
                    </h3>
                    <p className="text-muted-foreground">
                      {displayIcons[index].country}
                    </p>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 text-foreground mb-4">
                      {/* Cape Town Flowers placeholder */}
                      <svg viewBox="0 0 120 120" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <g>
                          {/* Flower 1 */}
                          <circle cx="40" cy="40" r="8" fill="currentColor"/>
                          <path d="M40 20 Q50 30 60 40 Q65 50 60 60 Q55 70 40 80 Q25 70 20 60 Q15 50 20 40 Q30 30 40 20 Z" fill="currentColor"/>
                          <path d="M40 20 Q50 30 60 40 Q65 50 60 60 Q55 70 40 80 Q25 70 20 60 Q15 50 20 40 Q30 30 40 20 Z" fill="currentColor" transform="rotate(45 40 40)"/>
                          <path d="M40 20 Q50 30 60 40 Q65 50 60 60 Q55 70 40 80 Q25 70 20 60 Q15 50 20 40 Q30 30 40 20 Z" fill="currentColor" transform="rotate(90 40 40)"/>
                          <path d="M40 20 Q50 30 60 40 Q65 50 60 60 Q55 70 40 80 Q25 70 20 60 Q15 50 20 40 Q30 30 40 20 Z" fill="currentColor" transform="rotate(135 40 40)"/>
                          
                          {/* Flower 2 */}
                          <circle cx="80" cy="80" r="8" fill="currentColor"/>
                          <path d="M80 60 Q90 70 100 80 Q105 90 100 100 Q95 110 80 120 Q65 110 60 100 Q55 90 60 80 Q70 70 80 60 Z" fill="currentColor"/>
                          <path d="M80 60 Q90 70 100 80 Q105 90 100 100 Q95 110 80 120 Q65 110 60 100 Q55 90 60 80 Q70 70 80 60 Z" fill="currentColor" transform="rotate(45 80 80)"/>
                          <path d="M80 60 Q90 70 100 80 Q105 90 100 100 Q95 110 80 120 Q65 110 60 100 Q55 90 60 80 Q70 70 80 60 Z" fill="currentColor" transform="rotate(90 80 80)"/>
                          <path d="M80 60 Q90 70 100 80 Q105 90 100 100 Q95 110 80 120 Q65 110 60 100 Q55 90 60 80 Q70 70 80 60 Z" fill="currentColor" transform="rotate(135 80 80)"/>
                          
                          {/* Flower 3 */}
                          <circle cx="60" cy="60" r="8" fill="currentColor"/>
                          <path d="M60 40 Q70 50 80 60 Q85 70 80 80 Q75 90 60 100 Q45 90 40 80 Q35 70 40 60 Q50 50 60 40 Z" fill="currentColor"/>
                          <path d="M60 40 Q70 50 80 60 Q85 70 80 80 Q75 90 60 100 Q45 90 40 80 Q35 70 40 60 Q50 50 60 40 Z" fill="currentColor" transform="rotate(45 60 60)"/>
                          <path d="M60 40 Q70 50 80 60 Q85 70 80 80 Q75 90 60 100 Q45 90 40 80 Q35 70 40 60 Q50 50 60 40 Z" fill="currentColor" transform="rotate(90 60 60)"/>
                          <path d="M60 40 Q70 50 80 60 Q85 70 80 80 Q75 90 60 100 Q45 90 40 80 Q35 70 40 60 Q50 50 60 40 Z" fill="currentColor" transform="rotate(135 60 60)"/>
                        </g>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Cape Town
                    </h3>
                    <p className="text-muted-foreground">
                      South Africa
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
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