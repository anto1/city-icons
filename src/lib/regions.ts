/**
 * Display order of the eight regions (one per src/data/icons/*.json file),
 * shared by the homepage region filter and the /map presets and city list.
 */
export const REGIONS = [
  'Europe',
  'Asia',
  'North America',
  'South America',
  'Middle East',
  'Africa',
  'Oceania',
  'Central America',
] as const;

/** Sort comparator by REGIONS order; unknown regions go last. */
export function compareRegions(a: string, b: string): number {
  const rank = (region: string) => {
    const index = (REGIONS as readonly string[]).indexOf(region);
    return index === -1 ? REGIONS.length : index;
  };
  return rank(a) - rank(b);
}
