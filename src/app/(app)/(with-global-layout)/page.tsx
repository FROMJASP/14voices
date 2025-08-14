import { getPayload } from 'payload';
import configPromise from '@payload-config';
import type { Page } from '@/payload-types';
import { transformVoiceoverData } from '@/lib/voiceover-utils';
import type { PayloadVoiceover } from '@/types/voiceover';
import { HomepageWithDrawerOptimized } from '@/components/features/homepage/HomepageContainer';
import { OptimizedVoiceoverQueries } from '@/lib/database-optimizations';
import { getHomepageSettings } from '@/lib/homepage-settings';

export async function generateMetadata() {
  const payload = await getPayload({ config: configPromise });

  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
      status: {
        equals: 'published',
      },
    },
    limit: 1,
  });

  const page = pages.docs[0] as Page | undefined;

  if (!page) {
    return {
      title: '14voices',
      description: 'Professional voice-over services',
    };
  }

  const title = page.meta?.title || page.title;
  const description = page.meta?.description || '';
  const image =
    page.meta?.image && typeof page.meta.image === 'object' ? page.meta.image.url : undefined;

  return {
    title,
    description,
    openGraph: {
      title: page.openGraph?.title || title,
      description: page.openGraph?.description || description,
      images: image ? [{ url: image }] : [],
      type: page.openGraph?.type || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.openGraph?.title || title,
      description: page.openGraph?.description || description,
      images: image ? [image] : [],
    },
  };
}

export default async function HomePage() {
  try {
    console.log('Homepage: Starting optimized data fetch...');

    // Use optimized database queries with aggressive caching
    const [voiceoverData, heroSettings] = await Promise.all([
      OptimizedVoiceoverQueries.getHomepageVoiceovers({
        limit: 50,
        includeUnavailable: false,
        cacheTTL: 1000 * 60 * 30, // 30 minutes cache
      }),
      getHomepageSettings(),
    ]);

    // Ensure voiceoverData is an array
    const voiceoverArray = Array.isArray(voiceoverData) ? voiceoverData : [];
    console.log(`Homepage: Found ${voiceoverArray.length} voiceovers`);

    // Transform the data efficiently
    const voiceovers = voiceoverArray.map((voiceover: any, index: number) => {
      const transformed = transformVoiceoverData(voiceover as PayloadVoiceover, index);
      return transformed;
    });

    console.log('Homepage: Data transformed, rendering component...');

    return <HomepageWithDrawerOptimized voiceovers={voiceovers} heroSettings={heroSettings} />;
  } catch (error) {
    console.error('Homepage error:', error);

    // Optimized fallback with cached settings
    const fallbackHeroSettings = await getHomepageSettings().catch(() => ({
      hero: {
        title: 'Vind de stem die jouw merk laat spreken.',
        description: 'Een goed verhaal verdient een goede stem.',
        primaryButton: { text: 'Ontdek stemmen', url: '#voiceovers' },
        secondaryButton: { text: 'Hoe wij werken', url: '/hoe-het-werkt' },
        heroImage: '/header-image.png',
        stats: [
          { number: '14', label: 'Stemacteurs' },
          { number: '<48u', label: 'Snelle levering' },
          { number: '9.1/10', label: 'Klantbeoordeling' },
        ],
      },
    }));

    return <HomepageWithDrawerOptimized voiceovers={[]} heroSettings={fallbackHeroSettings} />;
  }
}
