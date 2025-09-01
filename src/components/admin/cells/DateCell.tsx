'use client';

import React, { memo } from 'react';
import type { DefaultCellComponentProps } from 'payload';
import { useTranslation } from '@payloadcms/ui';

const dutchMonths = [
  'januari',
  'februari',
  'maart',
  'april',
  'mei',
  'juni',
  'juli',
  'augustus',
  'september',
  'oktober',
  'november',
  'december',
];

export const DateCell: React.FC<DefaultCellComponentProps> = memo(({ cellData }) => {
  const { i18n } = useTranslation();

  if (!cellData) return <span>-</span>;

  const date = new Date(cellData);
  const isNL = i18n.language === 'nl';

  // Format date based on language
  if (isNL) {
    // Dutch format: "14 augustus, 2025 - 14:57"
    const day = date.getDate();
    const month = dutchMonths[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return (
      <span style={{ fontSize: '14px', color: 'var(--theme-text)' }}>
        {`${day} ${month}, ${year} - ${hours}:${minutes}`}
      </span>
    );
  } else {
    // English format: "14 August, 2025 - 14:57" (24-hour format)
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const formatted = date.toLocaleDateString('en-US', options);
    // Transform "August 14, 2025 at 14:57" to "14 August, 2025 - 14:57"
    const parts = formatted.match(/(\w+)\s+(\d+),\s+(\d+)\s+at\s+(\d+:\d+)/);

    if (parts) {
      const [_, month, day, year, time] = parts;
      return (
        <span style={{ fontSize: '14px', color: 'var(--theme-text)' }}>
          {`${day} ${month}, ${year} - ${time}`}
        </span>
      );
    }

    // Fallback
    return <span style={{ fontSize: '14px', color: 'var(--theme-text)' }}>{formatted}</span>;
  }
});

DateCell.displayName = 'DateCell';
