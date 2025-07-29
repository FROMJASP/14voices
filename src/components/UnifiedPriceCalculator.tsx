'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';
import Link from 'next/link';
import { useVoiceover } from '@/contexts/VoiceoverContext';
import { useCart } from '@/contexts/CartContext';
import { ProductionGrid } from './ProductionGrid';
import { ProductionDetail } from './ProductionDetail';

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

const productionData: ProductionType[] = [
  {
    name: 'Videoproductie',
    price: 175,
    description:
      "Videoproducties zijn video's voor intern gebruik of online plaatsing, zonder advertentiebudget. Bij inzet als betaalde advertentie kies je voor 'Web Commercial'.",
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
      "E-learning video's worden gebruikt voor training, onboarding of instructie, bedoeld voor intern of educatief gebruik — niet als promotie of advertentie.",
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
    name: 'Radiospots',
    price: 150,
    description:
      'Radiospots worden uitgezonden via radio of streamingdiensten met als doel een product, dienst of merk te promoten.',
    titleOne: 'Productiesoort',
    titleTwo: 'Aantal versies',
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
    explainText:
      "Aantal versies inclusief eventuele tag-ons. Bijvoorbeeld: wanneer je één commercial plus één tag-on nodig hebt, vul hier dan 'twee' in.",
    uitzendgebied: [
      { name: 'regionaal', price: 0 },
      { name: 'nationaal', price: 250 },
    ],
  },
  {
    name: 'TV Commercial',
    price: 250,
    description:
      'TV Commercials zijn betaalde videospots voor televisie, bedoeld om een merk, product of dienst landelijk of regionaal te promoten.',
    titleOne: 'Productiesoort',
    titleTwo: 'Aantal versies',
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
    explainText:
      "Aantal versies inclusief eventuele tag-ons. Bijvoorbeeld: wanneer je één commercial plus één tag-on nodig hebt, vul hier dan 'twee' in.",
    uitzendgebied: [
      { name: 'regionaal', price: 0 },
      { name: 'nationaal', price: 300 },
    ],
  },
  {
    name: 'Web Commercial',
    price: 400,
    description:
      'Web Commercials zijn online videoadvertenties die worden verspreid via internet, sociale media of streamingdiensten, met inzet van advertentiebudget.',
    titleOne: 'Productiesoort',
    titleTwo: 'Aantal versies',
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
    explainText:
      "Aantal versies inclusief eventuele tag-ons. Bijvoorbeeld: wanneer je één commercial plus één tag-on nodig hebt, vul hier dan 'twee' in.",
    uitzendgebied: [
      { name: 'regionaal', price: 0 },
      { name: 'nationaal', price: 250 },
    ],
  },
  {
    name: 'Voice Response',
    price: 150,
    description: "Voice Response wordt gebruikt voor keuzemenu's (IVR), voicemails en wachtrijen.",
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

    const tierWords = Math.min(remainingWords, tier.max - previousMax);
    totalPrice += tierWords * tier.rate;
    remainingWords -= tierWords;
    previousMax = tier.max;

    if (tier.max === Infinity) break;
  }

  return Math.round(totalPrice);
};

export function UnifiedPriceCalculator() {
  const { selectedVoiceover } = useVoiceover();
  const {
    setCartItemCount,
    setCartItems,
    setCartTotal,
    setProductionName,
    setWordCount,
    setRegion,
    setExtras,
    setSelectedVoiceover,
  } = useCart();
  const [selectedProduction, setSelectedProduction] = useState<number | null>(null);
  const [selectedWords, setSelectedWords] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [customWordCount, setCustomWordCount] = useState('');

  const currentProduction = selectedProduction !== null ? productionData[selectedProduction] : null;

  const calculateTotal = useMemo(() => {
    if (!currentProduction) return 0;
    let total = currentProduction.price;

    // Add word price
    if (selectedWords) {
      const isLastOption =
        selectedWords ===
        currentProduction.itemlistTwo[currentProduction.itemlistTwo.length - 1].item;
      if (isLastOption && customWordCount && parseInt(customWordCount) > 0) {
        const minWords = selectedWords === '1500+' ? 1501 : 2001;
        const words = Math.max(parseInt(customWordCount), minWords);
        total += calculateWordPrice(words, currentProduction.name);
      } else {
        const wordItem = currentProduction.itemlistTwo.find((item) => item.item === selectedWords);
        if (wordItem) total += wordItem.price;
      }
    }

    // Add option prices
    selectedOptions.forEach((option) => {
      const optionItem = currentProduction.itemlistThree.find((item) => item.item === option);
      if (optionItem) total += optionItem.price;
    });

    // Add region price
    if (currentProduction.uitzendgebied && selectedRegion) {
      const regionItem = currentProduction.uitzendgebied.find(
        (item) => item.name === selectedRegion
      );
      if (regionItem) total += regionItem.price;
    }

    return total;
  }, [currentProduction, selectedWords, selectedOptions, selectedRegion, customWordCount]);

  // Prepare cart items for FloatingCart
  const cartItems = useMemo(() => {
    const items = [];

    if (currentProduction) {
      // Add production type
      items.push({
        id: 'production',
        name: currentProduction.name,
        price: currentProduction.price,
        details: [],
      });

      // Add word count price if applicable
      if (selectedWords) {
        const isLastOption =
          selectedWords ===
          currentProduction.itemlistTwo[currentProduction.itemlistTwo.length - 1].item;
        if (isLastOption && customWordCount && parseInt(customWordCount) > 0) {
          const minWords = selectedWords === '1500+' ? 1501 : 2001;
          const words = Math.max(parseInt(customWordCount), minWords);
          const wordPrice = calculateWordPrice(words, currentProduction.name);
          if (wordPrice > 0) {
            items.push({
              id: 'words',
              name: `Extra woorden (${words} woorden)`,
              price: wordPrice,
              details: [],
            });
          }
        } else {
          const wordItem = currentProduction.itemlistTwo.find(
            (item) => item.item === selectedWords
          );
          if (wordItem && wordItem.price > 0) {
            items.push({
              id: 'words',
              name: `${selectedWords} ${currentProduction.name === 'Radiospots' || currentProduction.name === 'TV Commercial' || currentProduction.name === 'Web Commercial' ? 'versies' : 'woorden'}`,
              price: wordItem.price,
              details: [],
            });
          }
        }
      }

      // Add region price if applicable
      if (currentProduction.uitzendgebied && selectedRegion) {
        const regionItem = currentProduction.uitzendgebied.find(
          (item) => item.name === selectedRegion
        );
        if (regionItem && regionItem.price > 0) {
          items.push({
            id: 'region',
            name: `Uitzendgebied: ${selectedRegion}`,
            price: regionItem.price,
            details: [],
          });
        }
      }
    }

    // Add extra options to items
    if (currentProduction) {
      selectedOptions.forEach((option) => {
        const optionItem = currentProduction.itemlistThree.find((item) => item.item === option);
        if (optionItem) {
          items.push({
            id: `option-${option}`,
            name: option,
            price: optionItem.price,
            details: [],
          });
        }
      });
    }

    return items;
  }, [currentProduction, selectedWords, selectedRegion, customWordCount, selectedOptions]);

  // Update cart context
  useEffect(() => {
    const itemCount =
      cartItems.length + (selectedVoiceover ? 1 : 0) + Array.from(selectedOptions).length;
    setCartItemCount(itemCount);
    setCartItems(cartItems);
    setCartTotal(calculateTotal);
    setProductionName(currentProduction?.name);
    setWordCount(
      selectedWords
        ? `${selectedWords} ${currentProduction?.name === 'Radiospots' || currentProduction?.name === 'TV Commercial' || currentProduction?.name === 'Web Commercial' ? 'versies' : 'woorden'}`
        : undefined
    );
    setRegion(selectedRegion || undefined);
    setExtras(Array.from(selectedOptions));
    setSelectedVoiceover(
      selectedVoiceover
        ? {
            name: selectedVoiceover.name,
            profilePhoto: selectedVoiceover.profilePhoto,
          }
        : undefined
    );
  }, [
    cartItems,
    selectedVoiceover,
    selectedOptions,
    setCartItemCount,
    setCartItems,
    setCartTotal,
    setProductionName,
    setWordCount,
    setRegion,
    setExtras,
    setSelectedVoiceover,
    calculateTotal,
    currentProduction,
    selectedWords,
    selectedRegion,
  ]);

  // Removed auto-open drawer - now using hover preview instead
  // Removed handleBooking function - validation logic moved elsewhere

  return (
    <>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #18f109;
          border-radius: 3px;
          opacity: 0.5;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          opacity: 0.8;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #18f109 transparent;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.03);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
      <section
        id="price-calculator"
        className={`py-24 bg-white dark:bg-background ${plusJakarta.variable} ${instrumentSerif.variable} font-plus-jakarta relative overflow-hidden`}
      >
        {/* Background decoration with floating color blobs - only in light mode */}
        <div className="absolute inset-0 pointer-events-none dark:hidden">
          {/* Floating color blobs inspired by style tag colors */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#18f109] rounded-full blur-[120px] opacity-[0.05]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#efd243] rounded-full blur-[120px] opacity-[0.05]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ebaa3a] rounded-full blur-[150px] opacity-[0.04]" />

          {/* Animated floating elements */}
          <div className="absolute top-20 right-20 w-32 h-32 opacity-[0.06]">
            <div className="w-full h-full bg-gradient-to-br from-[#18f109] to-[#efd243] rounded-full animate-float" />
          </div>
          <div className="absolute bottom-32 left-32 w-24 h-24 opacity-[0.06]">
            <div className="w-full h-full bg-gradient-to-br from-[#ebaa3a] to-[#18f109] rounded-full animate-float-delayed" />
          </div>
        </div>

        {/* Main Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center bg-[#fcf9f5] dark:bg-card text-muted-foreground px-4 py-1.5 rounded-md text-sm font-medium transition-all border border-primary shadow-[3px_3px_0px_0px_rgb(24,241,9)] mb-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#18f109]/10 to-[#efd243]/10 opacity-50" />
              <span className="relative">Prijzen</span>
            </motion.div>

            <h2 className="font-instrument-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-title mb-6">
              Weet wat je <span className="text-primary italic">betaalt</span>
            </h2>
            <p className="text-lg sm:text-xl text-foreground max-w-3xl mx-auto leading-relaxed">
              Bereken de prijs voor je productie en boek jouw stem.
            </p>
          </motion.div>

          {/* Calculator Content */}
          <div className="space-y-12">
            {/* Production Selection - Grid or Detail View */}
            {selectedProduction === null ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-muted-foreground">Kies je productie</h3>
                  <p className="text-sm text-muted-foreground">
                    Klik op een productie om te bestellen
                  </p>
                </div>
                <ProductionGrid />
              </motion.div>
            ) : (
              <ProductionDetail
                productionIndex={selectedProduction}
                onBack={() => {
                  setSelectedProduction(null);
                  setSelectedWords(null);
                  setSelectedOptions(new Set());
                  setSelectedRegion(null);
                  setCustomWordCount('');
                  setCartItems([]);
                  setCartItemCount(0);
                  setCartTotal(0);
                }}
                onAddToCart={(data) => {
                  setSelectedProduction(data.productionIndex);
                  setSelectedWords(data.selectedWords);
                  setSelectedOptions(data.selectedOptions);
                  setCustomWordCount(data.customWordCount);
                  setSelectedRegion(data.selectedRegion);

                  // Update cart
                  const production = productionData[data.productionIndex];
                  setProductionName(production.name);
                  setWordCount(data.selectedWords || '');
                  setRegion(data.selectedRegion || '');
                  setExtras(Array.from(data.selectedOptions));
                  setCartTotal(data.total);

                  // Update cart items
                  const items = [];
                  items.push({
                    id: 'production',
                    name: production.name,
                    price: production.price,
                    details: [],
                  });

                  if (data.selectedWords) {
                    const wordItem = production.itemlistTwo.find(
                      (item) => item.item === data.selectedWords
                    );
                    if (wordItem && wordItem.price > 0) {
                      items.push({
                        id: 'words',
                        name: `${production.titleTwo}: ${data.selectedWords}`,
                        price: wordItem.price,
                        details: [],
                      });
                    }
                  }

                  data.selectedOptions.forEach((option) => {
                    const optionItem = production.itemlistThree.find(
                      (item) => item.item === option
                    );
                    if (optionItem) {
                      items.push({
                        id: option,
                        name: option,
                        price: optionItem.price,
                        details: [],
                      });
                    }
                  });

                  if (data.selectedRegion && production.uitzendgebied) {
                    const regionItem = production.uitzendgebied.find(
                      (item) => item.name === data.selectedRegion
                    );
                    if (regionItem && regionItem.price > 0) {
                      items.push({
                        id: 'region',
                        name: `Uitzendgebied: ${data.selectedRegion}`,
                        price: regionItem.price,
                        details: [],
                      });
                    }
                  }

                  setCartItems(items);
                  setCartItemCount(items.length);

                  if (selectedVoiceover) {
                    setSelectedVoiceover(selectedVoiceover);
                  }

                  // Show success message
                  alert('Product toegevoegd aan winkelwagen! Kies nu een stem.');
                }}
              />
            )}
          </div>

          {/* Contact for custom quote */}
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              Heb je vragen over de prijzen?{' '}
              <Link href="/contact" className="text-primary font-medium hover:underline">
                Neem contact op
              </Link>{' '}
              voor een persoonlijke offerte.
            </p>
          </div>

          {/* Add extra spacing for mobile fixed bottom bar */}
          <div className="h-24 md:hidden" />
        </div>
      </section>

      {/* Cart Drawer removed - using hover preview in navbar instead */}
    </>
  );
}
