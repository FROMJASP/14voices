'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useField } from '@payloadcms/ui';

interface VariantContextValue {
  getVariant: (blockType: string) => string | undefined;
  variants: Record<string, string>;
}

const VariantContext = createContext<VariantContextValue>({
  getVariant: () => undefined,
  variants: {},
});

export const useVariant = () => useContext(VariantContext);

/**
 * Provider component that makes variant selections from pageBlocks available
 * to all child components. This ensures a single source of truth for variants.
 */
export const VariantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { value: pageBlocks } = useField({ path: 'pageBlocks' });
  
  const contextValue = useMemo(() => {
    const variants: Record<string, string> = {};
    
    if (Array.isArray(pageBlocks)) {
      pageBlocks.forEach((block: any) => {
        if (block.blockType === 'hero' && block.heroVariant) {
          variants.hero = block.heroVariant;
        } else if (block.blockType === 'voiceover' && block.voiceoverVariant) {
          variants.voiceover = block.voiceoverVariant;
        } else if (block.blockType === 'linkToBlog' && block.contentVariant) {
          variants.linkToBlog = block.contentVariant;
        }
      });
    }
    
    return {
      getVariant: (blockType: string) => variants[blockType],
      variants,
    };
  }, [pageBlocks]);
  
  return (
    <VariantContext.Provider value={contextValue}>
      {children}
    </VariantContext.Provider>
  );
};