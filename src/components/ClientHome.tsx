'use client';

import SearchBar from '@/components/SearchBar';
import IconGrid from '@/components/IconGrid';
import IconModal from '@/components/IconModal';
import StructuredData from '@/components/StructuredData';
import { IconHeader } from '@/components/IconHeader';
import { IconFooter } from '@/components/IconFooter';
import { RandomIconHeader } from '@/components/RandomIconHeader';
import { SearchResultsCount } from '@/components/SearchResultsCount';
import { useIconSearch } from '@/hooks/useIconSearch';
import { useModalNavigation } from '@/hooks/useModalNavigation';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Icon } from '@/types';

interface ClientHomeProps {
  initialIcons: Icon[];
  countryFilter?: string;
}

export default function ClientHome({ initialIcons, countryFilter }: ClientHomeProps) {
  const { filteredIcons, handleSearch } = useIconSearch({ 
    icons: initialIcons, 
    countryFilter 
  });
  
  const { selectedIcon, modalOpen, handleIconClick, handleCloseModal } = useModalNavigation({ 
    icons: initialIcons 
  });
  
  useKeyboardShortcuts({ modalOpen, onCloseModal: handleCloseModal });

  return (
    <div className="min-h-screen bg-background">
      {/* Inject structured data when modal is open */}
      {selectedIcon && modalOpen && <StructuredData icon={selectedIcon} />}
      
      <RandomIconHeader icons={initialIcons} />
      
      <div className="container mx-auto px-4 py-8">
        <IconHeader 
          selectedIcon={selectedIcon} 
          modalOpen={modalOpen} 
          countryFilter={countryFilter}
          filteredIcons={filteredIcons}
          totalIcons={initialIcons.length}
        />
        
        <SearchBar onSearch={handleSearch} allIcons={initialIcons} />
        
        <SearchResultsCount filteredIcons={filteredIcons} totalIcons={initialIcons.length} />
        
        <div className="mt-12">
          <IconGrid 
            icons={filteredIcons} 
            loading={false} 
            onIconClick={handleIconClick} 
          />
        </div>
      </div>

      <IconFooter icons={initialIcons} />

      <IconModal 
        icon={selectedIcon} 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
} 