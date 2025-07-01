'use client'

import React, { memo, useCallback } from 'react'
import type { DefaultCellComponentProps } from 'payload'
import { useRouter } from 'next/navigation'

export const NameCell: React.FC<DefaultCellComponentProps> = memo(({ cellData, rowData }) => {
  const router = useRouter()
  
  const handleClick = useCallback(() => {
    if (rowData?.id) {
      router.push(`/admin/collections/voiceovers/${rowData.id}`)
    }
  }, [rowData?.id, router])
  
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
        // Use CSS variables that Payload provides for theming
        color: 'var(--theme-text)',
        textDecoration: 'underline',
        textDecorationColor: 'transparent',
        transition: 'text-decoration-color 0.2s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.textDecorationColor = 'var(--theme-success-500)'}
      onMouseLeave={(e) => e.currentTarget.style.textDecorationColor = 'transparent'}
      >
        {cellData || 'Unnamed'}
      </span>
    </div>
  )
})

NameCell.displayName = 'NameCell'