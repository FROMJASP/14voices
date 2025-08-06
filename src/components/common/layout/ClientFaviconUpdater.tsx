'use client';

import { useDynamicBrowserFavicon } from '@/hooks/useFavicon';

export function ClientFaviconUpdater() {
  // Use the centralized hook for favicon management with cache-busting
  useDynamicBrowserFavicon();

  // This component doesn't need to render anything
  return null;
}
