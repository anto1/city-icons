import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Icon } from '@/types';
import { findIconBySlugs, getIconUrl, slugify } from '@/lib/utils';

interface UseModalNavigationProps {
  icons: Icon[];
}

export function useModalNavigation({ icons }: UseModalNavigationProps) {
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Handle direct URL access on initial load
  useEffect(() => {
    if (!isInitialized && pathname !== '/') {
      const pathParts = pathname.split('/').filter(Boolean);
      if (pathParts.length === 3 && pathParts[1] === 'city') {
        // New format: /country/city/cityname
        const [countrySlug, , citySlug] = pathParts;
        const icon = findIconBySlugs(countrySlug, citySlug, icons);
        if (icon) {
          setSelectedIcon(icon);
          setModalOpen(true);
        }
      } else if (pathParts.length === 2) {
        // Old format: /country/cityname (for backward compatibility)
        const [countrySlug, citySlug] = pathParts;
        const icon = findIconBySlugs(countrySlug, citySlug, icons);
        if (icon) {
          setSelectedIcon(icon);
          setModalOpen(true);
        }
      }
      setIsInitialized(true);
    }
  }, [pathname, icons, isInitialized]);

  // Sync URL with modal state
  useEffect(() => {
    if (isInitialized) {
      if (modalOpen && selectedIcon) {
        const url = getIconUrl(selectedIcon);
        if (pathname !== url) {
          router.push(url, { scroll: false });
        }
      } else if (!modalOpen && pathname !== '/') {
        // Check if current pathname is a country page
        const pathParts = pathname.split('/').filter(Boolean);
        if (pathParts.length === 1) {
          // This might be a country page, check if it's valid
          const countrySlug = pathParts[0];
          const countryIcons = icons.filter(icon => slugify(icon.country) === countrySlug);
          if (countryIcons.length === 0) {
            // Not a valid country page, redirect to home
            router.push('/', { scroll: false });
          }
          // If it's a valid country page, don't redirect - stay on country page
        } else if (pathParts.length === 3 && pathParts[1] === 'city') {
          // This is an individual icon page, redirect to home when modal closes
          router.push('/', { scroll: false });
        } else {
          // Not a country page or icon page, redirect to home
          router.push('/', { scroll: false });
        }
      }
    }
  }, [modalOpen, selectedIcon, pathname, router, isInitialized, icons]);

  const handleIconClick = (icon: Icon) => {
    setSelectedIcon(icon);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedIcon(null);
  };

  return {
    selectedIcon,
    modalOpen,
    handleIconClick,
    handleCloseModal
  };
} 