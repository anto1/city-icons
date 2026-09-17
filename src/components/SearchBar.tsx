'use client';

import { useState, useEffect, useMemo, useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { SearchBarProps } from '@/types';
import { trackEvent } from 'fathom-client';
import { getIconSearchScore } from '@/lib/utils';

const SEARCH_DEBOUNCE_MS = 150;
const MAX_SUGGESTIONS = 5;

interface Suggestion {
  city: string;
  country: string;
  name: string;
}

// The landmark part of an icon name (e.g. "Sagrada Familia" from
// "Barcelona Sagrada Familia"), or null when the name adds nothing.
function getLandmarkLabel(suggestion: Suggestion): string | null {
  if (suggestion.name === suggestion.city) return null;
  if (suggestion.name.startsWith(`${suggestion.city} `)) {
    return suggestion.name.slice(suggestion.city.length + 1);
  }
  return suggestion.name;
}

export default function SearchBar({ onSearch, allIcons }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestionsDismissed, setSuggestionsDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTrackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Read ?search= on mount so the WebSite SearchAction URL template
  // (/?search=term) pre-fills the search box and filters the grid.
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get('search');
    if (initial) {
      setQuery(initial);
    }
  }, []);

  // Debounce search so the grid doesn't re-render on every keystroke
  useEffect(() => {
    const timeout = setTimeout(() => onSearch(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [query, onSearch]);

  // Debounce analytics tracking (fire once after 800ms of no typing)
  useEffect(() => {
    if (query.trim()) {
      if (searchTrackTimeout.current) clearTimeout(searchTrackTimeout.current);
      searchTrackTimeout.current = setTimeout(() => {
        trackEvent('SEARCH_PERFORMED');
      }, 800);
    }
    return () => {
      if (searchTrackTimeout.current) clearTimeout(searchTrackTimeout.current);
    };
  }, [query]);

  // Rank matches (city > country/region > landmark name/tags), then take the
  // top unique cities
  const suggestions = useMemo<Suggestion[]>(() => {
    const term = query.trim();
    if (!term || !allIcons) return [];

    const ranked = allIcons
      .map(icon => ({ icon, score: getIconSearchScore(icon, term) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.icon.city.localeCompare(b.icon.city));

    const seen = new Set<string>();
    const unique: Suggestion[] = [];
    for (const { icon } of ranked) {
      const key = `${icon.city}|${icon.country}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push({ city: icon.city, country: icon.country, name: icon.name });
      if (unique.length === MAX_SUGGESTIONS) break;
    }
    return unique;
  }, [query, allIcons]);

  const showSuggestions = isFocused && !suggestionsDismissed && suggestions.length > 0;

  // Keep the active option visible when navigating with arrow keys
  useEffect(() => {
    if (activeIndex < 0) return;
    document
      .getElementById(`search-suggestion-${activeIndex}`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const handleSelect = (suggestion: Suggestion) => {
    setQuery(suggestion.city);
    setSuggestionsDismissed(true);
    setActiveIndex(-1);
    onSearch(suggestion.city);
    inputRef.current?.focus();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSuggestionsDismissed(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      if (suggestions.length === 0) return;
      e.preventDefault();
      if (!showSuggestions) {
        setSuggestionsDismissed(false);
        setActiveIndex(0);
      } else {
        setActiveIndex(prev => (prev + 1) % suggestions.length);
      }
    } else if (e.key === 'ArrowUp') {
      if (suggestions.length === 0) return;
      e.preventDefault();
      if (!showSuggestions) {
        setSuggestionsDismissed(false);
        setActiveIndex(suggestions.length - 1);
      } else {
        setActiveIndex(prev => (prev <= 0 ? suggestions.length - 1 : prev - 1));
      }
    } else if (e.key === 'Enter') {
      if (showSuggestions && activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      if (showSuggestions) {
        e.preventDefault();
        setSuggestionsDismissed(true);
        setActiveIndex(-1);
      }
    }
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
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          // Options prevent default on mousedown, so blur only fires when
          // focus truly leaves the search widget
          setIsFocused(false);
          setActiveIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        className="pl-12 text-lg h-14 md:!text-2xl md:h-16"
        role="combobox"
        aria-controls="search-suggestions"
        aria-expanded={showSuggestions}
        aria-autocomplete="list"
        aria-activedescendant={
          showSuggestions && activeIndex >= 0
            ? `search-suggestion-${activeIndex}`
            : undefined
        }
      />

      {/* Search Suggestions */}
      {showSuggestions && (
        <ul
          id="search-suggestions"
          className="absolute top-full left-0 right-0 bg-background border border-border rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto md:max-h-80 list-none"
          role="listbox"
          aria-label="Search suggestions"
        >
          {suggestions.map((suggestion, index) => {
            const landmark = getLandmarkLabel(suggestion);
            return (
              <li key={`${suggestion.city}|${suggestion.country}`} role="presentation">
                <button
                  id={`search-suggestion-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  tabIndex={-1}
                  type="button"
                  className={`w-full px-4 py-3 text-left transition-colors flex flex-col md:py-4 ${
                    index === activeIndex ? 'bg-muted' : 'hover:bg-muted'
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => handleSelect(suggestion)}
                >
                  <span className="font-medium text-foreground md:text-lg">{suggestion.city}</span>
                  <span className="text-sm text-muted-foreground md:text-base">
                    {suggestion.country}
                    {landmark && <> &middot; {landmark}</>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </search>
  );
}
