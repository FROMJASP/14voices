'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';
import Link from 'next/link';
import { Check, Info, Plus } from 'lucide-react';
import { useVoiceover } from '@/contexts/VoiceoverContext';
import { useCart } from '@/contexts/CartContext';

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

// Production emojis
const productionEmojis: Record<string, string> = {
  Videoproductie: '🎬',
  'E-learning': '📚',
  Radiospots: '📻',
  'TV Commercial': '📺',
  'Web Commercial': '🌐',
  'Voice Response': '📞',
};

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
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  // const [showProductionAlert, setShowProductionAlert] = useState(false);
  // const [alertMessage, setAlertMessage] = useState('');

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

  const toggleOption = (option: string) => {
    if (!currentProduction) return;

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

          {/* Production Selection Alert - temporarily disabled */}
          {/* <AnimatePresence>
            {showProductionAlert && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4"
              >
                <div className="bg-yellow-500 text-black px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 border-2 border-yellow-600">
                  <Info className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-semibold">{alertMessage}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence> */}

          {/* Calculator Content */}
          <div className="space-y-12">
            {/* Step 1: Production Type Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
                <span className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black font-bold">
                  1
                </span>
                Kies je productie
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 items-stretch">
                {productionData.map((type, index) => {
                  return (
                    <motion.div
                      key={type.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
                      onClick={() => {
                        setSelectedProduction(index);
                        setSelectedWords(null); // Don't auto-select
                        setSelectedOptions(new Set());
                        setCustomWordCount('');
                        setSelectedRegion(null);
                      }}
                      className="relative group cursor-pointer"
                    >
                      {/* Mobile: Fixed height card */}
                      <div className="sm:hidden">
                        <motion.div
                          className={`relative rounded-2xl transition-all duration-300 h-28 flex ${
                            selectedProduction === index
                              ? 'bg-gradient-to-r from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 border-2 border-primary shadow-lg shadow-primary/20'
                              : 'bg-[#fcf9f5] dark:bg-card border border-border'
                          }`}
                        >
                          <div className="flex items-center gap-3 p-4 w-full">
                            {/* Left: Icon */}
                            <div
                              className={`text-4xl flex-shrink-0 transition-transform duration-300 ${
                                selectedProduction === index ? 'scale-110' : ''
                              }`}
                            >
                              {productionEmojis[type.name]}
                            </div>

                            {/* Center: Content */}
                            <div className="flex-1 min-w-0 h-full flex flex-col justify-center">
                              <h3 className="text-base font-semibold text-foreground">
                                {type.name}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 leading-snug mt-1">
                                {type.description}
                              </p>
                            </div>

                            {/* Right: Price */}
                            <div className="flex-shrink-0 text-right">
                              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                vanaf
                              </p>
                              <div className="flex items-baseline gap-0.5">
                                <span className="text-xl font-bold text-foreground">
                                  €{type.price}
                                </span>
                                <span className="text-xs text-muted-foreground">,-</span>
                              </div>
                            </div>

                            {/* Selection indicator */}
                            {selectedProduction === index && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                              >
                                <Check className="w-4 h-4 text-black" />
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      </div>

                      {/* Tablet/Desktop: Fixed height card design */}
                      <div className="hidden sm:block h-full">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative h-full p-6 rounded-3xl transition-all duration-300 flex flex-col ${
                            selectedProduction === index
                              ? 'bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 border-2 border-primary shadow-lg shadow-primary/20'
                              : 'bg-[#fcf9f5] dark:bg-card border border-border hover:border-primary/50 hover:shadow-md hover:bg-gradient-to-br hover:from-[#fcf9f5] hover:to-primary/5 dark:hover:from-card dark:hover:to-primary/10'
                          }`}
                          style={{ minHeight: '320px' }}
                        >
                          {/* Selection indicator */}
                          <AnimatePresence>
                            {selectedProduction === index && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center z-10"
                              >
                                <Check className="w-5 h-5 text-black" />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Icon and Title */}
                          <div className="flex-shrink-0">
                            <div
                              className={`text-5xl mb-3 transition-transform duration-300 ${
                                selectedProduction === index ? 'scale-110' : 'group-hover:scale-110'
                              }`}
                            >
                              {productionEmojis[type.name]}
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-3">
                              {type.name}
                            </h3>
                          </div>

                          {/* Description area with fixed height */}
                          <div className="flex-1 min-h-0 mb-4">
                            <div className="h-full overflow-y-auto custom-scrollbar">
                              <p className="text-sm text-muted-foreground leading-relaxed pr-2">
                                {type.description}
                              </p>
                            </div>
                          </div>

                          {/* Price - always at bottom */}
                          <div className="flex-shrink-0 pt-3 border-t border-border/50">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                              vanaf
                            </p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-bold text-foreground">
                                €{type.price}
                              </span>
                              <span className="text-sm text-muted-foreground">,- </span>
                            </div>
                          </div>

                          {/* Hover effect line */}
                          <motion.div
                            className="absolute bottom-0 left-6 right-6 h-0.5 bg-primary"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: selectedProduction === index ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Step 2: Word Count Selection */}
            {currentProduction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
                  <span className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black font-bold">
                    2
                  </span>
                  {currentProduction.titleTwo}
                </h3>

                <div className="bg-[#fcf9f5] dark:bg-card rounded-2xl p-6 border border-border shadow-sm">
                  <p className="text-sm text-muted-foreground mb-4">
                    {currentProduction.name === 'Radiospots' ||
                    currentProduction.name === 'TV Commercial' ||
                    currentProduction.name === 'Web Commercial'
                      ? 'Selecteer het aantal versies voor je productie'
                      : 'Selecteer het aantal woorden in je script'}
                  </p>
                  <div className="space-y-3">
                    {currentProduction.itemlistTwo.map((item, index) => {
                      const isSelected = selectedWords === item.item;
                      const isLastOption = index === currentProduction.itemlistTwo.length - 1;
                      const showCustomInput = isSelected && isLastOption;

                      return (
                        <motion.div key={item.item} whileHover={{ x: 5 }} className="relative">
                          <button
                            onClick={() => {
                              setSelectedWords(item.item);
                              if (!isLastOption) setCustomWordCount('');
                            }}
                            className={`
                          w-full p-4 rounded-xl border-2 transition-all flex justify-between items-center
                          ${
                            isSelected
                              ? 'border-primary bg-primary/10 dark:bg-primary/20'
                              : 'border-border bg-white dark:bg-background hover:border-muted-foreground hover:bg-gray-50 dark:hover:bg-muted/50'
                          }
                        `}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isSelected ? 'bg-primary border-primary' : 'border-border'
                                }`}
                              >
                                {isSelected && (
                                  <Check className="w-4 h-4 text-primary-foreground" />
                                )}
                              </div>
                              <span className="font-medium">
                                {item.item}{' '}
                                {currentProduction.name === 'Radiospots' ||
                                currentProduction.name === 'TV Commercial' ||
                                currentProduction.name === 'Web Commercial'
                                  ? item.item === '1'
                                    ? 'versie'
                                    : 'versies'
                                  : 'woorden'}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-muted-foreground">
                              +€{item.price}
                            </span>
                          </button>

                          {/* Custom word count input */}
                          <AnimatePresence>
                            {showCustomInput && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 pl-9"
                              >
                                <div className="flex gap-3 items-center">
                                  <input
                                    type="number"
                                    min={item.item === '1500+' ? 1501 : 2001}
                                    value={customWordCount}
                                    onChange={(e) => setCustomWordCount(e.target.value)}
                                    placeholder={`Vul het exacte aantal in (min. ${item.item === '1500+' ? '1501' : '2001'})`}
                                    className="flex-1 px-4 py-2 rounded-lg border border-border bg-input text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                  />
                                  {customWordCount && parseInt(customWordCount) > 0 && (
                                    <span className="text-sm font-semibold text-primary whitespace-nowrap">
                                      +€
                                      {calculateWordPrice(
                                        Math.max(
                                          parseInt(customWordCount),
                                          item.item === '1500+' ? 1501 : 2001
                                        ),
                                        currentProduction.name
                                      )}
                                    </span>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>

                  {currentProduction.explainText && (
                    <p className="text-xs text-muted-foreground mt-4 italic">
                      {currentProduction.explainText}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2.5: Region Selection (if applicable) */}
            {currentProduction?.uitzendgebied && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <h3 className="text-xl font-semibold mb-4">Uitzendgebied</h3>
                <div className="flex flex-wrap gap-3">
                  {currentProduction.uitzendgebied.map((region) => (
                    <button
                      key={region.name}
                      onClick={() => setSelectedRegion(region.name)}
                      className={`
                      px-6 py-3 rounded-full border-2 transition-all capitalize
                      ${
                        selectedRegion === region.name
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-[#fcf9f5] dark:bg-card text-foreground hover:border-muted-foreground hover:bg-gray-50 dark:hover:bg-card/80'
                      }
                    `}
                    >
                      {region.name}
                      {region.price > 0 && (
                        <span className="ml-2 text-sm opacity-70">+€{region.price}</span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Extra Options */}
            {currentProduction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
                  <span className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black font-bold">
                    3
                  </span>
                  Extra opties
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentProduction.itemlistThree.map((option) => {
                    const isSelected = selectedOptions.has(option.item);
                    const isDisabled = option.dependencies?.some(
                      (dep) => !selectedOptions.has(dep)
                    );

                    return (
                      <motion.div
                        key={option.item}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={() => !isDisabled && toggleOption(option.item)}
                          disabled={isDisabled}
                          onMouseEnter={() => setHoveredOption(option.item)}
                          onMouseLeave={() => setHoveredOption(null)}
                          className={`
                        w-full p-6 rounded-2xl border-2 transition-all flex items-center justify-between
                        ${
                          isSelected
                            ? 'border-primary bg-primary/10 dark:bg-primary/20'
                            : 'border-border bg-[#fcf9f5] dark:bg-card hover:border-muted-foreground hover:bg-[#f5f0e8] dark:hover:bg-card/80'
                        }
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                        >
                          <div className="text-left flex-1">
                            <h4 className="font-semibold mb-1 flex items-center gap-2">
                              {option.item}
                              {hoveredOption === option.item && (
                                <Info className="w-4 h-4 text-muted-foreground" />
                              )}
                            </h4>
                            <AnimatePresence>
                              {hoveredOption === option.item && (
                                <motion.p
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="text-sm text-muted-foreground mt-2"
                                >
                                  {option.infoText}
                                  {option.dependencies && (
                                    <span className="block text-xs text-destructive mt-1">
                                      Vereist: {option.dependencies.join(', ')}
                                    </span>
                                  )}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <span className="text-lg font-semibold">+€{option.price}</span>
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                              }`}
                            >
                              {isSelected ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <Plus className="w-5 h-5" />
                              )}
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
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
