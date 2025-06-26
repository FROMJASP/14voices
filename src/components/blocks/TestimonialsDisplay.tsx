'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { Testimonial } from '@/payload-types'

interface TestimonialsDisplayProps {
  data: {
    source?: 'all' | 'featured' | 'rating' | 'selected'
    minRating?: number
    selectedTestimonials?: Testimonial[]
    limit?: number
    headline?: string
    subheadline?: string
    displayType?: 'grid' | 'carousel' | 'masonry'
    columns?: string
    showRating?: boolean
    showTitle?: boolean
    showCompany?: boolean
    showAvatar?: boolean
  }
}

export function TestimonialsDisplay({ data }: TestimonialsDisplayProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        let url = '/api/testimonials?'
        
        if (data.source === 'featured') {
          url += 'where[featured][equals]=true&'
        } else if (data.source === 'rating' && data.minRating) {
          url += `where[rating][greater_than_equal]=${data.minRating}&`
        } else if (data.source === 'selected' && data.selectedTestimonials && data.selectedTestimonials.length > 0) {
          // Handle selected testimonials differently
          setTestimonials(data.selectedTestimonials)
          setLoading(false)
          return
        }
        
        url += `limit=${data.limit || 6}&sort=-publishedDate`
        
        const response = await fetch(url)
        if (response.ok) {
          const result = await response.json()
          setTestimonials(result.docs || [])
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [data])

  if (loading) {
    return (
      <div className="testimonials-loading animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (!testimonials.length) {
    return null
  }

  const renderStars = (rating: string) => {
    const stars = parseInt(rating) || 5
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  const renderTestimonial = (testimonial: Testimonial) => (
    <div key={testimonial.id} className="testimonial-card bg-white rounded-lg shadow-lg p-6">
      {data.showRating && testimonial.rating && (
        <div className="mb-4">{renderStars(testimonial.rating)}</div>
      )}
      
      <blockquote className="text-gray-700 mb-4">
        &quot;{testimonial.testimonial}&quot;
      </blockquote>
      
      <div className="flex items-center gap-4">
        {data.showAvatar && testimonial.avatar && typeof testimonial.avatar === 'object' && (
          <Image
            src={testimonial.avatar.url || ''}
            alt={testimonial.name}
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
        
        <div>
          <p className="font-semibold">{testimonial.name}</p>
          {testimonial.title && <p className="text-sm text-gray-600">{testimonial.title}</p>}
          {testimonial.company && <p className="text-sm text-gray-600">{testimonial.company}</p>}
        </div>
      </div>
    </div>
  )

  return (
    <section className="testimonials-display py-16 md:py-20">
      <div className="container mx-auto px-4">
        {(data.headline || data.subheadline) && (
          <div className="text-center mb-12">
            {data.headline && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{data.headline}</h2>
            )}
            {data.subheadline && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">{data.subheadline}</p>
            )}
          </div>
        )}

        {data.displayType === 'grid' && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map(renderTestimonial)}
          </div>
        )}

        {data.displayType === 'carousel' && (
          <div className="testimonials-carousel">
            {/* Carousel implementation */}
            <div className="flex gap-8 overflow-x-auto pb-4 snap-x">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex-none w-full md:w-96 snap-center">
                  {renderTestimonial(testimonial)}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.displayType === 'masonry' && (
          <div className="space-y-8 max-w-3xl mx-auto">
            {testimonials.map(renderTestimonial)}
          </div>
        )}
      </div>
    </section>
  )
}