'use client';

import React from 'react';
import type { DefaultCellComponentProps } from 'payload';

export const CategoryCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  // If no category is selected, show a dash
  if (!cellData) {
    return <span>-</span>;
  }

  // If cellData is an object (populated), show the name
  if (typeof cellData === 'object' && cellData !== null && 'name' in cellData) {
    return <span>{cellData.name}</span>;
  }

  // If cellData is just an ID (not populated), show a dash
  return <span>-</span>;
};

export default CategoryCell;
