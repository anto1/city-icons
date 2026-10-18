'use client';

import { GridIcon } from '@/types';
import { trackEvent } from 'fathom-client';
import { eventKey } from '@/lib/analytics';
import { compareRegions } from '@/lib/regions';

interface RegionFilterProps {
  regions: string[];
  selectedRegion: string | null;
  onRegionSelect: (region: string | null) => void;
  icons: GridIcon[];
}

export function RegionFilter({ regions, selectedRegion, onRegionSelect, icons }: RegionFilterProps) {
  const sortedRegions = [...regions].sort(compareRegions);

  // Get count of icons per region
  const getRegionCount = (region: string) => {
    return icons.filter(icon => icon.region === region).length;
  };

  return (
    <div
      role="group"
      aria-label="Filter icons by region"
      className="flex flex-wrap justify-center gap-2 mt-6"
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
        const count = getRegionCount(region);
        const isSelected = selectedRegion === region;

        return (
          <button
            key={region}
            onClick={() => {
              onRegionSelect(isSelected ? null : region);
              trackEvent(`FILTER_${eventKey(region)}`);
            }}
            aria-pressed={isSelected}
            aria-label={`Filter by ${region} (${count} icons)${isSelected ? ', currently selected' : ''}`}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2
              ${isSelected
                ? 'bg-foreground text-background'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }
            `}
          >
            {region}
            <span className="ml-1.5 opacity-60" aria-hidden="true">{count}</span>
          </button>
        );
      })}
    </div>
  );
}

