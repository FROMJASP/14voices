'use client'

import { useEffect } from 'react'

export function DynamicFavicon() {
  useEffect(() => {
    async function updateFavicon() {
      try {
        const response = await fetch('/api/site-settings')
        if (!response.ok) return
        
        const settings = await response.json()
        
        if (settings?.favicon?.url) {
          // Remove any existing favicon links
          const existingLinks = document.querySelectorAll('link[rel*="icon"]')
          existingLinks.forEach(link => link.remove())
          
          // Create new favicon links
          const iconUrl = settings.favicon.url
          
          // Standard favicon
          const link = document.createElement('link')
          link.rel = 'icon'
          link.type = 'image/x-icon'
          link.href = iconUrl
          document.head.appendChild(link)
          
          // Apple touch icon
          const appleLink = document.createElement('link')
          appleLink.rel = 'apple-touch-icon'
          appleLink.href = iconUrl
          document.head.appendChild(appleLink)
          
          // Shortcut icon (for older browsers)
          const shortcutLink = document.createElement('link')
          shortcutLink.rel = 'shortcut icon'
          shortcutLink.href = iconUrl
          document.head.appendChild(shortcutLink)
        }
      } catch (error) {
        console.error('Failed to fetch favicon:', error)
      }
    }
    
    updateFavicon()
  }, [])
  
  return null
}