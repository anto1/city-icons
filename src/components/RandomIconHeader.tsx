'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/types';
import { getIconUrl, getIconSvgUrl } from '@/lib/utils';

interface RandomIconHeaderProps {
  icons: Icon[];
}

export function RandomIconHeader({ icons }: RandomIconHeaderProps) {
  // Memoize random selection to avoid re-shuffling on every render
  const randomIcons = useMemo(() => {
    return [...icons]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }, [icons]);

  return (
    <div className="flex justify-center items-center gap-8 py-16">
      {randomIcons.map((icon) => (
        <Link
          key={icon._id}
          href={getIconUrl(icon)}
          className="w-14 h-14 cursor-pointer hover:opacity-70 transition-opacity"
          title={`${icon.city}, ${icon.country}`}
        >
          <Image
            src={getIconSvgUrl(icon)}
            alt={`${icon.city} icon`}
            width={56}
            height={56}
            className="w-14 h-14"
          />
        </Link>
      ))}
    </div>
  );
} 