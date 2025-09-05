'use client';

import React from 'react';
import { useField, Button } from '@payloadcms/ui';

interface VariantDisplayProps {
  blockType: 'hero' | 'voiceover' | 'linkToBlog';
  variantLabels: Record<string, string>;
  variantFieldName: string;
}

/**
 * Displays the current variant selection from the Layout section
 * and provides a button to quickly navigate to the Layout settings
 */
export const VariantDisplay: React.FC<VariantDisplayProps> = ({ 
  blockType, 
  variantLabels,
  variantFieldName
}) => {
  const { value: pageBlocks } = useField({ path: 'pageBlocks' });
  
  let currentVariant = 'variant1';
  if (Array.isArray(pageBlocks)) {
    const block = pageBlocks.find((b: any) => b.blockType === blockType);
    if (block) {
      currentVariant = block[variantFieldName] || 'variant1';
    }
  }
  
  const variantLabel = variantLabels[currentVariant] || currentVariant;
  
  const scrollToLayout = () => {
    const layoutSection = document.querySelector('[data-field-path="pageBlocks"]');
    if (layoutSection) {
      layoutSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Find and highlight the specific block
      setTimeout(() => {
        const blocks = document.querySelectorAll('.array-field__row');
        blocks.forEach((block) => {
          const label = block.querySelector('.array-field__row-label');
          if (label?.textContent?.toLowerCase().includes(blockType.toLowerCase())) {
            block.classList.add('highlight-flash');
            setTimeout(() => {
              block.classList.remove('highlight-flash');
            }, 2000);
          }
        });
      }, 300);
    }
  };
  
  return (
    <div className="variant-display">
      <div className="variant-display__content">
        <div className="variant-display__info">
          <span className="variant-display__label">Current Variant:</span>
          <span className="variant-display__value">{variantLabel}</span>
        </div>
        <Button
          buttonStyle="secondary"
          size="small"
          onClick={scrollToLayout}
        >
          Change in Layout
        </Button>
      </div>
      <style jsx>{`
        .variant-display {
          background: var(--theme-elevation-50);
          border: 1px solid var(--theme-elevation-150);
          border-radius: 4px;
          padding: 12px 16px;
          margin-bottom: 20px;
        }
        
        .variant-display__content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .variant-display__info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .variant-display__label {
          color: var(--theme-text-secondary);
          font-size: 14px;
        }
        
        .variant-display__value {
          color: var(--theme-text);
          font-weight: 600;
          font-size: 14px;
        }
        
        :global(.highlight-flash) {
          animation: flash 2s ease-in-out;
        }
        
        @keyframes flash {
          0%, 100% {
            background-color: transparent;
          }
          10%, 30%, 50%, 70%, 90% {
            background-color: var(--theme-success-50);
          }
        }
      `}</style>
    </div>
  );
};

export const HeroVariantDisplay: React.FC = () => (
  <VariantDisplay
    blockType="hero"
    variantFieldName="heroVariant"
    variantLabels={{
      variant1: 'Hero variant 1',
      variant2: 'Hero variant 2',
    }}
  />
);

export const VoiceoverVariantDisplay: React.FC = () => (
  <VariantDisplay
    blockType="voiceover"
    variantFieldName="voiceoverVariant"
    variantLabels={{
      variant1: 'Voiceover variant 1',
    }}
  />
);

export const ContentVariantDisplay: React.FC = () => (
  <VariantDisplay
    blockType="linkToBlog"
    variantFieldName="contentVariant"
    variantLabels={{
      variant1: 'Content variant 1',
    }}
  />
);