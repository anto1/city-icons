'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Icon } from '@/types';
import { Button } from '@/components/ui/button';
import { Download, Copy, Share2, Github, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from 'fathom-client';
import { getIconUrl, getIconSvgUrl, slugify } from '@/lib/utils';
import { IconFooter } from '@/components/IconFooter';
import { ThemeToggle } from './ThemeToggle';
import Link from 'next/link';

interface CityPageProps {
  icon: Icon;
  allIcons: Icon[];
}

export default function CityPage({ icon, allIcons }: CityPageProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('SCROLL_TO_TOP_CLICKED');
  };

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
    a.download = `${icon.name}-${icon.city}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Track download event with city data
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
      
      // Track copy event with city data
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
      
      // Track share event with city data
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

  // Get related icons from the same country (show all available)
  const relatedIcons = allIcons.filter(
    (relatedIcon) => 
      relatedIcon.country === icon.country && 
      relatedIcon._id !== icon._id
  );

  // Get deterministic "random" icons from different countries (seeded by icon id to avoid hydration mismatch)
  const randomIcons = useMemo(() => {
    const seed = parseInt(icon._id) || 0;
    return allIcons
      .filter((randomIcon) => randomIcon.country !== icon.country)
      .sort((a, b) => {
        const hashA = (parseInt(a._id) * 2654435761 + seed) >>> 0;
        const hashB = (parseInt(b._id) * 2654435761 + seed) >>> 0;
        return hashA - hashB;
      })
      .slice(0, 4);
  }, [allIcons, icon]);

  return (
    <div className="min-h-screen bg-background">
      {/* Random icon header - same as main page */}
      <nav aria-label="Featured cities" className="relative flex justify-center items-center gap-8 py-16">
        <div className="absolute md:fixed right-4 top-4 md:z-50 flex items-center gap-2">
          <button
            onClick={scrollToTop}
            className={`p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300 ${
              showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
            aria-label="Scroll to top"
            aria-hidden={!showScrollTop}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <a
            href="https://github.com/anto1/city-icons"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => trackEvent('GITHUB_CLICKED')}
            aria-label="View on GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <ThemeToggle />
        </div>
        {allIcons
          .filter((i) => i._id !== icon._id)
          .slice(0, 3)
          .map((randomIcon) => (
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
      <article className="container mx-auto px-4 py-8">
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
                  <Link
                    href={getIconUrl(relatedIcon)}
                    className="group cursor-pointer hover:cursor-pointer active:cursor-pointer transition-all duration-500 ease-out hover:border-2 hover:border-[#fafafa] p-4 rounded-[48px] flex flex-col items-center justify-center h-full"
                    style={{ aspectRatio: '1 / 1' }}
                    aria-label={`${relatedIcon.city}, ${relatedIcon.country} icon`}
                  >
                    <div className="flex flex-col items-center justify-center flex-1">
                      <div className="w-14 h-14 flex items-center justify-center mb-4">
                        <Image
                          src={getIconSvgUrl(relatedIcon)}
                          width={56}
                          height={56}
                          className="w-14 h-14 opacity-60 group-hover:opacity-100 transition-opacity duration-200 dark:invert"
                          alt="City landmark icon"
                          loading="lazy"
                        />
                      </div>
                      <div className="text-center w-full">
                        <span className="text-base font-medium text-foreground truncate block w-full mb-1">{relatedIcon.city}</span>
                        <span className="text-sm text-muted-foreground truncate block w-full">{relatedIcon.country}</span>
                      </div>
                    </div>
                  </Link>
                </li>
                ))}
            </ul>
          </section>
        )}

        {/* Explore more section */}
        {randomIcons.length > 0 && (
          <section className="mt-20" aria-labelledby="explore-more-heading">
            <h2 id="explore-more-heading" className="text-2xl font-bold text-center mb-8">Explore More Cities</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 relative list-none" aria-label="Explore more cities">
                {randomIcons.slice(0, 4).map((randomIcon) => (
                <li key={randomIcon._id}>
                  <Link
                    href={getIconUrl(randomIcon)}
                    className="group cursor-pointer hover:cursor-pointer active:cursor-pointer transition-all duration-500 ease-out hover:border-2 hover:border-[#fafafa] p-4 rounded-[48px] flex flex-col items-center justify-center h-full"
                    style={{ aspectRatio: '1 / 1' }}
                    aria-label={`${randomIcon.city}, ${randomIcon.country} icon`}
                  >
                    <div className="flex flex-col items-center justify-center flex-1">
                      <div className="w-14 h-14 flex items-center justify-center mb-4">
                        <Image
                          src={getIconSvgUrl(randomIcon)}
                          width={56}
                          height={56}
                          className="w-14 h-14 opacity-60 group-hover:opacity-100 transition-opacity duration-200 dark:invert"
                          alt="City landmark icon"
                          loading="lazy"
                        />
                      </div>
                      <div className="text-center w-full">
                        <span className="text-base font-medium text-foreground truncate block w-full mb-1">{randomIcon.city}</span>
                        <span className="text-sm text-muted-foreground truncate block w-full">{randomIcon.country}</span>
                      </div>
                    </div>
                  </Link>
                </li>
                ))}
            </ul>
          </section>
        )}

        {/* Back to all icons */}
        <nav className="mt-20 text-center" aria-label="Navigation">
          <Link href="/">
            <Button variant="outline" size="lg">
              View All City Icons
            </Button>
          </Link>
        </nav>
      </article>

      <IconFooter icons={allIcons} />
    </div>
  );
}
