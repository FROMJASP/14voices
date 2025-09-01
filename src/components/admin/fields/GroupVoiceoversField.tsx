'use client'

import React, { useEffect, useState } from 'react'
import { useFormFields } from '@payloadcms/ui'
import Link from 'next/link'

interface Voiceover {
  id: string
  name: string
  status: string
  availability?: {
    isAvailable?: boolean
  }
}

export const GroupVoiceoversField: React.FC = () => {
  const { id } = useFormFields(([fields]) => ({
    id: fields.id?.value,
  }))
  
  const [voiceovers, setVoiceovers] = useState<Voiceover[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchVoiceovers = async () => {
      try {
        const response = await fetch(`/api/voiceovers?where[group][equals]=${id}&limit=100`)
        const data = await response.json()
        setVoiceovers(data.docs || [])
      } catch (error) {
        console.error('Failed to fetch voiceovers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVoiceovers()
  }, [id])

  if (!id) {
    return (
      <div className="field-type text">
        <p className="text-gray-500">Save the group first to see voiceovers</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="field-type text">
        <p>Loading voiceovers...</p>
      </div>
    )
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    'more-voices': 'bg-blue-100 text-blue-800',
    archived: 'bg-red-100 text-red-800',
  }

  return (
    <div className="field-type">
      <div className="space-y-2">
        {voiceovers.length === 0 ? (
          <p className="text-gray-500">No voiceovers in this group yet</p>
        ) : (
          <div className="grid gap-2">
            {voiceovers.map((voiceover) => (
              <Link
                key={voiceover.id}
                href={`/admin/collections/voiceovers/${voiceover.id}`}
                className="block p-3 border rounded hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{voiceover.name}</span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[voiceover.status as keyof typeof statusColors] || statusColors.draft}`}>
                      {voiceover.status}
                    </span>
                    {voiceover.availability?.isAvailable === false && (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Unavailable
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">Edit →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="mt-4 text-sm text-gray-500">
          Total: {voiceovers.length} voiceover{voiceovers.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}

export default GroupVoiceoversField