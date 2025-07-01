'use client'

import React from 'react'
import { useConfig } from '@payloadcms/ui'

export default function DynamicFavicon() {
  const config = useConfig()
  const [lastFaviconUrl, setLastFaviconUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    const updateFavicon = async () => {
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
              const faviconUrl = data.favicon.url
            
              // Only update if URL has changed
              if (faviconUrl !== lastFaviconUrl) {
                setLastFaviconUrl(faviconUrl)
                
                // Remove existing favicons
                const existingLinks = document.querySelectorAll('link[rel*="icon"]')
                existingLinks.forEach(link => link.remove())

                // Determine the MIME type based on file extension or default
                let mimeType = 'image/x-icon'
                if (faviconUrl.includes('.png')) mimeType = 'image/png'
                else if (faviconUrl.includes('.jpg') || faviconUrl.includes('.jpeg')) mimeType = 'image/jpeg'
                else if (faviconUrl.includes('.svg')) mimeType = 'image/svg+xml'

                // Create new favicon links with different sizes
                const link16 = document.createElement('link')
                link16.rel = 'icon'
                link16.type = mimeType
                link16.sizes = '16x16'
                link16.href = faviconUrl
                
                const link32 = document.createElement('link')
                link32.rel = 'icon'
                link32.type = mimeType
                link32.sizes = '32x32'
                link32.href = faviconUrl
                
                // Shortcut icon for older browsers
                const shortcutLink = document.createElement('link')
                shortcutLink.rel = 'shortcut icon'
                shortcutLink.href = faviconUrl
                
                // Apple touch icon
                const appleLink = document.createElement('link')
                appleLink.rel = 'apple-touch-icon'
                appleLink.href = faviconUrl
                
                // Append all links to head
                document.head.appendChild(link16)
                document.head.appendChild(link32)
                document.head.appendChild(shortcutLink)
                document.head.appendChild(appleLink)
                
                // Set CSS variable for breadcrumb favicon
                document.documentElement.style.setProperty('--favicon-url', `url('${faviconUrl}')`)
                
                console.log('Admin favicon updated to:', faviconUrl)
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to update favicon:', error)
      }
    }

    // Initial update
    updateFavicon()

    // Set up polling to check for favicon updates every 5 minutes
    const interval = setInterval(updateFavicon, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [config.serverURL, lastFaviconUrl])

  // This component doesn't render anything visible
  return null
}