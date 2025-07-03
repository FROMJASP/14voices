'use client';

import { useDynamicBrowserFavicon } from '@/hooks/useFavicon';

export function DynamicFavicon() {
  // Use the centralized hook for favicon management
  useDynamicBrowserFavicon();

  // This component doesn't need to render anything
  return null;
}

// Export default for compatibility
export default DynamicFavicon;
