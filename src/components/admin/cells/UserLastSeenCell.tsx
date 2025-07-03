'use client';

import React, { memo, useMemo } from 'react';
import type { DefaultCellComponentProps } from 'payload';
import { useDarkMode } from '@/hooks/useDarkMode';

export const UserLastSeenCell: React.FC<DefaultCellComponentProps> = memo(({ rowData }) => {
  const isDark = useDarkMode();

  const lastLogin = rowData?.security?.lastLogin;
  const createdAt = rowData?.createdAt;

  const { timeAgo, fullDate } = useMemo(() => {
    const dateToUse = lastLogin || createdAt;
    if (!dateToUse) return { timeAgo: 'Never', fullDate: 'Never logged in' };

    const date = new Date(dateToUse);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    let timeAgo = '';
    if (diffInMinutes < 1) {
      timeAgo = 'Just now';
    } else if (diffInMinutes < 60) {
      timeAgo = `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      timeAgo = `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      timeAgo = `${diffInDays}d ago`;
    } else if (diffInDays < 30) {
      timeAgo = `${Math.floor(diffInDays / 7)}w ago`;
    } else {
      timeAgo = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    const fullDate = date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return { timeAgo, fullDate };
  }, [lastLogin, createdAt]);

  const isOnline = useMemo(() => {
    if (!lastLogin) return false;
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    return diffInMinutes < 5;
  }, [lastLogin]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        height: '100%',
      }}
      title={fullDate}
    >
      {isOnline && (
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            flexShrink: 0,
          }}
        />
      )}
      <span
        style={{
          fontSize: '13px',
          color: isDark ? '#9ca3af' : '#6b7280',
        }}
      >
        {timeAgo}
      </span>
    </div>
  );
});

UserLastSeenCell.displayName = 'UserLastSeenCell';
