'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import IconGrid from '@/components/IconGrid';
import IconModal from '@/components/IconModal';
import StructuredData from '@/components/StructuredData';
import { Icon } from '@/types';
import { trackEvent } from 'fathom-client';
import { findIconBySlugs, getIconUrl, slugify } from '@/lib/utils';

interface ClientHomeProps {
  initialIcons: Icon[];
  countryFilter?: string;
}

export default function ClientHome({ initialIcons, countryFilter }: ClientHomeProps) {
  const [icons] = useState<Icon[]>(initialIcons);
  const [filteredIcons, setFilteredIcons] = useState<Icon[]>(initialIcons);
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Initialize search state with country filter
  useEffect(() => {
    if (countryFilter) {
      // Filter icons by country
      const countryFilteredIcons = icons.filter(icon => icon.country === countryFilter);
      setFilteredIcons(countryFilteredIcons);
    } else {
      setFilteredIcons(icons);
    }
  }, [icons, countryFilter]);

  // Handle direct URL access on initial load
  useEffect(() => {
    if (!isInitialized && pathname !== '/') {
      const pathParts = pathname.split('/').filter(Boolean);
      if (pathParts.length === 2) {
        const [countrySlug, citySlug] = pathParts;
        const icon = findIconBySlugs(countrySlug, citySlug, icons);
        if (icon) {
          setSelectedIcon(icon);
          setModalOpen(true);
        }
      }
      setIsInitialized(true);
    }
  }, [pathname, icons, isInitialized]);

  // Sync URL with modal state
  useEffect(() => {
    if (isInitialized) {
      if (modalOpen && selectedIcon) {
        const url = getIconUrl(selectedIcon);
        if (pathname !== url) {
          router.push(url, { scroll: false });
        }
      } else if (!modalOpen && pathname !== '/') {
        // Check if current pathname is a country page
        const pathParts = pathname.split('/').filter(Boolean);
        if (pathParts.length === 1) {
          // This might be a country page, check if it's valid
          const countrySlug = pathParts[0];
          const countryIcons = icons.filter(icon => slugify(icon.country) === countrySlug);
          if (countryIcons.length === 0) {
            // Not a valid country page, redirect to home
            router.push('/', { scroll: false });
          }
          // If it's a valid country page, don't redirect
        } else {
          // Not a country page, redirect to home
          router.push('/', { scroll: false });
        }
      }
    }
  }, [modalOpen, selectedIcon, pathname, router, isInitialized, icons]);

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
      const countryMatch = icon.country.toLowerCase().includes(searchTerm);
      
      return cityMatch || countryMatch;
    });

    // Remove duplicates based on _id (this should not be necessary but just in case)
    const uniqueFiltered = filtered.filter((icon, index, self) => 
      index === self.findIndex(i => i._id === icon._id)
    );

    const sortedFiltered = uniqueFiltered.sort((a, b) => a.city.localeCompare(b.city));
    setFilteredIcons(sortedFiltered);
  }, [icons, lastSearchQuery, countryFilter]);

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
      {/* Inject structured data when modal is open */}
      {selectedIcon && modalOpen && <StructuredData icon={selectedIcon} />}
      
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
        {/* SEO-friendly heading structure */}
        {selectedIcon && modalOpen ? (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
              {selectedIcon.name} - {selectedIcon.city}, {selectedIcon.country}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {selectedIcon.description || `Icon representing ${selectedIcon.city}, ${selectedIcon.country}`}
            </p>
            <p className="text-base text-muted-foreground">
              Download this high-quality SVG line art icon for your projects.
            </p>
          </div>
        ) : countryFilter ? (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
              {countryFilter} City Icons
            </h1>
            <p className="text-lg text-muted-foreground">
              Line art icons representing cities in {countryFilter} by{' '}
              <a
                href="https://partdirector.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-orange-600 transition-colors underline"
                onClick={() => trackEvent('STUDIO_PARTDIRECTOR_CLICKED')}
              >
                Studio Partdirector
              </a>.
            </p>
            <p className="text-lg text-muted-foreground mt-2">
              Browse {filteredIcons.length} city icons from {countryFilter}.
            </p>
          </div>
        ) : (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
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
              </a>.
            </p>
            <p className="text-lg text-muted-foreground mt-2">
              Feeling lucky?{' '}
              <Link
                href="/roulette"
                className="text-foreground hover:text-orange-600 transition-colors underline font-medium"
                onClick={() => trackEvent('ROULETTE_LINK_CLICKED')}
              >
                Spin the roulette
              </Link>
              {' '}and see where you should go this year.
            </p>
          </div>
        )}
        
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
          {/* Countries List */}
          <div className="mb-6">
            <div className="relative inline-block text-left">
              <select 
                className="text-sm text-muted-foreground bg-transparent border border-muted-foreground/20 rounded px-3 py-1 focus:outline-none focus:border-orange-600 transition-colors cursor-pointer"
                onChange={(e) => {
                  if (e.target.value) {
                    router.push(`/${e.target.value}`);
                  }
                }}
                value=""
              >
                <option value="">Country: choose</option>
                {[...new Set(icons.map(icon => icon.country))]
                  .sort()
                  .map((country) => (
                    <option key={country} value={slugify(country)}>
                      {country}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          
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
            <span className="hidden sm:inline text-sm text-muted-foreground">•</span>
            <Link
              href="/license"
              className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
              onClick={() => trackEvent('LICENSE_LINK_CLICKED')}
            >
              Usage & Licensing
            </Link>
            <span className="hidden sm:inline text-sm text-muted-foreground">•</span>
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