'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VoiceoverRowClick() {
  const router = useRouter()

  useEffect(() => {
    const handleRowClick = (e: MouseEvent) => {
      // Find the closest row element
      const row = (e.target as HTMLElement).closest('.collection-list__list-item[data-collection="voiceovers"]')
      if (!row) return

      // Don't navigate if clicking on checkbox, link, or button
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input')
      ) {
        return
      }

      // Get the row ID from data attribute or find it in the row
      const rowId = row.getAttribute('data-id') || 
                    row.querySelector('input[type="checkbox"]')?.getAttribute('value') ||
                    row.querySelector('[href*="/admin/collections/voiceovers/"]')?.getAttribute('href')?.split('/').pop()

      if (rowId) {
        router.push(`/admin/collections/voiceovers/${rowId}`)
      }
    }

    // Add click listener to the table container
    const tableContainer = document.querySelector('.collection-list')
    if (tableContainer) {
      tableContainer.addEventListener('click', handleRowClick)
    }

    return () => {
      if (tableContainer) {
        tableContainer.removeEventListener('click', handleRowClick)
      }
    }
  }, [router])

  return null
}