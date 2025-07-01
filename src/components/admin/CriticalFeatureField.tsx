'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'

export function CriticalFeatureField({ path, label, custom, required }: any) {
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
      <div className="field-label">
        <label htmlFor={path}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      </div>
      <div 
        className="checkbox-input"
        style={{
          backgroundColor: value ? 'transparent' : '#fef2f2',
          padding: value ? '8px' : '16px',
          borderRadius: '6px',
          border: value ? 'none' : '2px solid #ef4444',
          transition: 'all 0.2s ease',
          marginTop: '8px',
        }}
      >
        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            id={path}
            type="checkbox"
            checked={value || false}
            onChange={handleChange}
            style={{ marginRight: '8px', marginTop: '2px' }}
          />
          <div style={{ flex: 1 }}>
            {!value && (
              <div style={{ 
                marginBottom: '4px',
                fontSize: '13px',
                color: '#dc2626',
                fontWeight: '600',
              }}>
                ⚠️ This feature is currently DISABLED
              </div>
            )}
            <div style={{ 
              fontSize: '12px',
              color: value ? '#6b7280' : '#dc2626',
              lineHeight: '1.5',
            }}>
              {warningMessage}
            </div>
          </div>
        </label>
      </div>
    </div>
  )
}