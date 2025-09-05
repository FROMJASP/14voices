'use client';

import React from 'react';
import { useField } from '@payloadcms/ui';

/**
 * Component that shows/hides the entire blocks section based on pageBlocks
 */
export const DynamicHeroBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { value: pageBlocks } = useField({ path: 'pageBlocks' });
  
  // Check if there's a hero block enabled
  const hasHero = Array.isArray(pageBlocks) && 
    pageBlocks.some((b: any) => b.blockType === 'hero' && b.enabled);
  
  if (!hasHero) {
    return null;
  }
  
  return <>{children}</>;
};

export const DynamicVoiceoverBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { value: pageBlocks } = useField({ path: 'pageBlocks' });
  
  // Check if there's a voiceover block enabled
  const hasVoiceover = Array.isArray(pageBlocks) && 
    pageBlocks.some((b: any) => b.blockType === 'voiceover' && b.enabled);
  
  if (!hasVoiceover) {
    return null;
  }
  
  return <>{children}</>;
};

export const DynamicLinkToBlogBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { value: pageBlocks } = useField({ path: 'pageBlocks' });
  
  // Check if there's a linkToBlog block enabled
  const hasLinkToBlog = Array.isArray(pageBlocks) && 
    pageBlocks.some((b: any) => b.blockType === 'linkToBlog' && b.enabled);
  
  if (!hasLinkToBlog) {
    return null;
  }
  
  return <>{children}</>;
};

export const BlocksStatus: React.FC = () => {
  const { value: pageBlocks } = useField({ path: 'pageBlocks' });
  
  if (!Array.isArray(pageBlocks) || pageBlocks.length === 0) {
    return (
      <div style={{
        background: 'var(--theme-elevation-50)',
        border: '1px dashed var(--theme-elevation-200)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        textAlign: 'center',
        color: 'var(--theme-text-secondary)',
      }}>
        <p style={{ margin: '0 0 8px 0' }}>No blocks have been added to the layout yet.</p>
        <p style={{ margin: '0' }}>Add blocks in the Layout section above to edit their content here.</p>
      </div>
    );
  }
  
  const enabledBlocks = pageBlocks.filter((b: any) => b.enabled);
  
  if (enabledBlocks.length === 0) {
    return (
      <div style={{
        background: 'var(--theme-elevation-50)',
        border: '1px dashed var(--theme-warning-200)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        textAlign: 'center',
        color: 'var(--theme-text-secondary)',
      }}>
        <p style={{ margin: '0 0 8px 0' }}>All blocks are currently disabled.</p>
        <p style={{ margin: '0' }}>Enable blocks in the Layout section to edit their content.</p>
      </div>
    );
  }
  
  // Show what blocks are active
  const heroBlocks = enabledBlocks.filter((b: any) => b.blockType === 'hero');
  const voiceoverBlocks = enabledBlocks.filter((b: any) => b.blockType === 'voiceover');
  const contentBlocks = enabledBlocks.filter((b: any) => b.blockType === 'linkToBlog');
  
  return (
    <div style={{
      background: 'var(--theme-success-50)',
      border: '1px solid var(--theme-success-200)',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '16px',
      fontSize: '13px',
      color: 'var(--theme-success-600)',
    }}>
      <strong>Active blocks:</strong>
      <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
        {heroBlocks.length > 0 && (
          <li>Hero Section ({heroBlocks.map((b: any) => b.heroVariant || 'variant1').join(', ')})</li>
        )}
        {voiceoverBlocks.length > 0 && (
          <li>Special sections (Voiceover)</li>
        )}
        {contentBlocks.length > 0 && (
          <li>Content blocks</li>
        )}
      </ul>
    </div>
  );
};