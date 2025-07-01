'use client'

import React from 'react'
import type { DefaultCellComponentProps } from 'payload'

const groupColors: Record<string, { light: { bg: string; text: string }, dark: { bg: string; text: string } }> = {
  blue: {
    light: { bg: '#dbeafe', text: '#1d4ed8' },
    dark: { bg: '#1e3a8a', text: '#93bbfc' }
  },
  purple: {
    light: { bg: '#e9d5ff', text: '#7c3aed' },
    dark: { bg: '#581c87', text: '#c4b5fd' }
  },
  green: {
    light: { bg: '#d1fae5', text: '#059669' },
    dark: { bg: '#064e3b', text: '#34d399' }
  },
  yellow: {
    light: { bg: '#fef3c7', text: '#d97706' },
    dark: { bg: '#78350f', text: '#fcd34d' }
  },
  red: {
    light: { bg: '#fee2e2', text: '#dc2626' },
    dark: { bg: '#7f1d1d', text: '#f87171' }
  },
  pink: {
    light: { bg: '#fce7f3', text: '#db2777' },
    dark: { bg: '#831843', text: '#f9a8d4' }
  },
  orange: {
    light: { bg: '#fed7aa', text: '#ea580c' },
    dark: { bg: '#7c2d12', text: '#fb923c' }
  },
  teal: {
    light: { bg: '#ccfbf1', text: '#0d9488' },
    dark: { bg: '#134e4a', text: '#2dd4bf' }
  },
  indigo: {
    light: { bg: '#e0e7ff', text: '#4f46e5' },
    dark: { bg: '#312e81', text: '#a5b4fc' }
  },
  gray: {
    light: { bg: '#f3f4f6', text: '#4b5563' },
    dark: { bg: '#374151', text: '#d1d5db' }
  }
}

export const GroupCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  
  if (!cellData) {
    return (
      <span style={{ 
        color: 'var(--theme-text-placeholder)', 
        fontSize: '14px' 
      }}>
        No group
      </span>
    )
  }
  
  // Handle both populated and unpopulated relationships
  const groupData = typeof cellData === 'object' ? cellData : null
  
  if (!groupData) {
    return (
      <span style={{ 
        color: 'var(--theme-text-placeholder)', 
        fontSize: '14px' 
      }}>
        Group assigned
      </span>
    )
  }
  
  const colorScheme = groupColors[groupData.color] || groupColors.gray
  
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '13px',
        fontWeight: '500',
        backgroundColor: colorScheme.light.bg,
        color: colorScheme.light.text,
        whiteSpace: 'nowrap',
        opacity: 0.9
      }}
    >
      {groupData.name || 'Unnamed Group'}
    </span>
  )
}