'use client'

import React from 'react'
import { useConfig } from '@payloadcms/ui'

export default function Icon() {
  const [iconUrl, setIconUrl] = React.useState<string | null>(null)
  const config = useConfig()

  React.useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await fetch(`${config.serverURL}/api/globals/site-settings?depth=1`)
        if (response.ok) {
          const data = await response.json()
          if (data?.favicon?.url) {
            setIconUrl(data.favicon.url)
          }
        }
      } catch (error) {
        console.error('Failed to fetch site settings:', error)
      }
    }

    fetchSiteSettings()
  }, [config.serverURL])

  if (!iconUrl) {
    return (
      <div
        style={{
          width: '25px',
          height: '25px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          color: 'var(--theme-text)',
          backgroundColor: 'var(--theme-elevation-50)',
          borderRadius: '4px'
        }}
      >
        14
      </div>
    )
  }

  return (
    <div
      style={{
        width: '25px',
        height: '25px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--theme-elevation-100)',
        borderRadius: '4px',
        padding: '2px'
      }}
    >
      <img
        src={iconUrl}
        alt="14voices Icon"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'brightness(0) invert(1)'
        }}
      />
    </div>
  )
}