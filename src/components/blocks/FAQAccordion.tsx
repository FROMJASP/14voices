'use client'

import { useState } from 'react'
import { RichText } from '@/components/RichText'
import type { FAQAccordionData } from '@/types/blocks'

interface FAQAccordionProps {
  data: FAQAccordionData | null | undefined
}

export function FAQAccordion({ data }: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<number[]>([0])

  if (!data || !data.faqs) return null

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <section className="faq-accordion py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {(data.headline || data.subheadline) && (
            <div className="text-center mb-12">
              {data.headline && (
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {data.headline}
                </h2>
              )}
              {data.subheadline && (
                <p className="text-lg text-gray-600">
                  {data.subheadline}
                </p>
              )}
            </div>
          )}

          <div className="space-y-4">
            {data.faqs.map((faq, index) => {
              const isOpen = openItems.includes(index)
              
              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-lg">
                      {faq.question}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <div className="prose prose-gray max-w-none">
                        <RichText content={faq.answer} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}