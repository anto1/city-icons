'use client';

import { useCallback, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import IconGrid from '@/components/IconGrid';
import { IconHeader } from '@/components/IconHeader';
import { IconFooter } from '@/components/IconFooter';
import { RandomIconHeader } from '@/components/RandomIconHeader';
import { RegionFilter } from '@/components/RegionFilter';
import { ErrorBoundary, IconGridError } from '@/components/ErrorBoundary';
import { useIconSearch } from '@/hooks/useIconSearch';
import { CountryCount, GridIcon } from '@/types';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { slugify } from '@/lib/utils';

interface ClientHomeProps {
  initialIcons: GridIcon[];
  /** Featured header icons, picked deterministically server-side. */
  headerIcons: GridIcon[];
  /** Precomputed {country, count} pairs for the footer. */
  footerCountries: CountryCount[];
  /** Total number of icons in the collection. */
  totalIconCount: number;
  countryFilter?: string;
  hideSearch?: boolean;
}

export default function ClientHome({
  initialIcons,
  headerIcons,
  footerCountries,
  totalIconCount,
  countryFilter,
  hideSearch,
}: ClientHomeProps) {
  const {
    filteredIcons,
    handleSearch,
    handleRegionFilter,
    selectedRegion,
    regions,
    lastSearchQuery
  } = useIconSearch({
    icons: initialIcons,
    countryFilter
  });

  // Remount key for SearchBar so "Clear search and filters" also resets its input
  const [searchResetKey, setSearchResetKey] = useState(0);

  const handleClearFilters = useCallback(() => {
    handleSearch('');
    handleRegionFilter(null);
    setSearchResetKey((key) => key + 1);
  }, [handleSearch, handleRegionFilter]);

  return (
    <div className="min-h-screen bg-background">
      <RandomIconHeader icons={headerIcons} />
      
      <main className="container mx-auto px-4 py-8">
        {countryFilter && (
          <Breadcrumbs trail={[{ name: countryFilter, path: `/${slugify(countryFilter)}` }]} />
        )}

        <header>
          <IconHeader 
            countryFilter={countryFilter}
            filteredIcons={filteredIcons}
            totalIcons={totalIconCount}
          />
        </header>
        
        {!hideSearch && (
          <section aria-label="Search and filter">
            <SearchBar key={searchResetKey} onSearch={handleSearch} allIcons={initialIcons} />
            
            {/* Region filters */}
            <RegionFilter
              regions={regions}
              selectedRegion={selectedRegion}
              onRegionSelect={handleRegionFilter}
              icons={initialIcons}
            />
          </section>
        )}
        
        <section className="mt-12" aria-label="City icons collection">
          <ErrorBoundary fallback={<IconGridError />}>
            <IconGrid
              icons={filteredIcons}
              searchQuery={lastSearchQuery}
              selectedRegion={selectedRegion}
              onClearFilters={handleClearFilters}
            />
          </ErrorBoundary>
        </section>
      </main>

      <IconFooter countries={footerCountries} totalIcons={totalIconCount} />
    </div>
  );
} 