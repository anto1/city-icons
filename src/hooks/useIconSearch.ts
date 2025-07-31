import { useState, useCallback, useEffect } from 'react';
import { Icon } from '@/types';

interface UseIconSearchProps {
  icons: Icon[];
  countryFilter?: string;
}

export function useIconSearch({ icons, countryFilter }: UseIconSearchProps) {
  const [filteredIcons, setFilteredIcons] = useState<Icon[]>(() => {
    // Initialize with country-filtered icons if countryFilter is provided
    if (countryFilter) {
      return icons.filter(icon => icon.country === countryFilter);
    }
    return icons;
  });
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('');

  // Update filtered icons when icons or countryFilter changes
  // Only update if there's no active search query
  useEffect(() => {
    if (!lastSearchQuery.trim()) {
      if (countryFilter) {
        const countryFilteredIcons = icons.filter(icon => icon.country === countryFilter);
        setFilteredIcons(countryFilteredIcons);
      } else {
        setFilteredIcons(icons);
      }
    }
  }, [icons, countryFilter, lastSearchQuery]);

  const handleSearch = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    
    // Prevent unnecessary re-renders if the query hasn't changed
    if (trimmedQuery === lastSearchQuery) {
      return;
    }
    
    setLastSearchQuery(trimmedQuery);
    
    if (!trimmedQuery) {
      // If no search query, show all icons or country-filtered icons
      if (countryFilter) {
        const countryFilteredIcons = icons.filter(icon => icon.country === countryFilter);
        setFilteredIcons(countryFilteredIcons);
      } else {
        setFilteredIcons(icons);
      }
      return;
    }

    const searchTerm = trimmedQuery.toLowerCase();
    
    // Get the base icons to search in (all icons or country-filtered)
    const baseIcons = countryFilter 
      ? icons.filter(icon => icon.country === countryFilter)
      : icons;
    
    const filtered = baseIcons.filter(icon => {
      // Search in city and country names
      const cityMatch = icon.city.toLowerCase().includes(searchTerm);
      
      // For country matching, allow partial matches but be more intelligent
      // This allows "germ" to match "Germany" but prevents "amsterdam" matching "netherlands"
      const countryMatch = icon.country.toLowerCase().includes(searchTerm);
      
      // Additional check to prevent false positives
      // Only allow country match if the search term is at least 3 characters
      // or if it's a common country prefix
      const validCountryMatch = searchTerm.length >= 3 || 
                               ['usa', 'uk', 'uae'].includes(searchTerm) ||
                               icon.country.toLowerCase().startsWith(searchTerm);
      
      return cityMatch || (countryMatch && validCountryMatch);
    });

    // Remove duplicates based on _id (this should not be necessary but just in case)
    const uniqueFiltered = filtered.filter((icon, index, self) => 
      index === self.findIndex(i => i._id === icon._id)
    );

    const sortedFiltered = uniqueFiltered.sort((a, b) => a.city.localeCompare(b.city));
    
    // Ensure we're setting the state with the correct array
    setFilteredIcons(sortedFiltered);
  }, [icons, lastSearchQuery, countryFilter]);

  return {
    filteredIcons,
    handleSearch,
    lastSearchQuery
  };
} 