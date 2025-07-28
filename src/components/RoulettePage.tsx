'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/types';
import { Button } from '@/components/ui/button';
import { trackEvent } from 'fathom-client';

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
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                isSpinning 
                  ? 'border-orange-400 bg-orange-50 animate-pulse' 
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex flex-col items-center justify-center min-h-[200px]">
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
                    <div className="w-16 h-16 bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-muted-foreground text-2xl">?</span>
                    </div>
                    <p className="text-muted-foreground">Ready to spin!</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        {!isSpinning && selectedIcons.length > 0 && (
          <div className="text-center mt-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Your Random Cities:
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {selectedIcons.map((icon, index) => (
                <div
                  key={icon._id}
                  className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg"
                >
                  <span className="text-sm font-medium text-foreground">
                    {icon.city}, {icon.country}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 