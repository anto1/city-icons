import { Icon } from '@/types';

interface RandomIconHeaderProps {
  icons: Icon[];
}

export function RandomIconHeader({ icons }: RandomIconHeaderProps) {
  return (
    <div className="flex justify-center items-center gap-8 py-16">
      {[...icons]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((icon) => (
        <div
          key={icon._id}
          className="w-14 h-14 text-foreground cursor-help"
          title={`${icon.city}, ${icon.country}`}
          dangerouslySetInnerHTML={{
            __html: icon.svgContent
              .replace(/width="[^"]*"/, 'width="56"')
              .replace(/height="[^"]*"/, 'height="56"')
              .replace(/viewBox="[^"]*"/, 'viewBox="0 0 120 120"')
          }}
        />
      ))}
    </div>
  );
} 