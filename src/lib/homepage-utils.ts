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

  // Extract hero image URL with multiple fallback strategies
  let heroImageUrl = '/header-image.png'; // default fallback

  // First check for the virtual heroImageURL field
  if (heroWithRichText.heroImageURL) {
    heroImageUrl = heroWithRichText.heroImageURL;
  }
  // Then check the heroImage field
  else if (hero.heroImage) {
    if (typeof hero.heroImage === 'string') {
      // If it's just an ID (not populated), we can't use it directly
      // The virtual field should have resolved this, but as a fallback
      heroImageUrl = '/header-image.png';
    } else if (typeof hero.heroImage === 'object') {
      const heroImageObj = hero.heroImage as any;

      // Try different possible URL properties
      if (heroImageObj.url) {
        heroImageUrl = heroImageObj.url;
      } else if (heroImageObj.filename && process.env.NEXT_PUBLIC_S3_PUBLIC_URL) {
        // Construct URL from filename if we have the S3 public URL
        heroImageUrl = `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/media/${heroImageObj.filename}`;
      } else if (heroImageObj.filename) {
        // Fallback to local media path
        heroImageUrl = `/media/${heroImageObj.filename}`;
      }
    }
  }

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
      heroImage: heroImageUrl,
      stats: hero.stats || [],
    },
  };
}
