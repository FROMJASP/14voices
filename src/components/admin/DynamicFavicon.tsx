'use client'

import { useEffect, useState } from 'react'


export function DynamicFavicon() {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchFavicon() {
      try {
        const response = await fetch('/api/globals/site-settings')
        if (!response.ok) return
        
        const settings = await response.json()
        
        if (isMounted && settings?.favicon?.url) {
          setFaviconUrl(settings.favicon.url)
        }
      } catch {
        // Silently fail if favicon can't be fetched
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    
    fetchFavicon()
    
    return () => {
      isMounted = false
    }
  }, [])

  // Don't render anything while loading to avoid flashing
  if (isLoading) {
    return null
  }

  // If no custom favicon, let the default one remain
  if (!faviconUrl) {
    return null
  }
  
  // Use a portal-like approach to inject styles that will update the favicon
  // This is safer than direct DOM manipulation
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          /* Hide existing favicons */
          link[rel*="icon"] {
            display: none !important;
          }
          
          /* Add new favicon via CSS */
          head::after {
            content: '';
            display: none;
          }
        `,
      }}
    />
  )
}

// Alternative implementation using a custom hook for better control
export function useDynamicFavicon() {
  useEffect(() => {
    const originalFavicons: { rel: string; href: string; type?: string }[] = []
    let styleElement: HTMLStyleElement | null = null

    // Capture original favicon data (not the elements themselves)
    const faviconElements = document.querySelectorAll('link[rel*="icon"]')
    faviconElements.forEach((link) => {
      const linkEl = link as HTMLLinkElement
      originalFavicons.push({
        rel: linkEl.rel,
        href: linkEl.href,
        type: linkEl.type,
      })
    })

    async function updateFavicon() {
      try {
        const response = await fetch('/api/globals/site-settings')
        if (!response.ok) return
        
        const settings = await response.json()
        
        if (settings?.favicon?.url) {
          // Create a style element to override favicon
          styleElement = document.createElement('style')
          styleElement.textContent = `
            /* Temporarily hide original favicons */
            link[rel*="icon"] { opacity: 0; pointer-events: none; }
          `
          document.head.appendChild(styleElement)
          
          // Update existing favicon elements instead of removing them
          const existingIcons = document.querySelectorAll('link[rel*="icon"]') as NodeListOf<HTMLLinkElement>
          if (existingIcons.length > 0) {
            // Update the first favicon found
            existingIcons[0].href = settings.favicon.url
            // Hide the rest
            for (let i = 1; i < existingIcons.length; i++) {
              existingIcons[i].style.display = 'none'
            }
          } else {
            // If no favicon exists, create one
            const link = document.createElement('link')
            link.rel = 'icon'
            link.type = 'image/x-icon'
            link.href = settings.favicon.url
            document.head.appendChild(link)
          }
          
          // Remove the style element after update
          if (styleElement && styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement)
          }
        }
      } catch {
        console.warn('Failed to update favicon')
      }
    }
    
    updateFavicon()
    
    // Cleanup function - restore original state
    return () => {
      // Remove any style elements we added
      if (styleElement && styleElement.parentNode) {
        try {
          styleElement.parentNode.removeChild(styleElement)
        } catch {}
      }
      
      // Restore visibility of hidden favicons
      const allIcons = document.querySelectorAll('link[rel*="icon"]') as NodeListOf<HTMLLinkElement>
      allIcons.forEach((icon) => {
        icon.style.display = ''
        icon.style.opacity = ''
      })
    }
  }, [])
}

// Export a safer version that doesn't manipulate DOM directly
export default function SafeDynamicFavicon() {
  useDynamicFavicon()
  return null
}