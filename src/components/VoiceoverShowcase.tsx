import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { VoiceoverShowcaseClient } from './VoiceoverShowcaseClient';
import { transformVoiceoverData, getStyleTagLabel } from '@/lib/voiceover-utils';
import { PayloadVoiceover } from '@/types/voiceover';

export async function VoiceoverShowcase() {
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

  // Fetch archive voiceovers
  const archiveResult = await payload.find({
    collection: 'voiceovers',
    where: {
      status: {
        equals: 'more-voices',
      },
    },
    depth: 2,
    limit: 100,
  });

  // Transform the data
  const activeVoiceovers = activeResult.docs.map((voiceover, index) =>
    transformVoiceoverData(voiceover as PayloadVoiceover, index)
  );

  const archiveVoiceovers = archiveResult.docs.map((voiceover, index) =>
    transformVoiceoverData(voiceover as PayloadVoiceover, index + activeResult.docs.length)
  );

  // Extract all unique tags for filtering
  const allTagsSet = new Set<string>();
  [...activeResult.docs, ...archiveResult.docs].forEach((voiceover) => {
    const typedVoiceover = voiceover as PayloadVoiceover;
    typedVoiceover.styleTags?.forEach((tag) => {
      const label = getStyleTagLabel(tag);
      if (label && label !== 'Custom') {
        allTagsSet.add(label);
      }
    });
  });

  const allTags = Array.from(allTagsSet).sort();

  // Transform voiceovers to match VoiceoverData interface
  const transformToVoiceoverData = (voiceovers: typeof activeVoiceovers) => {
    return voiceovers.map((v) => ({
      ...v,
      profilePhoto: v.profilePhoto?.url || null,
      demos: v.demos.map((demo) => ({
        id: demo.id,
        title: demo.title,
        url: demo.audioFile.url,
        duration: demo.duration || '0:30',
      })),
    }));
  };

  return (
    <VoiceoverShowcaseClient
      activeVoiceovers={transformToVoiceoverData(activeVoiceovers)}
      archiveVoiceovers={transformToVoiceoverData(archiveVoiceovers)}
      allTags={allTags}
    />
  );
}
