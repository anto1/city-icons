'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import IconGrid from '@/components/IconGrid';
import IconModal from '@/components/IconModal';
import { Icon } from '@/types';

// Function to fetch SVG content from file
const fetchSvgContent = async (filename: string): Promise<string> => {
  try {
    const response = await fetch(`/icons/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch SVG: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching SVG:', error);
    // Fallback to a simple placeholder
    return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/></svg>';
  }
};

export default function Home() {
  const [icons, setIcons] = useState<Icon[]>([]);
  const [filteredIcons, setFilteredIcons] = useState<Icon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        console.log('📥 Starting to fetch icons...');
        setLoading(true);
        
        // Define icon data - already in alphabetical order
        const iconData = [
          {
            _id: '15',
            name: 'Barcelona Sagrada Familia',
            city: 'Barcelona',
            country: 'Spain',
            category: 'Landmarks',
            tags: ['church', 'gothic', 'modernist'],
            svgFilename: 'barcelona.svg',
            description: 'Barcelona is the capital of Catalonia, known for its unique architecture including the iconic Sagrada Familia by Antoni Gaudí. The city combines Mediterranean charm with innovative design, making it a cultural and architectural treasure.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '24',
            name: 'Batumi Seaside',
            city: 'Batumi',
            country: 'Georgia',
            category: 'Culture',
            tags: ['seaside', 'modern', 'architecture'],
            svgFilename: 'batumi.svg',
            description: 'Batumi is a coastal city in Georgia, known for its beautiful Black Sea beaches, modern architecture, and the iconic Alphabet Tower. The city combines traditional Georgian culture with contemporary development.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '4',
            name: 'Berlin Brandenburg Gate',
            city: 'Berlin',
            country: 'Germany',
            category: 'Landmarks',
            tags: ['gate', 'historic', 'neoclassical'],
            svgFilename: 'berlin.svg',
            description: 'The Brandenburg Gate is an 18th-century neoclassical monument in Berlin, built on the site of a former city gate that marked the start of the road from Berlin to the town of Brandenburg an der Havel. It has become a symbol of German unity and peace.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '23',
            name: 'Bremen Historic Center',
            city: 'Bremen',
            country: 'Germany',
            category: 'Culture',
            tags: ['historic', 'medieval', 'architecture'],
            svgFilename: 'bremen.svg',
            description: 'Bremen is a major city in northern Germany, known for its historic market square, the Bremen Town Musicians statue, and medieval architecture. The city has a rich maritime history and cultural heritage.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '12',
            name: 'Chicago Skyline',
            city: 'Chicago',
            country: 'USA',
            category: 'Buildings',
            tags: ['skyscrapers', 'modern', 'urban'],
            svgFilename: 'chicago.svg',
            description: 'The Chicago skyline is world-famous for its innovative architecture and towering skyscrapers. Home to the Willis Tower, John Hancock Center, and other architectural marvels, Chicago\'s skyline represents the birthplace of modern skyscraper design.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '26',
            name: 'Chisinau Government',
            city: 'Chisinau',
            country: 'Moldova',
            category: 'Buildings',
            tags: ['government', 'modern', 'architecture'],
            svgFilename: 'chisinau.svg',
            description: 'Chisinau is the capital and largest city of Moldova, known for its Soviet-era architecture, the Presidential Palace, and the beautiful Central Park. The city reflects the country\'s complex history and cultural diversity.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '27',
            name: 'Copenhagen Harbor',
            city: 'Copenhagen',
            country: 'Denmark',
            category: 'Culture',
            tags: ['harbor', 'modern', 'scandinavian'],
            svgFilename: 'copenhagen.svg',
            description: 'Copenhagen is the capital and largest city of Denmark, known for its beautiful harbor, the iconic Little Mermaid statue, and the colorful Nyhavn district. The city combines historic charm with modern Scandinavian design and sustainable urban planning.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '5',
            name: 'Kuopio Tower',
            city: 'Kuopio',
            country: 'Finland',
            category: 'Landmarks',
            tags: ['tower', 'observation', 'modern'],
            svgFilename: 'kuopio.svg',
            description: 'The Kuopio Tower is a 75-meter high observation tower located on Puijo Hill in Kuopio, Finland. Built in 1963, it offers panoramic views of the city and surrounding lakes. The tower features a revolving restaurant and is a popular tourist attraction.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '16',
            name: 'Leipzig Modern City',
            city: 'Leipzig',
            country: 'Germany',
            category: 'Buildings',
            tags: ['modern', 'architecture', 'urban'],
            svgFilename: 'liepzig.svg',
            description: 'Leipzig is a major city in Saxony, Germany, known for its rich cultural heritage and modern development. The city combines historic architecture with contemporary design, featuring the Leipzig Opera House and numerous museums.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '9',
            name: 'Limassol Castle',
            city: 'Limassol',
            country: 'Cyprus',
            category: 'Landmarks',
            tags: ['castle', 'fortress', 'medieval'],
            svgFilename: 'limassol.svg',
            description: 'Limassol Castle is a medieval castle located near the old harbor in the heart of the historical center of Limassol. Built in the 12th century, it has served as a fortress, prison, and now houses the Medieval Museum of Cyprus.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '25',
            name: 'London Big Ben',
            city: 'London',
            country: 'UK',
            category: 'Landmarks',
            tags: ['clock', 'historic', 'iconic'],
            svgFilename: 'london.svg',
            description: 'London is the capital of England and the United Kingdom, known for its rich history, iconic landmarks like Big Ben and the Tower Bridge, and world-class museums. The city is a global center for finance and culture.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '20',
            name: 'Madrid Royal Palace',
            city: 'Madrid',
            country: 'Spain',
            category: 'Landmarks',
            tags: ['palace', 'royal', 'historic'],
            svgFilename: 'madrid.svg',
            description: 'Madrid, the capital of Spain, is a vibrant city known for its rich cultural heritage, the Royal Palace, and world-class museums like the Prado. The city combines historic grandeur with modern Spanish culture.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '31',
            name: 'Erevan Republic Square',
            city: 'Erevan',
            country: 'Armenia',
            category: 'Landmarks',
            tags: ['square', 'historic', 'government'],
            svgFilename: 'erevan.svg',
            description: 'Erevan is the capital and largest city of Armenia, known for its beautiful Republic Square, the Cascade complex, and the historic Matenadaran library. The city combines ancient Armenian heritage with modern urban development and serves as the cultural heart of Armenia.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '13',
            name: 'Miami Beach',
            city: 'Miami',
            country: 'USA',
            category: 'Culture',
            tags: ['beach', 'modern', 'tropical'],
            svgFilename: 'miami.svg',
            description: 'Miami is a vibrant coastal city known for its beautiful beaches, Art Deco architecture in South Beach, and diverse cultural scene. The city combines tropical climate with modern urban development and international influences.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '28',
            name: 'Milan Cathedral',
            city: 'Milan',
            country: 'Italy',
            category: 'Landmarks',
            tags: ['cathedral', 'gothic', 'historic'],
            svgFilename: 'milan.svg',
            description: 'Milan is the capital of Lombardy and Italy\'s second-largest city, known for its fashion industry, the magnificent Duomo di Milano, and the historic La Scala opera house. The city combines rich cultural heritage with modern Italian design and innovation.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '21',
            name: 'New York Skyline',
            city: 'New York',
            country: 'USA',
            category: 'Buildings',
            tags: ['skyscrapers', 'modern', 'urban'],
            svgFilename: 'new-york.svg',
            description: 'New York City is the most populous city in the United States, known for its iconic skyline featuring the Empire State Building, Statue of Liberty, and Times Square. The city is a global center for finance, culture, and innovation.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '29',
            name: 'Toronto CN Tower',
            city: 'Toronto',
            country: 'Canada',
            category: 'Landmarks',
            tags: ['tower', 'modern', 'iconic'],
            svgFilename: 'toronto.svg',
            description: 'Toronto is the capital of Ontario and Canada\'s largest city, known for its iconic CN Tower - the tallest freestanding structure in the Western Hemisphere. The city combines modern urban development with natural beauty along Lake Ontario, featuring a diverse multicultural population and vibrant arts scene.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '3',
            name: 'Paris Eiffel Tower',
            city: 'Paris',
            country: 'France',
            category: 'Landmarks',
            tags: ['tower', 'romance', 'architecture'],
            svgFilename: 'paris.svg',
            description: 'The iconic Eiffel Tower, a wrought-iron lattice tower located on the Champ de Mars in Paris. Built in 1889, it stands 324 meters tall and has become a global cultural icon of France and one of the most recognizable structures in the world.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '11',
            name: 'Porto Historic Center',
            city: 'Porto',
            country: 'Portugal',
            category: 'Culture',
            tags: ['historic', 'riverside', 'medieval'],
            svgFilename: 'porto.svg',
            description: 'Porto\'s Historic Center is a UNESCO World Heritage site featuring medieval architecture, colorful houses, and the iconic Dom Luís I Bridge. The city is famous for its port wine cellars and the beautiful Ribeira district along the Douro River.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '19',
            name: 'Prague Castle',
            city: 'Prague',
            country: 'Czech Republic',
            category: 'Landmarks',
            tags: ['castle', 'historic', 'medieval'],
            svgFilename: 'prague.svg',
            description: 'Prague, the capital of the Czech Republic, is known for its stunning medieval architecture, the iconic Prague Castle, and the historic Charles Bridge. The city\'s Old Town Square is a masterpiece of Gothic and Baroque architecture.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '18',
            name: 'Riga Historic Center',
            city: 'Riga',
            country: 'Latvia',
            category: 'Culture',
            tags: ['historic', 'architecture', 'medieval'],
            svgFilename: 'riga.svg',
            description: 'Riga is the capital and largest city of Latvia, known for its well-preserved medieval Old Town and Art Nouveau architecture. The city\'s historic center is a UNESCO World Heritage site.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '22',
            name: 'Seoul Modern City',
            city: 'Seoul',
            country: 'South Korea',
            category: 'Buildings',
            tags: ['modern', 'technology', 'urban'],
            svgFilename: 'seoul.svg',
            description: 'Seoul is the capital and largest city of South Korea, known for its cutting-edge technology, modern architecture, and rich cultural heritage. The city seamlessly blends ancient palaces with futuristic skyscrapers.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '17',
            name: 'Stockholm Royal Palace',
            city: 'Stockholm',
            country: 'Sweden',
            category: 'Landmarks',
            tags: ['palace', 'royal', 'historic'],
            svgFilename: 'stockholm.svg',
            description: 'Stockholm, the capital of Sweden, is built on 14 islands connected by bridges. The city is known for its beautiful architecture, the Royal Palace, and the historic Gamla Stan (Old Town) with its medieval streets.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '14',
            name: 'Tel Aviv Modern City',
            city: 'Tel Aviv',
            country: 'Israel',
            category: 'Buildings',
            tags: ['modern', 'architecture', 'urban'],
            svgFilename: 'tel-aviv.svg',
            description: 'Tel Aviv is known for its stunning modern architecture, particularly the White City with its Bauhaus buildings. The city combines Mediterranean charm with cutting-edge design, making it a hub for innovation and culture.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '10',
            name: 'Tbilisi Old Town',
            city: 'Tbilisi',
            country: 'Georgia',
            category: 'Culture',
            tags: ['historic', 'architecture', 'traditional'],
            svgFilename: 'tbilisi.svg',
            description: 'Tbilisi Old Town is the historic heart of Georgia\'s capital, featuring narrow cobblestone streets, traditional Georgian architecture, and the iconic Narikala Fortress. This UNESCO World Heritage site showcases the city\'s rich cultural heritage and ancient history.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '30',
            name: 'Uralsk Historic Center',
            city: 'Uralsk',
            country: 'Kazakhstan',
            category: 'Culture',
            tags: ['historic', 'riverside', 'traditional'],
            svgFilename: 'uralsk.svg',
            description: 'Uralsk is a historic city in western Kazakhstan, located on the Ural River. Known for its traditional Kazakh culture, horse breeding heritage, and beautiful riverfront, the city preserves its rich nomadic traditions while embracing modern development. The horse symbolizes the region\'s deep connection to Central Asian nomadic culture.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '6',
            name: 'Valencia Modern Buildings',
            city: 'Valencia',
            country: 'Spain',
            category: 'Buildings',
            tags: ['modern', 'architecture', 'abstract'],
            svgFilename: 'valencia.svg',
            description: 'The City of Arts and Sciences in Valencia is a stunning complex of futuristic buildings designed by Santiago Calatrava. This architectural marvel includes an opera house, science museum, planetarium, and aquarium, showcasing innovative modern design.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '8',
            name: 'Vienna St. Stephen\'s Cathedral',
            city: 'Vienna',
            country: 'Austria',
            category: 'Landmarks',
            tags: ['cathedral', 'gothic', 'historic'],
            svgFilename: 'vienna.svg',
            description: 'St. Stephen\'s Cathedral is the mother church of the Roman Catholic Archdiocese of Vienna and the seat of the Archbishop of Vienna. This magnificent Gothic cathedral, with its distinctive tiled roof, has stood at the heart of Vienna for over 700 years.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
          {
            _id: '7',
            name: 'Warsaw Mermaid',
            city: 'Warsaw',
            country: 'Poland',
            category: 'Culture',
            tags: ['mermaid', 'mythology', 'symbol'],
            svgFilename: 'warsaw.svg',
            description: 'The Warsaw Mermaid is the official symbol of Warsaw, Poland. According to legend, a mermaid swam from the Baltic Sea to Warsaw and decided to stay, protecting the city. The statue shows her with a sword and shield, ready to defend the city.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        ];

        console.log('📋 Original iconData order:', iconData.map(icon => icon.city));
        console.log('🔄 Starting to fetch SVG content...');

        // Fetch SVG content for each icon
        const iconsWithSvg = await Promise.all(
          iconData.map(async (icon) => {
            const svgContent = await fetchSvgContent(icon.svgFilename);
            return {
              ...icon,
              svgContent
            };
          })
        );

        console.log('🔄 Icons with SVG loaded:', iconsWithSvg.length);

        // Ensure perfect alphabetical order - the data is already sorted, but double-check
        const sortedIcons = [...iconsWithSvg].sort((a, b) => {
          const result = a.city.localeCompare(b.city, 'en', { sensitivity: 'base' });
          return result;
        });
        
        console.log('✅ Final sorted icons order:', sortedIcons.map(icon => icon.city));
        console.log('✅ Sample icons loaded:', sortedIcons.length);
        
        setIcons(sortedIcons);
        setFilteredIcons(sortedIcons);
      } catch (error) {
        console.error('❌ Error loading icons:', error);
      } finally {
        console.log('🏁 Loading complete');
        setLoading(false);
      }
    };

    fetchIcons();
  }, []);

  const handleSearch = async (query: string) => {
    console.log('🔍 Searching for:', query);
    if (!query.trim()) {
      console.log('🔄 No query, showing all icons in order');
      setFilteredIcons(icons);
      return;
    }

    // Client-side filtering with alphabetical order maintained
    const filtered = icons.filter(icon =>
      icon.name.toLowerCase().includes(query.toLowerCase()) ||
      icon.city.toLowerCase().includes(query.toLowerCase()) ||
      icon.country.toLowerCase().includes(query.toLowerCase()) ||
      icon.category.toLowerCase().includes(query.toLowerCase()) ||
      icon.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    console.log('🔍 Filtered results before sorting:', filtered.map(icon => icon.city));
    
    // Sort filtered results alphabetically by city name
    const sortedFiltered = filtered.sort((a, b) => a.city.localeCompare(b.city));
    
    console.log('✅ Filtered results after sorting:', sortedFiltered.map(icon => icon.city));
    console.log('📊 Filtered results count:', sortedFiltered.length);
    setFilteredIcons(sortedFiltered);
  };

  const handleIconClick = (icon: Icon) => {
    console.log('🖱️ Icon clicked:', icon.name);
    setSelectedIcon(icon);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('❌ Modal closed');
    setModalOpen(false);
    setSelectedIcon(null);
  };

  console.log('🎨 Rendering Home component');
  console.log('📊 Current filteredIcons count:', filteredIcons.length);
  console.log('📋 Current filteredIcons order:', filteredIcons.map(icon => icon.city));

  return (
    <div className="min-h-screen bg-background">
      {/* Random Icons Header */}
      <div className="flex justify-center items-center gap-8 py-16">
        {icons
          .slice(0, 3)
          .map((icon) => (
          <div
            key={icon._id}
            className="w-14 h-14 text-foreground"
            dangerouslySetInnerHTML={{
              __html: icon.svgContent
                .replace(/width="[^"]*"/, 'width="56"')
                .replace(/height="[^"]*"/, 'height="56"')
                .replace(/viewBox="[^"]*"/, 'viewBox="0 0 120 120"')
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            City Icons Collection
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover beautiful line art icons representing cities around the world
          </p>
        </div>
        <SearchBar onSearch={handleSearch} />
        
        <div className="mt-12">
          <IconGrid 
            icons={filteredIcons} 
            loading={loading} 
            onIconClick={handleIconClick} 
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-foreground">
            © Studio Partdirector, 2025 • {icons.length} icons
          </p>
        </div>
      </footer>

      <IconModal 
        icon={selectedIcon} 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}
