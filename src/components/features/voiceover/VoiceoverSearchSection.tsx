// Optimized Server Component for VoiceoverSearchSection
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { transformVoiceoverData } from '@/lib/voiceover-utils';
import type { PayloadVoiceover } from '@/types/voiceover';
import { VoiceoverSearchFieldDesignOptimized } from './VoiceoverSearchField';
import { VoiceoverProvider } from '@/contexts/VoiceoverContext';
import { UnifiedPriceCalculatorOptimized } from '@/components/features/pricing';
import { unstable_cache } from 'next/cache';

// Cache the voiceover data fetching for better performance
const getCachedVoiceovers = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise });

    // Optimized query with only necessary fields and improved performance
    const activeResult = await payload.find({
      collection: 'voiceovers',
      where: {
        status: {
          equals: 'active',
        },
      },
      depth: 2, // Reduced depth for better performance
      limit: 100,
      select: {
        // Only select fields we actually need
        id: true,
        name: true,
        slug: true,
        profilePhoto: true,
        styleTags: true,
        demos: true,
        status: true,
        updatedAt: true,
      },
      sort: '-updatedAt', // Sort by most recent first for better user experience
    });

    // Transform data in parallel for better performance
    const voiceovers = await Promise.all(
      activeResult.docs.map(async (voiceover, index) => {
        return transformVoiceoverData(voiceover as unknown as PayloadVoiceover, index);
      })
    );

    return voiceovers;
  },
  ['active-voiceovers'], // Cache key
  {
    revalidate: 60 * 15, // Cache for 15 minutes
    tags: ['voiceovers'], // Allow manual cache invalidation
  }
);

export async function VoiceoverSearchSectionOptimized() {
  try {
    // Use cached data fetching
    const voiceovers = await getCachedVoiceovers();

    return (
      <VoiceoverProvider>
        <VoiceoverSearchFieldDesignOptimized voiceovers={voiceovers} />
        <UnifiedPriceCalculatorOptimized />
      </VoiceoverProvider>
    );
  } catch (error) {
    console.error('Error fetching voiceovers:', error);

    // Fallback UI for error state
    return (
      <div className="min-h-screen bg-white dark:bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Oops! Er ging iets mis</h2>
          <p className="text-muted-foreground mb-6">
            We konden de stemacteurs niet laden. Probeer het later opnieuw.
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
