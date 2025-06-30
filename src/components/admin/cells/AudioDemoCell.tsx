'use client'

import React, { memo, useMemo } from 'react'
import type { CellComponentProps } from 'payload'
import { useDarkMode } from '@/hooks/useDarkMode'

export const AudioDemoCell: React.FC<CellComponentProps> = memo(({ cellData, rowData }) => {
  const isDark = useDarkMode()
  const content = useMemo(() => {
    const demos = []
    
    // Since this is being called for the primaryDemo field,
    // cellData should contain the primaryDemo data
    if (cellData) {
      if (typeof cellData === 'object' && cellData.filename) {
        // If the media is populated (has filename)
        demos.push(cellData.filename)
      } else if (typeof cellData === 'string') {
        // If it's just an ID, we can't show the filename
        demos.push('Demo uploaded')
      }
    }
    
    // Also check additional demos from rowData
    if (rowData?.additionalDemos && Array.isArray(rowData.additionalDemos)) {
      rowData.additionalDemos.forEach((demoItem) => {
        if (demoItem.title) {
          demos.push(demoItem.title)
        } else if (demoItem.demo?.filename) {
          demos.push(demoItem.demo.filename)
        }
      })
    }
    
    if (demos.length === 0) {
      return (
        <span style={{ color: isDark ? '#6b7280' : '#9ca3af', fontSize: '14px' }}>
          No demos
        </span>
      )
    }
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {demos.slice(0, 2).map((demo, index) => (
          <span key={index} style={{ fontSize: '13px', color: isDark ? '#e5e7eb' : '#374151' }}>
            {demo}
          </span>
        ))}
        {demos.length > 2 && (
          <span style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}>
            +{demos.length - 2} more
          </span>
        )}
      </div>
    )
  }, [cellData, rowData?.additionalDemos, isDark])

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center',
      minHeight: '56px'
    }}>
      {content}
    </div>
  )
})

AudioDemoCell.displayName = 'AudioDemoCell'