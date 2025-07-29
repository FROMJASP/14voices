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
    description:
      "Videoproducties zijn video's die intern worden gebruikt, bijvoorbeeld als bedrijfsfilm, of extern via de website of sociale media — zonder inzet van advertentiebudget. Wordt de video ingezet als betaalde advertentie, kies dan voor de categorie 'Web Commercial'.",
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
    description:
      "E-learning video's worden ingezet voor educatieve doeleinden, zoals interne trainingen, onboarding of instructie voor medewerkers of klanten. Deze video's zijn bedoeld voor gebruik binnen een leeromgeving of platform, zonder commerciële doeleinden. Wanneer de video primair wordt ingezet als promotie of werving, kies dan voor de categorie 'Web Commercial'.",
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
    description:
      'Radiospots zijn audioboodschappen die worden uitgezonden via radio of streamingdiensten met als doel een product, dienst of merk te promoten. Deze producties zijn specifiek bedoeld voor commerciële doeleinden en worden verspreid met inzet van mediabudget.',
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
    description:
      'TV Commercials zijn videoproducties die worden uitgezonden via televisie of videoplatforms met inzet van mediabudget. Ze zijn gericht op een breed publiek en bedoeld om merkbekendheid te vergroten of een product of dienst te promoten. Let op: vergeet niet te specificeren of de commercial regionaal of nationaal uitgezonden wordt.',
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
    description:
      "Web Commercials zijn online video's die worden ingezet als advertentie op platforms zoals YouTube, Instagram, Facebook of LinkedIn, met gebruik van advertentiebudget. Ze zijn gericht op het promoten van een product, dienst of merk bij een specifieke doelgroep.",
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
    description:
      "Voice Response betreft ingesproken teksten voor automatische telefoonsystemen, zoals keuzemenu's, welkomstboodschappen, voicemails of wachtrijen. Deze opnames zorgen voor een professionele en consistente telefonische klantbeleving.",
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
    Videoproductie: {
      base: 0,
      tiers: [
        { max: 250, rate: 0 },
        { max: 500, rate: 0.2 },
        { max: 1000, rate: 0.3 },
        { max: 1500, rate: 0.45 },
        { max: Infinity, rate: 0.23 }, // Progressive discount for 1500+
      ],
    },
    'E-learning': {
      base: 0,
      tiers: [
        { max: 500, rate: 0 },
        { max: 1000, rate: 0.2 },
        { max: 1500, rate: 0.35 },
        { max: 2000, rate: 0.5 },
        { max: Infinity, rate: 0.2 }, // Progressive discount for 2000+
      ],
    },
    'Voice Response': {
      base: 0,
      tiers: [
        { max: 500, rate: 0 },
        { max: 1000, rate: 0.2 },
        { max: 1500, rate: 0.35 },
        { max: 2000, rate: 0.5 },
        { max: Infinity, rate: 0.2 }, // Progressive discount for 2000+
      ],
    },
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

export function PriceCalculator() {
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
      className={`py-24 bg-white dark:bg-background ${plusJakarta.variable} ${instrumentSerif.variable} font-plus-jakarta relative overflow-hidden`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18f10905_1px,transparent_1px),linear-gradient(to_bottom,#18f10905_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 bg-[#18f109]/10 rounded-full filter blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-80 h-80 bg-[#efd243]/10 rounded-full filter blur-3xl"
          animate={{
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 5,
          }}
        />
      </div>

      {/* Floating SVG Illustrations */}
      <div className="hidden xl:block">
        {/* Left Side - Speech Bubble SVG */}
        <motion.div
          className="absolute left-16 top-32 z-0"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Image
            src="/undraw_speech_to_text.svg"
            alt="Speech illustration"
            width={256}
            height={256}
            className="w-64 h-64 opacity-80 dark:opacity-60"
          />
        </motion.div>

        {/* Right Side - Dark Podcast SVG */}
        <motion.div
          className="absolute right-16 bottom-32 z-0"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3,
          }}
        >
          <Image
            src="/undraw_podcast_dark.svg"
            alt="Podcast illustration"
            width={224}
            height={224}
            className="w-56 h-56 opacity-80 dark:opacity-60"
          />
        </motion.div>
      </div>

      {/* Main Container with unified background */}
      <div className="bg-[#fcf9f5] dark:bg-[#1a1a1a] rounded-3xl mx-4 sm:mx-6 lg:mx-8 overflow-hidden relative">
        {/* Decorative Elements for the entire container */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#18f10908_1px,transparent_1px),linear-gradient(to_bottom,#18f10908_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />

          {/* Gradient orbs */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#18f109]/15 rounded-full filter blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#efd243]/10 rounded-full filter blur-3xl" />
        </div>

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
              className="inline-flex items-center gap-2 bg-white/60 dark:bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 shadow-sm"
            >
              <Sparkles className="w-5 h-5 text-[#18f109]" />
              <span className="text-sm font-semibold text-[#18f109]">Transparante prijzen</span>
            </motion.div>

            <h2 className="font-instrument-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-title mb-6">
              Bereken je <span className="text-[#18f109] italic">investering</span>
            </h2>
            <p className="text-lg sm:text-xl text-normal max-w-3xl mx-auto leading-relaxed">
              Direct inzicht in de kosten voor jouw voice-over project. Geen verborgen kosten, geen
              verrassingen.
            </p>
          </motion.div>

          {/* Divider line */}
          <div className="w-full h-px bg-gray-200 dark:bg-gray-700/50 mb-16" />

          {/* Calculator Content */}
          <div className="pb-20">
            {/* Production Type Selection */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-semibold mb-8 text-center">Kies je productiesoort</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {productionData.map((production, index) => {
                  const Icon = productionIcons[production.name] || Calculator;
                  const isExpanded = expandedProduction === production.name;

                  return (
                    <motion.div
                      key={production.name}
                      className="relative group"
                      onMouseEnter={() => setHoveredProduction(production.name)}
                      onMouseLeave={() => setHoveredProduction(null)}
                    >
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          setSelectedProduction(production.name);
                          setSelectedWords(production.itemlistTwo[0].item);
                          setSelectedOptions(new Set());
                          setCustomWordCount('');
                        }}
                        className={`
                          p-6 rounded-2xl transition-all duration-300 text-center group relative overflow-hidden w-full
                          ${
                            selectedProduction === production.name
                              ? 'bg-[#18f109] text-black shadow-xl scale-105'
                              : 'bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-accent shadow-sm hover:shadow-md'
                          }
                        `}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="relative z-10">
                          <Icon
                            className={`w-8 h-8 mx-auto mb-3 transition-transform group-hover:scale-110 ${
                              selectedProduction === production.name
                                ? 'text-black'
                                : 'text-[#18f109]'
                            }`}
                          />
                          <p className="font-medium text-sm mb-2 flex items-center justify-center gap-1">
                            {production.name}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedProduction(isExpanded ? null : production.name);
                              }}
                              className="p-1 -m-1 rounded-full hover:bg-black/10 transition-colors"
                            >
                              <Info className="w-3 h-3 opacity-60" />
                            </button>
                          </p>
                          <p
                            className={`text-lg font-bold ${
                              selectedProduction === production.name ? 'text-black' : 'text-title'
                            }`}
                          >
                            €{production.price}
                          </p>
                        </div>
                        {selectedProduction === production.name && (
                          <motion.div
                            className="absolute inset-0 bg-black/5"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          />
                        )}
                      </motion.button>

                      {/* Desktop Tooltip (hover) */}
                      <AnimatePresence>
                        {hoveredProduction === production.name && !isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute left-0 right-0 top-full mt-2 p-4 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-2xl shadow-xl z-20 min-w-[240px] hidden lg:block"
                          >
                            <p className="leading-relaxed">{production.description}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Mobile/Tablet Expandable (tap) */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="absolute left-0 right-0 top-full mt-2 overflow-hidden lg:hidden z-20"
                          >
                            <div className="p-4 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-2xl shadow-xl">
                              <p className="leading-relaxed">{production.description}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Configuration Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Column 1: Word Count / Versions */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white dark:bg-card rounded-3xl p-8 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#18f109]/10 rounded-xl flex items-center justify-center">
                    <ChevronRight className="w-6 h-6 text-[#18f109]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-title">
                      {currentProduction.titleTwo}
                    </h3>
                    {currentProduction.explainText && (
                      <p className="text-sm text-normal mt-1">{currentProduction.explainText}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {currentProduction.itemlistTwo.map((item, index) => {
                    const isLastOption = index === currentProduction.itemlistTwo.length - 1;
                    const isWordBased = ['Videoproductie', 'E-learning', 'Voice Response'].includes(
                      currentProduction.name
                    );
                    const showCustomInput =
                      isWordBased && isLastOption && selectedWords === item.item;

                    return (
                      <div key={item.item} className="space-y-2">
                        <motion.label
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`
                            flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-200 group
                            ${
                              selectedWords === item.item
                                ? 'bg-[#18f109] text-black shadow-md'
                                : 'bg-gray-50 dark:bg-muted hover:bg-gray-100 dark:hover:bg-accent'
                            }
                          `}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <input
                            type="radio"
                            name="words"
                            value={item.item}
                            checked={selectedWords === item.item}
                            onChange={() => {
                              setSelectedWords(item.item);
                              if (!isLastOption) setCustomWordCount('');
                            }}
                            className="sr-only"
                          />
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">{item.item}</span>
                            <div className="flex items-center gap-2">
                              {item.price > 0 && !showCustomInput && (
                                <span className="font-semibold">+€{item.price}</span>
                              )}
                              {showCustomInput && customWordCount && (
                                <span className="font-semibold">
                                  +€
                                  {(() => {
                                    const words = parseInt(customWordCount) || 0;
                                    const minWords = item.item === '1500+' ? 1501 : 2001;
                                    return calculateWordPrice(
                                      Math.max(words, minWords),
                                      currentProduction.name
                                    );
                                  })()}
                                </span>
                              )}
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                  selectedWords === item.item
                                    ? 'border-black bg-black'
                                    : 'border-gray-400 group-hover:border-[#18f109]'
                                }`}
                              >
                                {selectedWords === item.item && (
                                  <Check className="w-3 h-3 text-[#18f109]" />
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.label>

                        {/* Custom word count input */}
                        <AnimatePresence>
                          {showCustomInput && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-2">
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                  Voer het exacte aantal woorden in:
                                </label>
                                <input
                                  type="number"
                                  min={isLastOption && item.item === '1500+' ? 1501 : 2001}
                                  value={customWordCount}
                                  onChange={(e) => setCustomWordCount(e.target.value)}
                                  placeholder={`Bijv. ${isLastOption && item.item === '1500+' ? '2000' : '2500'}`}
                                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#18f109] focus:border-transparent"
                                />
                                {customWordCount && parseInt(customWordCount) > 0 && (
                                  <div className="mt-2 space-y-2">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                      {(() => {
                                        const words = parseInt(customWordCount);
                                        const minWords = item.item === '1500+' ? 1501 : 2001;
                                        const actualWords = Math.max(words, minWords);
                                        const price = calculateWordPrice(
                                          actualWords,
                                          currentProduction.name
                                        );

                                        if (words < minWords) {
                                          // Find the appropriate tier for this word count
                                          const appropriateTier =
                                            currentProduction.itemlistTwo.find((tier) => {
                                              const [min, max] = tier.item
                                                .split(' - ')
                                                .map((s) => parseInt(s.replace('+', '')) || 0);
                                              return words >= min && (max === 0 || words <= max);
                                            });

                                          return (
                                            <div className="bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 p-3 rounded-lg">
                                              <p className="font-medium mb-1">Let op:</p>
                                              <p>
                                                Voor {words} woorden kun je beter de optie &quot;
                                                {appropriateTier?.item || '0 - 250'}&quot; selecteren.
                                              </p>
                                              <p className="mt-1">
                                                Deze optie heeft een minimum van {minWords} woorden
                                                (€{price}).
                                              </p>
                                            </div>
                                          );
                                        } else {
                                          return (
                                            <>
                                              <p>Prijs per woord: €{(price / words).toFixed(4)}</p>
                                              <p className="text-xs">
                                                Totaal voor {words} woorden: €{price}
                                              </p>
                                            </>
                                          );
                                        }
                                      })()}
                                    </div>

                                    {/* Pricing explanation button */}
                                    <button
                                      onClick={() => setShowPricingDrawer(true)}
                                      className="text-xs text-[#18f109] hover:text-[#14c208] transition-colors flex items-center gap-1"
                                    >
                                      <Info className="w-3 h-3" />
                                      Hoe berekenen we de prijs?
                                    </button>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Region Selection */}
                {currentProduction.uitzendgebied && (
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold mb-4 text-title">Uitzendgebied</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {currentProduction.uitzendgebied.map((region, index) => (
                        <motion.label
                          key={region.name}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className={`
                            flex items-center justify-center p-4 rounded-2xl cursor-pointer transition-all duration-200
                            ${
                              selectedRegion === region.name
                                ? 'bg-[#18f109] text-black shadow-md'
                                : 'bg-gray-50 dark:bg-muted hover:bg-gray-100 dark:hover:bg-accent'
                            }
                          `}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <input
                            type="radio"
                            name="region"
                            value={region.name}
                            checked={selectedRegion === region.name}
                            onChange={() => setSelectedRegion(region.name)}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <span className="font-medium capitalize block">{region.name}</span>
                            {region.price > 0 && (
                              <span className="text-sm font-semibold">+€{region.price}</span>
                            )}
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Column 2: Extra Options */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white dark:bg-card rounded-3xl p-8 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#efd243]/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#efd243]" />
                  </div>
                  <h3 className="text-xl font-semibold text-title">Extra Opties</h3>
                </div>

                <div className="space-y-3">
                  {currentProduction.itemlistThree.map((option, index) => {
                    const isSelected = selectedOptions.has(option.item);
                    const isDisabled = option.dependencies?.some(
                      (dep) => !selectedOptions.has(dep)
                    );

                    return (
                      <motion.div
                        key={option.item}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative group"
                      >
                        <label
                          className={`
                            flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-200
                            ${
                              isSelected
                                ? 'bg-[#18f109] text-black shadow-md'
                                : isDisabled
                                  ? 'bg-gray-50 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                                  : 'bg-gray-50 dark:bg-muted hover:bg-gray-100 dark:hover:bg-accent'
                            }
                          `}
                          onMouseEnter={() => setHoveredOption(option.item)}
                          onMouseLeave={() => setHoveredOption(null)}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => !isDisabled && toggleOption(option.item)}
                            disabled={isDisabled}
                            className="sr-only"
                          />
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <div
                                className={`
                                  w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                                  ${
                                    isSelected
                                      ? 'bg-black border-black'
                                      : 'border-gray-400 dark:border-gray-600 group-hover:border-[#18f109]'
                                  }
                                `}
                              >
                                {isSelected && <Check className="w-3 h-3 text-[#18f109]" />}
                              </div>
                              <span className="font-medium">{option.item}</span>
                              <Info className="w-4 h-4 opacity-60" />
                            </div>
                            <span className="font-semibold">+€{option.price}</span>
                          </div>
                        </label>

                        {/* Tooltip */}
                        <AnimatePresence>
                          {hoveredOption === option.item && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute left-0 right-0 top-full mt-2 p-4 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-2xl shadow-xl z-10"
                            >
                              <p>{option.infoText}</p>
                              {option.dependencies && (
                                <p className="mt-2 text-[#18f109] font-semibold">
                                  Vereist: {option.dependencies.join(', ')}
                                </p>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Column 3: Total Price */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:row-span-2"
              >
                <div className="bg-gradient-to-br from-[#18f109] to-[#14c208] rounded-3xl p-8 shadow-xl text-black sticky top-24">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center">
                      <Calculator className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold">Totaalprijs</h3>
                  </div>

                  {/* Selected Voiceover */}
                  {selectedVoiceover ? (
                    <div className="mb-6 pb-6 border-b border-black/10">
                      <p className="text-sm opacity-80 mb-3">Geselecteerde voice-over</p>
                      <div className="flex items-center gap-3 bg-black/10 rounded-2xl p-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-black/20 flex-shrink-0 relative">
                          {selectedVoiceover.profilePhoto ? (
                            <Image
                              src={selectedVoiceover.profilePhoto}
                              alt={selectedVoiceover.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-6 h-6 text-black/40" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{selectedVoiceover.name}</p>
                          <button
                            onClick={() => {
                              clearSelection();
                              scrollToVoiceovers();
                            }}
                            className="text-xs underline opacity-80 hover:opacity-100"
                          >
                            Wijzig selectie
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 pb-6 border-b border-black/10">
                      <div className="bg-black/10 rounded-2xl p-4">
                        <p className="text-sm font-medium mb-2">Selecteer eerst een voice-over</p>
                        <button
                          onClick={scrollToVoiceovers}
                          className="text-sm underline hover:no-underline font-semibold"
                        >
                          Bekijk beschikbare stemmen →
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="space-y-3 pb-6 border-b border-black/10">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{selectedProduction}</span>
                        <span className="font-bold">€{currentProduction.price}</span>
                      </div>

                      {selectedWords &&
                        (currentProduction.itemlistTwo.find((item) => item.item === selectedWords)
                          ?.price ?? 0) > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="opacity-80">{selectedWords}</span>
                            <span className="font-bold">
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
                          <span className="opacity-80 capitalize">{selectedRegion}</span>
                          <span className="font-bold">
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
                            <span className="opacity-80">{option}</span>
                            <span className="font-bold">+€{optionData?.price}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Total */}
                    <motion.div
                      key={calculateTotal}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="text-center py-6"
                    >
                      <p className="text-sm mb-2 opacity-80">Geschatte prijs</p>
                      <p className="text-6xl font-bold mb-1">€{calculateTotal}</p>
                      <p className="text-xs opacity-60">Excl. BTW</p>
                    </motion.div>

                    {/* CTA */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBooking}
                      className="w-full bg-black text-[#18f109] font-semibold py-4 px-6 rounded-2xl hover:bg-black/90 transition-all shadow-lg"
                    >
                      Direct boeken
                    </motion.button>

                    {/* Trust indicators */}
                    <div className="flex justify-center gap-4 pt-4">
                      <div className="flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span className="text-xs font-medium">48u levering</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs font-medium">100% garantie</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Additional information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 text-center pb-8"
            >
              <p className="text-sm text-normal">
                Heb je vragen over de prijzen?{' '}
                <Link href="/contact" className="text-[#18f109] font-semibold hover:underline">
                  Neem contact op
                </Link>{' '}
                voor een persoonlijke offerte.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Pricing Calculation Modal */}
      <AnimatePresence>
        {showPricingDrawer && (
          <div
            className="fixed inset-0 z-[100]"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPricingDrawer(false)}
              className="absolute inset-0 bg-black/50"
              style={{ position: 'absolute', inset: 0 }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900 flex flex-col"
              style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '672px',
                width: '90vw',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-xl font-semibold">Prijsberekening: {currentProduction.name}</h3>
                <button
                  onClick={() => setShowPricingDrawer(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {['Videoproductie', 'E-learning', 'Voice Response'].includes(
                  currentProduction.name
                ) ? (
                  <div className="space-y-6">
                    {/* Pricing table */}
                    <div>
                      <h4 className="font-medium mb-3">Prijzen per woordaantal</h4>
                      <div className="space-y-2">
                        {currentProduction.name === 'Videoproductie' && (
                          <>
                            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                              <span>0 - 250 woorden</span>
                              <span className="font-medium">Gratis</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                              <span>250 - 500 woorden</span>
                              <span className="font-medium">€0,20 per woord</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                              <span>500 - 1000 woorden</span>
                              <span className="font-medium">€0,30 per woord</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                              <span>1000 - 1500 woorden</span>
                              <span className="font-medium">€0,45 per woord</span>
                            </div>
                            <div className="flex justify-between py-2 text-[#18f109] font-semibold">
                              <span>1500+ woorden</span>
                              <span>€0,23 per woord ✨</span>
                            </div>
                          </>
                        )}
                        {(currentProduction.name === 'E-learning' ||
                          currentProduction.name === 'Voice Response') && (
                          <>
                            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                              <span>0 - 500 woorden</span>
                              <span className="font-medium">Gratis</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                              <span>500 - 1000 woorden</span>
                              <span className="font-medium">€0,20 per woord</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                              <span>1000 - 1500 woorden</span>
                              <span className="font-medium">€0,35 per woord</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                              <span>1500 - 2000 woorden</span>
                              <span className="font-medium">€0,50 per woord</span>
                            </div>
                            <div className="flex justify-between py-2 text-[#18f109] font-semibold">
                              <span>2000+ woorden</span>
                              <span>€0,20 per woord ✨</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Formula example */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <h4 className="font-medium mb-3">
                        {customWordCount && parseInt(customWordCount) > 0
                          ? `Berekening voor ${parseInt(customWordCount)} woorden:`
                          : 'Rekenvoorbeeld voor 2500 woorden:'}
                      </h4>
                      <div className="space-y-1 text-sm font-mono">
                        {(() => {
                          const wordCount =
                            customWordCount && parseInt(customWordCount) > 0
                              ? parseInt(customWordCount)
                              : 2500;

                          if (currentProduction.name === 'Videoproductie') {
                            const calculations = [];
                            let remaining = wordCount;
                            let total = 0;

                            // 0-250 free
                            if (remaining > 0) {
                              const words = Math.min(remaining, 250);
                              calculations.push(<div key="1">Eerste {words} woorden: €0</div>);
                              remaining -= words;
                            }

                            // 250-500 @ €0.20
                            if (remaining > 0) {
                              const words = Math.min(remaining, 250);
                              const cost = words * 0.2;
                              total += cost;
                              calculations.push(
                                <div key="2">
                                  {words} woorden × €0,20 = €{cost.toFixed(0)}
                                </div>
                              );
                              remaining -= words;
                            }

                            // 500-1000 @ €0.30
                            if (remaining > 0) {
                              const words = Math.min(remaining, 500);
                              const cost = words * 0.3;
                              total += cost;
                              calculations.push(
                                <div key="3">
                                  {words} woorden × €0,30 = €{cost.toFixed(0)}
                                </div>
                              );
                              remaining -= words;
                            }

                            // 1000-1500 @ €0.45
                            if (remaining > 0) {
                              const words = Math.min(remaining, 500);
                              const cost = words * 0.45;
                              total += cost;
                              calculations.push(
                                <div key="4">
                                  {words} woorden × €0,45 = €{cost.toFixed(0)}
                                </div>
                              );
                              remaining -= words;
                            }

                            // 1500+ @ €0.23
                            if (remaining > 0) {
                              const cost = remaining * 0.23;
                              total += cost;
                              calculations.push(
                                <div key="5" className="text-[#18f109]">
                                  {remaining} woorden × €0,23 = €{cost.toFixed(0)}
                                </div>
                              );
                            }

                            calculations.push(
                              <div
                                key="total"
                                className="pt-2 border-t border-gray-300 dark:border-gray-700 font-bold"
                              >
                                Totaal: €{total.toFixed(0)}
                              </div>
                            );

                            return calculations;
                          } else {
                            // E-learning / Voice Response
                            const calculations = [];
                            let remaining = wordCount;
                            let total = 0;

                            // 0-500 free
                            if (remaining > 0) {
                              const words = Math.min(remaining, 500);
                              calculations.push(<div key="1">Eerste {words} woorden: €0</div>);
                              remaining -= words;
                            }

                            // 500-1000 @ €0.20
                            if (remaining > 0) {
                              const words = Math.min(remaining, 500);
                              const cost = words * 0.2;
                              total += cost;
                              calculations.push(
                                <div key="2">
                                  {words} woorden × €0,20 = €{cost.toFixed(0)}
                                </div>
                              );
                              remaining -= words;
                            }

                            // 1000-1500 @ €0.35
                            if (remaining > 0) {
                              const words = Math.min(remaining, 500);
                              const cost = words * 0.35;
                              total += cost;
                              calculations.push(
                                <div key="3">
                                  {words} woorden × €0,35 = €{cost.toFixed(0)}
                                </div>
                              );
                              remaining -= words;
                            }

                            // 1500-2000 @ €0.50
                            if (remaining > 0) {
                              const words = Math.min(remaining, 500);
                              const cost = words * 0.5;
                              total += cost;
                              calculations.push(
                                <div key="4">
                                  {words} woorden × €0,50 = €{cost.toFixed(0)}
                                </div>
                              );
                              remaining -= words;
                            }

                            // 2000+ @ €0.20
                            if (remaining > 0) {
                              const cost = remaining * 0.2;
                              total += cost;
                              calculations.push(
                                <div key="5" className="text-[#18f109]">
                                  {remaining} woorden × €0,20 = €{cost.toFixed(0)}
                                </div>
                              );
                            }

                            calculations.push(
                              <div
                                key="total"
                                className="pt-2 border-t border-gray-300 dark:border-gray-700 font-bold"
                              >
                                Totaal: €{total.toFixed(0)}
                              </div>
                            );

                            return calculations;
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">
                    Deze productiesoort wordt berekend op basis van aantal versies.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
