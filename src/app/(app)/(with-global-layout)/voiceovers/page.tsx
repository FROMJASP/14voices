'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { VoiceoverCard } from '@/components/VoiceoverCard';
import { getVoiceovers } from '@/lib/api';
import type { TransformedVoiceover } from '@/types/voiceover';

export default function VoiceoversPage() {
  const router = useRouter();
  const [voiceovers, setVoiceovers] = useState<TransformedVoiceover[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVoiceovers = async () => {
      try {
        const data = await getVoiceovers();
        setVoiceovers(data);
      } catch (error) {
        console.error('Failed to load voiceovers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadVoiceovers();
  }, []);

  const handleSelectVoiceover = (voiceoverId: string) => {
    // Navigate to the voiceover detail page
    const voiceover = voiceovers.find((v) => v.id === voiceoverId);
    if (voiceover) {
      router.push(`/voiceovers/${voiceover.slug}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Onze Voice-over Artiesten
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {voiceovers.map((voiceover) => (
          <VoiceoverCard
            key={voiceover.id}
            voice={{
              id: voiceover.id,
              name: voiceover.name,
              slug: voiceover.slug,
              profilePhoto: voiceover.profilePhoto?.url || null,
              tags:
                voiceover.styleTags?.map((tag) =>
                  tag.tag === 'custom' && tag.customTag ? tag.customTag : tag.tag
                ) || [],
              beschikbaar: true,
              availabilityText: 'Beschikbaar',
              demos:
                voiceover.demos?.map((demo) => ({
                  id: demo.id,
                  title: demo.title,
                  audioFile: { url: demo.audioFile.url },
                  duration: demo.duration || '1:00',
                })) || [],
            }}
            isSelected={false}
            onSelect={() => handleSelectVoiceover(voiceover.id)}
          />
        ))}
      </div>
    </div>
  );
}
