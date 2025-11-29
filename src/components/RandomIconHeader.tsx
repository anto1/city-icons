import { Icon } from '@/types';
import { useRouter } from 'next/navigation';
import { getIconUrl, formatSvg } from '@/lib/utils';

interface RandomIconHeaderProps {
  icons: Icon[];
}

export function RandomIconHeader({ icons }: RandomIconHeaderProps) {
  const router = useRouter();

  const handleIconClick = (icon: Icon) => {
    const url = getIconUrl(icon);
    router.push(url);
  };

  return (
    <div className="flex justify-center items-center gap-8 py-16">
      {[...icons]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((icon) => (
        <div
          key={icon._id}
          className="w-14 h-14 text-foreground cursor-pointer hover:text-orange-600 transition-colors"
          title={`${icon.city}, ${icon.country}`}
          onClick={() => handleIconClick(icon)}
          dangerouslySetInnerHTML={{
            __html: formatSvg(icon.svgContent, 56, false)
          }}
        />
      ))}
    </div>
  );
} 