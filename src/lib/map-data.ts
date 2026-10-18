import { getSortedIcons } from '@/data';
import { getCoordinate, getIconsMissingCoordinates } from '@/data/coordinates';
import { getIconUrl } from '@/lib/utils';
import { REGIONS } from '@/lib/regions';
import { projectToPercent } from '@/components/map/projection';
import { VIEW_H, VIEW_W } from '@/components/map/world-land';
import type { MapMarker, RegionView } from '@/components/map/types';

export interface MapData {
  markers: MapMarker[];
  regionViews: RegionView[];
  citiesByRegion: { region: string; cities: { city: string; country: string; url: string }[] }[];
}

/** Everything /map renders, computed at build time from the dataset. */
export function buildMapData(): MapData {
  const icons = getSortedIcons();

  // Icons without coordinates are excluded from the map (but not from the
  // city list). Non-empty means the coordinates dataset needs a re-run of
  // scripts/build-city-coordinates.mjs — warn loudly at build time.
  const missing = getIconsMissingCoordinates(icons);
  if (missing.length > 0) {
    console.warn(
      `[map] ${missing.length} icon(s) have no coordinates and are missing from /map: ` +
        `${missing.map((icon) => icon.city).join(', ')}. ` +
        'Run `node scripts/build-city-coordinates.mjs` to regenerate src/data/coordinates.json.'
    );
  }

  const markers: MapMarker[] = [];
  const regionBounds = new Map<string, { x0: number; y0: number; x1: number; y1: number; count: number }>();

  for (const icon of icons) {
    const coordinate = getCoordinate(icon);
    if (!coordinate) continue;
    const { x, y } = projectToPercent(coordinate.lat, coordinate.lng);
    markers.push({
      id: icon._id,
      city: icon.city,
      country: icon.country,
      region: icon.region,
      svgFilename: icon.svgFilename,
      url: getIconUrl(icon),
      x,
      y,
    });

    const bounds = regionBounds.get(icon.region) ?? { x0: 100, y0: 100, x1: 0, y1: 0, count: 0 };
    bounds.x0 = Math.min(bounds.x0, x);
    bounds.y0 = Math.min(bounds.y0, y);
    bounds.x1 = Math.max(bounds.x1, x);
    bounds.y1 = Math.max(bounds.y1, y);
    bounds.count += 1;
    regionBounds.set(icon.region, bounds);
  }

  spreadCoincidentMarkers(markers);

  const regionViews: RegionView[] = [
    { label: 'World', count: 0, x0: 0, y0: 0, x1: 100, y1: 100 },
    ...REGIONS.filter((region) => regionBounds.has(region)).map((region) => {
      const bounds = regionBounds.get(region)!;
      // Pad the marker bounding box so edge cities are not glued to the frame.
      const padX = Math.max(1.5, (bounds.x1 - bounds.x0) * 0.08);
      const padY = Math.max(1.5, (bounds.y1 - bounds.y0) * 0.08);
      return {
        label: region,
        count: bounds.count,
        x0: Math.max(0, bounds.x0 - padX),
        y0: Math.max(0, bounds.y0 - padY),
        x1: Math.min(100, bounds.x1 + padX),
        y1: Math.min(100, bounds.y1 + padY),
      };
    }),
  ];

  const citiesByRegion = REGIONS.filter((region) => icons.some((icon) => icon.region === region)).map(
    (region) => ({
      region,
      cities: icons
        .filter((icon) => icon.region === region)
        .map((icon) => ({ city: icon.city, country: icon.country, url: getIconUrl(icon) })),
    })
  );

  return { markers, regionViews, citiesByRegion };
}

// Cities with more than one icon (Hanoi, São Paulo) resolve to identical
// coordinates, so their markers stack and only the topmost is clickable.
// Spread each coincident group evenly around a small circle — the offset is
// fixed in map space, so it is imperceptible at world zoom and separates the
// markers as the user zooms in. y is scaled by the basemap aspect so the
// arrangement stays circular on screen rather than elliptical.
function spreadCoincidentMarkers(markers: MapMarker[]): void {
  const SPREAD_X = 0.16; // % of basemap width
  const aspect = VIEW_W / VIEW_H;
  const groups = new Map<string, MapMarker[]>();
  for (const marker of markers) {
    const key = `${marker.x.toFixed(3)}|${marker.y.toFixed(3)}`;
    const group = groups.get(key);
    if (group) group.push(marker);
    else groups.set(key, [marker]);
  }
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    group.forEach((marker, index) => {
      const angle = (2 * Math.PI * index) / group.length;
      marker.x += SPREAD_X * Math.cos(angle);
      marker.y += SPREAD_X * aspect * Math.sin(angle);
    });
  }
}
