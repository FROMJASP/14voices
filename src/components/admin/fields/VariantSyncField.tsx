'use client';

import React, { useEffect } from 'react';
import { useField, useForm } from '@payloadcms/ui';

interface VariantSyncFieldProps {
  blockType: 'hero' | 'voiceover' | 'linkToBlog';
  targetField: string;
  variantFieldName: string;
}

/**
 * Syncs variant selection from pageBlocks to the block section fields in real-time
 */
const VariantSyncField: React.FC<VariantSyncFieldProps> = ({
  blockType,
  targetField,
  variantFieldName,
}) => {
  const { dispatchFields } = useForm();
  const { value: pageBlocks } = useField({ path: 'pageBlocks' });
  
  useEffect(() => {
    if (!Array.isArray(pageBlocks)) return;
    
    const block = pageBlocks.find((b: any) => b.blockType === blockType);
    if (!block) return;
    
    const variantValue = block[variantFieldName];
    if (!variantValue) return;
    
    // Update the target field with the variant value
    dispatchFields({
      type: 'UPDATE',
      path: targetField,
      value: variantValue,
    });
  }, [pageBlocks, blockType, targetField, variantFieldName, dispatchFields]);
  
  return null;
};

export const HeroVariantSync: React.FC = () => (
  <VariantSyncField
    blockType="hero"
    targetField="hero.layout"
    variantFieldName="heroVariant"
  />
);

export const VoiceoverVariantSync: React.FC = () => (
  <VariantSyncField
    blockType="voiceover"
    targetField="voiceover.variant"
    variantFieldName="voiceoverVariant"
  />
);

export const ContentVariantSync: React.FC = () => (
  <VariantSyncField
    blockType="linkToBlog"
    targetField="linkToBlog.layout"
    variantFieldName="contentVariant"
  />
);