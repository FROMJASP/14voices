'use client'

import React from 'react'
import type { CellComponentProps } from 'payload'
import { useDarkMode } from '@/hooks/useDarkMode'

export const ProfilePhotoCell: React.FC<CellComponentProps> = ({ cellData, rowData }) => {
  const isDark = useDarkMode()
  // Handle populated upload relationship
  let imageUrl = null
  
  // Since Payload doesn't populate relationships in list views,
  // we'll show a placeholder. The actual image is only available
  // when editing the document.
  if (cellData) {
    // If it's populated (unlikely in list view)
    if (typeof cellData === 'object' && cellData.url) {
      imageUrl = cellData.url
    }
    // If we have sizes
    else if (typeof cellData === 'object' && cellData.sizes?.thumbnail?.url) {
      imageUrl = cellData.sizes.thumbnail.url
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '8px 0'
    }}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Profile"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: isDark ? '2px solid #374151' : '2px solid #e5e7eb'
          }}
        />
      ) : (
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: isDark ? '#374151' : '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: '600',
            color: isDark ? '#9ca3af' : '#6b7280',
            border: isDark ? '2px solid #4b5563' : '2px solid #e5e7eb'
          }}
          title={cellData ? 'Photo uploaded' : 'No photo'}
        >
          {rowData?.name ? rowData.name.substring(0, 2).toUpperCase() : 'VP'}
        </div>
      )}
    </div>
  )
}