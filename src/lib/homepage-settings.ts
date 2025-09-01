import { getSafePayload } from '@/lib/safe-payload';
import type { Page } from '@/payload-types';

// Temporary interface until types are generated
export interface HomepageSettings {
  hero: {
    processSteps?: Array<{ text: string }>;
    title: string;
    description: string;
    primaryButton: {
      text: string;
      url: string;
    };
    secondaryButton: {
      text: string;
      url: string;
    };
    heroImage: string | { url: string };
    stats?: Array<{
      number: string;
      label: string;
    }>;
  };
}

// Cache for homepage settings
let cachedSettings: HomepageSettings | null = null;
let cacheExpiry: number = 0;
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

export async function getHomepageSettings(): Promise<HomepageSettings> {
  const now = Date.now();

  // Return cached settings if still valid
  if (cachedSettings && now < cacheExpiry) {
    return cachedSettings;
  }

  try {
    const payload = await getSafePayload();

    if (!payload) {
      console.log('Payload not initialized, returning fallback settings');
      // Return cached settings if available
      if (cachedSettings) {
        return cachedSettings;
      }
      // Otherwise return default fallback
      throw new Error('Payload not initialized');
    }

    // Find the homepage (page with slug 'home')
    const pages = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'home',
        },
      },
      limit: 1,
      depth: 2,
    });

    const homePage = pages.docs[0] as Page | undefined;

    if (!homePage || !homePage.hero) {
      throw new Error('Homepage not found or hero not configured');
    }

    // Accept any hero type but warn if not homepage type
    if (homePage.hero.type !== 'homepage') {
      console.warn(
        `Homepage hero type is "${homePage.hero.type}" instead of "homepage". Using fallback values for missing fields.`
      );
    }

    // Transform the page data to match HomepageSettings interface
    const settings: HomepageSettings = {
      hero: {
        processSteps: homePage.hero.processSteps || [],
        title: homePage.hero.title || '',
        description: homePage.hero.description || '',
        primaryButton: homePage.hero.primaryButton || {
          text: 'Ontdek stemmen',
          url: '#voiceovers',
        },
        secondaryButton: homePage.hero.secondaryButton || {
          text: 'Hoe wij werken',
          url: '/hoe-het-werkt',
        },
        heroImage:
          typeof homePage.hero.heroImage === 'object' && homePage.hero.heroImage?.url
            ? homePage.hero.heroImage.url
            : '/header-image.png',
        stats: homePage.hero.stats || [],
      },
    };

    // Cache the settings
    cachedSettings = settings;
    cacheExpiry = now + CACHE_DURATION;

    return settings;
  } catch (error) {
    console.error('Error fetching homepage settings:', error);

    // Return fallback settings if cache is available
    if (cachedSettings) {
      return cachedSettings;
    }

    // Return default fallback settings
    return {
      hero: {
        processSteps: [
          { text: 'Kies de stem' },
          { text: 'Upload script' },
          { text: 'Ontvang audio' },
        ],
        title: 'Vind de stem die jouw merk laat spreken.',
        description:
          'Een goed verhaal verdient een goede stem. Daarom trainde wij onze 14 voice-overs die samen met onze technici klaarstaan om jouw tekst tot leven te brengen!',
        primaryButton: {
          text: 'Ontdek stemmen',
          url: '#voiceovers',
        },
        secondaryButton: {
          text: 'Hoe wij werken',
          url: '/hoe-het-werkt',
        },
        heroImage: '/header-image.png',
        stats: [
          { number: '14', label: 'Stemacteurs' },
          { number: '<48u', label: 'Snelle levering' },
          { number: '9.1/10', label: 'Klantbeoordeling' },
        ],
      },
    } as HomepageSettings;
  }
}

export function clearHomepageSettingsCache(): void {
  cachedSettings = null;
  cacheExpiry = 0;
}
