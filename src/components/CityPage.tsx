'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Icon } from '@/types';
import { Button } from '@/components/ui/button';
import { Download, Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from 'fathom-client';
import { getIconUrl, getIconSvgUrl, slugify } from '@/lib/utils';
import { IconFooter } from '@/components/IconFooter';
import Link from 'next/link';

interface CityPageProps {
  icon: Icon;
  allIcons: Icon[];
}

export default function CityPage({ icon, allIcons }: CityPageProps) {
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

  // Add structured data for SEO
  useEffect(() => {
    const baseUrl = 'https://cities.partdirector.ch';
    const pageUrl = getIconUrl(icon);

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: icon.name,
      description: icon.description || `Icon representing ${icon.city}, ${icon.country}`,
      url: `${baseUrl}${pageUrl}`,
      image: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icons/${icon.svgFilename}`,
        contentUrl: `${baseUrl}/icons/${icon.svgFilename}`,
        encodingFormat: 'image/svg+xml',
        name: `${icon.name} icon`,
        description: `SVG icon of ${icon.name} representing ${icon.city}, ${icon.country}`,
      },
      author: {
        '@type': 'Organization',
        name: 'Studio Partdirector',
        url: 'https://partdirector.ch',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Studio Partdirector',
        url: 'https://partdirector.ch',
      },
      about: {
        '@type': 'Place',
        name: icon.city,
        containedInPlace: {
          '@type': 'Country',
          name: icon.country,
        },
        description: icon.description,
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: icon.country,
            item: `${baseUrl}/${slugify(icon.country)}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: icon.city,
            item: `${baseUrl}${pageUrl}`,
          },
        ],
      },
      keywords: `${icon.city}, ${icon.country}, city icon, SVG icon, line art, ${icon.name}, ${icon.tags?.join(', ') || ''}`,
      inLanguage: 'en-US',
      isAccessibleForFree: true,
      license: `${baseUrl}/license`,
      category: icon.category,
      genre: 'Line Art',
      datePublished: new Date().toISOString(),
      downloadUrl: `${baseUrl}/icons/${icon.svgFilename}`,
    };

    // Remove any existing structured data script
    const existingScript = document.querySelector('script[data-structured-data]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create and inject the structured data script in the head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-structured-data', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup function to remove the script when component unmounts
    return () => {
      const scriptToRemove = document.querySelector('script[data-structured-data]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [icon]);

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

  // Get random icons from different countries
  const randomIcons = allIcons
    .filter((randomIcon) => randomIcon.country !== icon.country)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Random icon header - same as main page */}
      <div className="flex justify-center items-center gap-8 py-16">
        {[...allIcons]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((randomIcon) => (
          <Link
            key={randomIcon._id}
            href={getIconUrl(randomIcon)}
            className="w-14 h-14 hover:opacity-70 transition-opacity"
            title={`${randomIcon.city}, ${randomIcon.country}`}
          >
            <Image
              src={getIconSvgUrl(randomIcon)}
              alt={`${randomIcon.city} icon`}
              width={56}
              height={56}
              className="w-14 h-14"
            />
          </Link>
        ))}
      </div>

      {/* Main content container - same structure as main page */}
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb navigation */}
        <div className="text-center mb-8">
          <div className="text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link 
              href={`/${slugify(icon.country)}`}
              className="hover:text-foreground transition-colors"
            >
              {icon.country}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">{icon.city}</span>
          </div>
        </div>

        {/* City icon header - similar to IconHeader */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
            {icon.name}
          </h1>
        </div>

        {/* Large icon display - centered */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-16 mb-8 w-full max-w-md aspect-square flex items-center justify-center">
            <Image
              src={getIconSvgUrl(icon)}
              alt={`${icon.name} - ${icon.city}, ${icon.country}`}
              width={128}
              height={128}
              className="w-32 h-32"
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
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-center mb-8">{relatedIcons.length} more from {icon.country}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 relative">
                {relatedIcons.map((relatedIcon) => (
                <Link
                  key={relatedIcon._id}
                  href={getIconUrl(relatedIcon)}
                  className="group cursor-pointer hover:cursor-pointer active:cursor-pointer transition-all duration-500 ease-out hover:border-2 hover:border-[#fafafa] p-4 rounded-[48px] flex flex-col items-center justify-center"
                  style={{ aspectRatio: '1 / 1' }}
                >
                  <div className="flex flex-col items-center justify-center flex-1">
                    <div className="w-14 h-14 flex items-center justify-center mb-4">
                      <Image
                        src={getIconSvgUrl(relatedIcon)}
                        alt={`${relatedIcon.city} icon`}
                        width={56}
                        height={56}
                        className="w-14 h-14 opacity-60 group-hover:opacity-100 transition-opacity duration-200"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-center w-full">
                      <h3 className="text-base font-medium text-foreground truncate w-full mb-1">{relatedIcon.city}</h3>
                      <p className="text-sm text-muted-foreground truncate w-full">{relatedIcon.country}</p>
                    </div>
                  </div>
                </Link>
                ))}
            </div>
          </div>
        )}

        {/* Explore more section */}
        {randomIcons.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-center mb-8">Explore More Cities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 relative">
                {randomIcons.slice(0, 4).map((randomIcon) => (
                <Link
                  key={randomIcon._id}
                  href={getIconUrl(randomIcon)}
                  className="group cursor-pointer hover:cursor-pointer active:cursor-pointer transition-all duration-500 ease-out hover:border-2 hover:border-[#fafafa] p-4 rounded-[48px] flex flex-col items-center justify-center"
                  style={{ aspectRatio: '1 / 1' }}
                >
                  <div className="flex flex-col items-center justify-center flex-1">
                    <div className="w-14 h-14 flex items-center justify-center mb-4">
                      <Image
                        src={getIconSvgUrl(randomIcon)}
                        alt={`${randomIcon.city} icon`}
                        width={56}
                        height={56}
                        className="w-14 h-14 opacity-60 group-hover:opacity-100 transition-opacity duration-200"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-center w-full">
                      <h3 className="text-base font-medium text-foreground truncate w-full mb-1">{randomIcon.city}</h3>
                      <p className="text-sm text-muted-foreground truncate w-full">{randomIcon.country}</p>
                    </div>
                  </div>
                </Link>
                ))}
            </div>
          </div>
        )}

        {/* Back to all icons */}
        <div className="mt-20 text-center">
          <Link href="/">
            <Button variant="outline" size="lg">
              View All City Icons
            </Button>
          </Link>
        </div>
      </div>

      <IconFooter icons={allIcons} />
    </div>
  );
}
