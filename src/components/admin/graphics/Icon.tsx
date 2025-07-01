'use client'

import React from 'react'

export default function Icon() {
  const [iconUrl, setIconUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await fetch('/api/globals/site-settings', {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (response.ok) {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json()
            if (data?.favicon?.url) {
              setIconUrl(data.favicon.url)
            }
          }
        }
      } catch {
        // Silently fail if settings can't be fetched
      }
    }

    fetchSiteSettings()
  }, [])

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
        position: 'relative'
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconUrl}
        alt="14voices Icon"
        style={{
          width: '17px',
          height: '17px',
          objectFit: 'contain',
          filter: 'brightness(0) invert(1)',
          flexShrink: 0
        }}
      />
    </div>
  )
}