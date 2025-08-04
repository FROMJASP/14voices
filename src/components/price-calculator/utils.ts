// Type definitions
export interface PriceItem {
  item: string;
  price: number;
}

export interface ExtraOption {
  item: string;
  price: number;
  infoText: string;
  dependencies?: string[];
}

export interface ProductionType {
  name: string;
  price: number;
  description: string;
  titleOne: string;
  titleTwo: string;
  itemlistTwo: PriceItem[];
  titleThree: string;
  itemlistThree: ExtraOption[];
  explainText?: string;
  uitzendgebied?: Array<{ name: string; price: number }>;
  icon?: string;
  orderLink?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  details: string[];
}

// Production data
export const productionData: ProductionType[] = [
  {
    name: 'E-learning',
    price: 200,
    description: 'Professionele voice-over voor educatieve content',
    titleOne: 'E-learning',
    titleTwo: 'Aantal woorden',
    itemlistTwo: [
      { item: '0-150 woorden', price: 0 },
      { item: '150-300 woorden', price: 75 },
      { item: '300-450 woorden', price: 150 },
      { item: '450-600 woorden', price: 225 },
      { item: 'Offerte op maat', price: 0 },
    ],
    titleThree: 'Extra opties',
    itemlistThree: [
      {
        item: 'Mix met muziek/SFX',
        price: 175,
        infoText: 'Professionele mix met achtergrondmuziek en geluidseffecten.',
      },
      {
        item: 'Revisie na feedback',
        price: 125,
        infoText: 'Eén ronde aanpassingen na uw feedback.',
      },
      {
        item: 'Meerdere talen/versies',
        price: 175,
        infoText: 'Vertaling en opname in extra taal.',
      },
      {
        item: 'Video synchronisatie',
        price: 195,
        infoText: 'Perfecte timing met uw videobeelden.',
      },
    ],
    icon: 'GraduationCap',
    orderLink: '/order/e-learning',
  },
  {
    name: 'Radiospot',
    price: 495,
    description: 'Catchy radiocommercial die blijft hangen',
    titleOne: 'Radiospot',
    titleTwo: 'Aantal seconden',
    itemlistTwo: [
      { item: '10 seconden', price: 0 },
      { item: '20 seconden', price: 75 },
      { item: '30 seconden', price: 150 },
      { item: '40 seconden', price: 225 },
    ],
    titleThree: 'Extra opties',
    itemlistThree: [
      {
        item: 'Productie & montage',
        price: 385,
        infoText: 'Complete productie inclusief muziek en effecten.',
      },
      {
        item: 'Uitzendrechten',
        price: 495,
        infoText: 'Onbeperkte uitzendrechten voor 1 jaar.',
      },
      {
        item: 'Jingle/sounder',
        price: 275,
        infoText: 'Herkenbare jingle voor uw merk.',
      },
      {
        item: 'Acteurs/figuranten',
        price: 395,
        infoText: 'Extra stemmen voor dialogen.',
      },
    ],
    uitzendgebied: [
      { name: 'Lokaal', price: 0 },
      { name: 'Regionaal', price: 195 },
      { name: 'Nationaal', price: 495 },
      { name: 'Internationaal', price: 795 },
    ],
    icon: 'Radio',
    orderLink: '/order/radiospot',
  },
  {
    name: 'Web/online commercial',
    price: 295,
    description: 'Overtuigende voice-over voor online video\'s',
    titleOne: 'Web/online commercial',
    titleTwo: 'Videoduur',
    itemlistTwo: [
      { item: '0-30 seconden', price: 0 },
      { item: '30-60 seconden', price: 95 },
      { item: '60-90 seconden', price: 195 },
      { item: '90-120 seconden', price: 295 },
      { item: 'Offerte op maat', price: 0 },
    ],
    titleThree: 'Extra opties',
    itemlistThree: [
      {
        item: 'Mix met muziek',
        price: 175,
        infoText: 'Professionele muziekonderlegger.',
      },
      {
        item: 'Revisie na feedback',
        price: 125,
        infoText: 'Aanpassingen na uw feedback.',
      },
      {
        item: 'Ondertiteling sync',
        price: 145,
        infoText: 'Perfecte timing met ondertitels.',
      },
      {
        item: 'Social media versies',
        price: 195,
        infoText: 'Aangepaste versies voor verschillende platforms.',
      },
    ],
    icon: 'Globe',
    orderLink: '/order/web-commercial',
  },
  {
    name: 'Videoproductie',
    price: 395,
    description: 'Voice-over voor professionele videoproducties',
    titleOne: 'Videoproductie',
    titleTwo: 'Videoduur',
    itemlistTwo: [
      { item: '0-1 minuut', price: 0 },
      { item: '1-3 minuten', price: 195 },
      { item: '3-5 minuten', price: 395 },
      { item: '5-10 minuten', price: 795 },
      { item: 'Offerte op maat', price: 0 },
    ],
    titleThree: 'Extra opties',
    itemlistThree: [
      {
        item: 'Video synchronisatie',
        price: 195,
        infoText: 'Perfecte lip-sync met beeld.',
      },
      {
        item: 'Karakterstem',
        price: 295,
        infoText: 'Unieke stem voor personage.',
      },
      {
        item: 'Meerdere versies',
        price: 245,
        infoText: 'Verschillende versies voor doelgroepen.',
      },
      {
        item: 'Rush levering',
        price: 195,
        infoText: 'Levering binnen 24 uur.',
      },
    ],
    icon: 'Video',
    orderLink: '/order/videoproductie',
  },
  {
    name: 'TV commercial',
    price: 695,
    description: 'Premium voice-over voor televisiereclame',
    titleOne: 'TV commercial',
    titleTwo: 'Aantal seconden',
    itemlistTwo: [
      { item: '10 seconden', price: 0 },
      { item: '20 seconden', price: 195 },
      { item: '30 seconden', price: 395 },
      { item: '40 seconden', price: 595 },
    ],
    titleThree: 'Extra opties',
    itemlistThree: [
      {
        item: 'Celebrity stem',
        price: 1495,
        infoText: 'Bekende stem voor extra impact.',
      },
      {
        item: 'Productie pakket',
        price: 795,
        infoText: 'Complete post-productie.',
      },
      {
        item: 'Uitzendrechten TV',
        price: 995,
        infoText: 'Landelijke TV-rechten voor 1 jaar.',
      },
      {
        item: 'Tag-on versies',
        price: 395,
        infoText: 'Variaties voor dealers/filialen.',
      },
    ],
    uitzendgebied: [
      { name: 'Regionaal', price: 395 },
      { name: 'Nationaal', price: 995 },
      { name: 'Benelux', price: 1495 },
      { name: 'Europa', price: 2495 },
    ],
    icon: 'Tv',
    orderLink: '/order/tv-commercial',
  },
  {
    name: 'Voice response (IVR)',
    price: 165,
    description: 'Professionele telefoonmenu\'s en wachtmuziek',
    titleOne: 'Voice response (IVR)',
    titleTwo: 'Aantal prompts',
    itemlistTwo: [
      { item: '1-5 prompts', price: 0 },
      { item: '5-10 prompts', price: 95 },
      { item: '10-20 prompts', price: 195 },
      { item: '20-30 prompts', price: 295 },
      { item: 'Offerte op maat', price: 0 },
    ],
    titleThree: 'Extra opties',
    itemlistThree: [
      {
        item: 'Wachtmuziek',
        price: 125,
        infoText: 'Professionele wachtmuziek op maat.',
      },
      {
        item: 'Meertalig menu',
        price: 195,
        infoText: 'Menu in meerdere talen.',
      },
      {
        item: 'Updates/wijzigingen',
        price: 95,
        infoText: 'Maandelijkse updates mogelijk.',
      },
      {
        item: 'On-hold boodschap',
        price: 145,
        infoText: 'Informatieve wachtboodschap.',
      },
    ],
    icon: 'Phone',
    orderLink: '/order/voice-response',
  },
];

// Calculate total price
export function calculateTotal(
  production: ProductionType,
  selectedWords: string,
  selectedOptions: Set<string>,
  selectedRegion?: string
): number {
  let total = production.price;

  // Add word count price
  const wordItem = production.itemlistTwo.find((item) => item.item === selectedWords);
  if (wordItem) {
    total += wordItem.price;
  }

  // Add selected options
  selectedOptions.forEach((option) => {
    const optionItem = production.itemlistThree.find((item) => item.item === option);
    if (optionItem) {
      total += optionItem.price;
    }
  });

  // Add region price if applicable
  if (selectedRegion && production.uitzendgebied) {
    const regionItem = production.uitzendgebied.find((item) => item.name === selectedRegion);
    if (regionItem) {
      total += regionItem.price;
    }
  }

  return total;
}

// Create cart items from selections
export function createCartItems(
  production: ProductionType,
  selectedWords: string,
  selectedOptions: Set<string>,
  selectedRegion?: string
): CartItem[] {
  const items: CartItem[] = [];

  // Add production base
  items.push({
    id: 'production',
    name: production.name,
    price: production.price,
    details: [],
  });

  // Add word count
  if (selectedWords) {
    const wordItem = production.itemlistTwo.find((item) => item.item === selectedWords);
    if (wordItem && wordItem.price > 0) {
      items.push({
        id: 'words',
        name: `${production.titleTwo}: ${selectedWords}`,
        price: wordItem.price,
        details: [],
      });
    }
  }

  // Add selected options
  selectedOptions.forEach((option) => {
    const optionItem = production.itemlistThree.find((item) => item.item === option);
    if (optionItem) {
      items.push({
        id: option,
        name: option,
        price: optionItem.price,
        details: [],
      });
    }
  });

  // Add region
  if (selectedRegion && production.uitzendgebied) {
    const regionItem = production.uitzendgebied.find((item) => item.name === selectedRegion);
    if (regionItem && regionItem.price > 0) {
      items.push({
        id: 'region',
        name: `Uitzendgebied: ${selectedRegion}`,
        price: regionItem.price,
        details: [],
      });
    }
  }

  return items;
}