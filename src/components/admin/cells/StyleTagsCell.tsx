'use client'

import React from 'react'
import type { DefaultCellComponentProps } from 'payload'
import { useDarkMode } from '@/hooks/useDarkMode'

const tagLabels: Record<string, string> = {
  'autoriteit': 'Autoriteit',
  'jeugdig-fris': 'Jeugdig & Fris',
  'kwaliteit': 'Kwaliteit',
  'stoer': 'Stoer',
  'warm-donker': 'Warm & Donker',
  'zakelijk': 'Zakelijk',
}

const tagColors: Record<string, { bg: string; text: string }> = {
  'autoriteit': { bg: '#ddd6fe', text: '#6d28d9' },
  'jeugdig-fris': { bg: '#fef3c7', text: '#d97706' },
  'kwaliteit': { bg: '#dbeafe', text: '#1d4ed8' },
  'stoer': { bg: '#fee2e2', text: '#dc2626' },
  'warm-donker': { bg: '#f3e8ff', text: '#9333ea' },
  'zakelijk': { bg: '#e0e7ff', text: '#4f46e5' },
  'custom': { bg: '#f3f4f6', text: '#4b5563' },
}

export const StyleTagsCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  const isDark = useDarkMode()
  
  if (!cellData || !Array.isArray(cellData) || cellData.length === 0) {
    return (
      <span style={{ color: isDark ? '#6b7280' : '#9ca3af', fontSize: '14px' }}>
        No tags
      </span>
    )
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '4px',
      maxWidth: '300px',
      alignItems: 'center',
      minHeight: '56px'
    }}>
      {cellData.slice(0, 3).map((tagItem, index) => {
        const tagValue = tagItem.tag
        const label = tagValue === 'custom' 
          ? tagItem.customTag || 'Custom' 
          : tagLabels[tagValue] || tagValue
        const colors = tagColors[tagValue] || tagColors.custom

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
              whiteSpace: 'nowrap'
            }}
          >
            {label}
          </span>
        )
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
            color: '#6b7280'
          }}
        >
          +{cellData.length - 3}
        </span>
      )}
    </div>
  )
}