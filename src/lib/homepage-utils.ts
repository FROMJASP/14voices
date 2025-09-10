import type { Page } from '@/payload-types';
import type { HomepageSettings } from './homepage-settings';
import { makeMediaUrlRelative } from './media-utils';

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

  // Check if title/description are already rich text (new structure) or need to check for legacy fields
  const extractedTitle =
    heroWithRichText.title && typeof heroWithRichText.title === 'object'
      ? extractTextFromLexical(heroWithRichText.title) // New: title IS rich text
      : heroWithRichText.titleRichText
        ? extractTextFromLexical(heroWithRichText.titleRichText) // Legacy: titleRichText field
        : hero.title || ''; // Fallback to plain text

  const extractedDescription =
    heroWithRichText.description && typeof heroWithRichText.description === 'object'
      ? extractTextFromLexical(heroWithRichText.description) // New: description IS rich text
      : heroWithRichText.descriptionRichText
        ? extractTextFromLexical(heroWithRichText.descriptionRichText) // Legacy: descriptionRichText field
        : hero.description || ''; // Fallback to plain text

  // Extract hero image URL with multiple fallback strategies
  let heroImageUrl: string | null = null; // No default fallback

  // First check for the virtual heroImageURL field (this is the most reliable)
  if ((hero as any).heroImageURL) {
    heroImageUrl = makeMediaUrlRelative((hero as any).heroImageURL);
  }
  // Then check the heroImage field
  else if (hero.heroImage) {
    if (typeof hero.heroImage === 'string') {
      // If it's just an ID (not populated), we can't use it directly
      heroImageUrl = null; // No fallback image
    } else if (typeof hero.heroImage === 'object') {
      const heroImageObj = hero.heroImage as any;

      // Try different possible URL properties
      if (heroImageObj.url) {
        heroImageUrl = makeMediaUrlRelative(heroImageObj.url);
      } else if (heroImageObj.filename && process.env.S3_PUBLIC_URL) {
        // Construct URL from filename if we have the S3 public URL
        const fullUrl = `${process.env.S3_PUBLIC_URL}/media/${heroImageObj.filename}`;
        heroImageUrl = makeMediaUrlRelative(fullUrl);
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
      primaryButton: hero.primaryButton || null,
      secondaryButton: hero.secondaryButton || null,
      heroImage: heroImageUrl,
      stats: hero.stats || [],
    },
  };
}
