import { getSafePayload } from '@/lib/safe-payload';
import type { Page } from '@/payload-types';
import { transformVoiceoverData } from '@/lib/voiceover-utils';
import type { PayloadVoiceover } from '@/types/voiceover';
import { HomepageWithDrawerOptimized } from '@/components/features/homepage/HomepageContainer';
import { OptimizedVoiceoverQueries } from '@/lib/database-optimizations';
import { getHomepageSettings } from '@/lib/homepage-settings';

// Disable static generation for self-hosted deployments
// This prevents build-time database connection attempts
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  // During build time with fake database URL, return default metadata
  if (process.env.DATABASE_URL?.includes('fake:fake@fake')) {
    return {
      title: '14voices - Professionele Voice-overs',
      description: 'Professionele voice-overs voor elk project. Van commercials tot bedrijfsfilms.',
    };
  }

  const payload = await getSafePayload();
  if (!payload) {
    return {
      title: '14voices - Professionele Voice-overs',
      description: 'Professionele voice-overs voor elk project. Van commercials tot bedrijfsfilms.',
    };
  }

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
  // CRITICAL FIX: Ultimate error handling to prevent any Server Components render error

  // Initialize with safe defaults
  let voiceovers: any[] = [];
  let heroSettings: any = {
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
  };

  // Check if we're in a deployment/startup phase
  const isStartingUp =
    process.env.NODE_ENV === 'production' &&
    (process.env.COOLIFY_URL || process.env.COOLIFY_FQDN || process.env.RAILWAY_ENVIRONMENT);

  if (isStartingUp) {
    // Detected deployment environment, using graceful data loading
  }

  try {
    // Starting data fetch

    // Create a timeout promise for data loading
    const dataLoadTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Data load timeout')), isStartingUp ? 5000 : 10000)
    );

    // Try to load data with timeout protection
    const dataLoadPromise = async () => {
      // Try to get hero settings first (less likely to fail)
      try {
        const settings = await getHomepageSettings();
        if (settings) {
          heroSettings = settings;
          // Hero settings loaded
        }
      } catch (settingsError) {
        // Using default hero settings
      }

      // Try to get voiceover data (more likely to fail on first deploy)
      try {
        const voiceoverData = await OptimizedVoiceoverQueries.getHomepageVoiceovers({
          limit: 50,
          includeUnavailable: false,
          cacheTTL: 1000 * 60 * 30, // 30 minutes cache
        });

        // Ensure voiceoverData is an array and handle null/undefined
        const voiceoverArray = Array.isArray(voiceoverData) ? voiceoverData : [];

        // Transform the data with safety checks
        if (voiceoverArray.length > 0) {
          voiceovers = voiceoverArray
            .map((voiceover: any, index: number) => {
              try {
                return transformVoiceoverData(voiceover as PayloadVoiceover, index);
              } catch (transformError) {
                // Skipping voiceover at index
                return null;
              }
            })
            .filter(Boolean); // Remove nulls
        }
      } catch (voiceoverError) {
        // No voiceovers available yet - keep empty array as default
      }
    };

    // Race between data loading and timeout
    try {
      await Promise.race([dataLoadPromise(), dataLoadTimeout]);
    } catch (timeoutError) {
      // Data loading timed out, using defaults
    }
  } catch (error) {
    // Error during initialization - continue with defaults
  }

  // Wrap the entire render in a try-catch
  try {
    // Ensure we have valid data structures
    if (!Array.isArray(voiceovers)) {
      // Invalid voiceovers data, using empty array
      voiceovers = [];
    }

    if (!heroSettings || typeof heroSettings !== 'object') {
      // Invalid hero settings, using defaults
      heroSettings = {
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
      };
    }

    return <HomepageWithDrawerOptimized voiceovers={voiceovers} heroSettings={heroSettings} />;
  } catch (renderError) {
    // Critical render error - return static fallback

    // Ultimate fallback - static HTML that won't fail
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">14voices</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Professionele voice-overs voor elk project
            </p>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                De website wordt momenteel geladen...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Ververs de pagina als dit bericht blijft staan
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
