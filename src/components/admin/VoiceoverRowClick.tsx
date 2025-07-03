'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function VoiceoverRowClick() {
  const router = useRouter()
  const listenerRef = useRef<((e: Event) => void) | null>(null)
  const containerRef = useRef<Element | null>(null)

  const handleRowClick = useCallback((e: Event) => {
    // Find the closest row element
    const target = e.target as HTMLElement
    const row = target.closest('.collection-list__list-item[data-collection="voiceovers"]')
    if (!row) return

    // Don't navigate if clicking on interactive elements
    const isInteractive = 
      target.tagName === 'INPUT' ||
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'SELECT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('a') ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('textarea') ||
      target.closest('[role="button"]') ||
      target.closest('[role="link"]')

    if (isInteractive) {
      return
    }

    // Get the row ID from various possible sources
    const rowId = 
      row.getAttribute('data-id') || 
      row.querySelector('input[type="checkbox"]')?.getAttribute('value') ||
      row.querySelector('[href*="/admin/collections/voiceovers/"]')?.getAttribute('href')?.split('/').pop()

    if (rowId && rowId !== 'create') {
      // Add visual feedback
      row.classList.add('navigating')
      
      // Navigate after a small delay for visual feedback
      setTimeout(() => {
        router.push(`/admin/collections/voiceovers/${rowId}`)
      }, 100)
    }
  }, [router])

  useEffect(() => {
    // Create a stable reference to the handler
    listenerRef.current = handleRowClick

    // Use a more robust selector and wait for DOM to be ready
    const setupListener = () => {
      // Try multiple selectors for better compatibility
      const tableContainer = 
        document.querySelector('.collection-list') ||
        document.querySelector('[data-collection="voiceovers"]')?.closest('.collection-list') ||
        document.querySelector('.collection-list__wrapper')

      if (!tableContainer) {
        // If container not found, retry after a delay
        const retryTimeout = setTimeout(setupListener, 500)
        return () => clearTimeout(retryTimeout)
      }

      containerRef.current = tableContainer

      // Add styles for hover effect
      const style = document.createElement('style')
      style.textContent = `
        .collection-list__list-item[data-collection="voiceovers"] {
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .collection-list__list-item[data-collection="voiceovers"]:hover {
          background-color: var(--theme-elevation-50);
        }
        .collection-list__list-item[data-collection="voiceovers"].navigating {
          background-color: var(--theme-elevation-100);
        }
      `
      document.head.appendChild(style)

      // Add event listener with options for better performance
      tableContainer.addEventListener('click', listenerRef.current!, { 
        passive: true,
        capture: false 
      })

      // Cleanup function
      return () => {
        if (containerRef.current && listenerRef.current) {
          containerRef.current.removeEventListener('click', listenerRef.current)
        }
        if (style.parentNode) {
          style.parentNode.removeChild(style)
        }
      }
    }

    // Start setup process
    const cleanup = setupListener()

    // Return cleanup function
    return () => {
      if (typeof cleanup === 'function') {
        cleanup()
      }
    }
  }, [handleRowClick])

  return null
}