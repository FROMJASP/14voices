import { getVoiceovers } from '@/lib/api'
import { VoiceoverCard } from '@/components/VoiceoverCard'

export const dynamic = 'force-dynamic'

export default async function VoiceoversPage() {
  const voiceovers = await getVoiceovers()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Voiceover Artists</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {voiceovers.map((voiceover) => (
          <VoiceoverCard key={voiceover.id} voiceover={voiceover} />
        ))}
      </div>
    </div>
  )
}