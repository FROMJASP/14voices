'use client';

import React from 'react';

interface PageBlockLabelProps {
  data?: any;
}

export const PageBlockLabel: React.FC<PageBlockLabelProps> = ({ data }) => {
  const blockLabels = {
    hero: { en: 'Hero Section', nl: 'Hero Section' },
    voiceover: { en: 'Special sections', nl: 'Speciale secties' },
    linkToBlog: { en: 'Content', nl: 'Content' },
  };

  const variantLabels = {
    variant1: '1',
    variant2: '2',
  };

  const label = blockLabels[data?.blockType as keyof typeof blockLabels] || {
    en: 'Block',
    nl: 'Blok',
  };
  const enabled = data?.enabled !== false;

  // Get the variant based on block type
  let variant = '';
  let variantLabel = '';

  if (data?.blockType === 'hero' && data?.heroVariant) {
    variant = data.heroVariant;
    variantLabel = variantLabels[variant as keyof typeof variantLabels] || variant;
  } else if (data?.blockType === 'voiceover' && data?.voiceoverVariant) {
    variant = data.voiceoverVariant;
    variantLabel = variantLabels[variant as keyof typeof variantLabels] || variant;
  } else if (data?.blockType === 'linkToBlog' && data?.contentVariant) {
    variant = data.contentVariant;
    variantLabel = variantLabels[variant as keyof typeof variantLabels] || variant;
  }

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
      {variantLabel && (
        <span
          style={{
            fontSize: '12px',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: '#F3F4F6',
            color: '#374151',
            fontWeight: 500,
          }}
        >
          Variant {variantLabel}
        </span>
      )}
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
