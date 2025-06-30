'use client'

import React from 'react'
import type { CellComponentProps } from 'payload'
import Link from 'next/link'

export const VoiceoverNameCell: React.FC<CellComponentProps> = ({ rowData, cellData, field }) => {
  const name = cellData || rowData?.name || 'Unnamed'
  const id = rowData?.id
  
  // Debug logging to see what data we're getting
  console.log('VoiceoverNameCell data:', { name, profilePhoto: rowData?.profilePhoto, rowData })
  
  // The profilePhoto might be in different locations based on how data is structured
  let profilePhoto = rowData?.profilePhoto
  
  // Check various possible URL locations
  const photoUrl = profilePhoto?.url || 
                   profilePhoto?.thumbnailURL || 
                   profilePhoto?.sizes?.thumbnail?.url ||
                   (typeof profilePhoto === 'object' && profilePhoto?.filename ? `/media/${profilePhoto.filename}` : null)
  
  const content = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={profilePhoto?.alt || name}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #e5e7eb',
          }}
          onError={(e) => {
            console.error('Image failed to load:', photoUrl)
            // Hide image and show fallback on error
            const img = e.currentTarget
            const fallback = img.nextElementSibling as HTMLElement
            img.style.display = 'none'
            if (fallback) fallback.style.display = 'flex'
          }}
        />
      ) : null}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#e5e7eb',
          display: photoUrl ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#6b7280',
        }}
      >
        {typeof name === 'string' && name.length > 0 ? name.charAt(0).toUpperCase() : 'V'}
      </div>
      <span style={{ fontWeight: '500' }}>{name}</span>
    </div>
  )

  // Wrap in a Link to make it clickable
  if (id) {
    return (
      <Link href={`/admin/collections/voiceovers/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {content}
      </Link>
    )
  }

  return content
}