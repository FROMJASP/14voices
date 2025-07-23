import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { transformVoiceoverData } from '@/lib/voiceover-utils';
import type { Voiceover as PayloadVoiceover } from '@/payload-types';
import { VoiceoverSearchFieldDesign } from './VoiceoverSearchFieldDesign';
import { VoiceoverProvider } from '@/contexts/VoiceoverContext';
import { PriceCalculator } from './PriceCalculator';

export async function VoiceoverSearchSection() {
  const payload = await getPayload({ config: configPromise });

  // Fetch active voiceovers
  const activeResult = await payload.find({
    collection: 'voiceovers',
    where: {
      status: {
        equals: 'active',
      },
    },
    depth: 2,
    limit: 100,
  });

  // Transform the data
  const voiceovers = activeResult.docs.map((voiceover, index) =>
    transformVoiceoverData(voiceover as PayloadVoiceover, index)
  );

  return (
    <VoiceoverProvider>
      <VoiceoverSearchFieldDesign voiceovers={voiceovers} />
      <PriceCalculator />
    </VoiceoverProvider>
  );
}