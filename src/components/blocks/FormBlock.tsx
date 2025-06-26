'use client'

import { useEffect, useState } from 'react'
import type { Form } from '@/payload-types'
import { FormRenderer } from '@/components/FormRenderer'

interface FormBlockProps {
  block: {
    form: string | Form
    showTitle?: boolean
    showDescription?: boolean
    blockType: 'form'
  }
}

export function FormBlock({ block }: FormBlockProps) {
  const [formData, setFormData] = useState<Form | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchForm() {
      if (typeof block.form === 'string') {
        try {
          const response = await fetch(`/api/forms/${block.form}`)
          if (response.ok) {
            const data = await response.json()
            setFormData(data)
          }
        } catch (error) {
          console.error('Failed to fetch form:', error)
        }
      } else {
        setFormData(block.form)
      }
      setLoading(false)
    }

    fetchForm()
  }, [block.form])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (!formData || formData.status !== 'active') {
    return null
  }

  return (
    <div className="form-block py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {block.showTitle !== false && formData.title && (
            <h2 className="text-3xl font-bold mb-4">{formData.title}</h2>
          )}
          {block.showDescription !== false && formData.description && (
            <p className="text-gray-600 mb-8">{formData.description}</p>
          )}
          <FormRenderer form={formData} />
        </div>
      </div>
    </div>
  )
}