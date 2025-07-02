import Image from 'next/image'
import Link from 'next/link'
import { UnifiedAudioPlayer } from './unified/UnifiedAudioPlayer'
import type { Voiceover } from '@/lib/api'

interface VoiceoverCardProps {
  voiceover: Voiceover
}

export function VoiceoverCard({ voiceover }: VoiceoverCardProps) {
  const primaryDemo = voiceover.demos?.find(demo => demo.isPrimary) || voiceover.demos?.[0]

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <Link href={`/voiceovers/${voiceover.slug}`} className="block">
        {voiceover.profilePhoto && (
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={voiceover.profilePhoto.url}
              alt={voiceover.profilePhoto.alt || voiceover.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{voiceover.name}</h2>
          
          {voiceover.bio && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">{voiceover.bio}</p>
          )}
        </div>
      </Link>

      {primaryDemo && (
        <div className="px-6 pb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Featured Demo</h3>
          <UnifiedAudioPlayer
            src={primaryDemo.audioFile.url}
            title={primaryDemo.title}
            demoType={primaryDemo.demoType}
            duration={primaryDemo.duration}
            variant="compact"
          />
        </div>
      )}
    </div>
  )
}