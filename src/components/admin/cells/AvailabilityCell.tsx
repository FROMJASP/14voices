'use client'

import React from 'react'
import type { DefaultCellComponentProps } from 'payload'
import { useDarkMode } from '@/hooks/useDarkMode'

export const AvailabilityCell: React.FC<DefaultCellComponentProps> = ({ rowData }) => {
  const isDark = useDarkMode()
  const isAvailable = rowData?.availability?.isAvailable !== false

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '56px',
      width: '100%'
    }}>
      {isAvailable ? (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: isDark ? '#064e3b' : '#d1fae5',
            color: isDark ? '#34d399' : '#059669',
            fontSize: '16px'
          }}
          title="Available"
        >
          ✓
        </span>
      ) : (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: isDark ? '#7f1d1d' : '#fee2e2',
            color: isDark ? '#f87171' : '#dc2626',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
          title="Not available"
        >
          ✕
        </span>
      )}
    </div>
  )
}