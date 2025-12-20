// Icon data from JSON files - used for grid views (no SVG content embedded)
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

// Icon type alias - we no longer embed SVG content in pages
// SVG content is loaded on-demand only when needed (download/copy)
export type Icon = IconData;

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

 