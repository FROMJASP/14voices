import type { FAQ } from '@/payload-types';

type FAQSeed = Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'>;

export const faqSeedData: FAQSeed[] = [
  {
    question: 'Hoe worden de tarieven berekend?',
    answer: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                mode: 'normal',
                text: 'Onze tarieven zijn gebaseerd op de lengte van de tekst, het type project en de gekozen stemacteur. U kunt gebruik maken van onze prijscalculator om direct een offerte te krijgen. Alle prijzen zijn transparant en er komen geen verborgen kosten bij.',
                type: 'text',
                style: '',
                detail: 0,
                format: 0,
                version: 1,
              },
            ],
          },
        ],
      },
    },
    category: 'pricing',
    order: 1,
    published: true,
  },
  {
    question: 'Hoe snel kan mijn voice-over klaar zijn?',
    answer: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                mode: 'normal',
                text: 'De standaard levertijd is 2-3 werkdagen. Voor spoedeisende projecten bieden we express levering binnen 24 uur aan (tegen meerprijs). De exacte levertijd hangt af van de lengte en complexiteit van uw project.',
                type: 'text',
                style: '',
                detail: 0,
                format: 0,
                version: 1,
              },
            ],
          },
        ],
      },
    },
    category: 'delivery',
    order: 2,
    published: true,
  },
  {
    question: 'In welke talen kunnen jullie voice-overs maken?',
    answer: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                mode: 'normal',
                text: 'Wij bieden voice-overs aan in meer dan 20 talen, waaronder Nederlands, Engels, Duits, Frans, Spaans en vele andere. Onze stemacteurs zijn native speakers, wat zorgt voor authentieke uitspraak en intonatie.',
                type: 'text',
                style: '',
                detail: 0,
                format: 0,
                version: 1,
              },
            ],
          },
        ],
      },
    },
    category: 'general',
    order: 3,
    published: true,
  },
  {
    question: 'In welke formaten lever ik de bestanden aan?',
    answer: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                mode: 'normal',
                text: 'U ontvangt uw voice-over standaard als high-quality MP3 en WAV bestand. Op verzoek kunnen we ook andere formaten leveren die geschikt zijn voor uw specifieke toepassing, zoals broadcast-kwaliteit bestanden voor radio en tv.',
                type: 'text',
                style: '',
                detail: 0,
                format: 0,
                version: 1,
              },
            ],
          },
        ],
      },
    },
    category: 'technical',
    order: 4,
    published: true,
  },
  {
    question: 'Kan ik wijzigingen aanvragen?',
    answer: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                mode: 'normal',
                text: 'Ja, wij bieden standaard 2 gratis revisierondes aan. Hiermee kunt u kleine aanpassingen laten maken aan de intonatie, het tempo of de uitspraak. Extra revisies zijn mogelijk tegen een kleine vergoeding.',
                type: 'text',
                style: '',
                detail: 0,
                format: 0,
                version: 1,
              },
            ],
          },
        ],
      },
    },
    category: 'general',
    order: 5,
    published: true,
  },
  {
    question: 'Voor welke doeleinden mag ik de voice-over gebruiken?',
    answer: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                mode: 'normal',
                text: 'Onze standaard licentie dekt commercieel gebruik voor online content, presentaties, e-learning en interne communicatie. Voor broadcast gebruik (radio/tv) of grootschalige campagnes gelden speciale tarieven. Dit bespreken we vooraf met u.',
                type: 'text',
                style: '',
                detail: 0,
                format: 0,
                version: 1,
              },
            ],
          },
        ],
      },
    },
    category: 'other',
    order: 6,
    published: true,
  },
];