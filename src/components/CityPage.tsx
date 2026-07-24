'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { CountryCount, GridIcon, Icon } from '@/types';
import { Button } from '@/components/ui/button';
import { Download, Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from 'fathom-client';
import { getIconUrl, getIconSvgUrl, slugify } from '@/lib/utils';
import { IconFooter } from '@/components/IconFooter';
import { IconCard } from '@/components/IconCard';
import { HeaderControls } from './PageHeader';
import Link from 'next/link';

interface CityPageProps {
  icon: Icon;
  /** First three icons of the sorted collection excluding the current one. */
  headerIcons: GridIcon[];
  /** All other icons from the same country. */
  relatedIcons: GridIcon[];
  /** Deterministic picks from other countries ("Explore More Cities"). */
  exploreIcons: GridIcon[];
  /** Precomputed {country, count} pairs for the footer. */
  footerCountries: CountryCount[];
  /** Total number of icons in the collection (footer credit line). */
  totalIcons: number;
}

export default function CityPage({
  icon,
  headerIcons,
  relatedIcons,
  exploreIcons,
  footerCountries,
  totalIcons,
}: CityPageProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  // Fetch SVG content on-demand for download/copy functionality
  const fetchSvgContent = useCallback(async () => {
    if (svgContent) return svgContent;
    try {
      const response = await fetch(getIconSvgUrl(icon));
      const content = await response.text();
      setSvgContent(content);
      return content;
    } catch (error) {
      console.error('Failed to fetch SVG:', error);
      return null;
    }
  }, [icon, svgContent]);

  const downloadSVG = async () => {
    if (!icon) return;
    
    const content = await fetchSvgContent();
    if (!content) {
      toast.error('Failed to download SVG');
      return;
    }
    
    const blob = new Blob([content], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = icon.svgFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Track download: aggregate event (queryable total) + per-city breakdown
    trackEvent('ICON_DOWNLOAD');
    trackEvent(`ICON_DOWNLOAD_${icon.city.replace(/\s+/g, '_').toUpperCase()}`);
    
    toast.success('SVG downloaded successfully!');
  };

  const copySVG = async () => {
    if (!icon) return;
    
    try {
      const content = await fetchSvgContent();
      if (!content) {
        throw new Error('Failed to fetch SVG content');
      }
      
      await navigator.clipboard.writeText(content);
      
      // Track copy: aggregate event (queryable total) + per-city breakdown
      trackEvent('ICON_COPY');
      trackEvent(`ICON_COPY_${icon.city.replace(/\s+/g, '_').toUpperCase()}`);
      
      toast.success('SVG copied to clipboard!', {
        description: `${icon.city} icon is ready to paste`,
        duration: 3000,
      });
    } catch (err) {
      console.error('Failed to copy SVG:', err);
      toast.error('Failed to copy SVG', {
        description: 'Please try again or use the download option',
        duration: 4000,
      });
    }
  };

  const shareLink = async () => {
    if (!icon) return;
    
    try {
      const shareUrl = `${window.location.origin}${getIconUrl(icon)}`;
      await navigator.clipboard.writeText(shareUrl);
      
      // Track share: aggregate event (queryable total) + per-city breakdown
      trackEvent('ICON_SHARE');
      trackEvent(`ICON_SHARE_${icon.city.replace(/\s+/g, '_').toUpperCase()}`);
      
      toast.success('Link copied to clipboard!', {
        description: `Direct link to ${icon.city} icon`,
        duration: 3000,
      });
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast.error('Failed to copy link', {
        description: 'Please try again',
        duration: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Random icon header - same as main page */}
      <nav aria-label="Featured cities" className="relative flex justify-center items-center gap-8 py-16">
        <HeaderControls />
        {headerIcons.map((randomIcon) => (
          <Link
            key={randomIcon._id}
            href={getIconUrl(randomIcon)}
            className="w-14 h-14 hover:opacity-70 transition-opacity"
            title={`${randomIcon.city}, ${randomIcon.country}`}
            aria-label={`View ${randomIcon.city}, ${randomIcon.country} icon`}
          >
            <Image
              src={getIconSvgUrl(randomIcon)}
              alt={`${randomIcon.name} - ${randomIcon.city}, ${randomIcon.country}`}
              width={56}
              height={56}
              className="w-14 h-14 dark:invert"
            />
          </Link>
        ))}
      </nav>

      {/* Main content container - same structure as main page */}
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb navigation */}
        <nav aria-label="Breadcrumb" className="text-center mb-8">
          <ol className="inline-flex items-center text-sm text-muted-foreground list-none">
            <li className="flex items-center">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span className="mx-2" aria-hidden="true">/</span>
            </li>
            <li className="flex items-center">
              <Link 
                href={`/${slugify(icon.country)}`}
                className="hover:text-foreground transition-colors"
              >
                {icon.country}
              </Link>
              <span className="mx-2" aria-hidden="true">/</span>
            </li>
            <li aria-current="page">
              <span className="text-foreground font-medium">{icon.city}</span>
            </li>
          </ol>
        </nav>

        {/* City icon header - similar to IconHeader */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
            {icon.name}
          </h1>
        </header>

        {/* Large icon display - centered */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-16 mb-8 w-full max-w-md aspect-square flex items-center justify-center">
            <Image
              src={getIconSvgUrl(icon)}
              alt={`${icon.name} - ${icon.city}, ${icon.country}`}
              width={128}
              height={128}
              className="w-32 h-32 dark:invert"
              priority
            />
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-3 w-full max-w-md">
            <Button 
              onClick={downloadSVG}
              className="flex-1 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button 
              onClick={copySVG}
              variant="outline"
              className="flex-1 flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy SVG
            </Button>
            <Button
              onClick={shareLink}
              variant="outline"
              size="icon"
              aria-label="Copy link to this icon"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Description - centered */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {icon.description}
          </p>
          {icon.tags && icon.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {icon.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related icons section */}
        {relatedIcons.length > 0 && (
          <section className="mt-20" aria-labelledby="related-icons-heading">
            <h2 id="related-icons-heading" className="text-2xl font-bold text-center mb-8">{relatedIcons.length} more from {icon.country}</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 relative list-none" aria-label={`More icons from ${icon.country}`}>
                {relatedIcons.map((relatedIcon) => (
                <li key={relatedIcon._id}>
                  <IconCard icon={relatedIcon} />
                </li>
                ))}
            </ul>
          </section>
        )}

        {/* Explore more section */}
        {exploreIcons.length > 0 && (
          <section className="mt-20" aria-labelledby="explore-more-heading">
            <h2 id="explore-more-heading" className="text-2xl font-bold text-center mb-8">Explore More Cities</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 relative list-none" aria-label="Explore more cities">
                {exploreIcons.map((randomIcon) => (
                <li key={randomIcon._id}>
                  <IconCard icon={randomIcon} />
                </li>
                ))}
            </ul>
          </section>
        )}

        {/* Back to all icons */}
        <nav className="mt-20 text-center" aria-label="Navigation">
          <Button asChild variant="outline" size="lg">
            <Link href="/">View All City Icons</Link>
          </Button>
        </nav>
      </main>

      <IconFooter countries={footerCountries} totalIcons={totalIcons} />
    </div>
  );
}
