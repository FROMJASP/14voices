'use client';

import React from 'react';
import type { UIFieldClientComponent } from 'payload';

export const LogoPreview: UIFieldClientComponent = (props) => {
  // Access the form data from the correct location
  const formData = props.form?.getData?.() || {};
  const logoType = formData?.branding?.logoType || 'text';
  const logoText = formData?.branding?.logoText || 'FourteenVoices';
  const logoImage = formData?.branding?.logoImage;
  const logoImageDark = formData?.branding?.logoImageDark;

  return (
    <div className="field-type">
      <div className="field-label">
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
          Logo Preview
        </span>
      </div>
      <div className="field-description" style={{ marginBottom: '12px', fontSize: '13px', color: '#666' }}>
        This is how your logo will appear on the website
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: '24px',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e1e5e9'
      }}>
        {/* Light mode preview */}
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: '500', 
            marginBottom: '8px',
            color: '#666'
          }}>
            Light Mode
          </div>
          <div style={{ 
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '6px',
            border: '1px solid #e1e5e9',
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center'
          }}>
            {logoType === 'text' ? (
              <span style={{ 
                fontSize: '24px',
                fontWeight: '700',
                color: '#000',
                letterSpacing: '-0.5px'
              }}>
                {logoText}
              </span>
            ) : logoImage ? (
              <img 
                src={typeof logoImage === 'object' && logoImage?.url ? logoImage.url : ''}
                alt="Logo"
                style={{ 
                  maxHeight: '40px',
                  width: 'auto'
                }}
              />
            ) : (
              <span style={{ color: '#999', fontSize: '14px' }}>
                No logo image selected
              </span>
            )}
          </div>
        </div>

        {/* Dark mode preview */}
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: '500', 
            marginBottom: '8px',
            color: '#666'
          }}>
            Dark Mode
          </div>
          <div style={{ 
            backgroundColor: '#1a1a1a',
            padding: '20px',
            borderRadius: '6px',
            border: '1px solid #333',
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center'
          }}>
            {logoType === 'text' ? (
              <span style={{ 
                fontSize: '24px',
                fontWeight: '700',
                color: '#fff',
                letterSpacing: '-0.5px'
              }}>
                {logoText}
              </span>
            ) : (logoImageDark || logoImage) ? (
              <img 
                src={
                  logoImageDark && typeof logoImageDark === 'object' && logoImageDark?.url 
                    ? logoImageDark.url 
                    : (typeof logoImage === 'object' && logoImage?.url ? logoImage.url : '')
                }
                alt="Logo"
                style={{ 
                  maxHeight: '40px',
                  width: 'auto'
                }}
              />
            ) : (
              <span style={{ color: '#666', fontSize: '14px' }}>
                No logo image selected
              </span>
            )}
          </div>
        </div>
      </div>

      {logoType === 'image' && !logoImage && (
        <div style={{ 
          marginTop: '12px',
          padding: '12px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          fontSize: '13px',
          color: '#856404'
        }}>
          ⚠️ Please upload a logo image to see the preview
        </div>
      )}
    </div>
  );
};