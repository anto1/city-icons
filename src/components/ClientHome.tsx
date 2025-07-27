'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import IconGrid from '@/components/IconGrid';
import IconModal from '@/components/IconModal';
import { Icon } from '@/types';

interface ClientHomeProps {
  initialIcons: Icon[];
}

export default function ClientHome({ initialIcons }: ClientHomeProps) {
  const [icons] = useState<Icon[]>(initialIcons);
  const [filteredIcons, setFilteredIcons] = useState<Icon[]>(initialIcons);
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredIcons(icons);
      return;
    }

    const filtered = icons.filter(icon =>
      icon.name.toLowerCase().includes(query.toLowerCase()) ||
      icon.city.toLowerCase().includes(query.toLowerCase()) ||
      icon.country.toLowerCase().includes(query.toLowerCase()) ||
      icon.category.toLowerCase().includes(query.toLowerCase()) ||
      icon.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    const sortedFiltered = filtered.sort((a, b) => a.city.localeCompare(b.city));
    setFilteredIcons(sortedFiltered);
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
    <div className="min-h-screen bg-background">
      {/* Random Icons Header */}
      <div className="flex justify-center items-center gap-8 py-16">
        {icons
          .slice(0, 3)
          .map((icon) => (
          <div
            key={icon._id}
            className="w-14 h-14 text-foreground"
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
            Beautiful line art icons representing cities around the world by Studio Partdirector
          </p>
        </div>
        <SearchBar onSearch={handleSearch} />
        
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
          <p className="text-sm text-foreground">
            © Studio Partdirector, 2025 • {icons.length} icons
          </p>
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