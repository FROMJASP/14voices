'use client'

import { useState, useRef } from 'react'
import { Play, Pause } from 'lucide-react'

interface DemoPlayerProps {
  src: string
  title: string
  demoType?: string
  duration?: string
  className?: string
}

export function DemoPlayer({ src, title, demoType, duration, className = '' }: DemoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors ${className}`}>
      <audio
        ref={audioRef}
        src={src}
        onEnded={() => setIsPlaying(false)}
        preload="none"
      />
      
      <button
        onClick={togglePlayPause}
        className="p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">{title}</h4>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          {demoType && <span className="capitalize">{demoType}</span>}
          {demoType && duration && <span>•</span>}
          {duration && <span>{duration}</span>}
        </div>
      </div>
    </div>
  )
}