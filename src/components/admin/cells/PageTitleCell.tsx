'use client';

import React, { memo } from 'react';
import type { DefaultCellComponentProps } from 'payload';

export const PageTitleCell: React.FC<DefaultCellComponentProps> = memo(({ cellData }) => {
  return (
    <span
      style={{
        fontSize: '14px',
        color: 'var(--theme-text)',
      }}
    >
      {cellData || 'Untitled'}
    </span>
  );
});

PageTitleCell.displayName = 'PageTitleCell';
