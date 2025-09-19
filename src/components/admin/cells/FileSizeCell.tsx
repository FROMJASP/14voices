'use client';

import React from 'react';
import type { DefaultCellComponentProps } from 'payload';

export const FileSizeCell: React.FC<DefaultCellComponentProps> = ({ rowData }) => {
  // Debug logging to see what data we're receiving
  console.log('[FileSizeCell] rowData:', rowData);

  const filesize = rowData?.filesize;

  if (!filesize || typeof filesize !== 'number') {
    console.log('[FileSizeCell] No filesize found, returning -');
    return <span>-</span>;
  }

  // Convert bytes to human readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return <span>{formatFileSize(filesize)}</span>;
};
