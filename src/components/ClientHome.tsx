'use client';

import SearchBar from '@/components/SearchBar';
import IconGrid from '@/components/IconGrid';
import { IconHeader } from '@/components/IconHeader';
import { IconFooter } from '@/components/IconFooter';
import { RandomIconHeader } from '@/components/RandomIconHeader';
import { SearchResultsCount } from '@/components/SearchResultsCount';
import { useIconSearch } from '@/hooks/useIconSearch';
import { Icon } from '@/types';

interface ClientHomeProps {
  initialIcons: Icon[];
  countryFilter?: string;
  hideSearch?: boolean;
}

export default function ClientHome({ initialIcons, countryFilter, hideSearch }: ClientHomeProps) {
  const { filteredIcons, handleSearch } = useIconSearch({ 
    icons: initialIcons, 
    countryFilter 
  });

  return (
    <div className="min-h-screen bg-background">
      <RandomIconHeader icons={initialIcons} />
      
      <div className="container mx-auto px-4 py-8">
        <IconHeader 
          countryFilter={countryFilter}
          filteredIcons={filteredIcons}
          totalIcons={initialIcons.length}
        />
        
        {!hideSearch && (
          <>
            <SearchBar onSearch={handleSearch} allIcons={initialIcons} />
            <SearchResultsCount filteredIcons={filteredIcons} totalIcons={initialIcons.length} />
          </>
        )}
        
        <div className="mt-12">
          <IconGrid 
            icons={filteredIcons} 
            loading={false} 
          />
        </div>
      </div>

      <IconFooter icons={initialIcons} />
    </div>
  );
} 