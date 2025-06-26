'use client'

import { useEffect, useState } from 'react'
import type { Section } from '@/payload-types'
import { SectionRenderer } from '@/components/SectionRenderer'

interface SectionBlockProps {
  block: {
    section: string | Section
    blockType: 'section'
  }
}

export function SectionBlock({ block }: SectionBlockProps) {
  const [sectionData, setSectionData] = useState<Section | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSection() {
      if (typeof block.section === 'string') {
        try {
          const response = await fetch(`/api/sections/${block.section}`)
          if (response.ok) {
            const data = await response.json()
            setSectionData(data)
          }
        } catch (error) {
          console.error('Failed to fetch section:', error)
        }
      } else {
        setSectionData(block.section)
      }
      setLoading(false)
    }

    fetchSection()
  }, [block.section])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (!sectionData) {
    return null
  }

  return <SectionRenderer section={sectionData} />
}