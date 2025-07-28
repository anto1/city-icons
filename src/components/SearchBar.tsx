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

  useEffect(() => {
    console.log('🔍 SearchBar calling onSearch with:', query);
    onSearch(query);
    // Track search if query is not empty
    if (query.trim()) {
      trackEvent('SEARCH_PERFORMED');
    }
  }, [query, onSearch]);

  useEffect(() => {
    if (query.trim() && allIcons) {
      const searchTerm = query.toLowerCase().trim();
      const filtered = allIcons.filter(icon =>
        icon.city.toLowerCase().includes(searchTerm) ||
        icon.country.toLowerCase().includes(searchTerm)
      ).slice(0, 5);
      
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
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className="pl-12 text-lg font-medium h-14 md:!text-2xl md:font-bold md:h-16"
      />
      
      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto md:max-h-80">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex flex-col md:py-4"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="font-medium text-foreground md:text-lg">{suggestion.city}</div>
              <div className="text-sm text-muted-foreground md:text-base">{suggestion.country}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 