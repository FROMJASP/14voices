'use client'

import React, { useEffect, useState } from 'react'

interface AudioPlayerProps {
  value?: string | { url?: string; filename?: string }
  path: string
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ value }) => {
  const [audioUrl, setAudioUrl] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')

  useEffect(() => {
    if (value) {
      if (typeof value === 'string') {
        // If it's just an ID, we'd need to fetch the full document
        // For now, we'll just show the ID
        setFileName(`Audio ID: ${value}`)
      } else if (value && typeof value === 'object' && value.url) {
        // If we have the full upload object with URL
        setAudioUrl(value.url)
        setFileName(value.filename || 'Audio Demo')
      }
    }
  }, [value])

  if (!value) {
    return <div style={{ color: '#999' }}>No audio selected</div>
  }

  return (
    <div style={{ 
      padding: '10px', 
      border: '1px solid #e0e0e0', 
      borderRadius: '4px',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
        {fileName}
      </div>
      {audioUrl && (
        <audio 
          controls 
          style={{ width: '100%', maxWidth: '400px' }}
          preload="metadata"
        >
          <source src={audioUrl} />
          Your browser does not support the audio element.
        </audio>
      )}
      {!audioUrl && (
        <div style={{ color: '#666', fontSize: '12px' }}>
          Audio preview not available - save to generate preview
        </div>
      )}
    </div>
  )
}

export default AudioPlayer