import { useState, useCallback, useMemo } from 'react';
import { Icon } from '@/types';
import { getIconSearchScore } from '@/lib/utils';

interface UseIconSearchProps {
  icons: Icon[];
  countryFilter?: string;
}

// Mirror the current search query into the URL (?search=) so filtered views
// can be shared and survive refresh. Matches the WebSite SearchAction URL
// template declared in layout.tsx. Runs synchronously in handleSearch (not an
// effect) so clearing the search removes the param before any remounted
// SearchBar reads it back.
function syncSearchParam(query: string) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (query) {
    url.searchParams.set('search', query);
  } else {
    url.searchParams.delete('search');
  }
  const next = url.pathname + url.search + url.hash;
  const current = window.location.pathname + window.location.search + window.location.hash;
  if (next !== current) {
    window.history.replaceState(window.history.state, '', next);
  }
}

export function useIconSearch({ icons, countryFilter }: UseIconSearchProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('');

  // Get unique regions from icons
  const regions = useMemo(() => {
    const regionSet = new Set(icons.map(icon => icon.region));
    return Array.from(regionSet).sort();
  }, [icons]);

  // Sort once; filters below preserve order, so no re-sort per filter change
  const sortedIcons = useMemo(
    () => [...icons].sort((a, b) => a.city.localeCompare(b.city)),
    [icons]
  );

  // Calculate filtered icons based on all filters
  const filteredIcons = useMemo(() => {
    let result = sortedIcons;

    // Apply country filter first
    if (countryFilter) {
      result = result.filter(icon => icon.country === countryFilter);
    }

    // Apply region filter
    if (selectedRegion) {
      result = result.filter(icon => icon.region === selectedRegion);
    }

    // Apply search query, ranked by relevance: city matches first, then
    // country/region, then landmark name/tag matches. The sort is stable,
    // so ties stay alphabetical.
    if (lastSearchQuery.trim()) {
      result = result
        .map(icon => ({ icon, score: getIconSearchScore(icon, lastSearchQuery) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ icon }) => icon);
    }

    return result;
  }, [sortedIcons, countryFilter, selectedRegion, lastSearchQuery]);

  const handleSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    setLastSearchQuery(trimmed);
    syncSearchParam(trimmed);
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
