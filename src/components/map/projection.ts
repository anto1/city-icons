import { LAT_MAX, LAT_MIN } from './world-land';

/**
 * Project a WGS84 coordinate onto the basemap as percentages of its width and
 * height. The basemap (world-land.ts) uses a plain equirectangular projection
 * cropped to [LAT_MIN, LAT_MAX], so markers positioned with these percentages
 * line up with the land geometry at any rendered size.
 */
export function projectToPercent(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * 100;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100;
  return {
    x: Number(x.toFixed(3)),
    y: Number(y.toFixed(3)),
  };
}
