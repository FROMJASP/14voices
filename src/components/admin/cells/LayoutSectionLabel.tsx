'use client';

import React from 'react';

const sectionNames = {
  hero: { en: 'Hero Section', nl: 'Hero Sectie' },
  voiceover: { en: 'Voice-over Section', nl: 'Voice-over Sectie' },
  linkToBlog: { en: 'Link-to-Blog Section', nl: 'Link-to-Blog Sectie' },
};

const defaultSections = ['hero', 'voiceover', 'linkToBlog'];

export const LayoutSectionLabel = ({ data, index }: { data?: any; index?: number }) => {
  // If section is not set, use the default based on index
  const sectionType = data?.section || defaultSections[index || 0];
  const label =
    sectionNames[sectionType as keyof typeof sectionNames]?.en || `Section ${(index || 0) + 1}`;
  const enabled = data?.enabled !== false;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span
        style={{
          fontSize: '14px',
          fontWeight: 500,
          color: enabled ? '#374151' : '#9CA3AF',
        }}
      >
        {label}
      </span>
      {!enabled && (
        <span
          style={{
            fontSize: '12px',
            color: '#9CA3AF',
            fontStyle: 'italic',
          }}
        >
          (disabled)
        </span>
      )}
    </div>
  );
};
