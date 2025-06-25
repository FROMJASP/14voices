'use client'

import React from 'react'

interface DemoListAudioPlayerProps {
  data?: {
    url?: string
    filename?: string
    mimeType?: string
  }
}

export const DemoListAudioPlayer: React.FC<DemoListAudioPlayerProps> = ({ data }) => {
  if (!data || !data.url) {
    return <span style={{ color: '#999' }}>No audio</span>
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <audio 
        controls 
        style={{ height: '30px', width: '200px' }}
        preload="none"
      >
        <source src={data.url} type={data.mimeType} />
      </audio>
      <span style={{ fontSize: '12px', color: '#666' }}>
        {data.filename}
      </span>
    </div>
  )
}

export default DemoListAudioPlayer