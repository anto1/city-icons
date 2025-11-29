'use client';

import SearchBar from '@/components/SearchBar';
import IconGrid from '@/components/IconGrid';
import { IconHeader } from '@/components/IconHeader';
import { IconFooter } from '@/components/IconFooter';
import { RandomIconHeader } from '@/components/RandomIconHeader';
import { RegionFilter } from '@/components/RegionFilter';
import { ErrorBoundary, IconGridError } from '@/components/ErrorBoundary';
import { useIconSearch } from '@/hooks/useIconSearch';
import { Icon } from '@/types';
import Link from 'next/link';

interface ClientHomeProps {
  initialIcons: Icon[];
  countryFilter?: string;
  hideSearch?: boolean;
}

export default function ClientHome({ initialIcons, countryFilter, hideSearch }: ClientHomeProps) {
  const { 
    filteredIcons, 
    handleSearch, 
    handleRegionFilter, 
    selectedRegion, 
    regions 
  } = useIconSearch({ 
    icons: initialIcons, 
    countryFilter 
  });

  return (
    <div className="min-h-screen bg-background">
      <RandomIconHeader icons={initialIcons} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb navigation for country pages */}
        {countryFilter && (
          <div className="text-center mb-8">
            <div className="text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground font-medium">{countryFilter}</span>
            </div>
          </div>
        )}
        
        <IconHeader 
          countryFilter={countryFilter}
          filteredIcons={filteredIcons}
          totalIcons={initialIcons.length}
        />
        
        {!hideSearch && (
          <>
            <SearchBar onSearch={handleSearch} allIcons={initialIcons} />
            
            {/* Region filters */}
            <RegionFilter
              regions={regions}
              selectedRegion={selectedRegion}
              onRegionSelect={handleRegionFilter}
              icons={initialIcons}
            />
          </>
        )}
        
        <div className="mt-12">
          <ErrorBoundary fallback={<IconGridError />}>
            <IconGrid 
              icons={filteredIcons} 
              loading={false} 
            />
          </ErrorBoundary>
        </div>
      </div>

      <IconFooter icons={initialIcons} />
    </div>
  );
} 