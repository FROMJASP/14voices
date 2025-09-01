'use client';

import React, { memo } from 'react';
import type { DefaultCellComponentProps } from 'payload';
import { useRouter } from 'next/navigation';

export const PageTitleCell: React.FC<DefaultCellComponentProps> = memo(({ cellData, rowData }) => {
  const router = useRouter();
  const isHomePage = rowData?.slug === 'home';

  const handleClick = () => {
    if (rowData?.id) {
      router.push(`/admin/collections/pages/${rowData.id}`);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      {isHomePage && (
        <span title="This page cannot be deleted">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              color: 'var(--theme-text-dark)',
              flexShrink: 0,
            }}
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </span>
      )}
      <span
        style={{
          fontSize: '14px',
          fontWeight: '500',
          color: isHomePage ? 'var(--theme-text-dark)' : 'var(--theme-text)',
          textDecoration: 'underline',
          textDecorationColor: 'transparent',
          transition: 'text-decoration-color 0.2s',
          opacity: isHomePage ? 0.8 : 1,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.textDecorationColor = 'var(--theme-success-500)')
        }
        onMouseLeave={(e) => (e.currentTarget.style.textDecorationColor = 'transparent')}
      >
        {cellData || 'Untitled'}
      </span>
    </div>
  );
});

PageTitleCell.displayName = 'PageTitleCell';
