'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'

export function CriticalFeatureField({ path, label, custom }: any) {
  const { value, setValue } = useField({ path })
  const warningMessage = custom?.warningMessage || 'Disabling this feature may affect your website functionality.'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked
    
    if (!newValue && value) {
      // User is trying to disable a critical feature
      const confirmed = window.confirm(
        `⚠️ WARNING: ${warningMessage}\n\nAre you absolutely sure you want to disable this feature?`
      )
      if (confirmed) {
        setValue(newValue)
      }
    } else {
      setValue(newValue)
    }
  }

  return (
    <div className="field-type checkbox">
      <div 
        style={{
          backgroundColor: value ? 'transparent' : '#fef2f2',
          padding: value ? '0' : '16px',
          borderRadius: '6px',
          border: value ? 'none' : '2px solid #ef4444',
          transition: 'all 0.2s ease',
          marginBottom: '16px',
        }}
      >
        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={value || false}
            onChange={handleChange}
            style={{ marginRight: '8px', marginTop: '2px' }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{label}</div>
            {!value && (
              <div style={{ 
                marginTop: '4px',
                fontSize: '13px',
                color: '#dc2626',
                fontWeight: '600',
              }}>
                ⚠️ This feature is currently DISABLED
              </div>
            )}
            <div style={{ 
              marginTop: '4px',
              fontSize: '12px',
              color: value ? '#6b7280' : '#dc2626',
            }}>
              {warningMessage}
            </div>
          </div>
        </label>
      </div>
    </div>
  )
}