import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { VoiceoverShowcaseClient } from './VoiceoverShowcaseClient';
import { transformVoiceoverData, getStyleTagLabel } from '@/lib/voiceover-utils';

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
    transformVoiceoverData(voiceover, index)
  );

  const archiveVoiceovers = archiveResult.docs.map((voiceover, index) =>
    transformVoiceoverData(voiceover, index + activeResult.docs.length)
  );

  // Extract all unique tags for filtering
  const allTagsSet = new Set<string>();
  [...activeResult.docs, ...archiveResult.docs].forEach((voiceover) => {
    voiceover.styleTags?.forEach((tag: any) => {
      const label = getStyleTagLabel(tag);
      if (label && label !== 'Custom') {
        allTagsSet.add(label);
      }
    });
  });

  const allTags = Array.from(allTagsSet).sort();

  return (
    <VoiceoverShowcaseClient
      activeVoiceovers={activeVoiceovers}
      archiveVoiceovers={archiveVoiceovers}
      allTags={allTags}
    />
  );
}
