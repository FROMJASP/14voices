'use client';

import React, { memo, useMemo } from 'react';
import type { DefaultCellComponentProps } from 'payload';
import { useDarkMode } from '@/hooks/useDarkMode';

export const UserAvatarCell: React.FC<DefaultCellComponentProps> = memo(({ cellData, rowData }) => {
  const isDark = useDarkMode();

  const { imageUrl, initials, avatarColor } = useMemo(() => {
    // Check if cellData is a populated media object
    if (cellData && typeof cellData === 'object' && cellData.url) {
      return { imageUrl: cellData.url, initials: null, avatarColor: null };
    }

    // Check avatarURL which should be resolved server-side
    if (rowData?.avatarURL && !rowData.avatarURL.includes('data:image/svg')) {
      return { imageUrl: rowData.avatarURL, initials: null, avatarColor: null };
    }

    // Check image property (fallback)
    if (rowData?.image && !rowData.image.includes('data:image/svg')) {
      return { imageUrl: rowData.image, initials: null, avatarColor: null };
    }

    // If we only have an ID, we can't fetch it client-side
    // The server-side hooks should have resolved this
    // Generate initials as fallback
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
        justifyContent: 'flex-start',
        width: '60px',
        minWidth: '60px',
        padding: '8px 12px',
      }}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt="Avatar"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: isDark ? '2px solid #374151' : '2px solid #e5e7eb',
            flexShrink: 0,
          }}
          onError={(e) => {
            // Hide broken image and show initials instead
            e.currentTarget.style.display = 'none';
            const initialsDiv = e.currentTarget.nextElementSibling as HTMLElement;
            if (initialsDiv) {
              initialsDiv.style.display = 'flex';
            }
          }}
        />
      ) : null}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: avatarColor,
          display: imageUrl ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          fontWeight: '600',
          color: 'white',
          flexShrink: 0,
        }}
      >
        {initials}
      </div>
    </div>
  );
});

UserAvatarCell.displayName = 'UserAvatarCell';
