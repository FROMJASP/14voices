'use client'

import React from 'react'
import type { DefaultCellComponentProps } from 'payload'
import { useDarkMode } from '@/hooks/useDarkMode'

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  'active': { 
    label: 'Active', 
    color: '#059669', 
    bg: '#d1fae5' 
  },
  'draft': { 
    label: 'Draft', 
    color: '#6b7280', 
    bg: '#f3f4f6' 
  },
  'more-voices': { 
    label: 'More Voices', 
    color: '#7c3aed', 
    bg: '#ede9fe' 
  },
  'archived': { 
    label: 'Archived', 
    color: '#dc2626', 
    bg: '#fee2e2' 
  }
}

export const StatusCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  const isDark = useDarkMode()
  
  if (!cellData) {
    return (
      <span style={{ color: isDark ? '#6b7280' : '#9ca3af', fontSize: '14px' }}>
        No status
      </span>
    )
  }

  const config = statusConfig[cellData] || { 
    label: cellData, 
    color: '#6b7280', 
    bg: '#f3f4f6' 
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '6px',
      minHeight: '56px'
    }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '13px',
          fontWeight: '500',
          backgroundColor: config.bg,
          color: config.color,
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: config.color,
          }}
        />
        {config.label}
      </span>
    </div>
  )
}