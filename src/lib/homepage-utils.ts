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
  // Note: Hero1 block uses 'image', legacy hero uses 'heroImage'
  const imageField = heroWithRichText.image || heroWithRichText.heroImage;

  // Log for debugging (will only run server-side during build)
  if (process.env.NODE_ENV !== 'production' && imageField && typeof imageField === 'object') {
    console.log('Hero image field:', {
      hasUrl: !!(imageField as any).url,
      hasFilename: !!(imageField as any).filename,
      keys: Object.keys(imageField as any),
    });
  }

  // First check for the virtual imageURL field (used in Hero1 block)
  if ((hero as any).imageURL) {
    heroImageUrl = (hero as any).imageURL;
  }
  // Then check for the virtual heroImageURL field (legacy hero blocks)
  else if ((hero as any).heroImageURL) {
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
        // Construct the URL based on the filename
        // The media files are served from storage.iam-studios.com/media/
        const s3PublicUrl = 'https://storage.iam-studios.com';

        // Handle different filename formats
        let filename = heroImageObj.filename;

        // Remove leading slash if present
        if (filename.startsWith('/')) {
          filename = filename.substring(1);
        }

        // Remove 'media/' prefix if already included in filename
        if (filename.startsWith('media/')) {
          filename = filename.substring(6);
        }

        // Ensure s3PublicUrl doesn't end with a slash
        const cleanS3Url = s3PublicUrl.endsWith('/') ? s3PublicUrl.slice(0, -1) : s3PublicUrl;

        // Construct the full URL with /media/ path
        heroImageUrl = `${cleanS3Url}/media/${filename}`;
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
