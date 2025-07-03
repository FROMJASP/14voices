'use client';

import React, { memo } from 'react';
import type { DefaultCellComponentProps } from 'payload';
import { useDarkMode } from '@/hooks/useDarkMode';

export const UserRoleCell: React.FC<DefaultCellComponentProps> = memo(({ cellData }) => {
  const isDark = useDarkMode();
  const role = cellData || 'user';

  const getRoleStyles = () => {
    switch (role) {
      case 'admin':
        return {
          backgroundColor: isDark ? '#7c3aed' : '#8b5cf6',
          color: 'white',
        };
      case 'editor':
        return {
          backgroundColor: isDark ? '#2563eb' : '#3b82f6',
          color: 'white',
        };
      case 'user':
        return {
          backgroundColor: isDark ? '#374151' : '#e5e7eb',
          color: isDark ? '#d1d5db' : '#374151',
        };
      default:
        return {
          backgroundColor: isDark ? '#374151' : '#e5e7eb',
          color: isDark ? '#d1d5db' : '#374151',
        };
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'editor':
        return 'Editor';
      case 'user':
        return 'User';
      default:
        return role;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <span
        style={{
          ...getRoleStyles(),
          padding: '4px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '500',
        }}
      >
        {getRoleLabel()}
      </span>
    </div>
  );
});

UserRoleCell.displayName = 'UserRoleCell';
