'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { TeamMember } from '@/payload-types'

interface TeamDisplayProps {
  data: {
    source?: 'all' | 'department' | 'featured' | 'selected'
    department?: string
    selectedMembers?: TeamMember[]
    headline?: string
    subheadline?: string
    displayType?: 'grid' | 'carousel' | 'list'
    columns?: string
    showBio?: boolean
    showEmail?: boolean
    showPhone?: boolean
    showSocial?: boolean
    showPhoto?: boolean
  }
}

export function TeamDisplay({ data }: TeamDisplayProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        let url = '/api/team?where[status][equals]=active&'
        
        if (data.source === 'featured') {
          url += 'where[featured][equals]=true&'
        } else if (data.source === 'department' && data.department) {
          url += `where[department][equals]=${data.department}&`
        } else if (data.source === 'selected' && data.selectedMembers && data.selectedMembers.length > 0) {
          setTeamMembers(data.selectedMembers)
          setLoading(false)
          return
        }
        
        url += 'sort=order'
        
        const response = await fetch(url)
        if (response.ok) {
          const result = await response.json()
          setTeamMembers(result.docs || [])
        }
      } catch (error) {
        console.error('Failed to fetch team members:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMembers()
  }, [data])

  if (loading) {
    return (
      <div className="team-loading animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (!teamMembers.length) {
    return null
  }

  const socialIcons = {
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
      </svg>
    ),
  }

  const renderTeamMember = (member: TeamMember) => (
    <div key={member.id} className="team-member text-center">
      <div className="relative mb-4 mx-auto w-48 h-48 md:w-56 md:h-56">
        {member.photo && typeof member.photo === 'object' && (
          <Image
            src={member.photo.url || ''}
            alt={member.name}
            fill
            className="object-cover rounded-full"
          />
        )}
      </div>
      
      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
      <p className="text-gray-600 mb-3">{member.role}</p>
      
      {data.showBio && member.bio && (
        <p className="text-sm text-gray-700 mb-4 max-w-xs mx-auto">{member.bio}</p>
      )}
      
      {data.showSocial && member.social && (
        <div className="flex justify-center gap-3">
          {member.social.linkedin && (
            <a
              href={member.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              {socialIcons.linkedin}
            </a>
          )}
          {member.social.twitter && (
            <a
              href={member.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-400 transition-colors"
            >
              {socialIcons.twitter}
            </a>
          )}
          {member.social.instagram && (
            <a
              href={member.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-600 transition-colors"
            >
              {socialIcons.instagram}
            </a>
          )}
        </div>
      )}
    </div>
  )

  const columnClasses = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-3',
    '4': 'md:grid-cols-4',
  }

  return (
    <section className="team-display py-16 md:py-20">
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
          <div className={`grid gap-8 ${columnClasses[data.columns as keyof typeof columnClasses] || 'md:grid-cols-3'}`}>
            {teamMembers.map(renderTeamMember)}
          </div>
        )}

        {data.displayType === 'carousel' && (
          <div className="team-carousel">
            <div className="flex gap-8 overflow-x-auto pb-4 snap-x">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex-none w-64 snap-center">
                  {renderTeamMember(member)}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.displayType === 'list' && (
          <div className="space-y-12 max-w-4xl mx-auto">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-none">
                  <div className="relative w-32 h-32">
                    {member.photo && typeof member.photo === 'object' && (
                      <Image
                        src={member.photo.url || ''}
                        alt={member.name}
                        fill
                        className="object-cover rounded-full"
                      />
                    )}
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-gray-600 mb-3">{member.role}</p>
                  {member.bio && <p className="text-gray-700">{member.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}