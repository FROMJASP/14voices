'use client';

import { useEffect } from 'react';
import { useAuth, useTheme } from '@payloadcms/ui';

export default function ThemeApplier() {
  // Get hooks directly in component body
  let user = null;
  let setTheme: ((theme: 'light' | 'dark') => void) | null = null;

  try {
    const auth = useAuth();
    user = auth.user;
  } catch (err) {
    console.debug('ThemeApplier: useAuth hook not available');
  }

  try {
    const theme = useTheme();
    setTheme = theme.setTheme;
  } catch (err) {
    console.debug('ThemeApplier: useTheme hook not available');
  }

  // Apply theme when user preference changes
  useEffect(() => {
    if (!user?.adminTheme || !setTheme) return;

    const applyTheme = (themeValue: string) => {
      if (themeValue === 'auto') {
        // Use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      } else if (themeValue === 'light' || themeValue === 'dark') {
        // Apply specific theme using Payload's setTheme
        setTheme(themeValue as 'light' | 'dark');
      }

      // Store in localStorage for persistence
      localStorage.setItem('payload-theme', themeValue);
    };

    // Apply theme immediately
    applyTheme(user.adminTheme);
  }, [user?.adminTheme, setTheme]);

  // Watch for changes in the theme radio buttons
  useEffect(() => {
    if (!setTheme) return;

    const handleThemeChange = () => {
      // Find all theme radio inputs
      const themeRadios = document.querySelectorAll('input[name="adminTheme"]');

      themeRadios.forEach((radio) => {
        const inputElement = radio as HTMLInputElement;

        // Remove any existing listeners to avoid duplicates
        const newRadio = inputElement.cloneNode(true) as HTMLInputElement;
        inputElement.parentNode?.replaceChild(newRadio, inputElement);

        // Add change listener
        newRadio.addEventListener('change', (e) => {
          const target = e.target as HTMLInputElement;
          if (target.checked) {
            const themeValue = target.value;

            if (themeValue === 'auto') {
              // Use system preference
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              setTheme(prefersDark ? 'dark' : 'light');
            } else if (themeValue === 'light' || themeValue === 'dark') {
              // Apply specific theme
              setTheme(themeValue as 'light' | 'dark');
            }

            // Store in localStorage
            localStorage.setItem('payload-theme', themeValue);
          }
        });
      });
    };

    // Initial setup
    handleThemeChange();

    // Watch for DOM changes (when navigating to account page)
    const observer = new MutationObserver(() => {
      const radios = document.querySelectorAll('input[name="adminTheme"]');
      if (radios.length > 0) {
        handleThemeChange();
      }
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [setTheme]);

  // Apply saved theme on mount
  useEffect(() => {
    if (!setTheme) return;

    const savedTheme = localStorage.getItem('payload-theme');

    if (savedTheme) {
      if (savedTheme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      } else if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme as 'light' | 'dark');
      }
    } else if (user?.adminTheme) {
      // Use user preference if no saved theme
      if (user.adminTheme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      } else if (user.adminTheme === 'light' || user.adminTheme === 'dark') {
        setTheme(user.adminTheme as 'light' | 'dark');
      }
    }
  }, [setTheme, user?.adminTheme]);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (!setTheme) return;

    const savedTheme = localStorage.getItem('payload-theme') || user?.adminTheme;

    if (savedTheme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleSystemThemeChange);

      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    }

    return undefined;
  }, [user?.adminTheme, setTheme]);

  return null;
}
