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
    console.log('🚀 Home component mounted');
    const fetchIcons = async () => {
      try {
        console.log('📥 Starting to fetch icons...');
        setLoading(true);
        
        // Define icon data
        const iconData = [
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
            _id: '13',
            name: 'Miami Beach',
            city: 'Miami',
            country: 'USA',
            category: 'Culture',
            tags: ['beach', 'art deco', 'tropical'],
            svgFilename: 'miami.svg',
            description: 'Miami Beach is renowned for its Art Deco architecture, pristine beaches, and vibrant cultural scene. The iconic pastel-colored buildings along Ocean Drive and the tropical atmosphere make it a world-famous destination for tourists and locals alike.',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        ];

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

        console.log('✅ Sample icons loaded:', iconsWithSvg.length);
        setIcons(iconsWithSvg);
        setFilteredIcons(iconsWithSvg);
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
      setFilteredIcons(icons);
      return;
    }

    // Client-side filtering
    const filtered = icons.filter(icon =>
      icon.name.toLowerCase().includes(query.toLowerCase()) ||
      icon.city.toLowerCase().includes(query.toLowerCase()) ||
      icon.country.toLowerCase().includes(query.toLowerCase()) ||
      icon.category.toLowerCase().includes(query.toLowerCase()) ||
      icon.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    console.log('📊 Filtered results:', filtered.length);
    setFilteredIcons(filtered);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              City Icons Collection
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover beautiful line art icons representing cities around the world. 
              Search, preview, and download SVG icons for your projects.
            </p>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Icons Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {loading ? 'Loading icons...' : `${filteredIcons.length} icons found`}
          </h2>
          {!loading && filteredIcons.length > 0 && (
            <p className="text-muted-foreground">
              Click on any icon to view details and download options
            </p>
          )}
        </div>
        
        <IconGrid 
          icons={filteredIcons} 
          onIconClick={handleIconClick}
          loading={loading}
        />
      </div>

      {/* Modal */}
      <IconModal
        icon={selectedIcon}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
