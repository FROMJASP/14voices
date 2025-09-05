'use client';

import React from 'react';
import { useField } from '@payloadcms/ui';

/**
 * Component that displays the layout section of pageBlocks in a clean, minimal way
 * This is shown in the "Layout" section where admins manage which blocks appear
 */
export const BlockLayoutManager: React.FC = () => {
  const { value: pageBlocks } = useField({ path: 'pageBlocks' });
  
  if (!Array.isArray(pageBlocks)) {
    return null;
  }

  const getBlockLabel = (block: any) => {
    const labels: Record<string, string> = {
      hero: 'Hero Section',
      voiceover: 'Special Section',
      linkToBlog: 'Content',
    };
    return labels[block.blockType] || block.blockType;
  };

  const getVariantLabel = (block: any) => {
    if (block.blockType === 'hero') {
      return block.variant === 'variant2' ? 'Hero variant 2' : 'Hero variant 1';
    } else if (block.blockType === 'voiceover') {
      return 'Voiceover variant 1';
    } else if (block.blockType === 'linkToBlog') {
      return 'Content variant 1';
    }
    return block.variant;
  };

  return (
    <div className="block-layout-manager">
      <div className="block-layout-header">
        <h4>Current Page Layout</h4>
        <p>Manage which blocks appear on the page and in what order</p>
      </div>
      
      <div className="block-layout-items">
        {pageBlocks.map((block, index) => (
          <div key={index} className="block-layout-item">
            <div className="block-info">
              <span className="block-number">{index + 1}</span>
              <div className="block-details">
                <strong>{getBlockLabel(block)}</strong>
                <span className="block-variant">{getVariantLabel(block)}</span>
              </div>
            </div>
            <div className="block-status">
              {block.enabled ? (
                <span className="status-enabled">✓ Enabled</span>
              ) : (
                <span className="status-disabled">✗ Disabled</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .block-layout-manager {
          background: var(--theme-elevation-50);
          border: 1px solid var(--theme-elevation-150);
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
        }

        .block-layout-header {
          margin-bottom: 16px;
        }

        .block-layout-header h4 {
          margin: 0 0 4px 0;
          color: var(--theme-text);
        }

        .block-layout-header p {
          margin: 0;
          color: var(--theme-text-secondary);
          font-size: 14px;
        }

        .block-layout-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .block-layout-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background: var(--theme-elevation-0);
          border: 1px solid var(--theme-elevation-100);
          border-radius: 4px;
        }

        .block-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .block-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: var(--theme-elevation-100);
          border-radius: 50%;
          font-size: 12px;
          font-weight: 600;
          color: var(--theme-text-secondary);
        }

        .block-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .block-details strong {
          color: var(--theme-text);
          font-size: 14px;
        }

        .block-variant {
          color: var(--theme-text-secondary);
          font-size: 12px;
        }

        .block-status {
          font-size: 12px;
        }

        .status-enabled {
          color: var(--theme-success);
        }

        .status-disabled {
          color: var(--theme-error);
        }
      `}</style>
    </div>
  );
};