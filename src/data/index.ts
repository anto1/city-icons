import { CountryCount, Icon } from '@/types';

import asiaIcons from './icons/asia.json';
import middleEastIcons from './icons/middle-east.json';
import europeIcons from './icons/europe.json';
import southAmericaIcons from './icons/south-america.json';
import northAmericaIcons from './icons/north-america.json';
import africaIcons from './icons/africa.json';
import oceaniaIcons from './icons/oceania.json';
import centralAmericaIcons from './icons/central-america.json';

// `satisfies` checks each region file against the Icon shape at compile time
// (instead of an unchecked `as Icon[]` widening cast).
const iconData: Icon[] = [
  ...(europeIcons satisfies Icon[]),
  ...(asiaIcons satisfies Icon[]),
  ...(northAmericaIcons satisfies Icon[]),
  ...(southAmericaIcons satisfies Icon[]),
  ...(middleEastIcons satisfies Icon[]),
  ...(africaIcons satisfies Icon[]),
  ...(oceaniaIcons satisfies Icon[]),
  ...(centralAmericaIcons satisfies Icon[]),
];

// Sorted-by-city copy computed once and shared by every page
// (previously re-sorted independently in each page file).
const sortedIcons: Icon[] = [...iconData].sort((a, b) =>
  a.city.localeCompare(b.city)
);

/** All icons sorted alphabetically by city. Treat as read-only. */
export function getSortedIcons(): Icon[] {
  return sortedIcons;
}

// Precomputed once: unique countries (alphabetical) with their icon counts —
// the footer only needs these ~2KB, not the full dataset.
const countryCounts: CountryCount[] = [
  ...iconData.reduce((counts, icon) => {
    counts.set(icon.country, (counts.get(icon.country) ?? 0) + 1);
    return counts;
  }, new Map<string, number>()),
]
  .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  .map(([country, count]) => ({ country, count }));

/** Unique countries (alphabetical) with icon counts, for IconFooter. */
export function getCountryCounts(): CountryCount[] {
  return countryCounts;
}

// The three featured header icons: a deterministic spread across the sorted
// collection (no Math.random — stable output for SSG/hydration).
const featuredIcons: Icon[] = (() => {
  if (sortedIcons.length === 0) return [];
  const step = Math.max(1, Math.floor(sortedIcons.length / 3));
  return [sortedIcons[0], sortedIcons[step], sortedIcons[step * 2]].filter(
    Boolean
  );
})();

/** Featured icons shown in the RandomIconHeader, picked server-side. */
export function getFeaturedIcons(): Icon[] {
  return featuredIcons;
}

export default iconData;
