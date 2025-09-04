'use client';

import React from 'react';
import { useTranslation } from '@payloadcms/ui';
import { useFormFields } from '@payloadcms/ui';

interface BlockUsageInfoProps {
  path?: string;
}

export const BlockUsageInfo: React.FC<BlockUsageInfoProps> = ({ path }) => {
  // Extract block type from the path
  let blockType: 'hero' | 'voiceover' | 'linkToBlog' = 'hero';

  if (path?.includes('hero')) {
    blockType = 'hero';
  } else if (path?.includes('voiceover')) {
    blockType = 'voiceover';
  } else if (path?.includes('linkToBlog')) {
    blockType = 'linkToBlog';
  }
  const { i18n } = useTranslation();
  const currentLanguage = i18n?.language || 'en';
  const isNL = currentLanguage === 'nl';

  // Access form fields to get pageBlocks data
  const formFields = useFormFields(([fields]) => {
    return {
      pageBlocks: fields?.pageBlocks?.value || [],
    };
  });

  // Ensure pageBlocks is an array
  const pageBlocks = Array.isArray(formFields.pageBlocks) ? formFields.pageBlocks : [];

  // Count how many times this block type is used and get variants
  const blockInstances = pageBlocks.filter(
    (block: any) => block.blockType === blockType && block.enabled
  );

  // Get the variant field name based on block type
  const getVariantFieldName = (type: string) => {
    switch (type) {
      case 'hero':
        return 'heroVariant';
      case 'voiceover':
        return 'voiceoverVariant';
      case 'linkToBlog':
        return 'contentVariant';
      default:
        return '';
    }
  };

  const variantFieldName = getVariantFieldName(blockType);

  if (blockInstances.length === 0) {
    return (
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: '#FEF3C7',
          borderRadius: '6px',
          marginBottom: '16px',
          fontSize: '14px',
          color: '#92400E',
        }}
      >
        {isNL
          ? 'Dit blok wordt momenteel niet gebruikt in de layout.'
          : 'This block is currently not used in the layout.'}
      </div>
    );
  }

  // Get all variants being used
  const variants = blockInstances.map((instance) => instance[variantFieldName] || 'variant1');
  const variantCounts = variants.reduce(
    (acc, v) => {
      acc[v] = (acc[v] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div
      style={{
        padding: '12px 16px',
        backgroundColor: '#E0E7FF',
        borderRadius: '6px',
        marginBottom: '16px',
        fontSize: '14px',
        color: '#3730A3',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: '8px' }}>
        {isNL ? 'Layout gebruik:' : 'Layout usage:'}
      </div>
      {Object.entries(variantCounts).map(([variant, count]) => (
        <div key={variant} style={{ marginBottom: '4px' }}>
          {'• '}Variant {variant.replace('variant', '')}: {String(count)}x{' '}
          {isNL ? 'gebruikt' : 'used'}
        </div>
      ))}
      <div style={{ marginTop: '12px', fontSize: '13px', opacity: 0.8 }}>
        {isNL
          ? 'Tip: Wijzigingen in een variant hebben effect op alle plekken waar die variant wordt gebruikt.'
          : 'Tip: Changes to a variant will affect all places where that variant is used.'}
      </div>
    </div>
  );
};
