'use client';

import { useEffect } from 'react';

export default function LocaleHider() {
  useEffect(() => {
    // Only hide locale switcher in navigation, not on account page
    const styleId = 'locale-hider-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* Hide the locale selector in the navigation/header only */
        nav .localizer,
        header .localizer,
        nav [class*='LocaleSelector'],
        header [class*='LocaleSelector'] {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return null;
}
