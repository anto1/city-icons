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
  createdAt: string;
  updatedAt: string;
}

export interface IconModalProps {
  icon: Icon | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export interface IconGridProps {
  icons: Icon[];
  onIconClick: (icon: Icon) => void;
  loading?: boolean;
}

export interface SanityIcon {
  _id: string;
  name: string;
  city: string;
  country: string;
  category: string;
  tags: string[];
  svgFilename: string;
  svgContent: string;
  description?: string;
  _createdAt: string;
  _updatedAt: string;
} 