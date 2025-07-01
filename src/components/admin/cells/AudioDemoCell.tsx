'use client'

import React, { memo, useMemo } from 'react'
import type { DefaultCellComponentProps } from 'payload'

export const AudioDemoCell: React.FC<DefaultCellComponentProps> = memo(({ rowData }) => {
  const content = useMemo(() => {
    const demos = []
    
    // Check for the three specific demo types
    if (rowData?.fullDemoReel) {
      const demoData = rowData.fullDemoReel
      if (typeof demoData === 'object' && demoData.filename) {
        demos.push({ type: 'Full Demo', filename: demoData.filename })
      } else if (demoData) {
        demos.push({ type: 'Full Demo', filename: 'Uploaded' })
      }
    }
    
    if (rowData?.commercialsDemo) {
      const demoData = rowData.commercialsDemo
      if (typeof demoData === 'object' && demoData.filename) {
        demos.push({ type: 'Commercials', filename: demoData.filename })
      } else if (demoData) {
        demos.push({ type: 'Commercials', filename: 'Uploaded' })
      }
    }
    
    if (rowData?.narrativeDemo) {
      const demoData = rowData.narrativeDemo
      if (typeof demoData === 'object' && demoData.filename) {
        demos.push({ type: 'Narrative', filename: demoData.filename })
      } else if (demoData) {
        demos.push({ type: 'Narrative', filename: 'Uploaded' })
      }
    }
    
    if (demos.length === 0) {
      return (
        <span style={{ color: 'var(--theme-text-placeholder)', fontSize: '14px' }}>
          No demos
        </span>
      )
    }
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {demos.map((demo, index) => (
          <div key={index} style={{ fontSize: '13px' }}>
            <span style={{ fontWeight: '500', color: 'var(--theme-text)' }}>
              {demo.type}:
            </span>
            <span style={{ marginLeft: '4px', color: 'var(--theme-success-500)' }}>
              ✓
            </span>
          </div>
        ))}
      </div>
    )
  }, [rowData?.fullDemoReel, rowData?.commercialsDemo, rowData?.narrativeDemo])

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