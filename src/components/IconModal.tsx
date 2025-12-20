'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { IconModalProps } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from 'fathom-client';
import { getIconUrl, getIconSvgUrl, slugify } from '@/lib/utils';
import Link from 'next/link';

export default function IconModal({ icon, isOpen, onClose }: IconModalProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  // Fetch SVG content on-demand for download/copy functionality
  const fetchSvgContent = useCallback(async () => {
    if (!icon) return null;
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-8 z-[9999]">
        <DialogHeader className="space-y-4">
          <Link
            href={`/${slugify(icon?.country || '')}`}
            className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline"
          >
            {icon?.country}
          </Link>
          <h2 className="text-xl font-semibold">
            {icon?.name}
          </h2>
          <DialogDescription className="text-base leading-relaxed">
            {icon?.description || `Icon representing ${icon?.city}, ${icon?.country}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex justify-center p-8 bg-muted rounded-lg">
            {icon && (
              <Image
                src={getIconSvgUrl(icon)}
                alt={`${icon.city} icon representing ${icon.name}`}
                width={96}
                height={96}
                className="w-24 h-24"
              />
            )}
          </div>
        </div>
        
        <DialogFooter className="flex gap-2 pt-4">
          <Button onClick={downloadSVG} className="flex-1 py-3">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button onClick={copySVG} variant="outline" className="flex-1 py-3">
            <Copy className="w-4 h-4 mr-2" />
            Copy SVG
          </Button>
          <Button onClick={shareLink} variant="outline" className="flex-1 py-3">
            <Share2 className="w-4 h-4 mr-2" />
            Share Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 