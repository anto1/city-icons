'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { SearchBarProps } from '@/types';
import { trackEvent } from 'fathom-client';

export default function SearchBar({ onSearch, allIcons }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{city: string, country: string}>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTrackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onSearch(query);
    // Debounce analytics tracking (fire once after 800ms of no typing)
    if (query.trim()) {
      if (searchTrackTimeout.current) clearTimeout(searchTrackTimeout.current);
      searchTrackTimeout.current = setTimeout(() => {
        trackEvent('SEARCH_PERFORMED');
      }, 800);
    }
    return () => {
      if (searchTrackTimeout.current) clearTimeout(searchTrackTimeout.current);
    };
  }, [query, onSearch]);

  useEffect(() => {
    if (query.trim() && allIcons) {
      const searchTerm = query.toLowerCase().trim();
      
      const filtered = allIcons.filter(icon => {
        const cityMatch = icon.city.toLowerCase().includes(searchTerm);
        const countryMatch = icon.country.toLowerCase().includes(searchTerm);
        return cityMatch || countryMatch;
      }).slice(0, 5);
      
      // Remove duplicates based on city and country combination
      const uniqueSuggestions = filtered.filter((icon, index, self) => 
        index === self.findIndex(i => 
          i.city === icon.city && i.country === icon.country
        )
      );
      
      setSuggestions(uniqueSuggestions.map(icon => ({ city: icon.city, country: icon.country })));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [query, allIcons]);

  const handleSuggestionClick = (suggestion: {city: string, country: string}) => {
    setQuery(suggestion.city);
    setShowSuggestions(false);
    onSearch(suggestion.city);
  };

  const handleInputFocus = () => {
    if (query.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <search className="relative max-w-2xl mx-auto" role="search">
      <label htmlFor="icon-search" className="sr-only">Search city icons</label>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground" aria-hidden="true" />
      <Input
        ref={inputRef}
        id="icon-search"
        type="search"
        placeholder="Search cities or countries..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className="pl-12 text-lg font-medium h-14 md:!text-2xl md:font-bold md:h-16"
        aria-describedby={showSuggestions && suggestions.length > 0 ? "search-suggestions" : undefined}
        aria-autocomplete="list"
        aria-expanded={showSuggestions && suggestions.length > 0}
      />
      
      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <ul 
          id="search-suggestions"
          className="absolute top-full left-0 right-0 bg-background border border-border rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto md:max-h-80 list-none"
          role="listbox"
          aria-label="Search suggestions"
        >
          {suggestions.map((suggestion, index) => (
            <li key={index} role="option" aria-selected={false}>
              <button
                className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex flex-col md:py-4"
                onClick={() => handleSuggestionClick(suggestion)}
                type="button"
              >
                <span className="font-medium text-foreground md:text-lg">{suggestion.city}</span>
                <span className="text-sm text-muted-foreground md:text-base">{suggestion.country}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </search>
  );
} 