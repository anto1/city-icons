'use client';

import { Icon } from '@/types';
import { trackEvent } from 'fathom-client';

interface RegionFilterProps {
  regions: string[];
  selectedRegion: string | null;
  onRegionSelect: (region: string | null) => void;
  icons: Icon[];
}

// Region display names and order
const REGION_CONFIG: Record<string, { label: string; order: number }> = {
  'Europe': { label: 'Europe', order: 1 },
  'Asia': { label: 'Asia', order: 2 },
  'North America': { label: 'North America', order: 3 },
  'South America': { label: 'South America', order: 4 },
  'Middle East': { label: 'Middle East', order: 5 },
  'Africa': { label: 'Africa', order: 6 },
  'Oceania': { label: 'Oceania', order: 7 },
  'Central America': { label: 'Central America', order: 8 },
};

export function RegionFilter({ regions, selectedRegion, onRegionSelect, icons }: RegionFilterProps) {
  // Sort regions by configured order
  const sortedRegions = [...regions].sort((a, b) => {
    const orderA = REGION_CONFIG[a]?.order ?? 99;
    const orderB = REGION_CONFIG[b]?.order ?? 99;
    return orderA - orderB;
  });

  // Get count of icons per region
  const getRegionCount = (region: string) => {
    return icons.filter(icon => icon.region === region).length;
  };

  return (
    <nav 
      aria-label="Filter icons by region"
      className="flex flex-wrap justify-center gap-2 mt-6"
      role="group"
    >
      {/* All button */}
      <button
        onClick={() => {
          onRegionSelect(null);
          trackEvent('FILTER_ALL');
        }}
        aria-pressed={selectedRegion === null}
        aria-label={`Show all icons (${icons.length} icons)`}
        className={`
          px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2
          ${selectedRegion === null
            ? 'bg-foreground text-background'
            : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
          }
        `}
      >
        All
        <span className="ml-1.5 opacity-60" aria-hidden="true">{icons.length}</span>
      </button>

      {/* Region buttons */}
      {sortedRegions.map((region) => {
        const config = REGION_CONFIG[region];
        const label = config?.label ?? region;
        const count = getRegionCount(region);
        const isSelected = selectedRegion === region;

        return (
          <button
            key={region}
            onClick={() => {
              onRegionSelect(isSelected ? null : region);
              trackEvent(`FILTER_${region.replace(/\s+/g, '_').toUpperCase()}`);
            }}
            aria-pressed={isSelected}
            aria-label={`Filter by ${label} (${count} icons)${isSelected ? ', currently selected' : ''}`}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2
              ${isSelected
                ? 'bg-foreground text-background'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }
            `}
          >
            {label}
            <span className="ml-1.5 opacity-60" aria-hidden="true">{count}</span>
          </button>
        );
      })}
    </nav>
  );
}

