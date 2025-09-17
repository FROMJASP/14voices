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
    } | null;
    secondaryButton: {
      text: string;
      url: string;
    } | null;
    heroImage: string | null;
    stats?: Array<{
      number?: string; // Legacy field
      value?: string; // New field
      label?: string; // Legacy field
      text?: string; // Alternative field
      link?: string; // Optional link
      hoverEffect?: boolean; // Optional hover effect
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

    if (!homePage) {
      throw new Error('Homepage not found');
    }

    // Find hero block in layout
    const heroBlock = homePage.layout?.find(
      (block) => block.blockType === 'hero-v1' || block.blockType === 'hero-v2'
    );

    if (!heroBlock) {
      throw new Error('Hero block not found in homepage layout');
    }

    // Transform the page data to match HomepageSettings interface
    const settings: HomepageSettings = {
      hero: {
        processSteps: (heroBlock.blockType === 'hero-v1' ? heroBlock.processSteps : []) || [],
        title: typeof heroBlock.title === 'string' ? heroBlock.title : '',
        description: typeof heroBlock.description === 'string' ? heroBlock.description : '',
        primaryButton:
          heroBlock.cta?.primaryLabel && heroBlock.cta?.primaryUrl
            ? { text: heroBlock.cta.primaryLabel, url: heroBlock.cta.primaryUrl }
            : null,
        secondaryButton:
          heroBlock.cta?.secondaryLabel && heroBlock.cta?.secondaryUrl
            ? { text: heroBlock.cta.secondaryLabel, url: heroBlock.cta.secondaryUrl }
            : null,
        heroImage:
          typeof heroBlock.image === 'object' && heroBlock.image?.url ? heroBlock.image.url : null, // No default image
        stats:
          heroBlock.blockType === 'hero-v1' && heroBlock.stats
            ? heroBlock.stats.map((stat) => ({
                value: stat.value,
                label: stat.label,
                link: stat.link || undefined,
                hoverEffect: stat.hoverEffect || undefined,
              }))
            : [],
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
        heroImage: null, // No default image
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
