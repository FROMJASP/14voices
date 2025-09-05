'use client';

import React from 'react';

interface PageBlockLabelProps {
  data?: any;
  path?: string;
  index?: number;
}

export const PageBlockLabel: React.FC<PageBlockLabelProps> = ({ data, index }) => {
  // If no data yet, show placeholder
  if (!data || !data.blockType) {
    return (
      <span style={{ color: '#9CA3AF', fontSize: '14px' }}>
        Block {typeof index === 'number' ? index + 1 : ''}
      </span>
    );
  }

  const blockLabels = {
    hero: 'Hero Section',
    voiceover: 'Speciale secties',
    linkToBlog: 'Content',
  };

  const blockLabel = blockLabels[data.blockType as keyof typeof blockLabels] || 'Block';
  const enabled = data?.enabled !== false;

  // Get the variant based on block type
  let variantText = '';
  
  if (data.blockType === 'hero' && data.heroVariant) {
    variantText = data.heroVariant === 'variant1' ? 'Variant 1' : 'Variant 2';
  } else if (data.blockType === 'voiceover' && data.voiceoverVariant) {
    variantText = data.voiceoverVariant === 'variant1' ? 'Variant 1' : 'Variant 2';
  } else if (data.blockType === 'linkToBlog' && data.contentVariant) {
    variantText = data.contentVariant === 'variant1' ? 'Variant 1' : 'Variant 2';
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* Main block type label */}
      <span
        style={{
          fontSize: '14px',
          fontWeight: 600,
          color: enabled ? 'var(--theme-text)' : 'var(--theme-text-secondary)',
          textDecoration: !enabled ? 'line-through' : 'none',
        }}
      >
        {blockLabel}
      </span>
      
      {/* Variant badge */}
      {variantText && (
        <span
          style={{
            fontSize: '11px',
            padding: '2px 6px',
            borderRadius: '3px',
            backgroundColor: enabled ? 'var(--theme-elevation-100)' : 'var(--theme-elevation-50)',
            color: enabled ? 'var(--theme-text-secondary)' : 'var(--theme-text-tertiary)',
            fontWeight: 500,
            border: '1px solid var(--theme-elevation-150)',
          }}
        >
          {variantText}
        </span>
      )}
      
      {/* Disabled indicator */}
      {!enabled && (
        <span
          style={{
            fontSize: '11px',
            color: 'var(--theme-warning-600)',
            fontStyle: 'italic',
            marginLeft: 'auto',
          }}
        >
          Uitgeschakeld
        </span>
      )}
    </div>
  );
};
