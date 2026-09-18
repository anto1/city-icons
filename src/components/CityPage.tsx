'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { CountryCount, GridIcon, Icon } from '@/types';
import { Button } from '@/components/ui/button';
import { Download, Copy, ImageDown, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from 'fathom-client';
import { getIconUrl, getIconSvgUrl, slugify, getCitySlug } from '@/lib/utils';
import { IconFooter } from '@/components/IconFooter';
import { IconCard } from '@/components/IconCard';
import { HeaderControls } from './PageHeader';
import Link from 'next/link';

/** Raster size for the client-side PNG export (the common icon default). */
const PNG_SIZE = 512;

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
  /** Month this icon was added, from the changelog. */
  addedOn?: { iso: string; label: string };
}

export default function CityPage({
  icon,
  headerIcons,
  relatedIcons,
  exploreIcons,
  footerCountries,
  totalIcons,
  addedOn,
}: CityPageProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  // Same landmark derivation as the page title: names are usually
  // "{City} {Landmark}", so strip a leading city prefix to isolate the landmark.
  const trimmedName = icon.name.trim();
  const landmark = trimmedName.toLowerCase().startsWith(`${icon.city.toLowerCase()} `)
    ? trimmedName.slice(icon.city.length + 1).trim()
    : trimmedName;
  const citySlug = getCitySlug(icon);

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

  const downloadPNG = async () => {
    if (!icon) return;

    const content = await fetchSvgContent();
    if (!content) {
      toast.error('Failed to export PNG');
      return;
    }

    try {
      // Force black artwork (icons use `currentColor` fills — an <img>-loaded
      // SVG resolves that to black, but be explicit) and an exact raster size
      // so the canvas renders crisply at the target resolution.
      const svg = content
        .replace(/currentColor/g, '#000000')
        .replace(
          /<svg([^>]*)>/,
          (_match, attrs: string) =>
            `<svg${attrs.replace(/\s(?:width|height)="[^"]*"/g, '')} width="${PNG_SIZE}" height="${PNG_SIZE}">`
        );
      const svgUrl = URL.createObjectURL(
        new Blob([svg], { type: 'image/svg+xml' })
      );

      let pngBlob: Blob;
      try {
        const image = new window.Image();
        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error('Failed to render SVG'));
          image.src = svgUrl;
        });

        const canvas = document.createElement('canvas');
        canvas.width = PNG_SIZE;
        canvas.height = PNG_SIZE;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas 2D context unavailable');
        context.drawImage(image, 0, 0, PNG_SIZE, PNG_SIZE);

        pngBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) =>
              blob ? resolve(blob) : reject(new Error('PNG encoding failed')),
            'image/png'
          );
        });
      } finally {
        URL.revokeObjectURL(svgUrl);
      }

      const pngUrl = URL.createObjectURL(pngBlob);
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = icon.svgFilename.replace(/\.svg$/, '.png');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(pngUrl);

      // Track download: aggregate event (queryable total) + per-city breakdown
      trackEvent('ICON_DOWNLOAD_PNG');
      trackEvent(`ICON_DOWNLOAD_PNG_${icon.city.replace(/\s+/g, '_').toUpperCase()}`);

      toast.success('PNG downloaded successfully!', {
        description: `${PNG_SIZE}×${PNG_SIZE}px, transparent background`,
        duration: 3000,
      });
    } catch (err) {
      console.error('Failed to export PNG:', err);
      toast.error('Failed to export PNG', {
        description: 'Please try again or download the SVG instead',
        duration: 4000,
      });
    }
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
              aria-label="Download SVG file"
            >
              <Download className="w-4 h-4" />
              SVG
            </Button>
            <Button
              onClick={downloadPNG}
              variant="outline"
              className="flex-1 flex items-center gap-2"
              aria-label={`Download ${PNG_SIZE}px PNG file`}
            >
              <ImageDown className="w-4 h-4" />
              PNG
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
        <section className="text-center max-w-2xl mx-auto mb-12" aria-labelledby="about-heading">
          <h2 id="about-heading" className="text-2xl font-bold mb-4">
            About the {landmark}
          </h2>
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
        </section>

        {/* Icon details — everything about the file itself, in one block that
            also gives the page the words its title promises (SVG, download,
            licence) alongside the landmark prose above. */}
        <section className="max-w-2xl mx-auto mb-12" aria-labelledby="details-heading">
          <h2 id="details-heading" className="text-2xl font-bold text-center mb-6">
            Icon details
          </h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
            <dt className="text-muted-foreground">Symbol</dt>
            <dd>{icon.name}</dd>

            <dt className="text-muted-foreground">City</dt>
            <dd>
              <Link href={`/${slugify(icon.country)}`} className="underline underline-offset-4 hover:no-underline">
                {icon.city}, {icon.country}
              </Link>
            </dd>

            {icon.region && (
              <>
                <dt className="text-muted-foreground">Region</dt>
                <dd>{icon.region}</dd>
              </>
            )}

            {icon.category && (
              <>
                <dt className="text-muted-foreground">Category</dt>
                <dd>{icon.category}</dd>
              </>
            )}

            <dt className="text-muted-foreground">Format</dt>
            <dd>SVG (scalable vector), plus PNG export at {PNG_SIZE}px</dd>

            <dt className="text-muted-foreground">File</dt>
            <dd><code className="text-xs">{icon.svgFilename}</code></dd>

            <dt className="text-muted-foreground">Licence</dt>
            <dd>
              <Link href="/license" className="underline underline-offset-4 hover:no-underline">
                CC BY 4.0
              </Link>{' '}
              — free for commercial use with attribution
            </dd>

            {addedOn && (
              <>
                <dt className="text-muted-foreground">Added</dt>
                <dd><time dateTime={addedOn.iso}>{addedOn.label}</time></dd>
              </>
            )}
          </dl>

          <div className="mt-6 rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground mb-2">Attribution — copy this when you use the icon:</p>
            <p className="text-sm">
              {icon.name} icon by Studio Partdirector, svgcities.com/{slugify(icon.country)}/{citySlug}, CC BY 4.0
            </p>
          </div>
        </section>

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
