import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getVoiceoverBySlug } from '@/lib/api'
import { AudioPlayer } from '@/components/AudioPlayer'
import { DemoPlayer } from '@/components/DemoPlayer'

// export async function generateStaticParams() {
//   const voiceovers = await getVoiceovers()
//   return voiceovers.map((voiceover) => ({
//     slug: voiceover.slug,
//   }))
// }

export default async function VoiceoverPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const voiceover = await getVoiceoverBySlug(slug)

  if (!voiceover) {
    notFound()
  }

  const primaryDemo = voiceover.demos?.find(demo => demo.isPrimary) || voiceover.demos?.[0]
  const otherDemos = voiceover.demos?.filter(demo => demo.id !== primaryDemo?.id) || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          {voiceover.profilePhoto && (
            <div className="aspect-square relative overflow-hidden rounded-lg mb-6">
              <Image
                src={voiceover.profilePhoto.url}
                alt={voiceover.profilePhoto.alt || voiceover.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{voiceover.name}</h1>
          
          {voiceover.bio && (
            <p className="text-gray-600 mb-6">{voiceover.bio}</p>
          )}
        </div>

        <div className="lg:col-span-2">
          {primaryDemo && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Featured Demo</h2>
              <AudioPlayer
                src={primaryDemo.audioFile.url}
                title={primaryDemo.title}
                artist={voiceover.name}
                className="mb-6"
              />
              
              {primaryDemo.tags && primaryDemo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {primaryDemo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {otherDemos.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">More Demos</h2>
              <div className="space-y-3">
                {otherDemos.map((demo) => (
                  <DemoPlayer
                    key={demo.id}
                    src={demo.audioFile.url}
                    title={demo.title}
                    demoType={demo.demoType}
                    duration={demo.duration}
                  />
                ))}
              </div>
            </div>
          )}

          {(!voiceover.demos || voiceover.demos.length === 0) && (
            <p className="text-gray-500 text-center py-8">No demos available yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}