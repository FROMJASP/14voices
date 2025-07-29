'use client';

import React from 'react';
import type { DefaultCellComponentProps } from 'payload';

const statusConfig: Record<
  string,
  { label: string; light: { color: string; bg: string }; dark: { color: string; bg: string } }
> = {
  active: {
    label: 'Main Page',
    light: { color: '#059669', bg: '#d1fae5' },
    dark: { color: '#34d399', bg: '#064e3b' },
  },
  draft: {
    label: 'Draft',
    light: { color: '#6b7280', bg: '#f3f4f6' },
    dark: { color: '#d1d5db', bg: '#374151' },
  },
  'more-voices': {
    label: 'More Voices',
    light: { color: '#7c3aed', bg: '#ede9fe' },
    dark: { color: '#c4b5fd', bg: '#581c87' },
  },
  archived: {
    label: 'Archived',
    light: { color: '#dc2626', bg: '#fee2e2' },
    dark: { color: '#f87171', bg: '#7f1d1d' },
  },
};

export const StatusCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  if (!cellData) {
    return (
      <span style={{ color: 'var(--theme-text-placeholder)', fontSize: '14px' }}>No status</span>
    );
  }

  const config = statusConfig[cellData] || {
    label: cellData,
    light: { color: '#6b7280', bg: '#f3f4f6' },
    dark: { color: '#d1d5db', bg: '#374151' },
  };

  const colors = config.light;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        minHeight: '56px',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '13px',
          fontWeight: '500',
          backgroundColor: colors.bg,
          color: colors.color,
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: colors.color,
          }}
        />
        {config.label}
      </span>
    </div>
  );
};
