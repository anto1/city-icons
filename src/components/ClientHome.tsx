'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import IconGrid from '@/components/IconGrid';
import IconModal from '@/components/IconModal';
import { Icon } from '@/types';
import { trackEvent } from 'fathom-client';

interface ClientHomeProps {
  initialIcons: Icon[];
}

export default function ClientHome({ initialIcons }: ClientHomeProps) {
  const [icons] = useState<Icon[]>(initialIcons);
  const [filteredIcons, setFilteredIcons] = useState<Icon[]>(initialIcons);
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('');

  // Initialize search state
  useEffect(() => {
    setFilteredIcons(icons);
  }, [icons]);

  // Debug filteredIcons
  useEffect(() => {
    console.log('🎯 filteredIcons changed:', filteredIcons.map(i => i.city));
  }, [filteredIcons]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close modal
      if (e.key === 'Escape' && modalOpen) {
        handleCloseModal();
      }
      
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  const handleSearch = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    
    console.log('🔍 handleSearch called with:', query, 'trimmed:', trimmedQuery);
    
    // Prevent unnecessary re-renders if the query hasn't changed
    if (trimmedQuery === lastSearchQuery) {
      console.log('⏭️ Skipping search - same query');
      return;
    }
    
    setLastSearchQuery(trimmedQuery);
    
    if (!trimmedQuery) {
      console.log('📋 Setting all icons (empty query)');
      setFilteredIcons(icons);
      return;
    }

    const searchTerm = trimmedQuery.toLowerCase();
    console.log('🔍 Searching for term:', searchTerm);
    
    const filtered = icons.filter(icon => {
      // Only search in city and country names for more accurate results
      const cityMatch = icon.city.toLowerCase().includes(searchTerm);
      const countryMatch = icon.country.toLowerCase().includes(searchTerm);
      
      if (icon.city === 'Amsterdam') {
        console.log('🎯 Amsterdam check:', { cityMatch, countryMatch, searchTerm });
      }
      
      return cityMatch || countryMatch;
    });

    console.log('📋 Filtered results:', filtered.map(i => i.city));

    // Remove duplicates based on _id
    const uniqueFiltered = filtered.filter((icon, index, self) => 
      index === self.findIndex(i => i._id === icon._id)
    );

    const sortedFiltered = uniqueFiltered.sort((a, b) => a.city.localeCompare(b.city));
    console.log('📋 Final sorted results:', sortedFiltered.map(i => i.city));
    console.log('📋 Setting filteredIcons to:', sortedFiltered.length, 'icons');
    setFilteredIcons(sortedFiltered);
  }, [icons]);

  const handleIconClick = (icon: Icon) => {
    setSelectedIcon(icon);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedIcon(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Random Icons Header */}
      <div className="flex justify-center items-center gap-8 py-16">
        {[...icons]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((icon) => (
          <div
            key={icon._id}
            className="w-14 h-14 text-foreground cursor-help"
            title={`${icon.city}, ${icon.country}`}
            dangerouslySetInnerHTML={{
              __html: icon.svgContent
                .replace(/width="[^"]*"/, 'width="56"')
                .replace(/height="[^"]*"/, 'height="56"')
                .replace(/viewBox="[^"]*"/, 'viewBox="0 0 120 120"')
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {icons.length} City Icons
          </h1>
          <p className="text-lg text-muted-foreground">
            Line art icons representing cities around the world by{' '}
            <a
              href="https://partdirector.ch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-orange-600 transition-colors underline"
              onClick={() => trackEvent('STUDIO_PARTDIRECTOR_CLICKED')}
            >
              Studio Partdirector
            </a>
          </p>
        </div>
        
        <SearchBar onSearch={handleSearch} allIcons={icons} />
        
        {/* Search Results Count */}
        {filteredIcons.length !== icons.length && (
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Found {filteredIcons.length} of {icons.length} icons
            </p>
          </div>
        )}
        
        <div className="mt-12">
          <IconGrid 
            icons={filteredIcons} 
            loading={false} 
            onIconClick={handleIconClick} 
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-foreground mb-2">
            {icons.length} icons ©{' '}
            <a
              href="https://partdirector.ch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-orange-600 transition-colors underline"
              onClick={() => trackEvent('STUDIO_PARTDIRECTOR_FOOTER_CLICKED')}
            >
              Studio Partdirector
            </a>
            , 2025
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:icons@partdirector.ch?subject=City Request&body=Please add: [City, Country]"
              className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
              onClick={() => trackEvent('MISSING_CITY_CLICKED')}
            >
              Missing your city?
            </a>
            <span className="text-sm text-muted-foreground">•</span>
            <Link
              href="/license"
              className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
              onClick={() => trackEvent('LICENSE_LINK_CLICKED')}
            >
              Usage & Licensing
            </Link>
            <span className="text-sm text-muted-foreground">•</span>
            <a
              href="https://github.com/anto1/city-icons"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
              onClick={() => trackEvent('GITHUB_LINK_CLICKED')}
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

      <IconModal 
        icon={selectedIcon} 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
} 