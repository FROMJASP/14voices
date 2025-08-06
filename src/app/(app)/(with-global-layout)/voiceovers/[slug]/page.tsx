import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { UnifiedPriceCalculatorOptimized } from '@/components/features/pricing';
import { VoiceoverProvider } from '@/contexts/VoiceoverContext';
import { transformVoiceoverData } from '@/lib/voiceover-utils';
import { VoiceoverDetailClientNew } from '@/components/features/voiceover';
import type { PayloadVoiceover } from '@/types/voiceover';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: 'voiceovers',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  });

  const voiceover = result.docs[0];

  if (!voiceover) {
    return {
      title: 'Voiceover niet gevonden',
    };
  }

  const firstName = voiceover.name.split(' ')[0];
  return {
    title: `${firstName} - 14voices`,
    description: voiceover.description || `Professionele voice-over door ${firstName}`,
  };
}

export default async function VoiceoverPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: 'voiceovers',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
    limit: 1,
  });

  const voiceover = result.docs[0];

  if (!voiceover) {
    notFound();
  }

  // Transform the voiceover data
  const transformedVoiceover = transformVoiceoverData(voiceover as unknown as PayloadVoiceover, 0);

  // Pre-selected voiceover data for context
  const preSelectedVoiceover = {
    id: String(voiceover.id),
    name: voiceover.name,
    profilePhoto:
      voiceover.profilePhoto && typeof voiceover.profilePhoto === 'object'
        ? (voiceover.profilePhoto.url ?? undefined)
        : undefined,
    styleTags: transformedVoiceover.tags,
  };

  return (
    <VoiceoverProvider initialVoiceover={preSelectedVoiceover}>
      <div className="min-h-screen">
        <VoiceoverDetailClientNew
          voiceover={{
            ...transformedVoiceover,
            profilePhoto: transformedVoiceover.profilePhoto?.url || null,
            demos: transformedVoiceover.demos.map((demo) => ({
              id: demo.id,
              title: demo.title,
              url: demo.audioFile.url,
              duration: demo.duration || '0:30',
            })),
          }}
        />

        {/* Price Calculator Section */}
        <div className="bg-[#fcf9f5] dark:bg-gray-900 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Bereken je prijs
            </h2>
            <UnifiedPriceCalculatorOptimized />
          </div>
        </div>
      </div>
    </VoiceoverProvider>
  );
}
