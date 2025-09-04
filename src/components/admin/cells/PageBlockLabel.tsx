'use client';

import React from 'react';

interface PageBlockLabelProps {
  data?: any;
}

export const PageBlockLabel: React.FC<PageBlockLabelProps> = ({ data }) => {
  const blockLabels = {
    hero: { en: 'Hero', nl: 'Hero' },
    voiceover: { en: 'Voiceover', nl: 'Voiceover' },
    linkToBlog: { en: 'Link to Blog', nl: 'Link naar Blog' },
  };

  const label = blockLabels[data?.blockType as keyof typeof blockLabels] || {
    en: 'Block',
    nl: 'Blok',
  };
  const enabled = data?.enabled !== false;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span
        style={{
          fontSize: '14px',
          fontWeight: 500,
          color: enabled ? 'inherit' : '#9CA3AF',
        }}
      >
        {label.en}
      </span>
      {!enabled && (
        <span
          style={{
            fontSize: '12px',
            color: '#9CA3AF',
            fontStyle: 'italic',
          }}
        >
          (hidden)
        </span>
      )}
    </div>
  );
};
