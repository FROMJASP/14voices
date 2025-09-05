'use client';

import React from 'react';
import { useField } from '@payloadcms/ui';

const VariantSyncNotice: React.FC<{ blockType: string }> = ({ blockType }) => {
  const { value } = useField({ path: 'pageBlocks' });
  const blocks = Array.isArray(value) ? value : [];
  const blockConfig = blocks.find((b: any) => b.blockType === blockType);

  const variantFieldName =
    blockType === 'hero'
      ? 'heroVariant'
      : blockType === 'voiceover'
        ? 'voiceoverVariant'
        : blockType === 'linkToBlog'
          ? 'contentVariant'
          : '';

  const currentVariant = blockConfig?.[variantFieldName];

  if (!currentVariant || !blockConfig?.enabled) return null;

  return (
    <div
      className="payload-field-message payload-field-message--info"
      style={{
        marginBottom: '1rem',
        padding: '0.75rem 1rem',
        borderRadius: '4px',
        backgroundColor: 'var(--theme-info-50)',
        borderLeft: '4px solid var(--theme-info-500)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ flexShrink: 0, color: 'var(--theme-info-700)' }}
        >
          <path d="M13 16h-1v-4h1m0-4h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
        </svg>
        <span style={{ fontSize: '0.875rem' }}>
          <strong>Variant gesynchroniseerd met Layout:</strong>{' '}
          {currentVariant === 'variant1' ? 'Variant 1' : 'Variant 2'}
          <br />
          <span style={{ opacity: 0.8 }}>
            Wijzigingen hier worden automatisch toegepast in de Layout sectie en vice versa.
          </span>
        </span>
      </div>
    </div>
  );
};

export const VariantSyncNoticeHero: React.FC = () => <VariantSyncNotice blockType="hero" />;
export const VariantSyncNoticeVoiceover: React.FC = () => (
  <VariantSyncNotice blockType="voiceover" />
);
export const VariantSyncNoticeContent: React.FC = () => (
  <VariantSyncNotice blockType="linkToBlog" />
);

export default VariantSyncNotice;
