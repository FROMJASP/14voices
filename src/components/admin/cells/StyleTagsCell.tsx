'use client';

import React from 'react';
import type { DefaultCellComponentProps } from 'payload';

const tagLabels: Record<string, string> = {
  autoriteit: 'Autoriteit',
  'jeugdig-fris': 'Jeugdig & Fris',
  kwaliteit: 'Kwaliteit',
  stoer: 'Stoer',
  'warm-donker': 'Warm & Donker',
  zakelijk: 'Zakelijk',
};

const tagColors: Record<
  string,
  { light: { bg: string; text: string }; dark: { bg: string; text: string } }
> = {
  autoriteit: {
    light: { bg: '#ddd6fe', text: '#6d28d9' },
    dark: { bg: '#4c1d95', text: '#ddd6fe' },
  },
  'jeugdig-fris': {
    light: { bg: '#fef3c7', text: '#d97706' },
    dark: { bg: '#78350f', text: '#fcd34d' },
  },
  kwaliteit: {
    light: { bg: '#dbeafe', text: '#1d4ed8' },
    dark: { bg: '#1e3a8a', text: '#93bbfc' },
  },
  stoer: {
    light: { bg: '#fee2e2', text: '#dc2626' },
    dark: { bg: '#7f1d1d', text: '#f87171' },
  },
  'warm-donker': {
    light: { bg: '#f3e8ff', text: '#9333ea' },
    dark: { bg: '#581c87', text: '#c4b5fd' },
  },
  zakelijk: {
    light: { bg: '#e0e7ff', text: '#4f46e5' },
    dark: { bg: '#312e81', text: '#a5b4fc' },
  },
  custom: {
    light: { bg: '#f3f4f6', text: '#4b5563' },
    dark: { bg: '#374151', text: '#d1d5db' },
  },
};

export const StyleTagsCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  if (!cellData || !Array.isArray(cellData) || cellData.length === 0) {
    return (
      <span style={{ color: 'var(--theme-text-placeholder)', fontSize: '14px' }}>No tags</span>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        maxWidth: '300px',
        alignItems: 'center',
        minHeight: '56px',
      }}
    >
      {cellData.slice(0, 3).map((tagItem, index) => {
        const tagValue = tagItem.tag;
        const label =
          tagValue === 'custom' ? tagItem.customTag || 'Custom' : tagLabels[tagValue] || tagValue;
        const colorScheme = tagColors[tagValue] || tagColors.custom;
        const colors = colorScheme.light;

        return (
          <span
            key={index}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: colors.bg,
              color: colors.text,
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
        );
      })}
      {cellData.length > 3 && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: '#f3f4f6',
            color: '#6b7280',
          }}
        >
          +{cellData.length - 3}
        </span>
      )}
    </div>
  );
};
