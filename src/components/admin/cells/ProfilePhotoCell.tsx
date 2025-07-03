'use client';

import React, { memo, useMemo } from 'react';
import type { DefaultCellComponentProps } from 'payload';
import { useDarkMode } from '@/hooks/useDarkMode';
import { getInitials } from '@/lib/initials';

export const ProfilePhotoCell: React.FC<DefaultCellComponentProps> = memo(
  ({ cellData, rowData }) => {
    const isDark = useDarkMode();

    // Handle populated upload relationship
    const imageUrl = useMemo(() => {
      // Check for uploaded avatar
      if (cellData) {
        // If it's populated (unlikely in list view)
        if (typeof cellData === 'object' && cellData.url) {
          return cellData.url;
        }
        // If we have sizes
        else if (typeof cellData === 'object' && cellData.sizes?.thumbnail?.url) {
          return cellData.sizes.thumbnail.url;
        }
      }

      return null;
    }, [cellData]);

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '8px 0',
        }}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Profile"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: isDark ? '2px solid #374151' : '2px solid #e5e7eb',
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
              border: isDark ? '2px solid #4b5563' : '2px solid #e5e7eb',
            }}
            title={cellData ? 'Photo uploaded' : 'No photo'}
          >
            {getInitials(rowData?.name || rowData?.email || 'User')}
          </div>
        )}
      </div>
    );
  }
);

ProfilePhotoCell.displayName = 'ProfilePhotoCell';
