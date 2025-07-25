'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import {
  Check,
  Info,
  Calculator,
  User,
  Video,
  GraduationCap,
  Radio,
  Tv,
  Globe,
  Phone,
  ChevronRight,
  Sparkles,
  Shield,
  X,
} from 'lucide-react';
import { useVoiceover, scrollToVoiceovers } from '@/contexts/VoiceoverContext';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

// Type definitions
interface PriceItem {
  item: string;
  price: number;
}

interface ExtraOption {
  item: string;
  price: number;
  infoText: string;
  dependencies?: string[];
}

interface ProductionType {
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
}

// Production data with icons
const productionIcons: Record<string, React.ElementType> = {
  Videoproductie: Video,
  'E-learning': GraduationCap,
  Radiospot: Radio,
  'TV Commercial': Tv,
  'Web Commercial': Globe,
  'Voice Response': Phone,
};

const productionData: ProductionType[] = [
  {
    name: 'Videoproductie',
    price: 175,
    description: 'Videoproducties zijn video\'s die intern worden gebruikt, bijvoorbeeld als bedrijfsfilm, of extern via de website of sociale media — zonder inzet van advertentiebudget. Wordt de video ingezet als betaalde advertentie, kies dan voor de categorie \'Web Commercial\'.',
    titleOne: 'Productiesoort',
    titleTwo: 'Aantal woorden',
    itemlistTwo: [
      { item: '0 - 250', price: 0 },
      { item: '250 - 500', price: 50 },
      { item: '500 - 1000', price: 150 },
      { item: '1000 - 1500', price: 225 },
      { item: '1500+', price: 350 },
    ],
    titleThree: 'Extra Opties',
    itemlistThree: [
      {
        item: 'Audio Cleanup',
        price: 50,
        infoText:
          'Al onze opnames worden standaard onbewerkt opgeleverd. Er kunnen dus ademhalingen, smakjes en andere oneffenheden te horen zijn. Kies Audio Cleanup wanneer je een volledig opgeschoond en geprocessed bestand wilt ontvangen dat kant en klaar te gebruiken is.',
      },
      {
        item: 'Editing',
        price: 50,
        infoText:
          'Onder deze categorie vallen producties zoals bedrijfsfilms, documentaires, audiotours, etc.',
      },
      {
        item: 'Mixage',
        price: 100,
        infoText:
          'Opname uitzendklaar door ons laten afmixen? Wij maken de perfecte radio- tv, of webmixage voor je zodat je productie goed klinkt en meteen gebruikt kan worden.',
        dependencies: ['Editing'],
      },
      {
        item: 'Sound Design',
        price: 100,
        infoText:
          'Heeft jouw productie een passend geluidsontwerp nodig? Wij voorzien de opnames in overleg met jou van passende geluidseffecten en leveren een kant en klaar eindproduct op.',
        dependencies: ['Editing', 'Mixage'],
      },
      {
        item: 'Klantregie',
        price: 75,
        infoText:
          'Live meeluisteren en regisseren tijdens de opnames? Dat kan met Klantregie. Via een eenvoudige weblink kun je meeluisteren en feedback geven alsof je in de studio zit',
      },
      {
        item: 'Copywriting',
        price: 125,
        infoText:
          'Je scripts nog beter laten klinken? Kies Copywriting wanneer je jouw basistekst door ons wilt laten redigeren tot goed in te spreken copy die overbrengt wat de bedoeling is.',
      },
      {
        item: 'Inspreken op beeld',
        price: 75,
        infoText:
          'Wil je dat jouw script op beeld wordt ingesproken? Stuur ons je video en we dubben de voice-over onder het beeld, zodat je qua timing altijd goed zit!',
      },
    ],
  },
  {
    name: 'E-learning',
    price: 200,
    description: 'E-learning video\'s worden ingezet voor educatieve doeleinden, zoals interne trainingen, onboarding of instructie voor medewerkers of klanten. Deze video\'s zijn bedoeld voor gebruik binnen een leeromgeving of platform, zonder commerciële doeleinden. Wanneer de video primair wordt ingezet als promotie of werving, kies dan voor de categorie \'Web Commercial\'.',
    titleOne: 'Productiesoort',
    titleTwo: 'Aantal woorden',
    itemlistTwo: [
      { item: '0 - 500', price: 0 },
      { item: '500 - 1000', price: 100 },
      { item: '1000 - 1500', price: 175 },
      { item: '1500 - 2000', price: 250 },
      { item: '2000+', price: 400 },
    ],
    titleThree: 'Extra Opties',
    itemlistThree: [
      {
        item: 'Audio Cleanup',
        price: 50,
        infoText:
          'Al onze opnames worden standaard onbewerkt opgeleverd. Er kunnen dus ademhalingen, smakjes en andere oneffenheden te horen zijn. Kies Audio Cleanup wanneer je een volledig opgeschoond en geprocessed bestand wilt ontvangen dat kant en klaar te gebruiken is.',
      },
      {
        item: 'Editing',
        price: 50,
        infoText:
          'Onder deze categorie vallen producties zoals bedrijfsfilms, documentaires, audiotours, etc.',
      },
      {
        item: 'Mixage',
        price: 100,
        infoText:
          'Opname uitzendklaar door ons laten afmixen? Wij maken de perfecte radio- tv, of webmixage voor je zodat je productie goed klinkt en meteen gebruikt kan worden.',
        dependencies: ['Editing'],
      },
      {
        item: 'Sound Design',
        price: 100,
        infoText:
          'Heeft jouw productie een passend geluidsontwerp nodig? Wij voorzien de opnames in overleg met jou van passende geluidseffecten en leveren een kant en klaar eindproduct op.',
        dependencies: ['Editing', 'Mixage'],
      },
      {
        item: 'Klantregie',
        price: 75,
        infoText:
          'Live meeluisteren en regisseren tijdens de opnames? Dat kan met Klantregie. Via een eenvoudige weblink kun je meeluisteren en feedback geven alsof je in de studio zit',
      },
      {
        item: 'Copywriting',
        price: 125,
        infoText:
          'Je scripts nog beter laten klinken? Kies Copywriting wanneer je jouw basistekst door ons wilt laten redigeren tot goed in te spreken copy die overbrengt wat de bedoeling is.',
      },
      {
        item: 'Inspreken op beeld',
        price: 75,
        infoText:
          'Wil je dat jouw script op beeld wordt ingesproken? Stuur ons je video en we dubben de voice-over onder het beeld, zodat je qua timing altijd goed zit!',
      },
    ],
  },
  {
    name: 'Radiospot',
    price: 150,
    description: 'Radiospots zijn audioboodschappen die worden uitgezonden via radio of streamingdiensten met als doel een product, dienst of merk te promoten. Deze producties zijn specifiek bedoeld voor commerciële doeleinden en worden verspreid met inzet van mediabudget.',
    titleOne: 'Productiesoort',
    titleTwo: 'Aantal versies',
    explainText:
      'Aantal versies inclusief eventuele tag-ons. Bijvoorbeeld: wanneer je één commercial plus één tag-on nodig hebt, vul hier dan "twee" in.',
    itemlistTwo: [
      { item: '1', price: 0 },
      { item: '2', price: 190 },
      { item: '3', price: 310 },
      { item: '4', price: 410 },
      { item: '5', price: 490 },
    ],
    titleThree: 'Extra Opties',
    itemlistThree: [
      {
        item: 'Audio Cleanup',
        price: 75,
        infoText:
          'Al onze opnames worden standaard onbewerkt opgeleverd. Er kunnen dus ademhalingen, smakjes en andere oneffenheden te horen zijn. Kies Audio Cleanup wanneer je een volledig opgeschoond en geprocessed bestand wilt ontvangen dat kant en klaar te gebruiken is.',
      },
      {
        item: 'Editing',
        price: 75,
        infoText:
          'Onder deze categorie vallen producties zoals bedrijfsfilms, documentaires, audiotours, etc.',
      },
      {
        item: 'Mixage',
        price: 150,
        infoText:
          'Opname uitzendklaar door ons laten afmixen? Wij maken de perfecte radio- tv, of webmixage voor je zodat je productie goed klinkt en meteen gebruikt kan worden.',
        dependencies: ['Editing'],
      },
      {
        item: 'Sound Design',
        price: 150,
        infoText:
          'Heeft jouw productie een passend geluidsontwerp nodig? Wij voorzien de opnames in overleg met jou van passende geluidseffecten en leveren een kant en klaar eindproduct op.',
        dependencies: ['Editing', 'Mixage'],
      },
      {
        item: 'Klantregie',
        price: 75,
        infoText:
          'Live meeluisteren en regisseren tijdens de opnames? Dat kan met Klantregie. Via een eenvoudige weblink kun je meeluisteren en feedback geven alsof je in de studio zit',
      },
      {
        item: 'Copywriting',
        price: 125,
        infoText:
          'Je scripts nog beter laten klinken? Kies Copywriting wanneer je jouw basistekst door ons wilt laten redigeren tot goed in te spreken copy die overbrengt wat de bedoeling is.',
      },
    ],
    uitzendgebied: [
      { name: 'regionaal', price: 0 },
      { name: 'nationaal', price: 250 },
    ],
  },
  {
    name: 'TV Commercial',
    price: 250,
    description: 'TV Commercials zijn videoproducties die worden uitgezonden via televisie of videoplatforms met inzet van mediabudget. Ze zijn gericht op een breed publiek en bedoeld om merkbekendheid te vergroten of een product of dienst te promoten. Let op: vergeet niet te specificeren of de commercial regionaal of nationaal uitgezonden wordt.',
    titleOne: 'Productiesoort',
    titleTwo: 'Aantal versies',
    explainText:
      'Aantal versies inclusief eventuele tag-ons. Bijvoorbeeld: wanneer je één commercial plus één tag-on nodig hebt, vul hier dan "twee" in.',
    itemlistTwo: [
      { item: '1', price: 0 },
      { item: '2', price: 190 },
      { item: '3', price: 310 },
      { item: '4', price: 410 },
      { item: '5', price: 490 },
    ],
    titleThree: 'Extra Opties',
    itemlistThree: [
      {
        item: 'Audio Cleanup',
        price: 75,
        infoText:
          'Al onze opnames worden standaard onbewerkt opgeleverd. Er kunnen dus ademhalingen, smakjes en andere oneffenheden te horen zijn. Kies Audio Cleanup wanneer je een volledig opgeschoond en geprocessed bestand wilt ontvangen dat kant en klaar te gebruiken is.',
      },
      {
        item: 'Editing',
        price: 75,
        infoText:
          'Onder deze categorie vallen producties zoals bedrijfsfilms, documentaires, audiotours, etc.',
      },
      {
        item: 'Mixage',
        price: 150,
        infoText:
          'Opname uitzendklaar door ons laten afmixen? Wij maken de perfecte radio- tv, of webmixage voor je zodat je productie goed klinkt en meteen gebruikt kan worden.',
        dependencies: ['Editing'],
      },
      {
        item: 'Sound Design',
        price: 150,
        infoText:
          'Heeft jouw productie een passend geluidsontwerp nodig? Wij voorzien de opnames in overleg met jou van passende geluidseffecten en leveren een kant en klaar eindproduct op.',
        dependencies: ['Editing', 'Mixage'],
      },
      {
        item: 'Klantregie',
        price: 75,
        infoText:
          'Live meeluisteren en regisseren tijdens de opnames? Dat kan met Klantregie. Via een eenvoudige weblink kun je meeluisteren en feedback geven alsof je in de studio zit',
      },
      {
        item: 'Copywriting',
        price: 125,
        infoText:
          'Je scripts nog beter laten klinken? Kies Copywriting wanneer je jouw basistekst door ons wilt laten redigeren tot goed in te spreken copy die overbrengt wat de bedoeling is.',
      },
      {
        item: 'Inspreken op beeld',
        price: 100,
        infoText:
          'Wil je dat jouw script op beeld wordt ingesproken? Stuur ons je video en we dubben de voice-over onder het beeld, zodat je qua timing altijd goed zit!',
      },
    ],
    uitzendgebied: [
      { name: 'regionaal', price: 0 },
      { name: 'nationaal', price: 300 },
    ],
  },
  {
    name: 'Web Commercial',
    price: 400,
    description: 'Web Commercials zijn online video\'s die worden ingezet als advertentie op platforms zoals YouTube, Instagram, Facebook of LinkedIn, met gebruik van advertentiebudget. Ze zijn gericht op het promoten van een product, dienst of merk bij een specifieke doelgroep.',
    titleOne: 'Productiesoort',
    titleTwo: 'Aantal versies',
    explainText:
      'Aantal versies inclusief eventuele tag-ons. Bijvoorbeeld: wanneer je één commercial plus één tag-on nodig hebt, vul hier dan "twee" in.',
    itemlistTwo: [
      { item: '1', price: 0 },
      { item: '2', price: 300 },
      { item: '3', price: 635 },
      { item: '4', price: 860 },
      { item: '5', price: 1040 },
    ],
    titleThree: 'Extra Opties',
    itemlistThree: [
      {
        item: 'Audio Cleanup',
        price: 75,
        infoText:
          'Al onze opnames worden standaard onbewerkt opgeleverd. Er kunnen dus ademhalingen, smakjes en andere oneffenheden te horen zijn. Kies Audio Cleanup wanneer je een volledig opgeschoond en geprocessed bestand wilt ontvangen dat kant en klaar te gebruiken is.',
      },
      {
        item: 'Editing',
        price: 75,
        infoText:
          'Onder deze categorie vallen producties zoals bedrijfsfilms, documentaires, audiotours, etc.',
      },
      {
        item: 'Mixage',
        price: 150,
        infoText:
          'Opname uitzendklaar door ons laten afmixen? Wij maken de perfecte radio- tv, of webmixage voor je zodat je productie goed klinkt en meteen gebruikt kan worden.',
        dependencies: ['Editing'],
      },
      {
        item: 'Sound Design',
        price: 150,
        infoText:
          'Heeft jouw productie een passend geluidsontwerp nodig? Wij voorzien de opnames in overleg met jou van passende geluidseffecten en leveren een kant en klaar eindproduct op.',
        dependencies: ['Editing', 'Mixage'],
      },
      {
        item: 'Klantregie',
        price: 75,
        infoText:
          'Live meeluisteren en regisseren tijdens de opnames? Dat kan met Klantregie. Via een eenvoudige weblink kun je meeluisteren en feedback geven alsof je in de studio zit',
      },
      {
        item: 'Copywriting',
        price: 125,
        infoText:
          'Je scripts nog beter laten klinken? Kies Copywriting wanneer je jouw basistekst door ons wilt laten redigeren tot goed in te spreken copy die overbrengt wat de bedoeling is.',
      },
      {
        item: 'Inspreken op beeld',
        price: 100,
        infoText:
          'Wil je dat jouw script op beeld wordt ingesproken? Stuur ons je video en we dubben de voice-over onder het beeld, zodat je qua timing altijd goed zit!',
      },
    ],
    uitzendgebied: [
      { name: 'regionaal', price: 0 },
      { name: 'nationaal', price: 250 },
    ],
  },
  {
    name: 'Voice Response',
    price: 150,
    description: 'Voice Response betreft ingesproken teksten voor automatische telefoonsystemen, zoals keuzemenu\'s, welkomstboodschappen, voicemails of wachtrijen. Deze opnames zorgen voor een professionele en consistente telefonische klantbeleving.',
    titleOne: 'Productiesoort',
    titleTwo: 'Aantal woorden',
    itemlistTwo: [
      { item: '0 - 500', price: 0 },
      { item: '500 - 1000', price: 100 },
      { item: '1000 - 1500', price: 175 },
      { item: '1500 - 2000', price: 250 },
      { item: '2000+', price: 400 },
    ],
    titleThree: 'Extra Opties',
    itemlistThree: [
      {
        item: 'Audio Cleanup',
        price: 50,
        infoText:
          'Al onze opnames worden standaard onbewerkt opgeleverd. Er kunnen dus ademhalingen, smakjes en andere oneffenheden te horen zijn. Kies Audio Cleanup wanneer je een volledig opgeschoond en geprocessed bestand wilt ontvangen dat kant en klaar te gebruiken is.',
      },
      {
        item: 'Editing',
        price: 50,
        infoText:
          'Onder deze categorie vallen producties zoals bedrijfsfilms, documentaires, audiotours, etc.',
      },
      {
        item: 'Mixage',
        price: 100,
        infoText:
          'Opname uitzendklaar door ons laten afmixen? Wij maken de perfecte radio- tv, of webmixage voor je zodat je productie goed klinkt en meteen gebruikt kan worden.',
        dependencies: ['Editing'],
      },
      {
        item: 'Sound Design',
        price: 100,
        infoText:
          'Heeft jouw productie een passend geluidsontwerp nodig? Wij voorzien de opnames in overleg met jou van passende geluidseffecten en leveren een kant en klaar eindproduct op.',
        dependencies: ['Editing', 'Mixage'],
      },
      {
        item: 'Klantregie',
        price: 75,
        infoText:
          'Live meeluisteren en regisseren tijdens de opnames? Dat kan met Klantregie. Via een eenvoudige weblink kun je meeluisteren en feedback geven alsof je in de studio zit',
      },
      {
        item: 'Copywriting',
        price: 125,
        infoText:
          'Je scripts nog beter laten klinken? Kies Copywriting wanneer je jouw basistekst door ons wilt laten redigeren tot goed in te spreken copy die overbrengt wat de bedoeling is.',
      },
      {
        item: 'Inspreken op beeld',
        price: 75,
        infoText:
          'Wil je dat jouw script op beeld wordt ingesproken? Stuur ons je video en we dubben de voice-over onder het beeld, zodat je qua timing altijd goed zit!',
      },
    ],
  },
];

// Pricing formula for word-based productions
const calculateWordPrice = (words: number, productionType: string): number => {
  // Base rates per word for each production type
  const rates = {
    'Videoproductie': {
      base: 0,
      tiers: [
        { max: 250, rate: 0 },
        { max: 500, rate: 0.20 },
        { max: 1000, rate: 0.30 },
        { max: 1500, rate: 0.45 },
        { max: Infinity, rate: 0.23 } // Progressive discount for 1500+
      ]
    },
    'E-learning': {
      base: 0,
      tiers: [
        { max: 500, rate: 0 },
        { max: 1000, rate: 0.20 },
        { max: 1500, rate: 0.35 },
        { max: 2000, rate: 0.50 },
        { max: Infinity, rate: 0.20 } // Progressive discount for 2000+
      ]
    },
    'Voice Response': {
      base: 0,
      tiers: [
        { max: 500, rate: 0 },
        { max: 1000, rate: 0.20 },
        { max: 1500, rate: 0.35 },
        { max: 2000, rate: 0.50 },
        { max: Infinity, rate: 0.20 } // Progressive discount for 2000+
      ]
    }
  };

  const productionRates = rates[productionType as keyof typeof rates];
  if (!productionRates) return 0;

  let totalPrice = 0;
  let remainingWords = words;
  let previousMax = 0;

  for (const tier of productionRates.tiers) {
    if (remainingWords <= 0) break;
    
    const wordsInThisTier = Math.min(remainingWords, tier.max - previousMax);
    totalPrice += wordsInThisTier * tier.rate;
    remainingWords -= wordsInThisTier;
    previousMax = tier.max;
  }

  return Math.round(totalPrice);
};

export function UnifiedPriceCalculator() {
  const [selectedProduction, setSelectedProduction] = useState(productionData[0].name);
  const [selectedWords, setSelectedWords] = useState(productionData[0].itemlistTwo[0].item);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [selectedRegion, setSelectedRegion] = useState<string>('regionaal');
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [hoveredProduction, setHoveredProduction] = useState<string | null>(null);
  const [expandedProduction, setExpandedProduction] = useState<string | null>(null);
  const [customWordCount, setCustomWordCount] = useState<string>('');
  const [showPricingDrawer, setShowPricingDrawer] = useState(false);
  const { selectedVoiceover, clearSelection } = useVoiceover();

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (showPricingDrawer) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [showPricingDrawer]);

  const currentProduction = useMemo(
    () => productionData.find((prod) => prod.name === selectedProduction) || productionData[0],
    [selectedProduction]
  );

  const calculateTotal = useMemo(() => {
    let total = currentProduction.price;

    // Check if this is a word-based production type
    const wordBasedTypes = ['Videoproductie', 'E-learning', 'Voice Response'];
    const isWordBased = wordBasedTypes.includes(currentProduction.name);

    // Add word/version price
    if (isWordBased && selectedWords === '1500+' && customWordCount) {
      // Use custom word count calculation
      const words = parseInt(customWordCount);
      if (!isNaN(words) && words > 0) {
        // Always calculate price, even if below 1500
        total += calculateWordPrice(Math.max(words, 1501), currentProduction.name);
      } else {
        // Fall back to default 1500+ price if invalid
        const wordItem = currentProduction.itemlistTwo.find((item) => item.item === selectedWords);
        if (wordItem) total += wordItem.price;
      }
    } else if (isWordBased && selectedWords === '2000+' && customWordCount) {
      // For E-learning and Voice Response
      const words = parseInt(customWordCount);
      if (!isNaN(words) && words > 0) {
        // Always calculate price, even if below 2000
        total += calculateWordPrice(Math.max(words, 2001), currentProduction.name);
      } else {
        const wordItem = currentProduction.itemlistTwo.find((item) => item.item === selectedWords);
        if (wordItem) total += wordItem.price;
      }
    } else {
      // Use standard pricing
      const wordItem = currentProduction.itemlistTwo.find((item) => item.item === selectedWords);
      if (wordItem) total += wordItem.price;
    }

    // Add selected options
    selectedOptions.forEach((option) => {
      const optionItem = currentProduction.itemlistThree.find((item) => item.item === option);
      if (optionItem) total += optionItem.price;
    });

    // Add region price
    if (currentProduction.uitzendgebied) {
      const regionItem = currentProduction.uitzendgebied.find(
        (item) => item.name === selectedRegion
      );
      if (regionItem) total += regionItem.price;
    }

    return total;
  }, [currentProduction, selectedWords, selectedOptions, selectedRegion, customWordCount]);

  const toggleOption = (option: string) => {
    const optionData = currentProduction.itemlistThree.find((item) => item.item === option);

    if (!optionData) return;

    const newOptions = new Set(selectedOptions);

    if (newOptions.has(option)) {
      newOptions.delete(option);
      // Remove dependent options
      currentProduction.itemlistThree.forEach((item) => {
        if (item.dependencies?.includes(option)) {
          newOptions.delete(item.item);
        }
      });
    } else {
      // Check dependencies
      if (optionData.dependencies) {
        const missingDeps = optionData.dependencies.filter((dep) => !newOptions.has(dep));
        if (missingDeps.length > 0) {
          // Auto-add dependencies
          missingDeps.forEach((dep) => newOptions.add(dep));
        }
      }
      newOptions.add(option);
    }

    setSelectedOptions(newOptions);
  };

  const handleBooking = () => {
    if (!selectedVoiceover) {
      scrollToVoiceovers();
    } else {
      // Handle actual booking logic here
      console.log('Booking with:', { selectedVoiceover, selectedProduction, calculateTotal });
    }
  };

  return (
    <section
      id="price-calculator"
      className={`py-24 bg-background ${plusJakarta.variable} ${instrumentSerif.variable} font-plus-jakarta relative overflow-hidden`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18f10905_1px,transparent_1px),linear-gradient(to_bottom,#18f10905_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
      </div>

      {/* Main Container with unified background */}
      <div className="bg-brand-bg dark:bg-brand-bg-dark rounded-3xl mx-4 sm:mx-6 lg:mx-8 max-w-7xl lg:mx-auto overflow-hidden relative">

        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pt-16 pb-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center bg-card text-muted-foreground px-4 py-1.5 rounded-md text-sm font-medium transition-all border border-primary shadow-[3px_3px_0px_0px_rgb(24,241,9)] mb-8"
            >
              Prijzen
            </motion.div>

            <h2 className="font-instrument-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-title mb-6">
              Weet wat je <span className="text-primary italic">betaalt</span>
            </h2>
            <p className="text-lg sm:text-xl text-foreground max-w-3xl mx-auto leading-relaxed">
              Bereken de prijs voor jouw project. Geen verborgen kosten, geen
              verrassingen.
            </p>
          </motion.div>

          {/* Divider line */}
          <div className="w-full h-px bg-border mb-16" />

          {/* Calculator Content */}
          <div className="pb-20">
            {/* Configuration Grid - 2 columns: left for options, right for total */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Left side: All selection options in one card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 space-y-4"
              >
                {/* Compact Combined Section */}
                <div className="bg-white dark:bg-card rounded-none sm:rounded-lg overflow-hidden">
                  {/* Production Type Section */}
                  <div className="border-b border-gray-200 dark:border-gray-800">
                    <div className="px-4 py-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-title">1. Productiesoort</h3>
                    </div>
                    <div className="px-4 pb-4">
                      <div className="flex flex-wrap gap-2">
                        {productionData.map((production) => {
                          const Icon = productionIcons[production.name] || Calculator;
                          const isSelected = selectedProduction === production.name;
                          return (
                            <motion.button
                              key={production.name}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedProduction(production.name);
                                setSelectedWords(production.itemlistTwo[0].item);
                                setSelectedOptions(new Set());
                                setCustomWordCount('');
                              }}
                              className={`
                                flex items-center gap-2 px-3 py-2 rounded-full border transition-all cursor-pointer
                                ${isSelected 
                                  ? 'border-primary bg-primary text-primary-foreground' 
                                  : 'border-border bg-card text-foreground hover:border-muted-foreground hover:bg-accent'
                                }
                              `}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="text-sm font-medium">{production.name}</span>
                              <span className="text-xs opacity-70">€{production.price}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                      {/* Compact description */}
                      <AnimatePresence mode="wait">
                        {selectedProduction && (
                          <motion.div
                            key={selectedProduction}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 overflow-hidden"
                          >
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {productionData.find(p => p.name === selectedProduction)?.description}
                            </p>
                            
                            {/* Region Selection if applicable */}
                            {currentProduction.uitzendgebied && (
                              <div className="mt-3">
                                <p className="text-xs font-semibold uppercase tracking-wider text-title mb-2">Uitzendgebied</p>
                                <div className="flex flex-wrap gap-2">
                                  {currentProduction.uitzendgebied.map((region) => {
                                    const isSelected = selectedRegion === region.name;
                                    return (
                                      <button
                                        key={region.name}
                                        onClick={() => setSelectedRegion(region.name)}
                                        className={`
                                          px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer
                                          ${isSelected 
                                            ? 'border-primary bg-primary text-primary-foreground' 
                                            : 'border-border bg-card text-foreground hover:border-muted-foreground hover:bg-accent'
                                          }
                                        `}
                                      >
                                        <span className="font-medium capitalize">{region.name}</span>
                                        {region.price > 0 && (
                                          <span className="ml-1 opacity-70">+€{region.price}</span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Word Count Section */}
                  <div className="border-b border-gray-200 dark:border-gray-800">
                    <div className="px-4 py-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-title">2. {currentProduction.titleTwo}</h3>
                      {currentProduction.explainText && (
                        <p className="text-xs text-muted-foreground mt-1">{currentProduction.explainText}</p>
                      )}
                    </div>
                    <div className="px-4 pb-4">
                      <div className="flex flex-wrap gap-2">
                        {currentProduction.itemlistTwo.map((item, index) => {
                          const isSelected = selectedWords === item.item;
                          const isLastOption = index === currentProduction.itemlistTwo.length - 1;
                          const isWordBased = ['Videoproductie', 'E-learning', 'Voice Response'].includes(currentProduction.name);
                          const showCustomInput = isWordBased && isLastOption && isSelected;
                          
                          return (
                            <React.Fragment key={item.item}>
                              <button
                                onClick={() => {
                                  setSelectedWords(item.item);
                                  if (!isLastOption) setCustomWordCount('');
                                }}
                                className={`
                                  px-4 py-2 rounded-full border transition-all cursor-pointer
                                  ${isSelected 
                                    ? 'border-primary bg-primary text-primary-foreground' 
                                    : 'border-border bg-card text-foreground hover:border-muted-foreground hover:bg-accent'
                                  }
                                `}
                              >
                                <span className="text-sm font-medium">{item.item}</span>
                                {item.price > 0 && (
                                  <span className="text-xs ml-1 opacity-70">+€{item.price}</span>
                                )}
                              </button>
                              
                              {/* Custom word count input inline */}
                              {showCustomInput && (
                                <div className="w-full mt-2">
                                  <div className="flex gap-2 items-center">
                                    <input
                                      type="number"
                                      min={isLastOption && item.item === '1500+' ? 1501 : 2001}
                                      value={customWordCount}
                                      onChange={(e) => setCustomWordCount(e.target.value)}
                                      placeholder={`${isLastOption && item.item === '1500+' ? '1501' : '2001'}+`}
                                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-input text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    {customWordCount && parseInt(customWordCount) > 0 && (
                                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                                        = €{calculateWordPrice(
                                          Math.max(parseInt(customWordCount), item.item === '1500+' ? 1501 : 2001), 
                                          currentProduction.name
                                        )}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Extra Options Section */}
                  <div className="border-b border-gray-200 dark:border-gray-800">
                    <div className="px-4 py-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-title">3. Extra Opties</h3>
                    </div>
                    <div className="px-4 pb-4">
                      <div className="space-y-2">
                        {currentProduction.itemlistThree.map((option) => {
                          const isSelected = selectedOptions.has(option.item);
                          const isDisabled = option.dependencies?.some(dep => !selectedOptions.has(dep));
                          
                          return (
                            <motion.label
                              key={option.item}
                              whileTap={{ scale: 0.99 }}
                              className={`
                                relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border
                                ${isSelected 
                                  ? 'bg-accent border-primary' 
                                  : 'bg-card border-border hover:bg-accent hover:border-muted-foreground'
                                }
                                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                              `}
                              onMouseEnter={() => setHoveredOption(option.item)}
                              onMouseLeave={() => setHoveredOption(null)}
                            >
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                                isSelected 
                                  ? 'bg-primary border-primary' 
                                  : 'border-border'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-title">
                                    {option.item}
                                  </span>
                                  <span className="text-sm font-semibold text-muted-foreground">
                                    +€{option.price}
                                  </span>
                                </div>
                                {/* Show info on hover */}
                                <AnimatePresence>
                                  {hoveredOption === option.item && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {option.infoText}
                                      </p>
                                      {option.dependencies && (
                                        <p className="text-xs text-destructive mt-1">
                                          Vereist: {option.dependencies.join(', ')}
                                        </p>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => !isDisabled && toggleOption(option.item)}
                                disabled={isDisabled}
                                className="sr-only"
                              />
                            </motion.label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>

              {/* Right side: Total Price */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-full md:w-[380px] flex-shrink-0"
              >
                <div className="bg-card rounded-none sm:rounded-lg overflow-hidden border border-border shadow-sm sticky top-24">
                  <div className="px-6 py-4 border-b border-border">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-title">Overzicht bestelling</h3>
                  </div>

                  <div className="p-6">
                    {/* Selected Voiceover */}
                    {selectedVoiceover ? (
                      <div className="pb-4 mb-4 border-b border-border">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Voice-over</p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0 relative">
                            {selectedVoiceover.profilePhoto ? (
                              <Image
                                src={selectedVoiceover.profilePhoto}
                                alt={selectedVoiceover.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-title">{selectedVoiceover.name}</p>
                            <button
                              onClick={() => {
                                clearSelection();
                                scrollToVoiceovers();
                              }}
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              Wijzig
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-accent rounded-lg p-4 mb-4">
                        <p className="text-sm text-title font-medium mb-1">Selecteer een voice-over</p>
                        <button
                          onClick={scrollToVoiceovers}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Bekijk stemmen →
                        </button>
                      </div>
                    )}

                    {/* Summary */}
                    <div className="space-y-2 pb-4 mb-4 border-b border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{selectedProduction}</span>
                        <span className="text-gray-900 dark:text-white">€{currentProduction.price}</span>
                      </div>

                      {selectedWords &&
                        (currentProduction.itemlistTwo.find((item) => item.item === selectedWords)
                          ?.price ?? 0) > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">{selectedWords} woorden</span>
                            <span className="text-gray-900 dark:text-white">
                              +€
                              {
                                currentProduction.itemlistTwo.find(
                                  (item) => item.item === selectedWords
                                )?.price
                              }
                            </span>
                          </div>
                        )}

                      {currentProduction.uitzendgebied && selectedRegion !== 'regionaal' && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400 capitalize">{selectedRegion}</span>
                          <span className="text-gray-900 dark:text-white">
                            +€
                            {
                              currentProduction.uitzendgebied.find((r) => r.name === selectedRegion)
                                ?.price
                            }
                          </span>
                        </div>
                      )}

                      {Array.from(selectedOptions).map((option) => {
                        const optionData = currentProduction.itemlistThree.find(
                          (item) => item.item === option
                        );
                        return (
                          <div key={option} className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">{option}</span>
                            <span className="text-gray-900 dark:text-white">+€{optionData?.price}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Total */}
                    <div className="pb-4 mb-4 border-b border-border">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-medium text-title">Totaal</span>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">€{calculateTotal}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Excl. BTW</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBooking}
                      className="w-full bg-black dark:bg-white text-white dark:text-black font-medium py-3 px-6 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
                    >
                      Nu boeken
                    </motion.button>

                    {/* Trust indicators */}
                    <div className="flex items-center justify-center gap-6 mt-4 pt-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <Check className="w-3.5 h-3.5" />
                        <span>Snelle levering</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Veilig betalen</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 text-center"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Heb je vragen over de prijzen?{' '}
                    <Link href="/contact" className="text-gray-900 dark:text-white font-medium hover:underline">
                      Neem contact op
                    </Link>{' '}
                    voor een persoonlijke offerte.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Calculation Modal */}
      <AnimatePresence>
        {showPricingDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPricingDrawer(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold mb-4">Prijsberekening</h3>
              <p className="text-sm text-muted-foreground">Hier komt de uitleg over prijsberekening.</p>
              <button
                onClick={() => setShowPricingDrawer(false)}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
              >
                Sluiten
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
