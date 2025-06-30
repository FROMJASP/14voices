'use client'

import React from 'react'
import type { CellComponentProps } from 'payload'
import { useRouter } from 'next/navigation'
import { useDarkMode } from '@/hooks/useDarkMode'

export const NameCell: React.FC<CellComponentProps> = ({ cellData, rowData }) => {
  const router = useRouter()
  const isDark = useDarkMode()
  
  const handleClick = () => {
    if (rowData?.id) {
      router.push(`/admin/collections/voiceovers/${rowData.id}`)
    }
  }
  
  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center',
        minHeight: '56px',
        cursor: 'pointer'
      }}
      onClick={handleClick}
    >
      <span style={{ 
        fontSize: '14px', 
        fontWeight: '500',
        color: isDark ? '#f3f4f6' : '#111827',
        textDecoration: 'underline',
        textDecorationColor: 'transparent',
        transition: 'text-decoration-color 0.2s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.textDecorationColor = '#3b82f6'}
      onMouseLeave={(e) => e.currentTarget.style.textDecorationColor = 'transparent'}
      >
        {cellData || 'Unnamed'}
      </span>
    </div>
  )
}