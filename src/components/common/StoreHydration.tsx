'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores';

interface StoreHydrationProps {
  children: React.ReactNode;
}

export function StoreHydration({ children }: StoreHydrationProps) {
  // Hydrate theme store on mount
  useEffect(() => {
    // Apply initial theme
    const themeStore = useThemeStore.getState();
    themeStore.applyTheme();
  }, []);

  return <>{children}</>;
}
