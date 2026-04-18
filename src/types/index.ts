export interface Icon {
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

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  allIcons?: Icon[];
}

export interface IconGridProps {
  icons: Icon[];
  loading?: boolean;
}
