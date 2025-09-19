'use client';

import React from 'react';

export const MediaThumbnailCell: React.FC<any> = (props) => {
  // The cell receives the entire document as props
  const rowData = props;

  if (!rowData) return null;

  const mimeType = rowData.mimeType;
  const isVideo = mimeType && typeof mimeType === 'string' && mimeType.startsWith('video/');
  const isAudio = mimeType && typeof mimeType === 'string' && mimeType.startsWith('audio/');
  const isPDF = mimeType === 'application/pdf';

  // For videos, show a video icon
  if (isVideo) {
    return (
      <div
        style={{
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
        }}
      >
        🎬
      </div>
    );
  }

  // For audio, show a music icon
  if (isAudio) {
    return (
      <div
        style={{
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
        }}
      >
        🎵
      </div>
    );
  }

  // For PDFs, show a document icon
  if (isPDF) {
    return (
      <div
        style={{
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
        }}
      >
        📄
      </div>
    );
  }

  // For images, show the actual thumbnail
  const thumbnailUrl = rowData.sizes?.thumbnail?.url || rowData.thumbnailURL || rowData.url;

  if (thumbnailUrl) {
    return (
      <img
        src={thumbnailUrl}
        alt={rowData.alt || rowData.filename || 'Media thumbnail'}
        style={{
          width: '40px',
          height: '40px',
          objectFit: 'cover',
          borderRadius: '4px',
        }}
        onError={(e) => {
          // Fallback to emoji on error
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = document.createElement('div');
          fallback.style.width = '40px';
          fallback.style.height = '40px';
          fallback.style.display = 'flex';
          fallback.style.alignItems = 'center';
          fallback.style.justifyContent = 'center';
          fallback.style.backgroundColor = '#f0f0f0';
          fallback.style.borderRadius = '4px';
          fallback.textContent = '🖼️';
          target.parentNode?.appendChild(fallback);
        }}
      />
    );
  }

  // Default fallback
  return (
    <div
      style={{
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
      }}
    >
      📎
    </div>
  );
};
