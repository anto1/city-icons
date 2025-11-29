import asiaIcons from './icons/asia.json';
import middleEastIcons from './icons/middle-east.json';
import europeIcons from './icons/europe.json';
import southAmericaIcons from './icons/south-america.json';
import northAmericaIcons from './icons/north-america.json';
import africaIcons from './icons/africa.json';
import oceaniaIcons from './icons/oceania.json';
import centralAmericaIcons from './icons/central-america.json';

// Combine all icons from all regions
const iconData = [
  ...europeIcons,
  ...asiaIcons,
  ...northAmericaIcons,
  ...southAmericaIcons,
  ...middleEastIcons,
  ...africaIcons,
  ...oceaniaIcons,
  ...centralAmericaIcons,
];

export default iconData;
