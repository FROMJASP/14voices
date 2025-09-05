import type { Field } from 'payload';
import { heroTitleConfig } from '@/fields/lexical/heroTitleConfig';
import { heroDescriptionConfig } from '@/fields/lexical/heroDescriptionConfig';
import { heroSubtitleConfig } from '@/fields/lexical/heroSubtitleConfig';

export const heroBlock: Field = {
  type: 'collapsible',
  label: 'Hero Section',
  admin: {
    condition: (data) => data.slug === 'home' || data.slug === 'blog',
    initCollapsed: true,
    description: {
      en: 'A hero section is usually shown at the top of a page',
      nl: 'Een hero sectie wordt meestal bovenaan een pagina getoond',
    },
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'layout',
          type: 'select',
          label: {
            en: 'Variant',
            nl: 'Variant',
          },
          defaultValue: 'variant1',
          options: [
            {
              label: { en: 'Hero variant 1', nl: 'Hero variant 1' },
              value: 'variant1',
            },
            {
              label: { en: 'Hero variant 2', nl: 'Hero variant 2' },
              value: 'variant2',
            },
          ],
          admin: {
            condition: (data) => {
              // Get the variant from pageBlocks
              const heroBlock = data.pageBlocks?.find((b: any) => b.blockType === 'hero' && b.enabled);
              return false; // Always hide this field since variant is controlled in Layout
            },
            hidden: true,
          },
        },
        // Legacy type field - hidden but maintained for backwards compatibility
        {
          name: 'type',
          type: 'text',
          defaultValue: 'homepage',
          admin: {
            hidden: true,
          },
        },
        // Variant 1 specific fields
        {
          type: 'collapsible',
          label: {
            en: 'Process Steps',
            nl: 'Processtappen',
          },
          admin: {
            condition: (data) => {
              // Check the pageBlocks array for which hero variant is selected
              const heroBlock = data?.pageBlocks?.find((b: any) => b.blockType === 'hero' && b.enabled);
              return heroBlock?.heroVariant === 'variant1';
            },
            initCollapsed: true,
          },
          fields: [
            {
              name: 'processSteps',
              type: 'array',
              admin: {
                description: {
                  en: 'The small process steps displayed at the top of the hero',
                  nl: 'De kleine processtappen die bovenaan de hero worden weergegeven',
                },
              },
              defaultValue: [
                { text: '1. Kies de stem' },
                { text: '2. Upload script' },
                { text: '3. Ontvang audio' },
              ],
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  label: {
                    en: 'Text',
                    nl: 'Tekst',
                  },
                  admin: {
                    description: {
                      en: 'Text for this step (e.g., "1. Choose the voice")',
                      nl: 'Tekst voor deze stap (bijv. "1. Kies de stem")',
                    },
                  },
                },
              ],
            },
          ],
        },
        // Variant 2 specific fields
        {
          type: 'collapsible',
          label: {
            en: 'Badge',
            nl: 'Badge',
          },
          admin: {
            condition: (data) => {
              // Check the pageBlocks array for which hero variant is selected
              const heroBlock = data?.pageBlocks?.find((b: any) => b.blockType === 'hero' && b.enabled);
              return heroBlock?.heroVariant === 'variant2';
            },
            initCollapsed: true,
          },
          fields: [
            {
              name: 'badge',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: {
                    en: 'Show Badge',
                    nl: 'Toon Badge',
                  },
                  admin: {
                    description: {
                      en: 'Toggle to show/hide the badge',
                      nl: 'Schakel in/uit om de badge te tonen/verbergen',
                    },
                  },
                },
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  defaultValue: 'Just released v1.0.0',
                  label: {
                    en: 'Badge Text',
                    nl: 'Badge Tekst',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Text displayed in the badge',
                      nl: 'Tekst weergegeven in de badge',
                    },
                  },
                },
                {
                  name: 'color',
                  type: 'text',
                  label: {
                    en: 'Badge Color (Light Mode)',
                    nl: 'Badge Kleur (Lichte Modus)',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Badge background color for light mode. Leave empty to use brand color from Site Settings → Branding',
                      nl: 'Badge achtergrondkleur voor lichte modus. Laat leeg om de huisstijl kleur uit Site Instellingen → Huisstijl te gebruiken',
                    },
                    components: {
                      Field:
                        '@innovixx/payload-color-picker-field/components#ColorPickerFieldComponent',
                    },
                  },
                },
                {
                  name: 'colorDark',
                  type: 'text',
                  label: {
                    en: 'Badge Color (Dark Mode)',
                    nl: 'Badge Kleur (Donkere Modus)',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Badge background color for dark mode. Leave empty to use brand color from Site Settings → Branding',
                      nl: 'Badge achtergrondkleur voor donkere modus. Laat leeg om de huisstijl kleur uit Site Instellingen → Huisstijl te gebruiken',
                    },
                    components: {
                      Field:
                        '@innovixx/payload-color-picker-field/components#ColorPickerFieldComponent',
                    },
                  },
                },
                {
                  name: 'textColor',
                  type: 'text',
                  label: {
                    en: 'Text Color (Light Mode)',
                    nl: 'Tekstkleur (Lichte Modus)',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Badge text color for light mode. Leave empty for automatic contrast color',
                      nl: 'Badge tekstkleur voor lichte modus. Laat leeg voor automatische contrastkleur',
                    },
                    components: {
                      Field:
                        '@innovixx/payload-color-picker-field/components#ColorPickerFieldComponent',
                    },
                  },
                },
                {
                  name: 'textColorDark',
                  type: 'text',
                  label: {
                    en: 'Text Color (Dark Mode)',
                    nl: 'Tekstkleur (Donkere Modus)',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Badge text color for dark mode. Leave empty for automatic contrast color',
                      nl: 'Badge tekstkleur voor donkere modus. Laat leeg voor automatische contrastkleur',
                    },
                    components: {
                      Field:
                        '@innovixx/payload-color-picker-field/components#ColorPickerFieldComponent',
                    },
                  },
                },
                {
                  name: 'lightingEffect',
                  type: 'select',
                  label: {
                    en: 'Lighting Effect',
                    nl: 'Lichteffect',
                  },
                  defaultValue: 'diagonal',
                  options: [
                    { label: { en: 'None', nl: 'Geen' }, value: 'none' },
                    { label: { en: 'Diagonal', nl: 'Diagonaal' }, value: 'diagonal' },
                    { label: { en: 'Horizontal', nl: 'Horizontaal' }, value: 'horizontal' },
                    { label: { en: 'Radial', nl: 'Radiaal' }, value: 'radial' },
                    { label: { en: 'Pulse', nl: 'Pulseren' }, value: 'pulse' },
                  ],
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Choose the lighting effect style for the badge',
                      nl: 'Kies de lichteffect stijl voor de badge',
                    },
                  },
                },
                {
                  name: 'lightingIntensity',
                  type: 'select',
                  label: {
                    en: 'Lighting Intensity',
                    nl: 'Lichtintensiteit',
                  },
                  defaultValue: 'medium',
                  options: [
                    { label: { en: 'Subtle', nl: 'Subtiel' }, value: 'subtle' },
                    { label: { en: 'Medium', nl: 'Gemiddeld' }, value: 'medium' },
                    { label: { en: 'Strong', nl: 'Sterk' }, value: 'strong' },
                  ],
                  admin: {
                    condition: (_data, siblingData) =>
                      siblingData?.enabled !== false && siblingData?.lightingEffect !== 'none',
                    description: {
                      en: 'Control the intensity of the lighting effect',
                      nl: 'Beheer de intensiteit van het lichteffect',
                    },
                  },
                },
              ],
            },
          ],
        },
        // Common fields
        {
          name: 'title',
          type: 'textarea',
          label: {
            en: 'Hero Title (Legacy)',
            nl: 'Hero Titel (Oud)',
          },
          admin: {
            condition: (_data, siblingData) => siblingData?.type !== 'none',
            description: {
              en: 'Legacy plain text title - will be migrated to rich text',
              nl: 'Oude platte tekst titel - wordt gemigreerd naar rich text',
            },
            rows: 3,
            hidden: true,
          },
        },
        {
          name: 'titleRichText',
          type: 'richText',
          editor: heroTitleConfig,
          label: {
            en: 'Hero Title',
            nl: 'Hero Titel',
          },
          admin: {
            condition: (_data, siblingData) => siblingData?.type !== 'none',
            description: {
              en: 'Hero title with formatting. Use the <code> button to highlight text in brand color.',
              nl: 'Hero titel met opmaak. Gebruik de <code> knop om tekst in merkkleur te markeren.',
            },
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          label: {
            en: 'Subtitle (Legacy)',
            nl: 'Ondertitel (Oud)',
          },
          admin: {
            condition: (data) => {
              // Check the pageBlocks array for which hero variant is selected
              const heroBlock = data?.pageBlocks?.find((b: any) => b.blockType === 'hero' && b.enabled);
              return heroBlock?.heroVariant === 'variant2';
            },
            hidden: true,
          },
        },
        {
          name: 'subtitleRichText',
          type: 'richText',
          editor: heroSubtitleConfig,
          label: {
            en: 'Subtitle',
            nl: 'Ondertitel',
          },
          admin: {
            condition: (data) => {
              // Check the pageBlocks array for which hero variant is selected
              const heroBlock = data?.pageBlocks?.find((b: any) => b.blockType === 'hero' && b.enabled);
              return heroBlock?.heroVariant === 'variant2';
            },
            description: {
              en: 'Subtitle with formatting. Use the <code> button to highlight text in brand color.',
              nl: 'Ondertitel met opmaak. Gebruik de <code> knop om tekst in merkkleur te markeren.',
            },
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: {
            en: 'Description (Legacy)',
            nl: 'Beschrijving (Oud)',
          },
          admin: {
            condition: (_data, siblingData) =>
              siblingData?.layout === 'variant1' || siblingData?.type === 'homepage',
            description: {
              en: 'Legacy plain text description - will be migrated to rich text',
              nl: 'Oude platte tekst beschrijving - wordt gemigreerd naar rich text',
            },
            rows: 4,
            hidden: true,
          },
        },
        {
          name: 'descriptionRichText',
          type: 'richText',
          editor: heroDescriptionConfig,
          label: {
            en: 'Description',
            nl: 'Beschrijving',
          },
          admin: {
            condition: (data) => {
              // Check the pageBlocks array for which hero variant is selected
              const heroBlock = data?.pageBlocks?.find((b: any) => b.blockType === 'hero' && b.enabled);
              return heroBlock?.heroVariant === 'variant1';
            },
            description: {
              en: 'Hero description with formatting. Use the <code> button to highlight text in brand color. You can also use bold, italic, and links.',
              nl: 'Hero beschrijving met opmaak. Gebruik de <code> knop om tekst in merkkleur te markeren. Je kunt ook vet, cursief en links gebruiken.',
            },
          },
        },
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
          label: {
            en: 'Hero Image',
            nl: 'Hero Afbeelding',
          },
          admin: {
            condition: (data) => {
              // Check the pageBlocks array for which hero variant is selected
              const heroBlock = data?.pageBlocks?.find((b: any) => b.blockType === 'hero' && b.enabled);
              return heroBlock?.heroVariant === 'variant1';
            },
            description: {
              en: 'Main image displayed in the oval-shaped container on the right (recommended: high-quality portrait photo, minimum 400x500px)',
              nl: 'Hoofdafbeelding weergegeven in de ovaalvormige container rechts (aanbevolen: hoogwaardige portretfoto, minimaal 400x500px)',
            },
          },
        },
        // Buttons
        {
          type: 'collapsible',
          label: {
            en: 'Primary Button',
            nl: 'Primaire Knop',
          },
          admin: {
            condition: (data) => {
              // Show buttons if there's any hero block enabled
              return data?.pageBlocks?.some((b: any) => b.blockType === 'hero' && b.enabled);
            },
            initCollapsed: true,
          },
          fields: [
            {
              name: 'primaryButton',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: {
                    en: 'Show Button',
                    nl: 'Toon Knop',
                  },
                  admin: {
                    description: {
                      en: 'Toggle to show/hide the primary button',
                      nl: 'Schakel in/uit om de primaire knop te tonen/verbergen',
                    },
                  },
                },
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  defaultValue: 'Ontdek stemmen',
                  label: {
                    en: 'Button Text',
                    nl: 'Knop Tekst',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Text for the primary call-to-action button',
                      nl: 'Tekst voor de primaire call-to-action knop',
                    },
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  defaultValue: '#voiceovers',
                  label: {
                    en: 'Button URL',
                    nl: 'Knop URL',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'URL for the primary button (e.g., #voiceovers, /voiceovers)',
                      nl: 'URL voor de primaire knop (bijv. #voiceovers, /voiceovers)',
                    },
                  },
                },
                {
                  name: 'backgroundColor',
                  type: 'text',
                  label: {
                    en: 'Background Color (Light Mode)',
                    nl: 'Achtergrondkleur (Lichte Modus)',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Button background color for light mode. Leave empty to use brand color',
                      nl: 'Knop achtergrondkleur voor lichte modus. Laat leeg om huisstijl kleur te gebruiken',
                    },
                    components: {
                      Field:
                        '@innovixx/payload-color-picker-field/components#ColorPickerFieldComponent',
                    },
                  },
                },
                {
                  name: 'backgroundColorDark',
                  type: 'text',
                  label: {
                    en: 'Background Color (Dark Mode)',
                    nl: 'Achtergrondkleur (Donkere Modus)',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Button background color for dark mode. Leave empty to use brand color',
                      nl: 'Knop achtergrondkleur voor donkere modus. Laat leeg om huisstijl kleur te gebruiken',
                    },
                    components: {
                      Field:
                        '@innovixx/payload-color-picker-field/components#ColorPickerFieldComponent',
                    },
                  },
                },
                {
                  name: 'textColor',
                  type: 'text',
                  label: {
                    en: 'Text Color (Light Mode)',
                    nl: 'Tekstkleur (Lichte Modus)',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Button text color for light mode. Leave empty for automatic contrast color',
                      nl: 'Knop tekstkleur voor lichte modus. Laat leeg voor automatische contrastkleur',
                    },
                    components: {
                      Field:
                        '@innovixx/payload-color-picker-field/components#ColorPickerFieldComponent',
                    },
                  },
                },
                {
                  name: 'textColorDark',
                  type: 'text',
                  label: {
                    en: 'Text Color (Dark Mode)',
                    nl: 'Tekstkleur (Donkere Modus)',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Button text color for dark mode. Leave empty for automatic contrast color',
                      nl: 'Knop tekstkleur voor donkere modus. Laat leeg voor automatische contrastkleur',
                    },
                    components: {
                      Field:
                        '@innovixx/payload-color-picker-field/components#ColorPickerFieldComponent',
                    },
                  },
                },
                {
                  name: 'icon',
                  type: 'select',
                  label: {
                    en: 'Icon',
                    nl: 'Icoon',
                  },
                  defaultValue: 'arrow-right',
                  options: [
                    { label: { en: 'Arrow Right', nl: 'Pijl Rechts' }, value: 'arrow-right' },
                    {
                      label: { en: 'Arrow Up Right', nl: 'Pijl Rechtsboven' },
                      value: 'arrow-up-right',
                    },
                    { label: { en: 'Play', nl: 'Afspelen' }, value: 'play' },
                    { label: { en: 'Plus', nl: 'Plus' }, value: 'plus' },
                    { label: { en: 'Download', nl: 'Download' }, value: 'download' },
                    { label: { en: 'External Link', nl: 'Externe Link' }, value: 'external-link' },
                    { label: { en: 'Mail Check', nl: 'Mail Check' }, value: 'mail-check' },
                    { label: { en: 'Mail', nl: 'Mail' }, value: 'mail' },
                    { label: { en: 'Phone', nl: 'Telefoon' }, value: 'phone' },
                    { label: { en: 'Send', nl: 'Verstuur' }, value: 'send' },
                    {
                      label: { en: 'Message Circle', nl: 'Bericht Cirkel' },
                      value: 'message-circle',
                    },
                    { label: { en: 'Info', nl: 'Info' }, value: 'info' },
                    {
                      label: { en: 'Chevron Right', nl: 'Chevron Rechts' },
                      value: 'chevron-right',
                    },
                    { label: { en: 'Check', nl: 'Vink' }, value: 'check' },
                    { label: { en: 'Star', nl: 'Ster' }, value: 'star' },
                    { label: { en: 'Heart', nl: 'Hart' }, value: 'heart' },
                    { label: { en: 'Zap', nl: 'Bliksem' }, value: 'zap' },
                    { label: { en: 'Sparkles', nl: 'Sparkles' }, value: 'sparkles' },
                    { label: { en: 'Calendar', nl: 'Kalender' }, value: 'calendar' },
                    { label: { en: 'Clock', nl: 'Klok' }, value: 'clock' },
                    { label: { en: 'File Text', nl: 'Bestand Tekst' }, value: 'file-text' },
                    { label: { en: 'Headphones', nl: 'Hoofdtelefoon' }, value: 'headphones' },
                    { label: { en: 'Mic', nl: 'Microfoon' }, value: 'mic' },
                    { label: { en: 'Music', nl: 'Muziek' }, value: 'music' },
                    { label: { en: 'None', nl: 'Geen' }, value: 'none' },
                  ],
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Icon to display in the button',
                      nl: 'Icoon om in de knop weer te geven',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'collapsible',
          label: {
            en: 'Secondary Button',
            nl: 'Secundaire Knop',
          },
          admin: {
            condition: (data) => {
              // Show buttons if there's any hero block enabled
              return data?.pageBlocks?.some((b: any) => b.blockType === 'hero' && b.enabled);
            },
            initCollapsed: true,
          },
          fields: [
            {
              name: 'secondaryButton',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: {
                    en: 'Show Button',
                    nl: 'Toon Knop',
                  },
                  admin: {
                    description: {
                      en: 'Toggle to show/hide the secondary button',
                      nl: 'Schakel in/uit om de secundaire knop te tonen/verbergen',
                    },
                  },
                },
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  defaultValue: 'Hoe wij werken',
                  label: {
                    en: 'Button Text',
                    nl: 'Knop Tekst',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Text for the secondary button',
                      nl: 'Tekst voor de secundaire knop',
                    },
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  defaultValue: '/hoe-het-werkt',
                  label: {
                    en: 'Button URL',
                    nl: 'Knop URL',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'URL for the secondary button',
                      nl: 'URL voor de secundaire knop',
                    },
                  },
                },
                {
                  name: 'backgroundColor',
                  type: 'text',
                  label: {
                    en: 'Background Color (Light Mode)',
                    nl: 'Achtergrondkleur (Lichte Modus)',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Button background color for light mode. Leave empty for transparent',
                      nl: 'Knop achtergrondkleur voor lichte modus. Laat leeg voor transparant',
                    },
                    components: {
                      Field:
                        '@innovixx/payload-color-picker-field/components#ColorPickerFieldComponent',
                    },
                  },
                },
                {
                  name: 'backgroundColorDark',
                  type: 'text',
                  label: {
                    en: 'Background Color (Dark Mode)',
                    nl: 'Achtergrondkleur (Donkere Modus)',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Button background color for dark mode. Leave empty for transparent',
                      nl: 'Knop achtergrondkleur voor donkere modus. Laat leeg voor transparant',
                    },
                    components: {
                      Field:
                        '@innovixx/payload-color-picker-field/components#ColorPickerFieldComponent',
                    },
                  },
                },
                {
                  name: 'borderColor',
                  type: 'text',
                  label: {
                    en: 'Border Color (Light Mode)',
                    nl: 'Randkleur (Lichte Modus)',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Button border color for light mode. Leave empty to use brand color',
                      nl: 'Knop randkleur voor lichte modus. Laat leeg om huisstijl kleur te gebruiken',
                    },
                    components: {
                      Field:
                        '@innovixx/payload-color-picker-field/components#ColorPickerFieldComponent',
                    },
                  },
                },
                {
                  name: 'borderColorDark',
                  type: 'text',
                  label: {
                    en: 'Border Color (Dark Mode)',
                    nl: 'Randkleur (Donkere Modus)',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Button border color for dark mode. Leave empty to use brand color',
                      nl: 'Knop randkleur voor donkere modus. Laat leeg om huisstijl kleur te gebruiken',
                    },
                    components: {
                      Field:
                        '@innovixx/payload-color-picker-field/components#ColorPickerFieldComponent',
                    },
                  },
                },
                {
                  name: 'textColor',
                  type: 'text',
                  label: {
                    en: 'Text Color (Light Mode)',
                    nl: 'Tekstkleur (Lichte Modus)',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Button text color for light mode. Leave empty to use brand color',
                      nl: 'Knop tekstkleur voor lichte modus. Laat leeg om huisstijl kleur te gebruiken',
                    },
                    components: {
                      Field:
                        '@innovixx/payload-color-picker-field/components#ColorPickerFieldComponent',
                    },
                  },
                },
                {
                  name: 'textColorDark',
                  type: 'text',
                  label: {
                    en: 'Text Color (Dark Mode)',
                    nl: 'Tekstkleur (Donkere Modus)',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Button text color for dark mode. Leave empty to use brand color',
                      nl: 'Knop tekstkleur voor donkere modus. Laat leeg om huisstijl kleur te gebruiken',
                    },
                    components: {
                      Field:
                        '@innovixx/payload-color-picker-field/components#ColorPickerFieldComponent',
                    },
                  },
                },
                {
                  name: 'icon',
                  type: 'select',
                  label: {
                    en: 'Icon',
                    nl: 'Icoon',
                  },
                  defaultValue: 'play',
                  options: [
                    { label: { en: 'Arrow Right', nl: 'Pijl Rechts' }, value: 'arrow-right' },
                    {
                      label: { en: 'Arrow Up Right', nl: 'Pijl Rechtsboven' },
                      value: 'arrow-up-right',
                    },
                    { label: { en: 'Play', nl: 'Afspelen' }, value: 'play' },
                    { label: { en: 'Plus', nl: 'Plus' }, value: 'plus' },
                    { label: { en: 'Download', nl: 'Download' }, value: 'download' },
                    { label: { en: 'External Link', nl: 'Externe Link' }, value: 'external-link' },
                    { label: { en: 'Mail Check', nl: 'Mail Check' }, value: 'mail-check' },
                    { label: { en: 'Mail', nl: 'Mail' }, value: 'mail' },
                    { label: { en: 'Phone', nl: 'Telefoon' }, value: 'phone' },
                    { label: { en: 'Send', nl: 'Verstuur' }, value: 'send' },
                    {
                      label: { en: 'Message Circle', nl: 'Bericht Cirkel' },
                      value: 'message-circle',
                    },
                    { label: { en: 'Info', nl: 'Info' }, value: 'info' },
                    {
                      label: { en: 'Chevron Right', nl: 'Chevron Rechts' },
                      value: 'chevron-right',
                    },
                    { label: { en: 'Check', nl: 'Vink' }, value: 'check' },
                    { label: { en: 'Star', nl: 'Ster' }, value: 'star' },
                    { label: { en: 'Heart', nl: 'Hart' }, value: 'heart' },
                    { label: { en: 'Zap', nl: 'Bliksem' }, value: 'zap' },
                    { label: { en: 'Sparkles', nl: 'Sparkles' }, value: 'sparkles' },
                    { label: { en: 'Calendar', nl: 'Kalender' }, value: 'calendar' },
                    { label: { en: 'Clock', nl: 'Klok' }, value: 'clock' },
                    { label: { en: 'File Text', nl: 'Bestand Tekst' }, value: 'file-text' },
                    { label: { en: 'Headphones', nl: 'Hoofdtelefoon' }, value: 'headphones' },
                    { label: { en: 'Mic', nl: 'Microfoon' }, value: 'mic' },
                    { label: { en: 'Music', nl: 'Muziek' }, value: 'music' },
                    { label: { en: 'None', nl: 'Geen' }, value: 'none' },
                  ],
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled !== false,
                    description: {
                      en: 'Icon to display in the button',
                      nl: 'Icoon om in de knop weer te geven',
                    },
                  },
                },
              ],
            },
          ],
        },
        // Stats for variant 1
        {
          type: 'collapsible',
          label: {
            en: 'Hero Stats',
            nl: 'Hero Statistieken',
          },
          admin: {
            condition: (data) => {
              // Check the pageBlocks array for which hero variant is selected
              const heroBlock = data?.pageBlocks?.find((b: any) => b.blockType === 'hero' && b.enabled);
              return heroBlock?.heroVariant === 'variant1';
            },
            initCollapsed: true,
          },
          fields: [
            {
              name: 'stats',
              type: 'array',
              admin: {
                description: {
                  en: 'Statistics displayed at the bottom of the hero section',
                  nl: 'Statistieken weergegeven onderaan de hero sectie',
                },
              },
              defaultValue: [
                { number: '14', label: 'Stemacteurs' },
                { number: '<48u', label: 'Snelle levering' },
                { number: '9.1/10', label: 'Klantbeoordeling' },
              ],
              fields: [
                {
                  name: 'number',
                  type: 'text',
                  required: true,
                  label: {
                    en: 'Number/Value',
                    nl: 'Nummer/Waarde',
                  },
                  admin: {
                    description: {
                      en: 'The statistic value (e.g., "14", "<48h", "9.1/10")',
                      nl: 'De statistische waarde (bijv. "14", "<48u", "9.1/10")',
                    },
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: {
                    en: 'Label',
                    nl: 'Label',
                  },
                  admin: {
                    description: {
                      en: 'Description of the statistic',
                      nl: 'Beschrijving van de statistiek',
                    },
                  },
                },
              ],
            },
          ],
        },
        // Legacy CTA field for backward compatibility
        {
          name: 'cta',
          type: 'group',
          label: {
            en: 'Call to Action',
            nl: 'Call to Action',
          },
          admin: {
            condition: () => false, // Legacy field - always hide
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              label: {
                en: 'Text',
                nl: 'Tekst',
              },
            },
            {
              name: 'link',
              type: 'text',
              label: {
                en: 'Link',
                nl: 'Link',
              },
            },
            {
              name: 'style',
              type: 'select',
              defaultValue: 'primary',
              label: {
                en: 'Style',
                nl: 'Stijl',
              },
              options: [
                { label: { en: 'Primary', nl: 'Primair' }, value: 'primary' },
                { label: { en: 'Secondary', nl: 'Secundair' }, value: 'secondary' },
                { label: { en: 'Outline', nl: 'Omlijnd' }, value: 'outline' },
              ],
            },
          ],
        },
        // Virtual field for resolved hero image URL
        {
          name: 'heroImageURL',
          type: 'text',
          virtual: true,
          admin: {
            hidden: true,
          },
          hooks: {
            afterRead: [
              async ({ siblingData, req }) => {
                // Only process if we have a heroImage
                if (!siblingData?.heroImage) return null;

                // If heroImage is just an ID string, fetch the media
                if (typeof siblingData.heroImage === 'string') {
                  try {
                    const media = await req.payload.findByID({
                      collection: 'media',
                      id: siblingData.heroImage,
                      depth: 0,
                    });

                    if (media?.url) {
                      return media.url;
                    } else if (media?.filename) {
                      const publicUrl = process.env.S3_PUBLIC_URL;
                      if (publicUrl) {
                        return `${publicUrl}/media/${media.filename}`;
                      }
                      return `/media/${media.filename}`;
                    }
                  } catch (error) {
                    console.error('Error fetching hero image media:', error);
                  }
                }
                // If heroImage is already populated as an object
                else if (typeof siblingData.heroImage === 'object') {
                  const heroImageObj = siblingData.heroImage as any;

                  if (heroImageObj.url) {
                    return heroImageObj.url;
                  } else if (heroImageObj.filename) {
                    const publicUrl = process.env.S3_PUBLIC_URL;
                    if (publicUrl) {
                      return `${publicUrl}/media/${heroImageObj.filename}`;
                    }
                    return `/media/${heroImageObj.filename}`;
                  }
                }

                return null;
              },
            ],
          },
        },
      ],
    },
  ],
};
