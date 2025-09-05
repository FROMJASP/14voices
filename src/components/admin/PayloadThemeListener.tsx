'use client';

import { useEffect } from 'react';

/**
 * Component that listens for Payload theme changes and provides
 * a way for custom components to react to theme switches
 */
export function PayloadThemeListener() {
  useEffect(() => {
    // Function to detect current Payload theme
    const detectPayloadTheme = () => {
      // Check multiple possible locations where Payload might indicate theme
      const body = document.body;
      const html = document.documentElement;

      // Check for Payload's theme indicators
      const isDark =
        // Check body classes
        body.classList.contains('payload-theme--dark') ||
        body.classList.contains('payload-theme-dark') ||
        body.classList.contains('theme--dark') ||
        body.classList.contains('theme-dark') ||
        // Check html classes
        html.classList.contains('payload-theme--dark') ||
        html.classList.contains('payload-theme-dark') ||
        html.classList.contains('theme--dark') ||
        html.classList.contains('theme-dark') ||
        // Check data attributes
        body.getAttribute('data-theme') === 'dark' ||
        html.getAttribute('data-theme') === 'dark' ||
        // Check for Payload's root container
        document.querySelector('.payload__root-container[data-theme="dark"]') !== null ||
        document.querySelector('[data-theme="dark"]') !== null;

      // Dispatch custom event with theme info
      window.dispatchEvent(
        new CustomEvent('payload-theme-change', {
          detail: { theme: isDark ? 'dark' : 'light' },
        })
      );

      // Set CSS variables for icon filtering
      if (isDark) {
        document.documentElement.style.setProperty('--payload-icon-filter', 'invert(1)');
        document.documentElement.style.setProperty('--payload-theme', 'dark');
      } else {
        document.documentElement.style.setProperty('--payload-icon-filter', 'none');
        document.documentElement.style.setProperty('--payload-theme', 'light');
      }

      return isDark ? 'dark' : 'light';
    };

    // Initial detection
    detectPayloadTheme();

    // Create observer for theme changes
    const observer = new MutationObserver((mutations) => {
      // Check if any mutation might be theme-related
      const themeRelated = mutations.some((mutation) => {
        if (mutation.type === 'attributes') {
          const attrName = mutation.attributeName;
          return attrName === 'class' || attrName === 'data-theme';
        }
        return false;
      });

      if (themeRelated) {
        detectPayloadTheme();
      }
    });

    // Observe multiple elements for theme changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    // Also listen for localStorage changes (Payload might store theme there)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && (e.key.includes('theme') || e.key.includes('payload'))) {
        setTimeout(detectPayloadTheme, 100);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen for clicks on theme toggle elements
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      // Check if this might be a theme toggle button
      if (
        target.closest('[aria-label*="theme"]') ||
        target.closest('[title*="theme"]') ||
        target.closest('button')?.textContent?.toLowerCase().includes('theme')
      ) {
        setTimeout(detectPayloadTheme, 200);
      }
    };

    document.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null;
}

export default PayloadThemeListener;
