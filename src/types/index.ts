// Raw icon data from JSON files (without svgContent)
export interface IconData {
  _id: string;
  name: string;
  city: string;
  country: string;
  category: string;
  tags: string[];
  svgFilename: string;
  description?: string;
  region: string;
}

// Full icon with SVG content (after server-side loading)
export interface Icon extends IconData {
  svgContent: string;
}

export interface IconModalProps {
  icon: Icon | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  allIcons?: Icon[];
}

export interface IconGridProps {
  icons: Icon[];
  onIconClick?: (icon: Icon) => void;
  loading?: boolean;
}

 