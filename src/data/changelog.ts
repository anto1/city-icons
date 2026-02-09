// Changelog tracking weekly icon additions
// Add new entries at the top of the array

export interface ChangelogEntry {
  week: string; // ISO week format: YYYY-WXX or date range
  date: string; // Display date
  cities: string[]; // City names added
  description?: string; // Optional description
}

export const changelog: ChangelogEntry[] = [
  {
    week: '2026-W06',
    date: 'February 2-8, 2026',
    cities: ['Accra', 'Taipei', 'Nara', 'Gdańsk', 'Bologna', 'La Paz', 'Caracas', 'Valparaíso', 'Zanzibar'],
    description: 'Africa, Asia, Europe, and South America additions',
  },
  {
    week: '2025-W02',
    date: 'January 6-10, 2025',
    cities: ['Kuala Lumpur', 'Dili', 'Kuching', 'Seria', 'Sihanoukville', 'Maseru'],
    description: 'Southeast Asia and Africa expansion',
  },
  {
    week: '2025-W01',
    date: 'January 1-5, 2025',
    cities: ['Ashgabat', 'Pyongyang', 'Nukus', 'Dushanbe', 'Barcelos', 'Nassau', 'Port-au-Prince', 'Saint John\'s', 'Georgetown'],
    description: 'Central Asia and Caribbean additions',
  },
  {
    week: '2024-W52',
    date: 'December 23-31, 2024',
    cities: ['Taranto', 'Bogotá', 'Medellín', 'Cartagena', 'Beijing', 'Bagan', 'Ulaanbaatar', 'Chengdu', 'Ushuaia'],
    description: 'South America and Asia expansion',
  },
  {
    week: '2024-W51',
    date: 'December 16-22, 2024',
    cities: ['Barcelona', 'Berlin', 'Belgrade', 'Paris', 'London', 'Rome', 'Amsterdam', 'Vienna', 'Prague'],
    description: 'Initial European collection',
  },
];

// Helper to get total cities added in last N weeks
export function getRecentAdditions(weeks: number = 4): ChangelogEntry[] {
  return changelog.slice(0, weeks);
}

// Helper to get total count of recently added cities
export function getRecentCityCount(weeks: number = 4): number {
  return getRecentAdditions(weeks).reduce((sum, entry) => sum + entry.cities.length, 0);
}
