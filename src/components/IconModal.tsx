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
import { Download, Copy } from 'lucide-react';
import { toast } from 'sonner';

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
    
    toast.success('SVG downloaded successfully!');
  };

  const copySVG = async () => {
    if (!icon) return;
    
    try {
      await navigator.clipboard.writeText(icon.svgContent);
      toast.success('SVG copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy SVG:', err);
      toast.error('Failed to copy SVG');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {icon?.name}
          </DialogTitle>
          <DialogDescription>
            {icon?.description || `Icon representing ${icon?.city}, ${icon?.country}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-center p-4 bg-muted rounded-lg">
            <div
              className="w-24 h-24 text-primary flex items-center justify-center"
              dangerouslySetInnerHTML={{ 
                __html: icon?.svgContent
                  ?.replace(/width="[^"]*"/, 'width="96"')
                  .replace(/height="[^"]*"/, 'height="96"')
                  .replace(/viewBox="[^"]*"/, 'viewBox="0 0 120 120"') || '' 
              }}
            />
          </div>
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button onClick={downloadSVG} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download SVG
          </Button>
          <Button onClick={copySVG} variant="outline" className="flex-1">
            <Copy className="w-4 h-4 mr-2" />
            Copy SVG
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 