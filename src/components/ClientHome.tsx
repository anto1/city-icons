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
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb navigation for country pages */}
        {countryFilter && (
          <nav aria-label="Breadcrumb" className="text-center mb-8">
            <ol className="inline-flex items-center text-sm text-muted-foreground list-none">
              <li className="flex items-center">
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
                <span className="mx-2" aria-hidden="true">/</span>
              </li>
              <li aria-current="page">
                <span className="text-foreground font-medium">{countryFilter}</span>
              </li>
            </ol>
          </nav>
        )}
        
        <header>
          <IconHeader 
            countryFilter={countryFilter}
            filteredIcons={filteredIcons}
            totalIcons={initialIcons.length}
          />
        </header>
        
        {!hideSearch && (
          <section aria-label="Search and filter">
            <SearchBar onSearch={handleSearch} allIcons={initialIcons} />
            
            {/* Region filters */}
            <RegionFilter
              regions={regions}
              selectedRegion={selectedRegion}
              onRegionSelect={handleRegionFilter}
              icons={initialIcons}
            />
          </section>
        )}
        
        <section className="mt-12" aria-label="City icons collection">
          <ErrorBoundary fallback={<IconGridError />}>
            <IconGrid 
              icons={filteredIcons} 
              loading={false} 
            />
          </ErrorBoundary>
        </section>
      </main>

      <IconFooter icons={initialIcons} />
    </div>
  );
} 