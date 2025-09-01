import type { GlobalConfig } from 'payload';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: {
            en: 'General',
            nl: 'Algemeen',
          },
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              defaultValue: '14voices',
              label: {
                en: 'Site Name',
                nl: 'Sitenaam',
              },
              admin: {
                description: {
                  en: 'The name of the website. This appears in browser tabs, search results, and when sharing links on social media. Important for SEO and brand recognition.',
                  nl: 'De naam van de website. Dit verschijnt in browser tabbladen, zoekresultaten en bij het delen van links op sociale media. Belangrijk voor SEO en merkherkenning.',
                },
              },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: {
                en: 'Logo',
                nl: 'Logo',
              },
              admin: {
                description: {
                  en: 'The company logo that appears in the website header. Recommended size: 200x50 pixels. Used for brand identity and navigation. For best results, use SVG or PNG with transparent background.',
                  nl: 'Het bedrijfslogo dat in de website header verschijnt. Aanbevolen formaat: 200x50 pixels. Gebruikt voor merkidentiteit en navigatie. Voor beste resultaten, gebruik SVG of PNG met transparante achtergrond.',
                },
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: {
                en: 'Favicon',
                nl: 'Favicon',
              },
              admin: {
                description: {
                  en: 'The small icon that appears in browser tabs and bookmarks. Recommended: 32x32px SVG or PNG. If no favicon is uploaded, a default dark "14" icon will be used. Important for brand recognition and professional appearance.',
                  nl: 'Het kleine pictogram dat verschijnt in browser tabbladen en bladwijzers. Aanbevolen: 32x32px SVG of PNG. Als er geen favicon wordt geüpload, wordt een standaard donker "14" pictogram gebruikt. Belangrijk voor merkherkenning en professionele uitstraling.',
                },
              },
            },
            {
              name: 'siteUrl',
              type: 'text',
              required: true,
              label: {
                en: 'Site URL',
                nl: 'Website URL',
              },
              admin: {
                description: {
                  en: 'The complete URL of the website (e.g., https://14voices.com). Used for generating absolute URLs in sitemaps, RSS feeds, and social media meta tags. Critical for SEO and proper functioning of sharing features.',
                  nl: 'De volledige URL van de website (bijv. https://14voices.com). Gebruikt voor het genereren van absolute URLs in sitemaps, RSS-feeds en sociale media meta tags. Cruciaal voor SEO en het goed functioneren van deelfuncties.',
                },
              },
            },
            {
              name: 'language',
              type: 'select',
              defaultValue: 'nl',
              label: {
                en: 'Language',
                nl: 'Taal',
              },
              options: [
                { 
                  label: {
                    en: 'Dutch',
                    nl: 'Nederlands',
                  },
                  value: 'nl' 
                },
                { 
                  label: {
                    en: 'English',
                    nl: 'Engels',
                  },
                  value: 'en' 
                },
                { 
                  label: {
                    en: 'Spanish',
                    nl: 'Spaans',
                  },
                  value: 'es' 
                },
                { 
                  label: {
                    en: 'French',
                    nl: 'Frans',
                  },
                  value: 'fr' 
                },
                { 
                  label: {
                    en: 'German',
                    nl: 'Duits',
                  },
                  value: 'de' 
                },
              ],
              admin: {
                description: {
                  en: 'The default language for the website content. This affects the language declaration in HTML, helping search engines understand the content language. Important for SEO and accessibility. Does not change CMS interface language.',
                  nl: 'De standaardtaal voor de website-inhoud. Dit beïnvloedt de taaldeclaratie in HTML, waardoor zoekmachines de inhoudstaal begrijpen. Belangrijk voor SEO en toegankelijkheid. Verandert niet de CMS-interfacetaal.',
                },
              },
            },
          ],
        },
        {
          label: {
            en: 'Contact',
            nl: 'Contact',
          },
          fields: [
            {
              name: 'contact',
              type: 'group',
              label: {
                en: 'Contact Information',
                nl: 'Contactgegevens',
              },
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  label: {
                    en: 'Email Address',
                    nl: 'E-mailadres',
                  },
                  admin: {
                    description: {
                      en: 'Primary contact email address for business inquiries. This appears in the footer and contact sections of the website.',
                      nl: 'Primair e-mailadres voor zakelijke vragen. Dit verschijnt in de footer en contactsecties van de website.',
                    },
                  },
                },
                {
                  name: 'phone',
                  type: 'text',
                  label: {
                    en: 'Phone Number',
                    nl: 'Telefoonnummer',
                  },
                  admin: {
                    description: {
                      en: 'Primary contact phone number. Include country code for international visibility (e.g., +31 6 12345678).',
                      nl: 'Primair telefoonnummer. Voeg landcode toe voor internationale zichtbaarheid (bijv. +31 6 12345678).',
                    },
                  },
                },
                {
                  name: 'address',
                  type: 'group',
                  label: {
                    en: 'Business Address',
                    nl: 'Bedrijfsadres',
                  },
                  fields: [
                    {
                      name: 'street',
                      type: 'text',
                      label: {
                        en: 'Street Address',
                        nl: 'Straatnaam en Huisnummer',
                      },
                    },
                    {
                      name: 'city',
                      type: 'text',
                      label: {
                        en: 'City',
                        nl: 'Plaats',
                      },
                    },
                    {
                      name: 'state',
                      type: 'text',
                      label: {
                        en: 'State/Province',
                        nl: 'Provincie',
                      },
                    },
                    {
                      name: 'zip',
                      type: 'text',
                      label: {
                        en: 'Postal Code',
                        nl: 'Postcode',
                      },
                    },
                    {
                      name: 'country',
                      type: 'text',
                      label: {
                        en: 'Country',
                        nl: 'Land',
                      },
                    },
                  ],
                },
                {
                  name: 'hours',
                  type: 'textarea',
                  label: {
                    en: 'Business Hours',
                    nl: 'Openingstijden',
                  },
                  admin: {
                    description: {
                      en: 'Business hours (one per line). Example:\nMonday-Friday: 9:00-17:00\nSaturday: 10:00-15:00\nSunday: Closed',
                      nl: 'Openingstijden (één per regel). Voorbeeld:\nMaandag-Vrijdag: 9:00-17:00\nZaterdag: 10:00-15:00\nZondag: Gesloten',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: {
            en: 'Social Media',
            nl: 'Sociale Media',
          },
          fields: [
            {
              name: 'socialLinks',
              type: 'group',
              label: {
                en: 'Social Media Links',
                nl: 'Social Media Links',
              },
              fields: [
                {
                  name: 'facebook',
                  type: 'text',
                  label: {
                    en: 'Facebook',
                    nl: 'Facebook',
                  },
                  admin: {
                    description: {
                      en: 'Complete URL to your Facebook page (e.g., https://facebook.com/14voices).',
                      nl: 'Volledige URL naar jouw Facebook-pagina (bijv. https://facebook.com/14voices).',
                    },
                  },
                },
                {
                  name: 'twitter',
                  type: 'text',
                  label: {
                    en: 'Twitter/X',
                    nl: 'Twitter/X',
                  },
                  admin: {
                    description: {
                      en: 'Complete URL to your Twitter/X profile (e.g., https://x.com/14voices).',
                      nl: 'Volledige URL naar jouw Twitter/X profiel (bijv. https://x.com/14voices).',
                    },
                  },
                },
                {
                  name: 'instagram',
                  type: 'text',
                  label: {
                    en: 'Instagram',
                    nl: 'Instagram',
                  },
                  admin: {
                    description: {
                      en: 'Complete URL to your Instagram profile (e.g., https://instagram.com/14voices).',
                      nl: 'Volledige URL naar jouw Instagram profiel (bijv. https://instagram.com/14voices).',
                    },
                  },
                },
                {
                  name: 'linkedin',
                  type: 'text',
                  label: {
                    en: 'LinkedIn',
                    nl: 'LinkedIn',
                  },
                  admin: {
                    description: {
                      en: 'Complete URL to your LinkedIn company page or profile (e.g., https://linkedin.com/company/14voices).',
                      nl: 'Volledige URL naar jouw LinkedIn bedrijfspagina of profiel (bijv. https://linkedin.com/company/14voices).',
                    },
                  },
                },
                {
                  name: 'youtube',
                  type: 'text',
                  label: {
                    en: 'YouTube',
                    nl: 'YouTube',
                  },
                  admin: {
                    description: {
                      en: 'Complete URL to your YouTube channel (e.g., https://youtube.com/@14voices).',
                      nl: 'Volledige URL naar jouw YouTube-kanaal (bijv. https://youtube.com/@14voices).',
                    },
                  },
                },
                {
                  name: 'tiktok',
                  type: 'text',
                  label: {
                    en: 'TikTok',
                    nl: 'TikTok',
                  },
                  admin: {
                    description: {
                      en: 'Complete URL to your TikTok profile (e.g., https://tiktok.com/@14voices).',
                      nl: 'Volledige URL naar jouw TikTok profiel (bijv. https://tiktok.com/@14voices).',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'defaultSeo',
              type: 'group',
              label: {
                en: 'Default SEO Settings',
                nl: 'Standaard SEO Instellingen',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: {
                    en: 'Page Title Template',
                    nl: 'Paginatitel Sjabloon',
                  },
                  admin: {
                    description: {
                      en: 'Template for browser tab titles. Use %s where the page-specific title should appear (e.g., "%s | 14voices"). This template is used when pages don\'t have their own custom title. Important for SEO and user navigation.',
                      nl: 'Sjabloon voor browsertabblad titels. Gebruik %s waar de pagina-specifieke titel moet verschijnen (bijv. "%s | 14voices"). Dit sjabloon wordt gebruikt wanneer pagina\'s geen eigen aangepaste titel hebben. Belangrijk voor SEO en gebruikersnavigatie.',
                    },
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: {
                    en: 'Default Meta Description',
                    nl: 'Standaard Meta Beschrijving',
                  },
                  admin: {
                    description: {
                      en: 'Default description for search engine results. Used when pages don\'t have their own description. Should be 150-160 characters for optimal display. This text appears under the page title in search results.',
                      nl: 'Standaard beschrijving voor zoekmachine resultaten. Gebruikt wanneer pagina\'s geen eigen beschrijving hebben. Moet 150-160 tekens zijn voor optimale weergave. Deze tekst verschijnt onder de paginatitel in zoekresultaten.',
                    },
                  },
                },
                {
                  name: 'keywords',
                  type: 'array',
                  label: {
                    en: 'Default Keywords',
                    nl: 'Standaard Trefwoorden',
                  },
                  admin: {
                    description: {
                      en: 'Default keywords for SEO. While less important for modern SEO, they can still help with content categorization. Focus on 5-10 relevant keywords that describe your business.',
                      nl: 'Standaard trefwoorden voor SEO. Hoewel minder belangrijk voor moderne SEO, kunnen ze nog steeds helpen bij inhoudscategorisatie. Focus op 5-10 relevante trefwoorden die jouw bedrijf beschrijven.',
                    },
                  },
                  fields: [
                    {
                      name: 'keyword',
                      type: 'text',
                      label: {
                        en: 'Keyword',
                        nl: 'Trefwoord',
                      },
                    },
                  ],
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: {
                    en: 'Default Social Sharing Image',
                    nl: 'Standaard Social Media Afbeelding',
                  },
                  admin: {
                    description: {
                      en: 'Default image shown when pages are shared on social media. Recommended size: 1200x630 pixels. Used when pages don\'t have their own social image. Important for engagement on Facebook, LinkedIn, etc.',
                      nl: 'Standaard afbeelding die wordt getoond wanneer pagina\'s worden gedeeld op sociale media. Aanbevolen formaat: 1200x630 pixels. Gebruikt wanneer pagina\'s geen eigen sociale afbeelding hebben. Belangrijk voor betrokkenheid op Facebook, LinkedIn, etc.',
                    },
                  },
                },
              ],
            },
            {
              name: 'openGraph',
              type: 'group',
              label: {
                en: 'Open Graph Settings',
                nl: 'Open Graph Instellingen',
              },
              fields: [
                {
                  name: 'siteName',
                  type: 'text',
                  label: {
                    en: 'Open Graph Site Name',
                    nl: 'Open Graph Sitenaam',
                  },
                  admin: {
                    description: {
                      en: 'Site name for Open Graph protocol (Facebook, LinkedIn, etc.). Usually the same as your site name. This appears above the page title when shared on social media.',
                      nl: 'Sitenaam voor Open Graph protocol (Facebook, LinkedIn, etc.). Meestal hetzelfde als jouw sitenaam. Dit verschijnt boven de paginatitel wanneer gedeeld op sociale media.',
                    },
                  },
                },
                {
                  name: 'type',
                  type: 'select',
                  label: {
                    en: 'Content Type',
                    nl: 'Inhoud Type',
                  },
                  defaultValue: 'website',
                  options: [
                    { 
                      label: {
                        en: 'Website',
                        nl: 'Website',
                      }, 
                      value: 'website' 
                    },
                    { 
                      label: {
                        en: 'Article',
                        nl: 'Artikel',
                      }, 
                      value: 'article' 
                    },
                  ],
                  admin: {
                    description: {
                      en: 'Type of content for Open Graph. "Website" for general pages, "Article" for blog posts and news. This helps social media platforms display your content appropriately.',
                      nl: 'Type inhoud voor Open Graph. "Website" voor algemene pagina\'s, "Artikel" voor blogposts en nieuws. Dit helpt sociale media platforms jouw inhoud correct weer te geven.',
                    },
                  },
                },
              ],
            },
            {
              name: 'twitterCard',
              type: 'group',
              label: {
                en: 'Twitter/X Card Settings',
                nl: 'Twitter/X Card Instellingen',
              },
              fields: [
                {
                  name: 'cardType',
                  type: 'select',
                  label: {
                    en: 'Card Type',
                    nl: 'Kaart Type',
                  },
                  defaultValue: 'summary_large_image',
                  options: [
                    { 
                      label: {
                        en: 'Summary',
                        nl: 'Samenvatting',
                      }, 
                      value: 'summary' 
                    },
                    { 
                      label: {
                        en: 'Summary Large Image',
                        nl: 'Samenvatting met Grote Afbeelding',
                      }, 
                      value: 'summary_large_image' 
                    },
                  ],
                  admin: {
                    description: {
                      en: 'How content appears when shared on Twitter/X. "Summary" shows a small square image, "Summary Large Image" shows a large rectangular image. Large image typically gets more engagement.',
                      nl: 'Hoe inhoud verschijnt wanneer gedeeld op Twitter/X. "Samenvatting" toont een kleine vierkante afbeelding, "Samenvatting met Grote Afbeelding" toont een grote rechthoekige afbeelding. Grote afbeelding krijgt meestal meer betrokkenheid.',
                    },
                  },
                },
                {
                  name: 'handle',
                  type: 'text',
                  label: {
                    en: 'Twitter/X Handle',
                    nl: 'Twitter/X Gebruikersnaam',
                  },
                  admin: {
                    description: {
                      en: 'Your Twitter/X username including the @ symbol (e.g., @14voices). This links shared content back to your Twitter/X account and can increase followers.',
                      nl: 'Jouw Twitter/X gebruikersnaam inclusief het @ symbool (bijv. @14voices). Dit koppelt gedeelde inhoud terug naar jouw Twitter/X account en kan volgers verhogen.',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: {
            en: 'Analytics',
            nl: 'Analytics',
          },
          fields: [
            {
              name: 'analytics',
              type: 'group',
              label: {
                en: 'Analytics & Tracking',
                nl: 'Analytics & Tracking',
              },
              fields: [
                {
                  name: 'googleAnalyticsId',
                  type: 'text',
                  label: {
                    en: 'Google Analytics 4 ID',
                    nl: 'Google Analytics 4 ID',
                  },
                  admin: {
                    description: {
                      en: 'Google Analytics 4 Measurement ID (e.g., G-XXXXXXXXXX). Find this in your Google Analytics property settings.',
                      nl: 'Google Analytics 4 Measurement ID (bijv. G-XXXXXXXXXX). Vind dit in jouw Google Analytics property-instellingen.',
                    },
                  },
                },
                {
                  name: 'googleTagManagerId',
                  type: 'text',
                  label: {
                    en: 'Google Tag Manager ID',
                    nl: 'Google Tag Manager ID',
                  },
                  admin: {
                    description: {
                      en: 'Google Tag Manager Container ID (e.g., GTM-XXXXXX). Find this in your GTM container settings.',
                      nl: 'Google Tag Manager Container ID (bijv. GTM-XXXXXX). Vind dit in jouw GTM-container instellingen.',
                    },
                  },
                },
                {
                  name: 'facebookPixelId',
                  type: 'text',
                  label: {
                    en: 'Facebook Pixel ID',
                    nl: 'Facebook Pixel ID',
                  },
                  admin: {
                    description: {
                      en: 'Facebook/Meta Pixel ID. Find this in your Facebook Business Manager under Events Manager.',
                      nl: 'Facebook/Meta Pixel ID. Vind dit in jouw Facebook Business Manager onder Events Manager.',
                    },
                  },
                },
                {
                  name: 'customScripts',
                  type: 'group',
                  label: {
                    en: 'Custom Scripts',
                    nl: 'Aangepaste Scripts',
                  },
                  fields: [
                    {
                      name: 'headScripts',
                      type: 'textarea',
                      label: {
                        en: 'Head Scripts',
                        nl: 'Head Scripts',
                      },
                      admin: {
                        description: {
                          en: 'Scripts to inject in the <head> section. Be careful: incorrect scripts can break your site.',
                          nl: 'Scripts om in de <head> sectie te injecteren. Wees voorzichtig: onjuiste scripts kunnen jouw site breken.',
                        },
                      },
                    },
                    {
                      name: 'bodyScripts',
                      type: 'textarea',
                      label: {
                        en: 'Body Scripts',
                        nl: 'Body Scripts',
                      },
                      admin: {
                        description: {
                          en: 'Scripts to inject before the closing </body> tag. Always test after adding new scripts.',
                          nl: 'Scripts om voor de sluitende </body> tag te injecteren. Test altijd na het toevoegen van nieuwe scripts.',
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Branding',
          fields: [
            {
              name: 'branding',
              type: 'group',
              fields: [
                {
                  name: 'logoType',
                  type: 'select',
                  defaultValue: 'text',
                  options: [
                    { label: 'Text Logo', value: 'text' },
                    { label: 'Image Logo', value: 'image' },
                  ],
                  admin: {
                    description: 'Choose between text logo or image logo',
                  },
                },
                {
                  name: 'logoText',
                  type: 'text',
                  defaultValue: 'FourteenVoices',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.logoType === 'text',
                    description: 'Text to display as logo',
                  },
                },
                {
                  name: 'logoImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.logoType === 'image',
                    description:
                      'Image to use as logo (recommended: SVG or PNG with transparent background)',
                  },
                },
                {
                  name: 'logoImageDark',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.logoType === 'image',
                    description:
                      'Optional: Different logo for dark mode (if not provided, same logo will be used)',
                  },
                },
                {
                  name: 'logoPreview',
                  type: 'ui',
                  admin: {
                    components: {
                      Field: '@/components/admin/ui/LogoPreview#LogoPreview',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: {
            en: 'Navigation',
            nl: 'Navigatie',
          },
          fields: [
            {
              name: 'navigation',
              type: 'group',
              fields: [
                {
                  name: 'mainMenuItems',
                  type: 'array',
                  label: {
                    en: 'Main Menu Items',
                    nl: 'Hoofdmenu Items',
                  },
                  admin: {
                    description: {
                      en: 'Navigation items to display in the main menu',
                      nl: 'Navigatie-items om in het hoofdmenu weer te geven',
                    },
                    initCollapsed: false,
                  },
                  defaultValue: [
                    { label: 'Voice-overs', url: '#voiceovers', hasDropdown: true },
                    { label: 'Prijzen', url: '/prijzen', hasDropdown: false },
                  ],
                  fields: [
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
                          en: 'Display text for the menu item',
                          nl: 'Weergavetekst voor het menu-item',
                        },
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                      label: {
                        en: 'URL',
                        nl: 'URL',
                      },
                      admin: {
                        description: {
                          en: 'URL path (e.g., /voiceovers) or anchor (#voiceovers)',
                          nl: 'URL pad (bijv. /voiceovers) of anker (#voiceovers)',
                        },
                      },
                    },
                    {
                      name: 'hasDropdown',
                      type: 'checkbox',
                      defaultValue: false,
                      label: {
                        en: 'Has Dropdown',
                        nl: 'Heeft Dropdown',
                      },
                      admin: {
                        description: {
                          en: 'Show dropdown arrow (dropdown content can be configured later)',
                          nl: 'Toon dropdown pijl (dropdown inhoud kan later worden geconfigureerd)',
                        },
                      },
                    },
                    {
                      name: 'openInNewTab',
                      type: 'checkbox',
                      defaultValue: false,
                      label: {
                        en: 'Open in New Tab',
                        nl: 'Open in Nieuw Tabblad',
                      },
                      admin: {
                        description: {
                          en: 'Open link in a new tab/window',
                          nl: 'Open link in een nieuw tabblad/venster',
                        },
                      },
                    },
                  ],
                },
                {
                  name: 'loginText',
                  type: 'text',
                  defaultValue: 'Login',
                  label: {
                    en: 'Login Text',
                    nl: 'Login Tekst',
                  },
                  admin: {
                    description: {
                      en: 'Text for the login link',
                      nl: 'Tekst voor de login link',
                    },
                  },
                },
                {
                  name: 'loginUrl',
                  type: 'text',
                  defaultValue: '/login',
                  label: {
                    en: 'Login URL',
                    nl: 'Login URL',
                  },
                  admin: {
                    description: {
                      en: 'URL for the login link',
                      nl: 'URL voor de login link',
                    },
                  },
                },
                {
                  name: 'ctaButtonText',
                  type: 'text',
                  defaultValue: 'Mijn omgeving',
                  label: {
                    en: 'CTA Button Text',
                    nl: 'CTA Knop Tekst',
                  },
                  admin: {
                    description: {
                      en: 'Text for the call-to-action button (only visible when user is logged in)',
                      nl: 'Tekst voor de call-to-action knop (alleen zichtbaar wanneer de gebruiker is ingelogd)',
                    },
                  },
                },
                {
                  name: 'ctaButtonUrl',
                  type: 'text',
                  defaultValue: '/dashboard',
                  label: {
                    en: 'CTA Button URL',
                    nl: 'CTA Knop URL',
                  },
                  admin: {
                    description: {
                      en: 'URL for the call-to-action button (button only shows when user is logged in)',
                      nl: 'URL voor de call-to-action knop (knop wordt alleen getoond wanneer de gebruiker is ingelogd)',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Top Bar',
          fields: [
            {
              name: 'topBar',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Enable Top Bar',
                  admin: {
                    description: 'Show the top bar with contact details and quick links',
                  },
                },
                {
                  name: 'whatsappNumber',
                  type: 'text',
                  defaultValue: '+31 6 12345678',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true,
                    description:
                      'WhatsApp number for contact (include country code). Default: +31 6 12345678',
                  },
                },
                {
                  name: 'whatsappTooltip',
                  type: 'group',
                  label: 'WhatsApp Tooltip',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true && siblingData?.whatsappNumber,
                    description: 'Configure the tooltip that appears when hovering over the WhatsApp number',
                  },
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: true,
                      label: 'Enable Tooltip',
                      admin: {
                        description: 'Show a tooltip when hovering over the WhatsApp number',
                      },
                    },
                    {
                      name: 'title',
                      type: 'text',
                      defaultValue: 'Stuur ons een WhatsApp',
                      admin: {
                        condition: (_data, siblingData) => siblingData?.enabled === true,
                        description: 'Title text for the tooltip. Default: "Stuur ons een WhatsApp"',
                      },
                    },
                    {
                      name: 'message',
                      type: 'textarea',
                      defaultValue: 'We zijn vaak in de studio aan het werk. Stuur ons eerst een WhatsApp-bericht, dan kunnen we je zo snel mogelijk terugbellen.',
                      admin: {
                        condition: (_data, siblingData) => siblingData?.enabled === true,
                        description: 'Message text for the tooltip. Default: "We zijn vaak in de studio aan het werk. Stuur ons eerst een WhatsApp-bericht, dan kunnen we je zo snel mogelijk terugbellen."',
                      },
                    },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      admin: {
                        condition: (_data, siblingData) => siblingData?.enabled === true,
                        description: 'Optional image to show in the tooltip (recommended: 80x80px)',
                      },
                    },
                  ],
                },
                {
                  name: 'email',
                  type: 'email',
                  defaultValue: 'casting@14voices.com',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true,
                    description: 'Primary contact email address. Default: casting@14voices.com',
                  },
                },
                {
                  name: 'quickLinks',
                  type: 'array',
                  label: 'Quick Links',
                  admin: {
                    condition: (_data, siblingData) => siblingData?.enabled === true,
                    description: 'Navigation links to display in the top bar. Default links: "Veelgestelde vragen" (/veelgestelde-vragen) and "Blog" (/blog)',
                    initCollapsed: false,
                  },
                  defaultValue: [
                    { label: 'Veelgestelde vragen', url: '/veelgestelde-vragen' },
                    { label: 'Blog', url: '/blog' },
                  ],
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Display text for the link',
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'URL path (e.g., /veelgestelde-vragen) or external URL',
                      },
                    },
                    {
                      name: 'openInNewTab',
                      type: 'checkbox',
                      defaultValue: false,
                      label: {
                        en: 'Open in New Tab',
                        nl: 'Open in Nieuw Tabblad',
                      },
                      admin: {
                        description: {
                          en: 'Open link in a new tab/window',
                          nl: 'Open link in een nieuw tabblad/venster',
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: {
            en: 'Features',
            nl: 'Functies',
          },
          fields: [
            {
              name: 'features',
              type: 'group',
              label: {
                en: 'Site Features',
                nl: 'Site Functies',
              },
              fields: [
                {
                  name: 'enableSearch',
                  type: 'checkbox',
                  defaultValue: true,
                  label: {
                    en: 'Enable Site Search',
                    nl: 'Zoekfunctie Inschakelen',
                  },
                  admin: {
                    description: {
                      en: '⚠️ WARNING: Disabling this will remove search functionality from your entire website. Visitors will not be able to search for content.',
                      nl: '⚠️ WAARSCHUWING: Dit uitschakelen verwijdert de zoekfunctionaliteit van jouw hele website. Bezoekers kunnen dan niet meer zoeken naar inhoud.',
                    },
                    condition: (_data, siblingData) => {
                      if (
                        siblingData?.enableSearch === false &&
                        siblingData?.enableSearch !== undefined
                      ) {
                        return confirm(
                          'Are you absolutely sure you want to disable site search? This will remove all search functionality from your website.'
                        );
                      }
                      return true;
                    },
                  },
                },
                {
                  name: 'enableBlog',
                  type: 'checkbox',
                  defaultValue: true,
                  label: {
                    en: 'Enable Blog',
                    nl: 'Blog Inschakelen',
                  },
                  admin: {
                    description: {
                      en: '⚠️ WARNING: Disabling this will hide all blog posts and the blog section from your website. This affects SEO and content visibility.',
                      nl: '⚠️ WAARSCHUWING: Dit uitschakelen verbergt alle blogposts en de blogsectie van jouw website. Dit beïnvloedt SEO en inhoudszichtbaarheid.',
                    },
                    condition: (_data, siblingData) => {
                      if (
                        siblingData?.enableBlog === false &&
                        siblingData?.enableBlog !== undefined
                      ) {
                        return confirm(
                          'Are you absolutely sure you want to disable the blog? This will hide all blog content from your website.'
                        );
                      }
                      return true;
                    },
                  },
                },
                {
                  name: 'maintenanceMode',
                  type: 'checkbox',
                  defaultValue: false,
                  label: {
                    en: 'Enable Maintenance Mode',
                    nl: 'Onderhoudsmodus Inschakelen',
                  },
                },
                {
                  name: 'maintenanceTitle',
                  type: 'text',
                  defaultValue: 'We zijn zo terug!',
                  label: {
                    en: 'Maintenance Title',
                    nl: 'Onderhoudstitel',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.maintenanceMode === true,
                    description: {
                      en: 'Main heading displayed on the maintenance page',
                      nl: 'Hoofdtitel die wordt weergegeven op de onderhoudspagina',
                    },
                  },
                },
                {
                  name: 'maintenanceMessage',
                  type: 'textarea',
                  defaultValue:
                    'We voeren momenteel gepland onderhoud uit. We zijn zo weer online.',
                  label: {
                    en: 'Maintenance Message',
                    nl: 'Onderhoudsbericht',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.maintenanceMode === true,
                    description: {
                      en: 'Main message to show visitors during maintenance',
                      nl: 'Hoofdbericht om bezoekers te tonen tijdens onderhoud',
                    },
                  },
                },
                {
                  name: 'maintenanceContactLabel',
                  type: 'text',
                  defaultValue: 'Contact nodig?',
                  label: {
                    en: 'Contact Label',
                    nl: 'Contact Label',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.maintenanceMode === true,
                    description: {
                      en: 'Label displayed above the contact email during maintenance',
                      nl: 'Label die boven het contact e-mailadres wordt getoond tijdens onderhoud',
                    },
                  },
                },
                {
                  name: 'showContactEmail',
                  type: 'checkbox',
                  defaultValue: true,
                  label: {
                    en: 'Show Contact Email',
                    nl: 'Contact E-mail Tonen',
                  },
                  admin: {
                    condition: (_data, siblingData) => siblingData?.maintenanceMode === true,
                    description: {
                      en: 'Display contact email on the maintenance page',
                      nl: 'Toon contact e-mailadres op de onderhoudspagina',
                    },
                  },
                },
                {
                  name: 'maintenancePreview',
                  type: 'ui',
                  admin: {
                    components: {
                      Field: './components/admin/MaintenanceModePreview#MaintenanceModePreview',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
