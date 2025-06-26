'use client'

import { useEffect, useState } from 'react'
import type { Layout } from '@/payload-types'
import { Header } from './layout/Header'
import { Footer } from './layout/Footer'
import { Sidebar } from './layout/Sidebar'

interface LayoutWrapperProps {
  layout: string | Layout
  children: React.ReactNode
}

export function LayoutWrapper({ layout, children }: LayoutWrapperProps) {
  const [layoutData, setLayoutData] = useState<Layout | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLayout() {
      if (typeof layout === 'string') {
        try {
          const response = await fetch(`/api/layouts/${layout}`)
          if (response.ok) {
            const data = await response.json()
            setLayoutData(data)
          }
        } catch (error) {
          console.error('Failed to fetch layout:', error)
        }
      } else {
        setLayoutData(layout)
      }
      setLoading(false)
    }

    fetchLayout()
  }, [layout])

  if (loading || !layoutData) {
    return <div className="min-h-screen">{children}</div>
  }

  const containerClasses = {
    standard: 'max-w-7xl',
    wide: 'max-w-[1536px]',
    full: 'max-w-full',
    narrow: 'max-w-5xl',
  }

  const paddingClasses = {
    none: '',
    small: 'py-4 md:py-6',
    medium: 'py-8 md:py-12',
    large: 'py-12 md:py-16',
  }

  return (
    <div className={`layout layout--${layoutData.type}`}>
      {layoutData.header?.style !== 'hidden' && (
        <Header config={layoutData.header} />
      )}

      <main className={`main-content ${paddingClasses[(layoutData.spacing?.contentPadding || 'medium') as keyof typeof paddingClasses]}`}>
        <div className={`container mx-auto px-4 ${containerClasses[(layoutData.containerWidth || 'standard') as keyof typeof containerClasses]}`}>
          {layoutData.sidebar?.enabled ? (
            <div className={`flex gap-8 ${layoutData.sidebar.position === 'left' ? 'flex-row-reverse' : ''}`}>
              <div className="flex-1">
                {children}
              </div>
              <aside className={`sidebar sidebar--${layoutData.sidebar.width || 'medium'}`}>
                <Sidebar config={layoutData.sidebar} />
              </aside>
            </div>
          ) : (
            children
          )}
        </div>
      </main>

      {layoutData.footer?.style !== 'hidden' && (
        <Footer config={layoutData.footer} />
      )}

      {layoutData.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: layoutData.customCSS }} />
      )}
    </div>
  )
}