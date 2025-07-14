'use client';

import React from 'react';
import { useFormFields } from '@payloadcms/ui';

export const BannerPreviewFixed: React.FC = () => {
  // Get the form fields
  const fields = useFormFields(([fields]) => fields);

  // Extract banner data from form fields
  const banner =
    (fields?.bannerSettings?.value as {
      enabled?: boolean;
      message?: string;
      linkText?: string;
      linkType?: string;
      linkUrl?: string;
      linkPage?: unknown;
      dismissible?: boolean;
      style?: 'gradient' | 'solid' | 'subtle';
    }) || {};

  const bannerStyles = {
    gradient: {
      background:
        'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 25%, #6BCF7F 50%, #4ECDC4 75%, #FF6B6B 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite',
      color: '#000',
    },
    solid: {
      background: '#FF6B6B',
      color: '#fff',
    },
    subtle: {
      background: '#f3f4f6',
      color: '#000',
    },
  };

  const currentStyle = bannerStyles[banner.style || 'gradient'];

  // Parse message with **text** pattern
  const formattedMessage = (banner.message || '').replace(
    /\*\*(.*?)\*\*/g,
    '<span style="color: #FF6B35; font-style: italic;">$1</span>'
  );

  const previewHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .banner {
            ${Object.entries(currentStyle)
              .map(([key, value]) => `${key}: ${value};`)
              .join(' ')}
            padding: 12px 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            position: relative;
          }
          
          .banner-content {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .banner-link {
            color: inherit;
            text-decoration: none;
            padding: 4px 12px;
            border: 1px solid currentColor;
            border-radius: 4px;
            transition: all 0.2s;
          }
          
          .banner-link:hover {
            background: rgba(0, 0, 0, 0.1);
          }
          
          .dismiss {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            opacity: 0.6;
            transition: opacity 0.2s;
          }
          
          .dismiss:hover {
            opacity: 1;
          }
          
          .page-content {
            padding: 40px;
            text-align: center;
            color: #666;
          }
        </style>
      </head>
      <body>
        ${
          banner?.enabled
            ? `
          <div class="banner">
            <div class="banner-content">
              <span>${formattedMessage}</span>
              ${banner.linkText ? `<a href="#" class="banner-link">${banner.linkText}</a>` : ''}
            </div>
            ${
              banner.dismissible
                ? `
              <button class="dismiss">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            `
                : ''
            }
          </div>
        `
            : ''
        }
        <div class="page-content">
          <p>Page content</p>
        </div>
      </body>
    </html>
  `;

  return (
    <div className="field-type">
      <div className="field-label">
        <label>Live Banner Preview</label>
      </div>
      <div className="field">
        <div
          style={{
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 'var(--style-radius-m)',
            overflow: 'hidden',
            background: 'var(--theme-elevation-0)',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--theme-elevation-150)',
              background: 'var(--theme-elevation-50)',
              fontSize: '13px',
            }}
          >
            {banner?.enabled ? (
              <span style={{ color: 'var(--theme-success-500)' }}>● Banner is enabled</span>
            ) : (
              <span style={{ color: 'var(--theme-elevation-600)' }}>○ Banner is disabled</span>
            )}
            <span
              style={{ marginLeft: '12px', fontSize: '12px', color: 'var(--theme-elevation-600)' }}
            >
              Use **text** to make text orange and italic
            </span>
          </div>

          <div style={{ height: '300px' }}>
            <iframe
              srcDoc={previewHTML}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              title="Banner Preview"
            />
          </div>
        </div>

        {!banner?.enabled && (
          <div
            style={{
              marginTop: '12px',
              padding: '12px',
              background: 'var(--theme-elevation-50)',
              borderRadius: '4px',
              fontSize: '12px',
              color: 'var(--theme-elevation-700)',
            }}
          >
            Enable the banner to see the preview.
          </div>
        )}
      </div>
    </div>
  );
};
