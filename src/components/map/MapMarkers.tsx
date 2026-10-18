import { memo, type MouseEvent as ReactMouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { MapMarker } from './types';

// Markers are memoized so pointer-driven pans (which only change the stage
// transform) never re-render 300 links. They re-render only when zoom changes.
export const MapMarkers = memo(function MapMarkers({
  markers,
  k,
  animate,
  activeRegion,
  onNavigate,
  onMarkerFocus,
}: {
  markers: MapMarker[];
  k: number;
  animate: boolean;
  /** Region preset in effect, or null/'World' for no emphasis. */
  activeRegion: string | null;
  onNavigate: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
  onMarkerFocus: (marker: MapMarker) => void;
}) {
  // Selecting a region emphasises its markers and fades the rest. Colour is
  // never the only signal — the preset button carries aria-pressed and its own
  // active styling, so this is reinforcement rather than the sole cue.
  const emphasise = activeRegion !== null && activeRegion !== 'World';
  return (
    <>
      {markers.map((marker) => (
        <Link
          key={marker.id}
          href={marker.url}
          prefetch={false}
          className={`group absolute block h-0 w-0 hover:z-20 focus-within:z-20 ${
            emphasise && marker.region !== activeRegion
              ? 'opacity-25 hover:opacity-100 focus-within:opacity-100'
              : ''
          }`}
          style={{
            left: `${marker.x}%`,
            top: `${marker.y}%`,
            transform: `scale(${1 / k})`,
            transition: animate ? 'transform 0.35s ease' : undefined,
          }}
          aria-label={`${marker.city}, ${marker.country}`}
          draggable={false}
          onClick={onNavigate}
          onFocus={() => onMarkerFocus(marker)}
        >
          {/* Hit target around a small dot, counter-scaled with zoom so it
              keeps its screen size: 16px for mouse precision in dense
              clusters, 24px on touch screens */}
          <span className="absolute -left-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full outline-none group-focus-visible:ring-2 group-focus-visible:ring-foreground pointer-coarse:-left-3 pointer-coarse:-top-3 pointer-coarse:h-6 pointer-coarse:w-6">
            <span
              className="h-[7px] w-[7px] rounded-full bg-foreground ring-1 ring-background transition-colors group-hover:bg-orange-600 group-focus-visible:bg-orange-600"
              aria-hidden="true"
            />
          </span>
          {/* Preview card. Fixed size so the box does not resize as the icon
              loads, and pointer-events-none so it never blocks the markers it
              overlaps in dense regions. The icon is fetched only on hover or
              focus — at ~13KB each, preloading all of them would be wasteful. */}
          <span
            className="pointer-events-none absolute -top-[4.75rem] left-0 hidden w-28 -translate-x-1/2 flex-col items-center gap-1 rounded-md border border-border bg-popover px-2 py-1.5 text-center shadow-sm group-hover:flex group-focus-visible:flex"
            aria-hidden="true"
          >
            <Image
              src={`/icons/${marker.svgFilename}`}
              alt=""
              width={40}
              height={40}
              loading="lazy"
              className="h-10 w-10 dark:invert"
            />
            <span className="w-full truncate text-xs font-medium text-popover-foreground">
              {marker.city}
            </span>
            <span className="w-full truncate text-[0.6875rem] leading-tight text-muted-foreground">
              {marker.country}
            </span>
          </span>
        </Link>
      ))}
    </>
  );
});
