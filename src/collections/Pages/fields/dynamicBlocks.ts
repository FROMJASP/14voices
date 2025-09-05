import type { Field } from 'payload';
import { heroBlock } from '../blocks/hero';
import { voiceoverBlock } from '../blocks/voiceover';
import { linkToBlogBlock } from '../blocks/linkToBlog';

/**
 * Dynamic blocks that render based on what's in pageBlocks
 * These are the actual content editing fields
 */
export const dynamicBlockFields: Field[] = [
  {
    name: 'blockContentInfo',
    type: 'ui',
    admin: {
      condition: (data) => (data.slug === 'home' || data.slug === 'blog'),
      components: {
        Field: '/components/admin/fields/DynamicBlockContent#DynamicBlockContent',
      },
    },
  },
  // We'll use conditional rendering to show these blocks
  // based on what's in pageBlocks
  {
    name: 'dynamicHeroBlocks',
    type: 'array',
    label: {
      en: 'Hero Blocks Content',
      nl: 'Hero Blokken Inhoud',
    },
    admin: {
      condition: (data) => {
        if (data.slug !== 'home' && data.slug !== 'blog') return false;
        // Show if there are hero blocks
        return data.pageBlocks?.some((b: any) => b.blockType === 'hero' && b.enabled);
      },
    },
    fields: [
      // These will be the hero content fields
      ...heroBlock.fields[0].fields, // Get the fields from the hero group
    ],
  },
  {
    name: 'dynamicVoiceoverBlocks',
    type: 'array',
    label: {
      en: 'Voiceover Blocks Content',
      nl: 'Voiceover Blokken Inhoud',
    },
    admin: {
      condition: (data) => {
        if (data.slug !== 'home' && data.slug !== 'blog') return false;
        // Show if there are voiceover blocks
        return data.pageBlocks?.some((b: any) => b.blockType === 'voiceover' && b.enabled);
      },
    },
    fields: [
      // These will be the voiceover content fields
      ...voiceoverBlock.fields[0].fields, // Get the fields from the voiceover group
    ],
  },
  {
    name: 'dynamicContentBlocks',
    type: 'array',
    label: {
      en: 'Content Blocks',
      nl: 'Content Blokken',
    },
    admin: {
      condition: (data) => {
        if (data.slug !== 'home' && data.slug !== 'blog') return false;
        // Show if there are content blocks
        return data.pageBlocks?.some((b: any) => b.blockType === 'linkToBlog' && b.enabled);
      },
    },
    fields: [
      // These will be the linkToBlog content fields
      ...linkToBlogBlock.fields[0].fields, // Get the fields from the linkToBlog group
    ],
  },
];