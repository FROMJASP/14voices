'use client'

import { useEffect, useState } from 'react'
import type { Block } from '@/payload-types'
import { BlockRenderer } from '@/components/BlockRenderer'

interface ReusableBlockProps {
  block: {
    block: string | Block
    blockType: 'reusableBlock'
  }
}

export function ReusableBlock({ block }: ReusableBlockProps) {
  const [blockData, setBlockData] = useState<Block | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlock() {
      if (typeof block.block === 'string') {
        try {
          const response = await fetch(`/api/blocks/${block.block}`)
          if (response.ok) {
            const data = await response.json()
            setBlockData(data)
          }
        } catch (error) {
          console.error('Failed to fetch block:', error)
        }
      } else {
        setBlockData(block.block)
      }
      setLoading(false)
    }

    fetchBlock()
  }, [block.block])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (!blockData) {
    return null
  }

  return <BlockRenderer block={blockData} />
}