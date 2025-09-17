import type { Block } from 'payload';

export const PriceCalculator: Block = {
  slug: 'price-calculator',
  interfaceName: 'PriceCalculatorBlock',
  labels: {
    singular: {
      en: 'Price Calculator',
      nl: 'Prijscalculator',
    },
    plural: {
      en: 'Price Calculators',
      nl: 'Prijscalculators',
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Bereken je project',
      admin: {
        description: 'Titel van de prijscalculator sectie',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
      defaultValue: 'Krijg direct inzicht in de kosten voor jouw voice-over project',
      admin: {
        description: 'Ondertitel/beschrijving',
      },
    },
    {
      name: 'showAllProductions',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Toon alle actieve producties',
      },
    },
    {
      name: 'selectedProductions',
      type: 'relationship',
      relationTo: 'productions',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => !siblingData?.showAllProductions,
        description: 'Selecteer specifieke producties om te tonen',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'cards',
      options: [
        {
          label: {
            en: 'Cards Layout',
            nl: 'Kaarten Layout',
          },
          value: 'cards',
        },
        {
          label: {
            en: 'Accordion Layout',
            nl: 'Accordeon Layout',
          },
          value: 'accordion',
        },
        {
          label: {
            en: 'Tabs Layout',
            nl: 'Tabbladen Layout',
          },
          value: 'tabs',
        },
      ],
      admin: {
        description: 'Kies de visuele weergave',
      },
    },
    {
      name: 'showVoiceoverSelection',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Toon ook voice-over selectie in de calculator',
      },
    },
    {
      name: 'ctaSettings',
      type: 'group',
      fields: [
        {
          name: 'showCTA',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Toon call-to-action na prijsberekening',
          },
        },
        {
          name: 'ctaText',
          type: 'text',
          localized: true,
          defaultValue: 'Bekijk onze voice-overs',
          admin: {
            condition: (_, siblingData) => siblingData?.showCTA,
            description: 'Tekst voor de CTA knop',
          },
        },
        {
          name: 'ctaLink',
          type: 'text',
          defaultValue: '/voiceovers',
          admin: {
            condition: (_, siblingData) => siblingData?.showCTA,
            description: 'Link voor de CTA knop',
          },
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'default',
      options: [
        {
          label: {
            en: 'Default',
            nl: 'Standaard',
          },
          value: 'default',
        },
        {
          label: {
            en: 'Gray',
            nl: 'Grijs',
          },
          value: 'gray',
        },
        {
          label: {
            en: 'White',
            nl: 'Wit',
          },
          value: 'white',
        },
      ],
      admin: {
        description: 'Achtergrondkleur van de sectie',
      },
    },
    {
      name: 'anchorId',
      type: 'text',
      defaultValue: 'prijzen',
      admin: {
        description: 'ID voor navigatie anker (bijv. voor #prijzen in URL)',
      },
    },
  ],
};
