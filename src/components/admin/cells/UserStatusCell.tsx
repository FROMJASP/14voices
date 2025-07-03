'use client';

import React, { memo } from 'react';
import type { DefaultCellComponentProps } from 'payload';

export const UserStatusCell: React.FC<DefaultCellComponentProps> = memo(({ cellData }) => {
  const status = cellData || 'active';

  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return {
          backgroundColor: '#10b981',
          color: 'white',
        };
      case 'inactive':
        return {
          backgroundColor: '#6b7280',
          color: 'white',
        };
      case 'suspended':
        return {
          backgroundColor: '#ef4444',
          color: 'white',
        };
      default:
        return {
          backgroundColor: '#6b7280',
          color: 'white',
        };
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'suspended':
        return 'Suspended';
      default:
        return status;
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
          ...getStatusStyles(),
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: '500',
          textTransform: 'capitalize',
        }}
      >
        {getStatusLabel()}
      </span>
    </div>
  );
});

UserStatusCell.displayName = 'UserStatusCell';
