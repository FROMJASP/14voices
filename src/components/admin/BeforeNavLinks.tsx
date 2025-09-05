'use client';

import React, { useEffect, useState, Fragment } from 'react';
import Link from 'next/link';
import { SiteSetting } from '@/payload-types';
import NavIconsCSS from './NavIconsCSS';

const BeforeNavLinks: React.FC = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSetting | null>(null);

  // Fetch site settings
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        // Use the Payload API endpoint directly
        const response = await fetch(
          '/api/globals/site-settings?locale=nl&fallback-locale=en&depth=1&draft=false'
        );
        if (response.ok) {
          const data = await response.json();
          setSiteSettings(data);
        } else {
          // Try the custom endpoint as fallback
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

  if (!siteSettings?.branding) {
    return <NavIconsCSS />; // Load icons while waiting for settings
  }

  const { branding } = siteSettings;
  const isImageLogo = branding.logoType === 'image';

  return (
    <Fragment>
      <NavIconsCSS />
      <div className="nav-logo-container">
        <style>{`
        .nav-logo-link,
        .nav-logo-link:link,
        .nav-logo-link:visited,
        .nav-logo-link:hover,
        .nav-logo-link:active,
        .nav-logo-link:focus {
          text-decoration: none !important;
          color: inherit !important;
        }
      `}</style>
        <style jsx>{`
          .nav-logo-container {
            position: absolute;
            top: 1.25rem; /* Move down to align with collapse button */
            left: 0;
            right: 0;
            height: 60px;
            display: flex;
            align-items: flex-start; /* Align to top instead of center */
            justify-content: flex-end; /* Align to the right */
            padding: 0 1rem;
            z-index: 10;
          }

          .nav-logo-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none !important;
            transition: opacity 0.2s ease;
            margin-right: 3rem; /* Space for collapse button */
            margin-top: 0; /* Fine-tune vertical alignment */
          }

          .nav-logo-link:hover {
            opacity: 0.8;
            text-decoration: none !important;
          }

          .logo-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-decoration: none !important;
            display: block;
          }

          .logo-wrapper {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            text-align: right;
          }

          /* Global style to remove underline from this specific link */
          a.nav-logo-link,
          a.nav-logo-link:hover,
          a.nav-logo-link:focus,
          a.nav-logo-link:active {
            text-decoration: none !important;
          }

          /* Add padding to nav items to account for logo */
          .nav-logo-container ~ * {
            padding-top: 60px;
          }

          @media (max-width: 1024px) {
            .nav-logo-container {
              display: none;
            }
          }
        `}</style>

        <Link href="/" target="_blank" rel="noopener noreferrer" className="nav-logo-link">
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
                maxWidth: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          ) : (
            <div className="logo-wrapper">
              <div
                className="logo-text"
                style={{
                  fontFamily:
                    (branding as any).logoFont === 'bricolage-grotesque'
                      ? '"Bricolage Grotesque", sans-serif'
                      : (branding as any).logoFont === 'geist-mono'
                        ? '"Geist Mono", monospace'
                        : '"Instrument Serif", serif',
                  fontSize: '1.75rem',
                  fontWeight: (branding as any).logoFont === 'instrument-serif' ? 400 : 600,
                  color: 'var(--theme-text)',
                  lineHeight: '1.2',
                }}
              >
                {branding.logoText || 'FourteenVoices'}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--theme-text)',
                  opacity: 0.7,
                  marginTop: '-0.375rem',
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
    </Fragment>
  );
};

export default BeforeNavLinks;
