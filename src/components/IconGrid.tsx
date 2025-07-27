'use client';

import { useState } from 'react';
import { IconGridProps } from '@/types';

export default function IconGrid({ icons, loading, onIconClick }: IconGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  console.log('🎯 IconGrid received icons:', icons.map(icon => icon.city));
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-muted-foreground">Loading icons...</div>
      </div>
    );
  }

  if (icons.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-muted-foreground">No icons found</div>
      </div>
    );
  }

  const getScale = (index: number) => {
    if (hoveredIndex === null) return 1;
    
    // Main hovered card
    if (index === hoveredIndex) return 1.05;
    
    // Neighbor cards (adjacent horizontally and vertically)
    const cols = window.innerWidth >= 1280 ? 6 : window.innerWidth >= 1024 ? 5 : window.innerWidth >= 768 ? 4 : window.innerWidth >= 640 ? 3 : 2;
    const row = Math.floor(index / cols);
    const col = index % cols;
    const hoveredRow = Math.floor(hoveredIndex / cols);
    const hoveredCol = hoveredIndex % cols;
    
    // Check if this card is adjacent to the hovered card
    const isAdjacent = (
      (Math.abs(row - hoveredRow) === 1 && col === hoveredCol) || // Vertical adjacent
      (Math.abs(col - hoveredCol) === 1 && row === hoveredRow) || // Horizontal adjacent
      (Math.abs(row - hoveredRow) === 1 && Math.abs(col - hoveredCol) === 1) // Diagonal adjacent
    );
    
    return isAdjacent ? 1.02 : 1;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
      {icons.map((icon, index) => (
        <div 
          key={icon._id} 
          className="group cursor-pointer transition-all duration-300 ease-out hover:border-2 hover:border-[#fafafa] p-4 rounded-[48px] flex flex-col items-center justify-center z-10" 
          style={{ 
            aspectRatio: '1 / 1',
            transform: `scale(${getScale(index)})`,
            zIndex: hoveredIndex === index ? 20 : 10
          }} 
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => onIconClick(icon)}
        >
          <div className="flex flex-col items-center justify-center flex-1">
            <div
              className="w-14 h-14 text-muted-foreground group-hover:text-[#E2725B] transition-colors duration-200 flex items-center justify-center mb-4"
              dangerouslySetInnerHTML={{
                __html: icon.svgContent
                  .replace(/width="[^"]*"/, 'width="56"')
                  .replace(/height="[^"]*"/, 'height="56"')
                  .replace(/viewBox="[^"]*"/, 'viewBox="0 0 120 120"')
                  .replace(/fill="[^"]*"/g, 'fill="currentColor"')
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