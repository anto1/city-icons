import { IconData } from '@/types';

import asiaIcons from './icons/asia.json';
import middleEastIcons from './icons/middle-east.json';
import europeIcons from './icons/europe.json';
import southAmericaIcons from './icons/south-america.json';
import northAmericaIcons from './icons/north-america.json';
import africaIcons from './icons/africa.json';
import oceaniaIcons from './icons/oceania.json';
import centralAmericaIcons from './icons/central-america.json';

// Type the JSON imports
const typedAsiaIcons = asiaIcons as IconData[];
const typedMiddleEastIcons = middleEastIcons as IconData[];
const typedEuropeIcons = europeIcons as IconData[];
const typedSouthAmericaIcons = southAmericaIcons as IconData[];
const typedNorthAmericaIcons = northAmericaIcons as IconData[];
const typedAfricaIcons = africaIcons as IconData[];
const typedOceaniaIcons = oceaniaIcons as IconData[];
const typedCentralAmericaIcons = centralAmericaIcons as IconData[];

// Combine all icons from all regions
const iconData: IconData[] = [
  ...typedEuropeIcons,
  ...typedAsiaIcons,
  ...typedNorthAmericaIcons,
  ...typedSouthAmericaIcons,
  ...typedMiddleEastIcons,
  ...typedAfricaIcons,
  ...typedOceaniaIcons,
  ...typedCentralAmericaIcons,
];

export default iconData;
