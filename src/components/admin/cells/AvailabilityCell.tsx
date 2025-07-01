'use client'

import React from 'react'
import type { DefaultCellComponentProps } from 'payload'

export const AvailabilityCell: React.FC<DefaultCellComponentProps> = ({ rowData }) => {
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
            backgroundColor: '#d1fae5',
            color: '#059669',
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
            backgroundColor: '#fee2e2',
            color: '#dc2626',
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