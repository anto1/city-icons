'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Download, Copy, ImageDown, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AttributionSnippet } from '@/components/AttributionSnippet';
import { iconAttribution } from '@/lib/attribution';
import { trackIconEvent } from '@/lib/analytics';
import { absoluteUrl } from '@/lib/site';
import { downloadBlob, fetchSvg, svgToPng } from '@/lib/svg-export';
import { getIconSvgUrl, getIconUrl } from '@/lib/utils';
import { PNG_SIZE } from '@/lib/constants';
import type { GridIcon } from '@/types';

interface IconActionsProps {
  icon: GridIcon;
  /** The large icon preview, rendered on the server and placed above the buttons. */
  children: ReactNode;
}

/**
 * The city page's interactive island: SVG/PNG download, copy, share, and the
 * credit box a successful download or copy reveals. Everything else on the
 * city page is a server component.
 */
export function IconActions({ icon, children }: IconActionsProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [showAttribution, setShowAttribution] = useState(false);
  const attribution = iconAttribution(icon.name, absoluteUrl(getIconUrl(icon)));

  // Fetched on first use, then reused by every action
  const getSvg = async () => {
    if (svgContent) return svgContent;
    try {
      const content = await fetchSvg(getIconSvgUrl(icon));
      setSvgContent(content);
      return content;
    } catch (error) {
      console.error('Failed to fetch SVG:', error);
      return null;
    }
  };

  const downloadSVG = async () => {
    const content = await getSvg();
    if (!content) {
      toast.error('Failed to download SVG');
      return;
    }

    downloadBlob(new Blob([content], { type: 'image/svg+xml' }), icon.svgFilename);
    trackIconEvent('ICON_DOWNLOAD', icon.city);
    setShowAttribution(true);
    toast.success('SVG download started');
  };

  const downloadPNG = async () => {
    const content = await getSvg();
    if (!content) {
      toast.error('Failed to export PNG');
      return;
    }

    try {
      const png = await svgToPng(content, PNG_SIZE);
      downloadBlob(png, icon.svgFilename.replace(/\.svg$/, '.png'));
      trackIconEvent('ICON_DOWNLOAD_PNG', icon.city);
      setShowAttribution(true);
      toast.success('PNG download started', {
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
    try {
      const content = await getSvg();
      if (!content) {
        throw new Error('Failed to fetch SVG content');
      }

      await navigator.clipboard.writeText(content);
      trackIconEvent('ICON_COPY', icon.city);
      setShowAttribution(true);
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
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${getIconUrl(icon)}`);
      trackIconEvent('ICON_SHARE', icon.city);
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
    <>
      <div className="flex flex-col items-center mb-8">
        {children}

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

      {showAttribution && (
        <section className="max-w-2xl mx-auto mb-12 p-6 rounded-lg border border-border bg-muted/30" aria-labelledby="credit-heading">
          <h2 id="credit-heading" className="text-xl font-semibold mb-2">Credit the artwork</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Copy a credit into your project’s credits or about page. If you change the icon,
            mention your changes. <Link href="/license" className="underline">CC BY 4.0 license details</Link>.
          </p>
          <AttributionSnippet label="Plain text" snippet={attribution.text} />
          <details className="mt-4">
            <summary className="cursor-pointer text-sm underline">HTML credit for websites</summary>
            <div className="mt-3"><AttributionSnippet label="HTML" snippet={attribution.html} /></div>
          </details>
        </section>
      )}
    </>
  );
}
