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
        <Card
          key={icon._id}
          className="group aspect-square hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/50"
          onClick={() => onIconClick(icon)}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center h-full">
            <div className="w-full h-full flex items-center justify-center mb-2">
              <div
                className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors duration-200 [&>svg]:fill-current [&>svg]:stroke-current [&>svg]:stroke-2"
                dangerouslySetInnerHTML={{ __html: icon.svgContent }}
              />
            </div>
            <div className="text-center w-full">
              <p className="text-xs font-medium text-foreground truncate w-full mb-1">{icon.name}</p>
              <p className="text-xs text-muted-foreground truncate w-full">{icon.country}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 