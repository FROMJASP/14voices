'use client';

import React from 'react';
import { useField } from '@payloadcms/ui';

/**
 * Component that displays content editing fields for blocks that exist in the layout
 * This dynamically shows only the blocks that have been added to pageBlocks
 */
export const BlockContentEditor: React.FC = () => {
  const { value: pageBlocks } = useField({ path: 'pageBlocks' });
  
  if (!Array.isArray(pageBlocks) || pageBlocks.length === 0) {
    return (
      <div className="no-blocks-message">
        <p>No blocks have been added to the layout yet.</p>
        <p>Add blocks in the Layout section above to edit their content here.</p>
      </div>
    );
  }

  // Group blocks by type for better organization
  const heroBlocks = pageBlocks
    .map((block, index) => ({ ...block, index }))
    .filter(block => block.blockType === 'hero' && block.enabled);
  
  const voiceoverBlocks = pageBlocks
    .map((block, index) => ({ ...block, index }))
    .filter(block => block.blockType === 'voiceover' && block.enabled);
  
  const contentBlocks = pageBlocks
    .map((block, index) => ({ ...block, index }))
    .filter(block => block.blockType === 'linkToBlog' && block.enabled);

  const getVariantLabel = (block: any) => {
    if (block.blockType === 'hero') {
      return block.variant === 'variant2' ? 'Variant 2' : 'Variant 1';
    }
    return 'Variant 1';
  };

  return (
    <div className="block-content-editor">
      {/* Hero Sections */}
      {heroBlocks.length > 0 && (
        <div className="block-group">
          <h3 className="block-group-title">Hero Sections</h3>
          {heroBlocks.map((block) => (
            <div key={`hero-${block.index}`} className="content-block">
              <div className="content-block-header">
                <span className="block-badge">Hero {getVariantLabel(block)}</span>
                <span className="block-position">Position: {block.index + 1}</span>
              </div>
              <div className="content-notice">
                Edit this block's content using the fields in the form below
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Special Sections (Voiceover) */}
      {voiceoverBlocks.length > 0 && (
        <div className="block-group">
          <h3 className="block-group-title">Special Sections</h3>
          {voiceoverBlocks.map((block) => (
            <div key={`voiceover-${block.index}`} className="content-block">
              <div className="content-block-header">
                <span className="block-badge">Voiceover</span>
                <span className="block-position">Position: {block.index + 1}</span>
              </div>
              <div className="content-notice">
                Edit this block's content using the fields in the form below
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Blocks */}
      {contentBlocks.length > 0 && (
        <div className="block-group">
          <h3 className="block-group-title">Content Blocks</h3>
          {contentBlocks.map((block) => (
            <div key={`content-${block.index}`} className="content-block">
              <div className="content-block-header">
                <span className="block-badge">Content</span>
                <span className="block-position">Position: {block.index + 1}</span>
              </div>
              <div className="content-notice">
                Edit this block's content using the fields in the form below
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .block-content-editor {
          margin: 16px 0;
        }

        .no-blocks-message {
          background: var(--theme-elevation-50);
          border: 1px dashed var(--theme-elevation-200);
          border-radius: 8px;
          padding: 24px;
          text-align: center;
          color: var(--theme-text-secondary);
        }

        .no-blocks-message p {
          margin: 8px 0;
        }

        .block-group {
          margin-bottom: 24px;
        }

        .block-group-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 12px 0;
          color: var(--theme-text);
        }

        .content-block {
          background: var(--theme-elevation-50);
          border: 1px solid var(--theme-elevation-150);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
        }

        .content-block-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .block-badge {
          display: inline-block;
          padding: 4px 8px;
          background: var(--theme-primary-100);
          color: var(--theme-primary-600);
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .block-position {
          font-size: 12px;
          color: var(--theme-text-secondary);
        }

        .content-notice {
          font-size: 13px;
          color: var(--theme-text-secondary);
          font-style: italic;
        }
      `}</style>
    </div>
  );
};