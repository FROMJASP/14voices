import type { Page } from '@/payload-types';
import type { HomepageSettings } from './homepage-settings';

export function transformHeroDataForHomepage(page: Page): HomepageSettings {
  const hero = page.hero || {};

  return {
    hero: {
      // Use actual data without fallbacks for live preview
      title: hero.title || '',
      description: hero.description || '',
      processSteps: hero.processSteps || [],
      primaryButton: hero.primaryButton || {
        text: '',
        url: '',
      },
      secondaryButton: hero.secondaryButton || {
        text: '',
        url: '',
      },
      heroImage:
        typeof hero.heroImage === 'object' && hero.heroImage?.url ? hero.heroImage.url : undefined,
      stats: hero.stats || [],
    },
  };
}
