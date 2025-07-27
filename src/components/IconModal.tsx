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
import { Badge } from '@/components/ui/badge';
import { Download, Copy, X } from 'lucide-react';
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
          <DialogTitle className="flex items-center gap-2">
            <div
              className="w-6 h-6 text-primary flex items-center justify-center"
              dangerouslySetInnerHTML={{ 
                __html: icon?.svgContent
                  ?.replace(/width="[^"]*"/, 'width="24"')
                  .replace(/height="[^"]*"/, 'height="24"')
                  .replace(/viewBox="[^"]*"/, 'viewBox="0 0 120 120"') || '' 
              }}
            />
            {icon?.name}
          </DialogTitle>
          <DialogDescription>
            {icon?.description || `Icon representing ${icon?.city}, ${icon?.country}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">City:</span>
              <p className="text-foreground">{icon?.city}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Country:</span>
              <p className="text-foreground">{icon?.country}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Category:</span>
              <p className="text-foreground">{icon?.category}</p>
            </div>
          </div>
          
          {icon?.tags && icon.tags.length > 0 && (
            <div>
              <span className="text-sm font-medium text-muted-foreground">Tags:</span>
              <div className="flex flex-wrap gap-1 mt-2">
                {icon.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
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
          <Button onClick={onClose} variant="ghost" size="icon">
            <X className="w-4 h-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 