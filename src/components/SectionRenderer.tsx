'use client'

import type { Section } from '@/payload-types'

interface SectionRendererProps {
  section: Section
}

export function SectionRenderer({ section }: SectionRendererProps) {
  const visibilityClasses = [
    section.visibility?.showOnDesktop !== false ? 'block' : 'hidden',
    section.visibility?.showOnTablet !== false ? 'md:block' : 'md:hidden',
    section.visibility?.showOnMobile !== false ? 'lg:block' : 'lg:hidden',
  ].join(' ')

  return (
    <section 
      className={`section section--${section.category} section--${section.style} ${visibilityClasses} ${section.customClasses || ''}`}
    >
      <div className="container mx-auto px-4">
        {/* Section content rendering will go here */}
        <div className="py-12">
          <h2 className="text-2xl font-bold mb-4">{section.name}</h2>
          {section.description && (
            <p className="text-gray-600">{section.description}</p>
          )}
        </div>
      </div>
    </section>
  )
}