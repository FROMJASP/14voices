'use client'

import { useState } from 'react'
import type { Form } from '@/payload-types'
import type { FormSettings } from '@/types/forms'

interface FormRendererProps {
  form: Form
}

export function FormRenderer({ form }: FormRendererProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleInputChange = (name: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    form.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label || field.name} is required`
      }
      
      // Additional validation based on field type
      if (formData[field.name] && field.validation) {
        const value = formData[field.name]
        
        if (field.validation.minLength && value.length < field.validation.minLength) {
          newErrors[field.name] = `Minimum length is ${field.validation.minLength}`
        }
        
        if (field.validation.maxLength && value.length > field.validation.maxLength) {
          newErrors[field.name] = `Maximum length is ${field.validation.maxLength}`
        }
        
        if (field.validation.pattern && typeof field.validation.pattern === 'string') {
          const regex = new RegExp(field.validation.pattern)
          if (!regex.test(value)) {
            newErrors[field.name] = (field.validation.customError as string) || 'Invalid format'
          }
        }
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setSubmitting(true)
    setSubmitError('')
    
    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: form.id,
          data: formData,
        }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setSubmitted(true)
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl
        }
      } else {
        if (result.errors) {
          setErrors(result.errors)
        } else {
          setSubmitError(result.message || (form.settings?.errorMessage as string) || 'An error occurred')
        }
      }
    } catch {
      setSubmitError((form.settings?.errorMessage as string) || 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-800">
          {(form.settings?.successMessage as string) || 'Thank you for your submission!'}
        </p>
      </div>
    )
  }

  const renderField = (field: Form['fields'][0] & { 
    fieldType?: string
    width?: string
    helpText?: string
    content?: string
  }) => {
    const baseClasses = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
    const errorClasses = errors[field.name] ? 'border-red-500' : ''
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return (
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`${baseClasses} ${errorClasses}`}
            required={field.required}
          />
        )
      
      case 'textarea':
        return (
          <textarea
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`${baseClasses} ${errorClasses} min-h-[120px]`}
            required={field.required}
          />
        )
      
      case 'select':
        return (
          <select
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`${baseClasses} ${errorClasses}`}
            required={field.required}
          >
            <option value="">Select...</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={formData[field.name] === option.value}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="mr-2"
                  required={field.required}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )
      
      case 'checkbox':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              name={field.name}
              checked={formData[field.name] || false}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              className="mr-2"
            />
            <span>{field.label}</span>
          </label>
        )
      
      case 'heading':
        return <h3 className="text-xl font-semibold">{field.content}</h3>
      
      case 'paragraph':
        return <p className="text-gray-600">{field.content}</p>
      
      default:
        return null
    }
  }

  const widthClasses = {
    full: 'col-span-full',
    half: 'col-span-full md:col-span-6',
    third: 'col-span-full md:col-span-4',
    'two-thirds': 'col-span-full md:col-span-8',
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-12 gap-4">
        {form.fields.map((field, index) => (
          <div
            key={index}
            className={widthClasses[('width' in field && field.width as keyof typeof widthClasses) || 'full']}
          >
            {field.type !== 'checkbox' && field.type !== 'hidden' && field.type !== 'heading' && field.type !== 'paragraph' && field.label && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            
            {renderField(field)}
            
            {'helpText' in field && field.helpText && (
              <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
            )}
            
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{submitError}</p>
        </div>
      )}

      <div className={`flex ${
        (form.settings as FormSettings)?.submitButton?.position === 'center' ? 'justify-center' :
        (form.settings as FormSettings)?.submitButton?.position === 'right' ? 'justify-end' :
        'justify-start'
      }`}>
        <button
          type="submit"
          disabled={submitting}
          className={`px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
            (form.settings as FormSettings)?.submitButton?.style === 'secondary'
              ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              : (form.settings as FormSettings)?.submitButton?.style === 'outline'
              ? 'border-2 border-gray-300 hover:bg-gray-100'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {submitting ? 'Submitting...' : ((form.settings as FormSettings)?.submitButton?.text || 'Submit')}
        </button>
      </div>
    </form>
  )
}