'use client'

import { UnifiedAudioPlayer } from './unified/UnifiedAudioPlayer'

interface DemoPlayerProps {
  demos: Array<{
    id: string
    title: string
    audioUrl: string
  }>
  className?: string
}

export function DemoPlayer({ demos, className = '' }: DemoPlayerProps) {
  if (!demos || demos.length === 0) return null

  return (
    <div className={`space-y-4 ${className}`}>
      {demos.map((demo) => (
        <UnifiedAudioPlayer
          key={demo.id}
          src={demo.audioUrl}
          title={demo.title}
          variant="compact"
        />
      ))}
    </div>
  )
}