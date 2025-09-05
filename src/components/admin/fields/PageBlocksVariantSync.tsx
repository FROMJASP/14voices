'use client';

import React, { useEffect, useRef } from 'react';
import { useField, useForm } from '@payloadcms/ui';

/**
 * This component syncs variant selections from pageBlocks to individual block sections
 * It ensures the variant fields in the block editing sections stay synchronized with
 * the variants selected in the Layout section
 */
const PageBlocksVariantSync: React.FC = () => {
  const { dispatchFields } = useForm();
  const { value: pageBlocks } = useField({ path: 'pageBlocks' });
  const { value: heroData, setValue: setHeroData } = useField({ path: 'hero' });
  const { value: voiceoverData, setValue: setVoiceoverData } = useField({ path: 'voiceover' });
  const { value: linkToBlogData, setValue: setLinkToBlogData } = useField({ path: 'linkToBlog' });
  
  // Track last synced values to avoid unnecessary updates
  const lastSynced = useRef<Record<string, string>>({});
  
  // Sync from pageBlocks to individual sections
  useEffect(() => {
    if (!Array.isArray(pageBlocks)) return;
    
    pageBlocks.forEach((block: any) => {
      // Sync hero variant
      if (block.blockType === 'hero' && block.heroVariant) {
        const syncKey = `hero-${block.heroVariant}`;
        if (lastSynced.current[syncKey] !== block.heroVariant) {
          lastSynced.current[syncKey] = block.heroVariant;
          
          // Update hero.layout field
          const updatedHero = { ...(heroData || {}), layout: block.heroVariant };
          setHeroData(updatedHero);
          
          // Also dispatch to ensure form state is updated
          dispatchFields({
            type: 'UPDATE',
            path: 'hero.layout',
            value: block.heroVariant,
          });
        }
      }
      
      // Sync voiceover variant
      if (block.blockType === 'voiceover' && block.voiceoverVariant) {
        const syncKey = `voiceover-${block.voiceoverVariant}`;
        if (lastSynced.current[syncKey] !== block.voiceoverVariant) {
          lastSynced.current[syncKey] = block.voiceoverVariant;
          
          // Update voiceover.variant field
          const updatedVoiceover = { ...(voiceoverData || {}), variant: block.voiceoverVariant };
          setVoiceoverData(updatedVoiceover);
          
          // Also dispatch to ensure form state is updated
          dispatchFields({
            type: 'UPDATE',
            path: 'voiceover.variant',
            value: block.voiceoverVariant,
          });
        }
      }
      
      // Sync linkToBlog variant
      if (block.blockType === 'linkToBlog' && block.contentVariant) {
        const syncKey = `linkToBlog-${block.contentVariant}`;
        if (lastSynced.current[syncKey] !== block.contentVariant) {
          lastSynced.current[syncKey] = block.contentVariant;
          
          // Update linkToBlog.layout field
          const updatedLinkToBlog = { ...(linkToBlogData || {}), layout: block.contentVariant };
          setLinkToBlogData(updatedLinkToBlog);
          
          // Also dispatch to ensure form state is updated
          dispatchFields({
            type: 'UPDATE',
            path: 'linkToBlog.layout',
            value: block.contentVariant,
          });
        }
      }
    });
  }, [pageBlocks, heroData, voiceoverData, linkToBlogData, setHeroData, setVoiceoverData, setLinkToBlogData, dispatchFields]);
  
  return null; // This is a logic-only component
};

export default PageBlocksVariantSync;