'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { SiteSetting } from '@/payload-types';
import NavIconsCSS from './NavIconsCSS';

const BeforeNavLinks: React.FC = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSetting | null>(null);
  const [container, setContainer] = useState<Element | null>(null);

  // Fetch site settings
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await fetch(
          '/api/globals/site-settings?locale=nl&fallback-locale=en&depth=1&draft=false'
        );
        if (response.ok) {
          const data = await response.json();
          setSiteSettings(data);
        } else {
          const fallbackResponse = await fetch('/api/site-settings');
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            setSiteSettings(fallbackData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
      }
    };

    fetchSiteSettings();
  }, []);

  // Create container for logo
  useEffect(() => {
    const setupContainer = () => {
      const nav = document.querySelector('.nav');
      const existingContainer = document.getElementById('nav-logo-container');

      if (nav && !existingContainer) {
        // Create a container that sits above nav content
        const logoContainer = document.createElement('div');
        logoContainer.id = 'nav-logo-container';
        logoContainer.style.cssText = `
          position: absolute;
          top: 0;
          right: 0;
          width: 270px;
          height: 60px;
          z-index: 100;
          pointer-events: none;
        `;

        // Insert at the beginning of nav, not in wrapper
        nav.insertBefore(logoContainer, nav.firstChild);
        setContainer(logoContainer);
      }
    };

    // Try multiple times
    setupContainer();
    const timers = [100, 500, 1000].map((delay) => setTimeout(setupContainer, delay));

    // Update position when nav state changes
    const observer = new MutationObserver(() => {
      const nav = document.querySelector('.nav');
      const container = document.getElementById('nav-logo-container');
      if (nav && container) {
        // Keep the container positioned relative to the nav
        container.style.width = `${(nav as HTMLElement).offsetWidth}px`;
      }
    });

    const rootProvider = document.querySelector('.payload__root-provider');
    if (rootProvider) {
      observer.observe(rootProvider, {
        attributes: true,
        attributeFilter: ['data-nav-open'],
      });
    }

    return () => {
      timers.forEach(clearTimeout);
      observer.disconnect();
      const container = document.getElementById('nav-logo-container');
      if (container) container.remove();
    };
  }, []);

  if (!siteSettings?.branding || !container) {
    return <NavIconsCSS />;
  }

  const { branding } = siteSettings;
  const isImageLogo = branding.logoType === 'image';

  const logoContent = (
    <div
      style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        pointerEvents: 'auto',
      }}
    >
      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        {isImageLogo && branding.logoImage ? (
          <img
            src={
              typeof branding.logoImage === 'object' && branding.logoImage.url
                ? branding.logoImage.url
                : typeof branding.logoImage === 'string'
                  ? branding.logoImage
                  : ''
            }
            alt={siteSettings.siteName || 'Logo'}
            style={{
              maxHeight: '40px',
              maxWidth: '180px',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        ) : (
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily:
                  (branding as any).logoFont === 'bricolage-grotesque'
                    ? '"Bricolage Grotesque", sans-serif'
                    : (branding as any).logoFont === 'geist-mono'
                      ? '"Geist Mono", monospace'
                      : '"Instrument Serif", serif',
                fontSize: '1.5rem',
                fontWeight: (branding as any).logoFont === 'instrument-serif' ? 400 : 600,
                color: 'var(--theme-text)',
                lineHeight: '1.2',
              }}
            >
              {branding.logoText || 'FourteenVoices'}
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                color: 'var(--theme-text)',
                opacity: 0.7,
                marginTop: '-0.125rem',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 400,
                letterSpacing: '0.02em',
              }}
            >
              Admin Panel
            </div>
          </div>
        )}
      </Link>
    </div>
  );

  return (
    <>
      <NavIconsCSS />
      <style>{`
        @media (max-width: 768px) {
          #nav-logo-container {
            display: none !important;
          }
        }
      `}</style>
      {createPortal(logoContent, container)}
    </>
  );
};

export default BeforeNavLinks;
