'use client';

import React from 'react';

const blockNames: Record<string, string> = {
  hero: 'Hero',
  voiceover: 'Products / Producten',
  linkToBlog: 'Blog',
};

interface BlockLabelProps {
  data?: any;
  index?: number;
  rowNumber?: number;
  path?: string;
}

export const BlockLabel: React.FC<BlockLabelProps> = ({ data, index, rowNumber }) => {
  // Payload v3 uses rowNumber for array items, it starts at 1
  // If rowNumber exists, use it directly, otherwise calculate from index
  const blockNumber = rowNumber !== undefined && rowNumber !== null ? rowNumber : (index ?? 0) + 1;

  // Try to get blockType from the data
  const blockType = data?.blockType || '';

  // Determine label based on blockType
  let label = `Block ${blockNumber}`;

  if (blockType && blockNames[blockType]) {
    const typeName = blockNames[blockType];
    label = `Block ${blockNumber} - ${typeName}`;
  }

  const enabled = data?.enabled !== false;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span
        style={{
          fontSize: '14px',
          fontWeight: 500,
          // Use inherit for color to work with both light and dark mode
          color: enabled ? 'inherit' : '#9CA3AF',
        }}
      >
        {label}
      </span>
      {!enabled && (
        <span
          style={{
            fontSize: '12px',
            color: '#9CA3AF',
            fontStyle: 'italic',
          }}
        >
          (hidden)
        </span>
      )}
    </div>
  );
};
