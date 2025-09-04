export interface Icon {
  _id: string;
  name: string;
  city: string;
  country: string;
  category: string;
  tags: string[];
  svgFilename: string;
  svgContent: string;
  description?: string;
  region: string;
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

 