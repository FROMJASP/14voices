'use client'

import React from 'react'
import { useConfig } from '@payloadcms/ui'

export default function Logo() {
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null)
  const config = useConfig()

  React.useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await fetch(`${config.serverURL}/api/globals/site-settings`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (response.ok) {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json()
            if (data?.favicon?.url) {
              setLogoUrl(data.favicon.url)
            }
          }
        }
      } catch (error) {
      }
    }

    fetchSiteSettings()
  }, [config.serverURL])

  if (!logoUrl) {
    return (
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--theme-text)' }}>
        14voices
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}
    >
      <div
        style={{
          width: '35px',
          height: '35px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--theme-elevation-100)',
          borderRadius: '6px',
          padding: '4px'
        }}
      >
        <img
          src={logoUrl}
          alt="14voices Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)'
          }}
        />
      </div>
      <span style={{ 
        fontSize: '18px', 
        fontWeight: '600', 
        color: 'var(--theme-text)' 
      }}>
        14voices
      </span>
    </div>
  )
}