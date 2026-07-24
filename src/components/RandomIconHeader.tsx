'use client';

import Image from 'next/image';
import Link from 'next/link';
import { GridIcon } from '@/types';
import { getIconUrl, getIconSvgUrl } from '@/lib/utils';
import { HeaderControls } from './PageHeader';

interface RandomIconHeaderProps {
  /** Featured icons to display, picked deterministically server-side. */
  icons: GridIcon[];
}

export function RandomIconHeader({ icons }: RandomIconHeaderProps) {
  return (
    <nav aria-label="Featured cities" className="relative flex justify-center items-center gap-8 py-16">
      <HeaderControls />
      {icons.map((icon) => (
        <Link
          key={icon._id}
          href={getIconUrl(icon)}
          className="w-14 h-14 cursor-pointer hover:opacity-70 transition-opacity"
          title={`${icon.city}, ${icon.country}`}
          aria-label={`View ${icon.city}, ${icon.country} icon`}
        >
          <Image
            src={getIconSvgUrl(icon)}
            alt={`${icon.name} - ${icon.city}, ${icon.country}`}
            width={56}
            height={56}
            className="w-14 h-14 dark:invert"
          />
        </Link>
      ))}
    </nav>
  );
}
