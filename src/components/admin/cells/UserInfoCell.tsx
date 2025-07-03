'use client';

import React, { memo, useCallback } from 'react';
import type { DefaultCellComponentProps } from 'payload';
import { useRouter } from 'next/navigation';
import { useDarkMode } from '@/hooks/useDarkMode';

export const UserInfoCell: React.FC<DefaultCellComponentProps> = memo(({ rowData }) => {
  const router = useRouter();
  const isDark = useDarkMode();

  const handleClick = useCallback(() => {
    if (rowData?.id) {
      router.push(`/admin/collections/users/${rowData.id}`);
    }
  }, [rowData?.id, router]);

  const name = rowData?.name || 'Unnamed User';
  const email = rowData?.email || '';
  const department = rowData?.department;
  const jobTitle = rowData?.jobTitle;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        padding: '8px 0',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <span
        style={{
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--theme-text)',
          textDecoration: 'underline',
          textDecorationColor: 'transparent',
          transition: 'text-decoration-color 0.2s',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.textDecorationColor = 'var(--theme-success-500)')
        }
        onMouseLeave={(e) => (e.currentTarget.style.textDecorationColor = 'transparent')}
      >
        {name}
      </span>
      <div
        style={{
          fontSize: '12px',
          color: isDark ? '#9ca3af' : '#6b7280',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>{email}</span>
        {jobTitle && (
          <>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>{jobTitle}</span>
          </>
        )}
        {department && (
          <>
            <span style={{ opacity: 0.5 }}>•</span>
            <span style={{ textTransform: 'capitalize' }}>{department}</span>
          </>
        )}
      </div>
    </div>
  );
});

UserInfoCell.displayName = 'UserInfoCell';
