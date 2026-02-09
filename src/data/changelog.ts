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
  {
    week: '2024-W50',
    date: 'December 9-15, 2024',
    cities: ['Cairo', 'Antananarivo', 'Casablanca', 'Lagos', 'Marrakesh', 'Cape Town', 'Benghazi', 'Fez', 'Lalibela', 'Dakar', 'Nairobi'],
    description: 'African cities collection',
  },
  {
    week: '2024-W49',
    date: 'December 2-8, 2024',
    cities: ['Istanbul', 'Jerusalem', 'Tehran', 'Dubai', 'Baku', 'Tbilisi', 'Yerevan', 'Tel Aviv', 'Beirut', 'Doha', 'Amman', 'Muscat', 'Ankara', 'Riyadh', 'Abu Dhabi', 'Manama', 'Kuwait City', 'Isfahan', 'Izmir', 'Mashhad', 'Batumi', 'Samarra', 'Haifa'],
    description: 'Middle East and Caucasus collection',
  },
  {
    week: '2024-W48',
    date: 'November 25 - December 1, 2024',
    cities: ['Tokyo', 'Seoul', 'Shanghai', 'Delhi', 'Kyoto', 'Manila', 'Hanoi', 'Dhaka', 'Kathmandu', 'Almaty', 'Denpasar', 'Karachi', 'Agra', 'Tashkent', 'Cebu', 'Islamabad', 'Bishkek', 'Luang Prabang'],
    description: 'East and South Asia collection',
  },
  {
    week: '2024-W47',
    date: 'November 18-24, 2024',
    cities: ['Yakutsk', 'Astana', 'Kostanay', 'Uralsk', 'Schuchinsk', 'Jingzhou', 'Leshan', 'Sentosa', 'Shirakawa-go', 'Pattaya'],
    description: 'Central Asia and East Asia expansion',
  },
  {
    week: '2024-W46',
    date: 'November 11-17, 2024',
    cities: ['Madrid', 'Lisbon', 'Copenhagen', 'Stockholm', 'Brussels', 'Warsaw', 'Dublin', 'Helsinki', 'Oslo', 'Athens', 'Edinburgh', 'Milan', 'Venice', 'Munich', 'Hamburg', 'Budapest', 'Porto', 'Lyon', 'Reykjavik'],
    description: 'Major European capitals',
  },
  {
    week: '2024-W45',
    date: 'November 4-10, 2024',
    cities: ['Frankfurt', 'Bremen', 'Leipzig', 'Nuremberg', 'Graz', 'Ljubljana', 'Riga', 'Manchester', 'Leeds', 'Valencia', 'Sorrento', 'Ferrara', 'Trieste', 'Bruges', 'Kuopio', 'Limassol', 'Matosinhos', 'Chisinau'],
    description: 'European cities expansion',
  },
  {
    week: '2024-W44',
    date: 'October 28 - November 3, 2024',
    cities: ['Kyiv', 'Minsk', 'Skopje', 'Mostar', 'Murmansk', 'Moscow', 'Akureyri', 'Forte dei Marmi', 'Santiago de Compostela', 'Palermo', 'Bern', 'Sarajevo', 'Bratislava', 'Monaco', 'San Marino', 'Zagreb'],
    description: 'Eastern and Southern Europe',
  },
  {
    week: '2024-W43',
    date: 'October 21-27, 2024',
    cities: ['Nicosia', 'Vatican City', 'Andorra la Vella', 'Vaduz', 'Pristina', 'Sofia', 'Tirana', 'Valletta', 'Luxembourg', 'Bucharest', 'Tallinn', 'Podgorica', 'Vilnius', 'Gijón', 'Málaga', 'Córdoba', 'Granada'],
    description: 'Small European states and Iberian cities',
  },
  {
    week: '2024-W42',
    date: 'October 14-20, 2024',
    cities: ['Viana do Castelo', 'Vigo', 'Chaves', 'Coruña', 'Vila Real', 'Guimarães', 'Leiria', 'Braga', 'Amadora', 'Nazaré', 'Tula', 'Siegen', 'Erfurt', 'Montpellier', 'Bielefeld', 'Wrocław', 'Poznań'],
    description: 'Portuguese and German cities',
  },
  {
    week: '2024-W41',
    date: 'October 7-13, 2024',
    cities: ['Budva', 'Świebodzin', 'Hallstatt', 'Paphos', 'Freiburg', 'Giessen', 'Herceg Novi', 'Szeged', 'Debrecen', 'Woerden', 'Maastricht', 'Rotterdam', 'De Meije', 'Odessa'],
    description: 'Central European and Dutch cities',
  },
  {
    week: '2024-W40',
    date: 'September 30 - October 6, 2024',
    cities: ['Sydney', 'Wellington', 'Melbourne', 'Perth', 'Canberra', 'Hobart', 'Noumea', 'Port Vila', 'Tarawa', 'Apia', 'Suva'],
    description: 'Oceania collection',
  },
  {
    week: '2024-W39',
    date: 'September 23-29, 2024',
    cities: ['New York', 'Chicago', 'Los Angeles', 'San Francisco', 'Miami', 'Toronto', 'Vancouver', 'Ottawa', 'Seattle', 'Boston', 'Philadelphia', 'Denver', 'Atlanta', 'San Diego', 'Austin', 'Phoenix'],
    description: 'Major North American cities',
  },
  {
    week: '2024-W38',
    date: 'September 16-22, 2024',
    cities: ['Washington', 'Pittsburgh', 'Columbus', 'Guadalajara', 'Tijuana', 'Panama City', 'Irvine', 'Cincinnati', 'Peoria', 'Sacramento', 'Hartford', 'St. Louis', 'New Orleans', 'Albuquerque'],
    description: 'North American expansion',
  },
  {
    week: '2024-W37',
    date: 'September 9-15, 2024',
    cities: ['Havana', 'Tegucigalpa', 'San Salvador', 'San Ignacio', 'Antigua', 'Alajuela'],
    description: 'Central American collection',
  },
  {
    week: '2024-W36',
    date: 'September 2-8, 2024',
    cities: ['Buenos Aires', 'Rio de Janeiro', 'São Paulo', 'Santiago', 'Lima', 'Cusco', 'Brasilia', 'Montevideo', 'Córdoba'],
    description: 'South American collection',
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
