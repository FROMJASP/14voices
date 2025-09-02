'use client';

import React from 'react';
import type { DefaultCellComponentProps } from 'payload';

export const GroupCell: React.FC<DefaultCellComponentProps> = ({ cellData, rowData }) => {
  // Check if group data is available in rowData
  const group = rowData?.group;

  if (!group) {
    return <span className="text-gray-400">-</span>;
  }

  // Handle different data types
  if (typeof group === 'string') {
    // If it's just an ID string, show a placeholder
    return <span className="text-gray-400">Group ID: {group}</span>;
  }

  // If it's the full group object
  if (typeof group === 'object' && 'name' in group) {
    return <span>{group.name}</span>;
  }

  // If cellData is available and is an object
  if (cellData && typeof cellData === 'object' && 'name' in cellData) {
    return <span>{cellData.name}</span>;
  }

  // Fallback - show "Loading..." to indicate Payload is fetching the relationship
  return <span className="text-gray-400 italic">Laden...</span>;
};

export default GroupCell;
