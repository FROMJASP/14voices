import { notFound } from 'next/navigation';
import { VoiceoverDetailClient } from '@/components/domains/voiceover/VoiceoverDetailClient';
import { fetchOptimized } from '@/lib/data-fetching-server';
import { transformVoiceoverData } from '@/lib/voiceover-utils';
import type { PayloadVoiceover } from '@/types/voiceover';

// Disable static generation for self-hosted deployments
// This prevents build-time database connection attempts
export const dynamic = 'force-dynamic';

interface VoiceoverPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function fetchVoiceoverBySlug(slug: string) {
  try {
    const result = await fetchOptimized({
      collection: 'voiceovers',
      where: {
        slug: {
          equals: slug,
        },
        status: {
          equals: 'active',
        },
      },
      limit: 1,
      depth: 2,
    });

    if (!result.docs || result.docs.length === 0) {
      return null;
    }

    // Transform the voiceover data to match the expected format
    const voiceover = transformVoiceoverData(result.docs[0] as PayloadVoiceover, 0);
    return voiceover;
  } catch (error) {
    console.error('Error fetching voiceover:', error);
    return null;
  }
}

export default async function VoiceoverPage({ params }: VoiceoverPageProps) {
  const { slug } = await params;
  const voiceover = await fetchVoiceoverBySlug(slug);

  if (!voiceover) {
    notFound();
  }

  return <VoiceoverDetailClient voiceover={voiceover} />;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: VoiceoverPageProps) {
  const { slug } = await params;
  const voiceover = await fetchVoiceoverBySlug(slug);

  if (!voiceover) {
    return {
      title: 'Voiceover Not Found',
    };
  }

  const description = voiceover.bio
    ? `${voiceover.bio.substring(0, 160)}...`
    : `Professionele Nederlandse voice-over van ${voiceover.name}. Boek nu voor uw project.`;

  return {
    title: `${voiceover.name} - Professional Voice-over | 14Voices`,
    description,
    openGraph: {
      title: `${voiceover.name} - Professional Voice-over`,
      description,
      images: voiceover.profilePhoto?.url
        ? [
            {
              url: voiceover.profilePhoto.url,
              width: 800,
              height: 600,
              alt: `Profile photo of ${voiceover.name}`,
            },
          ]
        : [],
    },
  };
}
