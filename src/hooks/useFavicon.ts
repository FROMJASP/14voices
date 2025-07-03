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
        const response = await fetch('/api/globals/site-settings', {
          headers: {
            'Content-Type': 'application/json',
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
      // Find existing favicon elements
      const iconLinks = document.querySelectorAll<HTMLLinkElement>('link[rel*="icon"]');

      if (iconLinks.length > 0) {
        // Update existing favicon hrefs
        iconLinks.forEach((link) => {
          link.href = url;
        });
      } else {
        // Only create new elements if none exist
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = url;
        document.head.appendChild(link);
      }

      // Handle apple-touch-icon separately
      let appleIcon = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
      if (appleIcon) {
        appleIcon.href = url;
      } else {
        appleIcon = document.createElement('link');
        appleIcon.rel = 'apple-touch-icon';
        appleIcon.href = url;
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
