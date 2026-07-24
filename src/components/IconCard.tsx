import { CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GridIcon } from '@/types';
import { cn, getIconUrl, getIconSvgUrl } from '@/lib/utils';

interface IconCardProps {
  icon: GridIcon;
  /** Extra classes on the link (e.g. the homepage grid's entrance animation). */
  className?: string;
  /** Inline styles merged over the default square aspect ratio. */
  style?: CSSProperties;
  onClick?: () => void;
  /** Defaults to `"{city}, {country} icon"`. */
  ariaLabel?: string;
  /** Defaults to `"{city}, {country} icon"`. */
  imageAlt?: string;
  imageTitle?: string;
  imageLoading?: 'eager' | 'lazy';
  /** Tint the icon terracotta on hover (homepage grid treatment). */
  hoverTint?: boolean;
}

/**
 * Square icon card (icon + city + country) linking to the city page. Shared
 * by the homepage grid and the related/explore grids on city pages — render
 * inside an `<li>`.
 */
export function IconCard({
  icon,
  className,
  style,
  onClick,
  ariaLabel,
  imageAlt,
  imageTitle,
  imageLoading = 'lazy',
  hoverTint = false,
}: IconCardProps) {
  return (
    <Link
      href={getIconUrl(icon)}
      className={cn(
        'group cursor-pointer hover:cursor-pointer active:cursor-pointer transition-all duration-500 ease-out border-2 border-transparent hover:border-border p-4 rounded-[48px] flex flex-col items-center justify-center h-full',
        className
      )}
      style={{ aspectRatio: '1 / 1', ...style }}
      onClick={onClick}
      aria-label={ariaLabel ?? `${icon.city}, ${icon.country} icon`}
    >
      <article className="flex flex-col items-center justify-center flex-1">
        <div
          className={cn(
            'w-14 h-14 flex items-center justify-center mb-4',
            hoverTint &&
              'text-muted-foreground group-hover:text-[#E2725B] transition-colors duration-200'
          )}
        >
          <Image
            src={getIconSvgUrl(icon)}
            alt={imageAlt ?? `${icon.city}, ${icon.country} icon`}
            title={imageTitle}
            width={56}
            height={56}
            className="w-14 h-14 opacity-60 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 dark:invert"
            loading={imageLoading}
          />
        </div>
        <div className="text-center w-full">
          <p className="text-base font-medium text-foreground truncate w-full mb-1">
            {icon.city}
          </p>
          <p className="text-sm text-muted-foreground truncate w-full">
            {icon.country}
          </p>
        </div>
      </article>
    </Link>
  );
}
