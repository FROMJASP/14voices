'use client';

import React, { memo, useMemo } from 'react';
import type { DefaultCellComponentProps } from 'payload';
import { useDarkMode } from '@/hooks/useDarkMode';

export const UserAvatarCell: React.FC<DefaultCellComponentProps> = memo(({ cellData, rowData }) => {
  const isDark = useDarkMode();

  const { imageUrl, initials, avatarColor } = useMemo(() => {
    // Check for avatarURL (which includes default avatar)
    if (rowData?.avatarURL) {
      return { imageUrl: rowData.avatarURL, initials: null, avatarColor: null };
    }

    // Check for uploaded avatar
    if (cellData) {
      if (typeof cellData === 'object' && cellData.url) {
        return { imageUrl: cellData.url, initials: null, avatarColor: null };
      }
    }

    // Generate initials
    const name = rowData?.name || rowData?.email || 'U';
    const parts = name.trim().split(' ').filter(Boolean);
    let initials = 'U';

    if (parts.length === 1) {
      initials = parts[0].charAt(0).toUpperCase();
    } else if (parts.length > 1) {
      initials = (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    return {
      imageUrl: null,
      initials,
      avatarColor: rowData?.avatarColor || '#3b82f6',
    };
  }, [cellData, rowData]);

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
          alt="Avatar"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: isDark ? '2px solid #374151' : '2px solid #e5e7eb',
          }}
        />
      ) : (
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: avatarColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600',
            color: 'white',
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );
});

UserAvatarCell.displayName = 'UserAvatarCell';
