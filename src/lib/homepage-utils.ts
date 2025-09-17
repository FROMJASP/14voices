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
  // Find hero block in layout
  const heroBlock = page.layout?.find(
    (block) => block.blockType === 'hero-v1' || block.blockType === 'hero-v2'
  );

  const hero = heroBlock || {};
  const heroWithRichText = hero as any;

  // Check if title/description are already rich text (new structure) or need to check for legacy fields
  const extractedTitle =
    heroWithRichText.title && typeof heroWithRichText.title === 'object'
      ? extractTextFromLexical(heroWithRichText.title) // New: title IS rich text
      : heroWithRichText.titleRichText
        ? extractTextFromLexical(heroWithRichText.titleRichText) // Legacy: titleRichText field
        : heroWithRichText.title || ''; // Fallback to plain text

  const extractedDescription =
    heroWithRichText.description && typeof heroWithRichText.description === 'object'
      ? extractTextFromLexical(heroWithRichText.description) // New: description IS rich text
      : heroWithRichText.descriptionRichText
        ? extractTextFromLexical(heroWithRichText.descriptionRichText) // Legacy: descriptionRichText field
        : heroWithRichText.description || ''; // Fallback to plain text

  // Extract hero image URL with multiple fallback strategies
  let heroImageUrl: string | null = null; // No default fallback

  // Check for image field (used in hero blocks)
  const imageField = heroWithRichText.image || heroWithRichText.heroImage;

  // First check for the virtual heroImageURL field (this is the most reliable)
  if ((hero as any).heroImageURL) {
    heroImageUrl = (hero as any).heroImageURL;
  }
  // Then check the image/heroImage field
  else if (imageField) {
    if (typeof imageField === 'string') {
      // If it's just an ID (not populated), we can't use it directly
      heroImageUrl = null; // No fallback image
    } else if (typeof imageField === 'object') {
      const heroImageObj = imageField as any;

      // Try different possible URL properties
      if (heroImageObj.url) {
        // Keep the full URL for external images
        heroImageUrl = heroImageObj.url;
      } else if (heroImageObj.filename) {
        // Use the known S3 public URL for storage.iam-studios.com
        // This URL is hardcoded because environment variables might not be available
        // in all build contexts (especially in production builds)
        const s3PublicUrl = 'https://storage.iam-studios.com';
        // Ensure proper path construction
        const filename = heroImageObj.filename.startsWith('/')
          ? heroImageObj.filename.substring(1)
          : heroImageObj.filename;
        heroImageUrl = `${s3PublicUrl}/${filename}`;
      }
    }
  }

  return {
    hero: {
      // Use rich text fields first, fall back to legacy fields
      title: extractedTitle,
      description: extractedDescription,
      processSteps: heroWithRichText.processSteps || [],
      primaryButton: heroWithRichText.primaryButton || null,
      secondaryButton: heroWithRichText.secondaryButton || null,
      heroImage: heroImageUrl,
      stats: heroWithRichText.stats || [],
    },
  };
}
