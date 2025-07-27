'use client';

import { IconGridProps } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

export default function IconGrid({ icons, onIconClick, loading = false }: IconGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
        {[...Array(12)].map((_, index) => (
          <Card key={index} className="aspect-square animate-pulse">
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <div className="w-12 h-12 bg-muted rounded mb-2"></div>
              <div className="w-20 h-3 bg-muted rounded mb-1"></div>
              <div className="w-16 h-2 bg-muted rounded mb-2"></div>
              <div className="flex gap-1">
                <div className="w-8 h-2 bg-muted rounded"></div>
                <div className="w-8 h-2 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (icons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Search className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No icons found</h3>
        <p className="text-muted-foreground">Try adjusting your search terms or browse all icons.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
      {icons.map((icon) => (
        <div key={icon._id} className="group cursor-pointer transition-colors duration-200 hover:bg-[#f7f7f7] p-4 rounded-[48px] flex flex-col items-center justify-center" style={{ aspectRatio: '1 / 1' }} onClick={() => onIconClick(icon)}>
          <div className="flex flex-col items-center justify-center flex-1">
            <div
              className="w-14 h-14 text-muted-foreground group-hover:text-primary transition-colors duration-200 flex items-center justify-center mb-4"
              dangerouslySetInnerHTML={{
                __html: icon.svgContent
                  .replace(/width="[^"]*"/, 'width="56"')
                  .replace(/height="[^"]*"/, 'height="56"')
                  .replace(/viewBox="[^"]*"/, 'viewBox="0 0 120 120"')
              }}
            />
            <div className="text-center w-full">
              <p className="text-base font-medium text-foreground truncate w-full mb-1">{icon.city}</p>
              <p className="text-sm text-muted-foreground truncate w-full">{icon.country}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 