'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import IconGrid from '@/components/IconGrid';
import IconModal from '@/components/IconModal';
import { Icon } from '@/types';

export default function Home() {
  const [icons, setIcons] = useState<Icon[]>([]);
  const [filteredIcons, setFilteredIcons] = useState<Icon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        setLoading(true);
        // Use sample data instead of Sanity
        const sampleIcons: Icon[] = [
          {
            _id: '1',
            name: 'New York Skyline',
            city: 'New York',
            country: 'USA',
            category: 'Landmarks',
            tags: ['skyscraper', 'city', 'urban'],
            svgFilename: 'new-york.svg',
            svgContent: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/></svg>',
            description: 'Iconic New York City skyline',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '2',
            name: 'London Bridge',
            city: 'London',
            country: 'UK',
            category: 'Landmarks',
            tags: ['bridge', 'river', 'historic'],
            svgFilename: 'london.svg',
            svgContent: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/></svg>',
            description: 'Famous London Bridge over the Thames',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '3',
            name: 'Paris Eiffel',
            city: 'Paris',
            country: 'France',
            category: 'Landmarks',
            tags: ['tower', 'romance', 'architecture'],
            svgFilename: 'paris.svg',
            svgContent: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/></svg>',
            description: 'The iconic Eiffel Tower',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '4',
            name: 'Tokyo Tower',
            city: 'Tokyo',
            country: 'Japan',
            category: 'Landmarks',
            tags: ['tower', 'modern', 'technology'],
            svgFilename: 'tokyo.svg',
            svgContent: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/></svg>',
            description: 'Famous Tokyo Tower landmark',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '5',
            name: 'Berlin Wall',
            city: 'Berlin',
            country: 'Germany',
            category: 'Landmarks',
            tags: ['historic', 'wall', 'culture'],
            svgFilename: 'berlin.svg',
            svgContent: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/></svg>',
            description: 'Historic Berlin Wall monument',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '6',
            name: 'Rome Colosseum',
            city: 'Rome',
            country: 'Italy',
            category: 'Landmarks',
            tags: ['ancient', 'amphitheater', 'historic'],
            svgFilename: 'rome.svg',
            svgContent: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/></svg>',
            description: 'Ancient Roman Colosseum',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        ];
        setIcons(sampleIcons);
        setFilteredIcons(sampleIcons);
      } catch (error) {
        console.error('Error loading icons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIcons();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setFilteredIcons(icons);
      return;
    }

    // Client-side filtering
    const filtered = icons.filter(icon =>
      icon.name.toLowerCase().includes(query.toLowerCase()) ||
      icon.city.toLowerCase().includes(query.toLowerCase()) ||
      icon.country.toLowerCase().includes(query.toLowerCase()) ||
      icon.category.toLowerCase().includes(query.toLowerCase()) ||
      icon.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredIcons(filtered);
  };

  const handleIconClick = (icon: Icon) => {
    setSelectedIcon(icon);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedIcon(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              City Icons Collection
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover beautiful line art icons representing cities around the world. 
              Search, preview, and download SVG icons for your projects.
            </p>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Icons Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {loading ? 'Loading icons...' : `${filteredIcons.length} icons found`}
          </h2>
          {!loading && filteredIcons.length > 0 && (
            <p className="text-muted-foreground">
              Click on any icon to view details and download options
            </p>
          )}
        </div>
        
        <IconGrid 
          icons={filteredIcons} 
          onIconClick={handleIconClick}
          loading={loading}
        />
      </div>

      {/* Modal */}
      <IconModal
        icon={selectedIcon}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
