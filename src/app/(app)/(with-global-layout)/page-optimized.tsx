// Optimized homepage with improved data fetching and caching
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import type { Page } from '@/payload-types';
import { transformVoiceoverData } from '@/lib/voiceover-utils';
import type { PayloadVoiceover } from '@/types/voiceover';
import { HomepageWithDrawerOptimized } from '@/components/HomepageWithDrawerOptimized';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';

// Cache the page metadata fetching
const getCachedPageMetadata = unstable_cache(
  async () => {
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
      select: {
        // Only select metadata fields we need
        title: true,
        meta: true,
        openGraph: true,
      },
    });

    return pages.docs[0] as Page | undefined;
  },
  ['homepage-metadata'],
  {
    revalidate: 60 * 60, // Cache for 1 hour
    tags: ['pages', 'homepage'],
  }
);

// Cache the voiceovers data fetching with React cache for request deduplication
const getCachedVoiceovers = cache(async () => {
  const payload = await getPayload({ config: configPromise });

  // Parallel queries for better performance
  const [activeResult, totalCount] = await Promise.all([
    payload.find({
      collection: 'voiceovers',
      where: {
        status: {
          equals: 'active',
        },
      },
      depth: 2,
      limit: 100,
      select: {
        id: true,
        name: true,
        slug: true,
        profilePhoto: true,
        styleTags: true,
        demos: true,
        status: true,
        updatedAt: true,
      },
      sort: '-updatedAt',
    }),
    // Get total count for analytics/monitoring
    payload.count({
      collection: 'voiceovers',
      where: {
        status: {
          equals: 'active',
        },
      },
    }),
  ]);

  // Transform data efficiently
  const voiceovers = activeResult.docs.map((voiceover, index) =>
    transformVoiceoverData(voiceover as unknown as PayloadVoiceover, index)
  );

  return {
    voiceovers,
    totalCount: totalCount.totalDocs,
  };
});

export async function generateMetadata() {
  try {
    const page = await getCachedPageMetadata();

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
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '14voices',
      description: 'Professional voice-over services',
    };
  }
}

export default async function HomePageOptimized() {
  try {
    // Fetch data with caching
    const { voiceovers, totalCount } = await getCachedVoiceovers();

    // Add performance monitoring
    console.log(`Loaded ${voiceovers.length} voiceovers out of ${totalCount} total active voiceovers`);

    return <HomepageWithDrawerOptimized voiceovers={voiceovers} />;
  } catch (error) {
    console.error('Error loading homepage data:', error);
    
    // Fallback UI for error state
    return (
      <div className="min-h-screen bg-white dark:bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            14voices
          </h1>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Er ging iets mis
          </h2>
          <p className="text-muted-foreground mb-6">
            We konden de pagina niet laden. Controleer je internetverbinding en probeer het opnieuw.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Probeer opnieuw
          </button>
        </div>
      </div>
    );
  }
}