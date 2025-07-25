'use client';

import { useState, useEffect } from 'react';

interface FaviconData {
  url: string;
  isCustom: boolean;
  isLoading: boolean;
}

export function useFavicon(): FaviconData {
  const [favicon, setFavicon] = useState<FaviconData>({
    url: '/favicon.svg',
    isCustom: false,
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchFavicon = async () => {
      try {
        // Add cache-busting timestamp to the API request
        const timestamp = Date.now();
        const response = await fetch(`/api/site-settings?t=${timestamp}`, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch site settings');
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response type');
        }

        const data = await response.json();

        if (isMounted) {
          if (data?.favicon?.url) {
            setFavicon({
              url: data.favicon.url,
              isCustom: true,
              isLoading: false,
            });
          } else {
            // No custom favicon, use default
            setFavicon({
              url: '/favicon.svg',
              isCustom: false,
              isLoading: false,
            });
          }
        }
      } catch {
        // On error, fall back to default favicon
        if (isMounted) {
          setFavicon({
            url: '/favicon.svg',
            isCustom: false,
            isLoading: false,
          });
        }
      }
    };

    fetchFavicon();

    return () => {
      isMounted = false;
    };
  }, []);

  return favicon;
}

// Hook for dynamically updating the browser favicon
export function useDynamicBrowserFavicon() {
  const { url, isLoading } = useFavicon();

  useEffect(() => {
    if (isLoading) return;

    // Update favicon by modifying existing elements instead of removing them
    const updateFavicons = () => {
      // Add cache-busting timestamp to the URL
      // Skip cache-busting for blob URLs and Vercel storage URLs as they're already unique
      const timestamp = Date.now();
      const cacheBustedUrl =
        url.startsWith('blob:') || url.includes('.vercel-storage.com')
          ? url
          : url.includes('?')
            ? `${url}&v=${timestamp}`
            : `${url}?v=${timestamp}`;

      // Find existing favicon elements
      const iconLinks = document.querySelectorAll<HTMLLinkElement>('link[rel*="icon"]');

      if (iconLinks.length > 0) {
        // Update existing favicon hrefs with cache-busted URL
        iconLinks.forEach((link) => {
          link.href = cacheBustedUrl;
        });
      } else {
        // Only create new elements if none exist
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = cacheBustedUrl;
        document.head.appendChild(link);
      }

      // Handle apple-touch-icon separately
      let appleIcon = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
      if (appleIcon) {
        appleIcon.href = cacheBustedUrl;
      } else {
        appleIcon = document.createElement('link');
        appleIcon.rel = 'apple-touch-icon';
        appleIcon.href = cacheBustedUrl;
        document.head.appendChild(appleIcon);
      }
    };

    // Use a small delay to ensure DOM is ready
    const timeoutId = setTimeout(updateFavicons, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };
  }, [url, isLoading]);
}
