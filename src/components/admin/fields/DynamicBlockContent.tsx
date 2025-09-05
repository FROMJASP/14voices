'use client';

import React, { useEffect, useState } from 'react';
import { useField, useForm } from '@payloadcms/ui';

/**
 * Dynamically renders content editing blocks based on what's in pageBlocks
 * This creates the "Blokken aanpassen" section that only shows blocks that exist
 */
export const DynamicBlockContent: React.FC = () => {
  const { value: pageBlocks } = useField({ path: 'pageBlocks' });
  const { getData } = useForm();
  const [blocks, setBlocks] = useState<any[]>([]);

  useEffect(() => {
    // Try to get pageBlocks from form data if field value is not available
    const formData = getData();
    const currentBlocks = pageBlocks || formData?.pageBlocks || [];
    setBlocks(Array.isArray(currentBlocks) ? currentBlocks : []);
  }, [pageBlocks, getData]);

  // Debug logging
  useEffect(() => {
    console.log('DynamicBlockContent - pageBlocks:', pageBlocks);
    console.log('DynamicBlockContent - blocks state:', blocks);
  }, [pageBlocks, blocks]);

  if (!Array.isArray(blocks) || blocks.length === 0) {
    return (
      <div className="empty-blocks-message">
        <p>No blocks have been added to the layout yet.</p>
        <p>Add blocks in the Layout section above to edit their content here.</p>
        <style jsx>{`
          .empty-blocks-message {
            background: var(--theme-elevation-50);
            border: 1px dashed var(--theme-elevation-200);
            border-radius: 8px;
            padding: 24px;
            text-align: center;
            color: var(--theme-text-secondary);
            margin: 16px 0;
          }
          .empty-blocks-message p {
            margin: 8px 0;
          }
        `}</style>
      </div>
    );
  }

  // Get enabled blocks
  const enabledBlocks = blocks.filter(block => block.enabled);

  if (enabledBlocks.length === 0) {
    return (
      <div className="no-enabled-blocks">
        <p>All blocks are currently disabled.</p>
        <p>Enable blocks in the Layout section to edit their content.</p>
        <style jsx>{`
          .no-enabled-blocks {
            background: var(--theme-elevation-50);
            border: 1px dashed var(--theme-warning-200);
            border-radius: 8px;
            padding: 24px;
            text-align: center;
            color: var(--theme-text-secondary);
            margin: 16px 0;
          }
          .no-enabled-blocks p {
            margin: 8px 0;
          }
        `}</style>
      </div>
    );
  }

  // Group blocks by type for display
  const heroBlocks = enabledBlocks.filter(b => b.blockType === 'hero');
  const contentBlocks = enabledBlocks.filter(b => b.blockType === 'linkToBlog');
  const voiceoverBlocks = enabledBlocks.filter(b => b.blockType === 'voiceover');

  return (
    <div className="dynamic-blocks-container">
      {heroBlocks.length > 0 && (
        <div className="block-section">
          <h4>Hero Sections</h4>
          {heroBlocks.map((block, index) => (
            <div key={block.id || `hero-${index}`} className="block-indicator">
              <div className="block-header">
                <span className="block-type">Hero</span>
                <span className="block-variant">
                  {block.heroVariant === 'variant2' ? 'Variant 2' : 'Variant 1'}
                </span>
              </div>
              <div className="block-info">
                <p>Edit the content for this hero section using the fields below.</p>
                {block.heroVariant === 'variant1' && (
                  <ul>
                    <li>Process steps</li>
                    <li>Title, description, image</li>
                    <li>Buttons and statistics</li>
                  </ul>
                )}
                {block.heroVariant === 'variant2' && (
                  <ul>
                    <li>Badge configuration</li>
                    <li>Title and subtitle</li>
                    <li>Primary and secondary buttons</li>
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {contentBlocks.length > 0 && (
        <div className="block-section">
          <h4>Content Blocks</h4>
          {contentBlocks.map((block, index) => (
            <div key={block.id || `content-${index}`} className="block-indicator">
              <div className="block-header">
                <span className="block-type">Content</span>
                <span className="block-variant">Variant 1</span>
              </div>
              <div className="block-info">
                <p>Edit the content block settings using the fields below.</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {voiceoverBlocks.length > 0 && (
        <div className="block-section">
          <h4>Special Sections (Voiceover)</h4>
          {voiceoverBlocks.map((block, index) => (
            <div key={block.id || `voiceover-${index}`} className="block-indicator">
              <div className="block-header">
                <span className="block-type">Voiceover</span>
                <span className="block-variant">Variant 1</span>
              </div>
              <div className="block-info">
                <p>Edit the voiceover section title using the fields below.</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .dynamic-blocks-container {
          margin: 16px 0;
        }

        .block-section {
          margin-bottom: 32px;
        }

        .block-section h4 {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: var(--theme-text);
        }

        .block-indicator {
          background: var(--theme-elevation-50);
          border: 1px solid var(--theme-elevation-150);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
        }

        .block-header {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 12px;
        }

        .block-type {
          display: inline-block;
          padding: 4px 8px;
          background: var(--theme-primary-100);
          color: var(--theme-primary-600);
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .block-variant {
          display: inline-block;
          padding: 4px 8px;
          background: var(--theme-elevation-100);
          color: var(--theme-text-secondary);
          border-radius: 4px;
          font-size: 12px;
        }

        .block-info {
          color: var(--theme-text-secondary);
          font-size: 13px;
        }

        .block-info p {
          margin: 0 0 8px 0;
        }

        .block-info ul {
          margin: 0;
          padding-left: 20px;
          font-size: 12px;
        }

        .block-info li {
          margin: 4px 0;
        }
      `}</style>
    </div>
  );
};