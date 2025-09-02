import type { Page } from '@/payload-types';
import type { HomepageSettings } from './homepage-settings';

// Helper function to extract plain text from Lexical rich text
function extractTextFromLexical(richText: unknown): string {
  const lexicalData = richText as { root?: { children?: unknown[] } };
  if (!lexicalData?.root?.children) return '';

  let text = '';

  const extractFromNode = (node: unknown): void => {
    const nodeData = node as { type?: string; text?: string; children?: unknown[] };
    if (nodeData.type === 'text') {
      text += nodeData.text || '';
    } else if (nodeData.children && Array.isArray(nodeData.children)) {
      nodeData.children.forEach(extractFromNode);
    }
  };

  lexicalData.root.children.forEach(extractFromNode);
  return text.trim();
}

export function transformHeroDataForHomepage(page: Page): HomepageSettings {
  const hero = page.hero || {};
  const heroWithRichText = hero as any;

  const extractedTitle = heroWithRichText.titleRichText
    ? extractTextFromLexical(heroWithRichText.titleRichText)
    : hero.title || '';
  const extractedDescription = heroWithRichText.descriptionRichText
    ? extractTextFromLexical(heroWithRichText.descriptionRichText)
    : hero.description || '';

  return {
    hero: {
      // Use rich text fields first, fall back to legacy fields
      title: extractedTitle,
      description: extractedDescription,
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
        typeof hero.heroImage === 'object' && hero.heroImage?.url
          ? hero.heroImage.url
          : '/header-image.png',
      stats: hero.stats || [],
    },
  };
}
