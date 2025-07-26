import { createClient } from 'next-sanity';
import { SanityIcon } from '@/types';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Function to fetch SVG content from local file
export const fetchSvgFromFile = async (filename: string): Promise<string> => {
  try {
    const response = await fetch(`/icons/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch SVG: ${response.statusText}`);
    }
    const svgContent = await response.text();
    return svgContent;
  } catch (error) {
    console.error('Error fetching SVG from file:', error);
    return '';
  }
};

export const getIcons = async (): Promise<SanityIcon[]> => {
  const query = `*[_type == "icon"] {
    _id,
    name,
    city,
    country,
    category,
    tags,
    svgFilename,
    description,
    _createdAt,
    _updatedAt
  }`;
  
  const icons = await client.fetch(query);
  
  // Process icons to get SVG content from files
  const processedIcons = await Promise.all(
    icons.map(async (icon: SanityIcon) => {
      const svgContent = await fetchSvgFromFile(icon.svgFilename);
      
      return {
        ...icon,
        svgContent
      };
    })
  );
  
  return processedIcons;
};

export const searchIcons = async (searchTerm: string): Promise<SanityIcon[]> => {
  const query = `*[_type == "icon" && (
    name match "*${searchTerm}*" ||
    city match "*${searchTerm}*" ||
    country match "*${searchTerm}*" ||
    category match "*${searchTerm}*" ||
    tags[] match "*${searchTerm}*"
  )] {
    _id,
    name,
    city,
    country,
    category,
    tags,
    svgFilename,
    description,
    _createdAt,
    _updatedAt
  }`;
  
  const icons = await client.fetch(query);
  
  // Process icons to get SVG content from files
  const processedIcons = await Promise.all(
    icons.map(async (icon: SanityIcon) => {
      const svgContent = await fetchSvgFromFile(icon.svgFilename);
      
      return {
        ...icon,
        svgContent
      };
    })
  );
  
  return processedIcons;
};

export const getIconById = async (id: string): Promise<SanityIcon | null> => {
  const query = `*[_type == "icon" && _id == $id][0] {
    _id,
    name,
    city,
    country,
    category,
    tags,
    svgFilename,
    description,
    _createdAt,
    _updatedAt
  }`;
  
  const icon = await client.fetch(query, { id });
  
  if (!icon) return null;
  
  const svgContent = await fetchSvgFromFile(icon.svgFilename);
  
  return {
    ...icon,
    svgContent
  };
}; 