'use client';

import React from 'react';
import { Button } from '@payloadcms/ui';
import { useTranslation } from '@payloadcms/ui';

export const FAQSettingsNav: React.FC = () => {
  const { i18n } = useTranslation();
  const isNL = i18n.language === 'nl';

  return (
    <div 
      style={{ 
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: 'var(--theme-elevation-50)',
        borderRadius: 'var(--border-radius-m)',
        border: '1px solid var(--theme-elevation-100)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--theme-text-secondary)' }}>
          {isNL 
            ? 'Configureer hoe de FAQ sectie op de homepage wordt weergegeven via de instellingen.'
            : 'Configure how the FAQ section appears on the homepage through settings.'
          }
        </p>
      </div>
      <Button
        el="link"
        to="/admin/globals/faq-settings"
        buttonStyle="primary"
        size="small"
      >
        {isNL ? 'FAQ Instellingen' : 'FAQ Settings'}
      </Button>
    </div>
  );
};