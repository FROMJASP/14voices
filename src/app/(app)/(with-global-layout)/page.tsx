import { getPayload } from 'payload';
import configPromise from '@payload-config';
import type { Page } from '@/payload-types';
import { transformVoiceoverData } from '@/lib/voiceover-utils';
import type { PayloadVoiceover } from '@/types/voiceover';
import { HomepageWithDrawerOptimized } from '@/components/HomepageWithDrawerOptimized';
import { fetchOptimized } from '@/lib/data-fetching-server';

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

    // Fetch active voiceovers with optimized caching and query
    const activeResult = await fetchOptimized({
      collection: 'voiceovers',
      where: {
        status: {
          equals: 'active',
        },
      },
      limit: 50, // Initial load limit
      depth: 2,
      sort: '-updatedAt',
      cacheTTL: 1000 * 60 * 15, // 15 minutes cache for homepage
    });

    console.log(`Homepage: Found ${activeResult.docs.length} voiceovers`);

    // Transform the data
    const voiceovers = activeResult.docs.map((voiceover, index) =>
      transformVoiceoverData(voiceover as PayloadVoiceover, index)
    );

    console.log('Homepage: Data transformed, rendering component...');

    // If no voiceovers found, still render the component - it will show empty state
    return <HomepageWithDrawerOptimized voiceovers={voiceovers} />;
  } catch (error) {
    console.error('Homepage error:', error);
    
    // Fallback UI - render empty array to show proper empty state
    console.log('Homepage: Rendering fallback with empty voiceovers array');
    return <HomepageWithDrawerOptimized voiceovers={[]} />;
  }
}
