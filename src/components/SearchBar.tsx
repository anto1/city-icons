'use client';

import { useState, useEffect } from 'react';
import { SearchBarProps } from '@/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);

  return (
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
      <Input
        type="text"
        placeholder="Search icons by name, city, country, or category..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 text-lg h-14"
      />
    </div>
  );
} 