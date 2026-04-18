import { useState, useCallback, useMemo } from 'react';
import { Icon } from '@/types';
import { iconMatchesQuery } from '@/lib/utils';

interface UseIconSearchProps {
  icons: Icon[];
  countryFilter?: string;
}

export function useIconSearch({ icons, countryFilter }: UseIconSearchProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('');

  // Get unique regions from icons
  const regions = useMemo(() => {
    const regionSet = new Set(icons.map(icon => icon.region));
    return Array.from(regionSet).sort();
  }, [icons]);

  // Calculate filtered icons based on all filters
  const filteredIcons = useMemo(() => {
    let result = icons;

    // Apply country filter first
    if (countryFilter) {
      result = result.filter(icon => icon.country === countryFilter);
    }

    // Apply region filter
    if (selectedRegion) {
      result = result.filter(icon => icon.region === selectedRegion);
    }

    // Apply search query
    if (lastSearchQuery.trim()) {
      result = result.filter(icon => iconMatchesQuery(icon, lastSearchQuery));
    }

    // Remove duplicates and sort
    const uniqueFiltered = result.filter((icon, index, self) => 
      index === self.findIndex(i => i._id === icon._id)
    );

    return uniqueFiltered.sort((a, b) => a.city.localeCompare(b.city));
  }, [icons, countryFilter, selectedRegion, lastSearchQuery]);

  const handleSearch = useCallback((query: string) => {
    setLastSearchQuery(query.trim());
  }, []);

  const handleRegionFilter = useCallback((region: string | null) => {
    setSelectedRegion(region);
  }, []);

  return {
    filteredIcons,
    handleSearch,
    handleRegionFilter,
    selectedRegion,
    regions,
    lastSearchQuery
  };
} 