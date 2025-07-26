'use client';

import { useState, useEffect } from 'react';
import { SearchBarProps } from '@/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch, placeholder = "Search city icons..." }: SearchBarProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 text-lg shadow-lg border-2 focus:border-primary"
        />
      </div>
    </div>
  );
} 