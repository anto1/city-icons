'use client';

import { IconGridProps } from '@/types';

export default function IconGrid({ icons, loading, onIconClick }: IconGridProps) {
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

  // Generate a random vibrant blue hue for hover effect
  const getRandomBlueHue = () => {
    const blueHues = [
      'hsl(210, 100%, 50%)',   // Bright blue
      'hsl(220, 100%, 45%)',   // Royal blue
      'hsl(200, 100%, 40%)',   // Deep blue
      'hsl(240, 100%, 50%)',   // Pure blue
      'hsl(230, 100%, 55%)',   // Light blue
    ];
    return blueHues[Math.floor(Math.random() * blueHues.length)];
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
      {icons.map((icon) => (
        <div key={icon._id} className="group cursor-pointer transition-colors duration-200 hover:bg-[#f7f7f7] p-4 rounded-[48px] flex flex-col items-center justify-center" style={{ aspectRatio: '1 / 1' }} onClick={() => onIconClick(icon)}>
          <div className="flex flex-col items-center justify-center flex-1">
            <div
              className="w-14 h-14 text-muted-foreground group-hover:text-primary transition-colors duration-200 flex items-center justify-center mb-4"
              style={{ 
                '--hover-color': getRandomBlueHue() 
              } as React.CSSProperties}
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