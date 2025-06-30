'use client'

import React from 'react'
import type { CellComponentProps } from 'payload'

export const VoiceoverDemosCell: React.FC<CellComponentProps> = ({ rowData, cellData }) => {
  // cellData contains the primaryDemo value
  const primaryDemo = cellData || rowData?.primaryDemo
  const additionalDemos = rowData?.additionalDemos || []
  
  
  // Check if primaryDemo exists and get its data
  const hasPrimaryDemo = !!primaryDemo
  const demoFilename = primaryDemo?.filename || 
                      (typeof primaryDemo === 'object' && primaryDemo?.url ? primaryDemo.url.split('/').pop() : null)
  
  const totalDemos = (hasPrimaryDemo ? 1 : 0) + additionalDemos.length
  
  if (totalDemos === 0) {
    return (
      <span style={{ color: '#9ca3af', fontSize: '14px' }}>
        No demos
      </span>
    )
  }
  
  // Create audio element for primary demo if it exists
  const audioUrl = primaryDemo?.url || 
                   (typeof primaryDemo === 'object' && primaryDemo?.filename ? `/media/${primaryDemo.filename}` : null)
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {hasPrimaryDemo && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: '#10b981', flexShrink: 0 }}
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span style={{ fontSize: '14px', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {demoFilename || 'Primary Demo'}
            </span>
          </div>
          {audioUrl && (
            <audio 
              controls 
              style={{ 
                width: '200px', 
                height: '30px',
                marginTop: '4px'
              }}
              preload="none"
            >
              <source src={audioUrl} type="audio/mpeg" />
              <source src={audioUrl} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      )}
      {additionalDemos.length > 0 && (
        <span style={{ fontSize: '13px', color: '#6b7280' }}>
          +{additionalDemos.length} more demo{additionalDemos.length > 1 ? 's' : ''}
        </span>
      )}
    </div>
  )
}