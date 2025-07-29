'use client';

import { IconModalProps } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from 'fathom-client';
import { getIconUrl } from '@/lib/utils';

export default function IconModal({ icon, isOpen, onClose }: IconModalProps) {
  const downloadSVG = () => {
    if (!icon) return;
    
    const blob = new Blob([icon.svgContent], { type: 'image/svg+xml' });
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
      await navigator.clipboard.writeText(icon.svgContent);
      
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
          <h2 className="text-xl font-semibold">
            {icon?.name}
          </h2>
          <DialogDescription className="text-base leading-relaxed">
            {icon?.description || `Icon representing ${icon?.city}, ${icon?.country}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex justify-center p-8 bg-muted rounded-lg">
            <div
              className="w-24 h-24 text-primary flex items-center justify-center"
              role="img"
              aria-label={`${icon?.city} icon representing ${icon?.name}`}
              dangerouslySetInnerHTML={{ 
                __html: icon?.svgContent
                  ?.replace(/width="[^"]*"/, 'width="96"')
                  ?.replace(/height="[^"]*"/, 'height="96"')
                  ?.replace(/viewBox="[^"]*"/, 'viewBox="0 0 120 120"') || '' 
              }}
            />
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