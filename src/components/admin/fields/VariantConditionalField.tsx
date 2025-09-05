'use client';

import React from 'react';
import { useVariant } from './VariantProvider';

interface VariantConditionalFieldProps {
  blockType: 'hero' | 'voiceover' | 'linkToBlog';
  showForVariants?: string[];
  hideForVariants?: string[];
  children: React.ReactNode;
}

/**
 * Component that conditionally renders children based on the current variant
 * selection in the Layout section
 */
export const VariantConditionalField: React.FC<VariantConditionalFieldProps> = ({
  blockType,
  showForVariants,
  hideForVariants,
  children,
}) => {
  const { getVariant } = useVariant();
  const currentVariant = getVariant(blockType);
  
  if (!currentVariant) {
    // If no variant is set, don't show variant-specific fields
    return null;
  }
  
  if (showForVariants && !showForVariants.includes(currentVariant)) {
    return null;
  }
  
  if (hideForVariants && hideForVariants.includes(currentVariant)) {
    return null;
  }
  
  return <>{children}</>;
};