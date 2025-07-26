'use client';

import { IconGridProps } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

export default function IconGrid({ icons, onIconClick, loading = false }: IconGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4">
        {Array.from({ length: 24 }).map((_, index) => (
          <Card key={index} className="aspect-square animate-pulse">
            <CardContent className="p-4 bg-muted" />
          </Card>
        ))}
      </div>
    );
  }

  if (icons.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-4">
          <Search className="mx-auto h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No icons found</h3>
        <p className="text-muted-foreground">Try adjusting your search terms</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4">
      {icons.map((icon) => (
        <Card
          key={icon._id}
          className="group aspect-square hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/50"
          onClick={() => onIconClick(icon)}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center h-full">
            <div className="w-full h-full flex items-center justify-center mb-2">
              <div
                className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors duration-200"
                dangerouslySetInnerHTML={{ __html: icon.svgContent }}
              />
            </div>
            <div className="text-center w-full">
              <p className="text-xs font-medium text-foreground truncate w-full mb-1">
                {icon.name}
              </p>
              <p className="text-xs text-muted-foreground truncate w-full mb-2">
                {icon.city}
              </p>
              <div className="flex flex-wrap gap-1 justify-center">
                {icon.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 