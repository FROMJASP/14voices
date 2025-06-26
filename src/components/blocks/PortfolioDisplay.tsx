'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { PortfolioProject } from '@/payload-types'

interface PortfolioDisplayProps {
  data: {
    source?: 'all' | 'featured' | 'category' | 'selected'
    category?: string
    selectedProjects?: PortfolioProject[]
    limit?: number
    headline?: string
    subheadline?: string
    displayType?: 'grid' | 'carousel' | 'masonry' | 'list'
    columns?: string
    showCategory?: boolean
    showClient?: boolean
    enableFiltering?: boolean
  }
}

export function PortfolioDisplay({ data }: PortfolioDisplayProps) {
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>('all')

  useEffect(() => {
    async function fetchProjects() {
      try {
        let url = '/api/portfolio?where[status][equals]=published&'
        
        if (data.source === 'featured') {
          url += 'where[featured][equals]=true&'
        } else if (data.source === 'category' && data.category) {
          url += `where[category][equals]=${data.category}&`
        } else if (data.source === 'selected' && data.selectedProjects && data.selectedProjects.length > 0) {
          setProjects(data.selectedProjects)
          setLoading(false)
          return
        }
        
        url += `limit=${data.limit || 6}&sort=-completedDate`
        
        const response = await fetch(url)
        if (response.ok) {
          const result = await response.json()
          setProjects(result.docs || [])
        }
      } catch (error) {
        console.error('Failed to fetch portfolio projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [data])

  if (loading) {
    return (
      <div className="portfolio-loading animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (!projects.length) {
    return null
  }

  const categories = [
    { label: 'All', value: 'all' },
    { label: 'Commercial', value: 'commercial' },
    { label: 'Corporate', value: 'corporate' },
    { label: 'E-Learning', value: 'elearning' },
    { label: 'Animation', value: 'animation' },
    { label: 'Video Game', value: 'videogame' },
  ]

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter)

  const renderProject = (project: PortfolioProject) => (
    <Link
      key={project.id}
      href={`/portfolio/${project.slug}`}
      className="portfolio-item group block"
    >
      <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
        {project.thumbnailImage && typeof project.thumbnailImage === 'object' && (
          <Image
            src={project.thumbnailImage.url || ''}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-sm font-medium">{project.client}</p>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-600 transition-colors">
        {project.title}
      </h3>
      
      {data.showCategory && project.category && (
        <p className="text-sm text-gray-600 capitalize mb-2">
          {project.category.replace('-', ' ')}
        </p>
      )}
      
      {data.showClient && project.client && (
        <p className="text-sm text-gray-600">{project.client}</p>
      )}
      
      {project.description && (
        <p className="text-sm text-gray-700 mt-2 line-clamp-2">{project.description}</p>
      )}
    </Link>
  )

  const columnClasses = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-3',
    '4': 'md:grid-cols-4',
  }

  return (
    <section className="portfolio-display py-16 md:py-20">
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

        {data.enableFiltering && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveFilter(cat.value)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeFilter === cat.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {data.displayType === 'grid' && (
          <div className={`grid gap-8 ${columnClasses[data.columns as keyof typeof columnClasses] || 'md:grid-cols-3'}`}>
            {filteredProjects.map(renderProject)}
          </div>
        )}

        {data.displayType === 'carousel' && (
          <div className="portfolio-carousel">
            <div className="flex gap-8 overflow-x-auto pb-4 snap-x">
              {filteredProjects.map((project) => (
                <div key={project.id} className="flex-none w-full md:w-96 snap-center">
                  {renderProject(project)}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.displayType === 'masonry' && (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="break-inside-avoid mb-8">
                {renderProject(project)}
              </div>
            ))}
          </div>
        )}

        {data.displayType === 'list' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            {filteredProjects.map((project) => (
              <div key={project.id} className="flex flex-col md:flex-row gap-6">
                <div className="flex-none w-full md:w-64">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    {project.thumbnailImage && typeof project.thumbnailImage === 'object' && (
                      <Image
                        src={project.thumbnailImage.url || ''}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">
                    <Link href={`/portfolio/${project.slug}`} className="hover:text-blue-600 transition-colors">
                      {project.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-2">{project.client}</p>
                  {project.description && (
                    <p className="text-gray-700">{project.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}