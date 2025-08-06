'use client';

import React from 'react';

export const SeverityCell: React.FC<{ cellData: any }> = ({ cellData }) => {
  const severities: Record<string, { label: string; color: string }> = {
    low: { label: 'Low', color: 'green' },
    medium: { label: 'Medium', color: 'yellow' },
    high: { label: 'High', color: 'orange' },
    critical: { label: 'Critical', color: 'red' },
  };

  const severity = severities[cellData as string] || { label: cellData as string, color: 'gray' };

  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: `var(--color-${severity.color}-100)`,
        color: `var(--color-${severity.color}-800)`,
      }}
    >
      {severity.label}
    </span>
  );
};
