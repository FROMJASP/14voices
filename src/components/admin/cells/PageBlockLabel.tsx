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
        <>
          <span
            style={{
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: 'var(--theme-info-100)',
              color: 'var(--theme-info-800)',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ flexShrink: 0 }}
            >
              <title>Synced with block settings</title>
              <path
                d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"
                transform="rotate(180 12 12)"
              />
            </svg>
            Variant {variantLabel}
          </span>
        </>
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
