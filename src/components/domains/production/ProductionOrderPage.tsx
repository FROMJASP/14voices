'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bricolage_Grotesque, Instrument_Serif } from 'next/font/google';
import { ChevronDown, Check, ShoppingCart, Users, Mic, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useVoiceoverStore, useCartStore, useCheckoutStore, useDrawerStore } from '@/stores';
import type { TransformedVoiceover } from '@/types/voiceover';

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
});

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

// Production data types
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
  videoUrl: string;
  color: string;
  accentColor: string;
  titleTwo: string;
  itemlistTwo: PriceItem[];
  titleThree: string;
  itemlistThree: ExtraOption[];
  uitzendgebied?: Array<{ name: string; price: number }>;
}

const productionData: ProductionType[] = [
  {
    name: 'Videoproductie',
    price: 175,
    description:
      "Videoproducties zijn video's voor intern gebruik of online plaatsing, zonder advertentiebudget. Bij inzet als betaalde advertentie kies je voor 'Web Commercial'.",
    videoUrl: '/videos/videoproductie.mp4',
    color: '#18f109',
    accentColor: '#14c007',
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
    videoUrl: '/videos/e-learning.mp4',
    color: '#4b9eff',
    accentColor: '#3a8de8',
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
      'Radiospots worden uitgezonden via radio of streamingdiensten met als doel een product, dienst of merk te promoten.',
    videoUrl: '/videos/radiospot.mp4',
    color: '#ff6b6b',
    accentColor: '#e85d5d',
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
    uitzendgebied: [
      { name: 'regionaal', price: 0 },
      { name: 'nationaal', price: 250 },
    ],
  },
  {
    name: 'TV Commercial',
    price: 250,
    description:
      'Betaalde videospots voor televisie, bedoeld om een merk, product of dienst landelijk of regionaal te promoten.',
    videoUrl: '/videos/tv-commercial.mp4',
    color: '#a78bfa',
    accentColor: '#9775f5',
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
    videoUrl: '/videos/web-commercial.mp4',
    color: '#f59e0b',
    accentColor: '#dc8a09',
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
    uitzendgebied: [
      { name: 'regionaal', price: 0 },
      { name: 'nationaal', price: 250 },
    ],
  },
  {
    name: 'Voice Response',
    price: 150,
    description: "Voice Response wordt gebruikt voor keuzemenu's (IVR), voicemails en wachtrijen.",
    videoUrl: '/videos/voice-response.mp4',
    color: '#10b981',
    accentColor: '#0ea571',
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

const productionSlugs = [
  'videoproductie',
  'e-learning',
  'radiospot', // Changed back to singular to match production data
  'tv-commercial',
  'web-commercial',
  'voice-response',
];

interface ProductionOrderPageProps {
  productionIndex: number;
  voiceovers: TransformedVoiceover[];
  hideCloseButton?: boolean;
}

export const ProductionOrderPage = React.memo(function ProductionOrderPage({
  productionIndex,
  voiceovers,
  hideCloseButton = false,
}: ProductionOrderPageProps) {
  console.log('ProductionOrderPage rendering:', {
    productionIndex,
    voiceoverCount: voiceovers.length,
    hideCloseButton,
  });

  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);
  const addItem = useCartStore((state) => state.addItem);
  const setProductionName = useCheckoutStore((state) => state.setProductionName);
  const setWordCount = useCheckoutStore((state) => state.setWordCount);
  const setRegion = useCheckoutStore((state) => state.setRegion);
  const setExtras = useCheckoutStore((state) => state.setExtras);
  const selectedVoiceover = useVoiceoverStore((state) => state.selectedVoiceover);
  const setSelectedVoiceover = useVoiceoverStore((state) => state.setSelectedVoiceover);
  const openDrawer = useDrawerStore((state) => state.openDrawer);

  const [selectedWords, setSelectedWords] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [wordsDropdownOpen, setWordsDropdownOpen] = useState(false);
  const [voiceDropdownOpen, setVoiceDropdownOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const production = useMemo(() => productionData[productionIndex], [productionIndex]);

  // Extract font classes to variable as per project guidelines
  const fontClasses = `${bricolageGrotesque.variable} ${instrumentSerif.variable} bg-background`;

  useEffect(() => {
    if (videoRef.current && production) {
      videoRef.current.play().catch(() => {});
    }
  }, [productionIndex, production]);

  // Calculate total price
  const calculateTotal = useCallback(() => {
    let total = production.price;

    // Add word/version price
    if (selectedWords) {
      const wordItem = production.itemlistTwo.find((item) => item.item === selectedWords);
      if (wordItem) total += wordItem.price;
    }

    // Add option prices
    selectedOptions.forEach((option) => {
      const optionItem = production.itemlistThree.find((item) => item.item === option);
      if (optionItem) total += optionItem.price;
    });

    // Add region price
    if (production.uitzendgebied && selectedRegion) {
      const regionItem = production.uitzendgebied.find((item) => item.name === selectedRegion);
      if (regionItem) total += regionItem.price;
    }

    return total;
  }, [production, selectedWords, selectedOptions, selectedRegion]);

  const handleOptionToggle = useCallback(
    (option: string) => {
      const optionData = production.itemlistThree.find((item) => item.item === option);
      const newOptions = new Set(selectedOptions);

      if (newOptions.has(option)) {
        newOptions.delete(option);
        // Remove dependent options
        production.itemlistThree.forEach((item) => {
          if (item.dependencies?.includes(option)) {
            newOptions.delete(item.item);
          }
        });
      } else {
        // Check dependencies
        if (optionData?.dependencies) {
          optionData.dependencies.forEach((dep) => newOptions.add(dep));
        }
        newOptions.add(option);
      }

      setSelectedOptions(newOptions);
    },
    [selectedOptions, production.itemlistThree]
  );

  const handleProductionChange = useCallback(
    (newSlug: string) => {
      router.push(`/order/${newSlug}`);
    },
    [router]
  );

  const handleAddToCart = useCallback(() => {
    if (!selectedVoiceover) {
      alert('Kies eerst een stem voor je productie');
      return;
    }

    // Prepare cart items similar to UnifiedPriceCalculator
    const newCartItems = [];

    // Add production type
    newCartItems.push({
      id: 'production',
      name: production.name,
      price: production.price,
      details: [],
    });

    // Add word/version price
    if (selectedWords) {
      const wordItem = production.itemlistTwo.find((item) => item.item === selectedWords);
      if (wordItem && wordItem.price > 0) {
        newCartItems.push({
          id: 'words',
          name: `${selectedWords} ${production.name === 'Radiospot' || production.name === 'TV Commercial' || production.name === 'Web Commercial' ? 'versies' : 'woorden'}`,
          price: wordItem.price,
          details: [],
        });
      }
    }

    // Add region price if applicable
    if (production.uitzendgebied && selectedRegion) {
      const regionItem = production.uitzendgebied.find((item) => item.name === selectedRegion);
      if (regionItem && regionItem.price > 0) {
        newCartItems.push({
          id: 'region',
          name: `Uitzendgebied: ${selectedRegion}`,
          price: regionItem.price,
          details: [],
        });
      }
    }

    // Add extra options
    selectedOptions.forEach((option) => {
      const optionItem = production.itemlistThree.find((item) => item.item === option);
      if (optionItem) {
        newCartItems.push({
          id: `option-${option}`,
          name: option,
          price: optionItem.price,
          details: [],
        });
      }
    });

    // Update checkout configuration
    setProductionName(production.name);
    setWordCount(
      selectedWords
        ? `${selectedWords} ${production.name === 'Radiospot' || production.name === 'TV Commercial' || production.name === 'Web Commercial' ? 'versies' : 'woorden'}`
        : undefined
    );
    setRegion(selectedRegion || undefined);
    setExtras(Array.from(selectedOptions));

    // Clear cart and add new items
    clearCart();
    newCartItems.forEach((item) => addItem(item));

    // Open drawer with voiceover selection
    if (selectedVoiceover) {
      openDrawer('production', {
        id: selectedVoiceover.id,
        name: selectedVoiceover.name,
        slug: selectedVoiceover.name.toLowerCase().replace(/\s+/g, '-'),
        profilePhoto: selectedVoiceover.profilePhoto,
      });
    }

    alert('Product toegevoegd aan winkelwagen!');
  }, [
    selectedVoiceover,
    production,
    selectedWords,
    selectedRegion,
    selectedOptions,
    calculateTotal,
    clearCart,
    addItem,
    setProductionName,
    setWordCount,
    setRegion,
    setExtras,
    openDrawer,
  ]);

  const toggleAccordion = useCallback((item: string) => {
    setOpenAccordions((prev) => {
      const newOpenAccordions = new Set(prev);
      if (newOpenAccordions.has(item)) {
        newOpenAccordions.delete(item);
      } else {
        newOpenAccordions.add(item);
      }
      return newOpenAccordions;
    });
  }, []);

  // Safety check after all hooks
  if (!production) {
    console.error('Production not found for index:', productionIndex);
    return (
      <div className="min-h-[50vh] bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Production not found</h2>
          <p className="text-muted-foreground">Production index: {productionIndex}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={fontClasses}>
      {/* Fixed Header with Close Button */}
      {!hideCloseButton && (
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">Configureer je productie</h2>
            <button
              onClick={() => router.push('/')}
              className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
              aria-label="Sluiten"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Video and Info */}
            <div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-6">
                <video
                  ref={videoRef}
                  src={production.videoUrl}
                  loop
                  muted
                  autoPlay
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              <h1
                className="text-3xl lg:text-4xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-instrument-serif)' }}
              >
                {production.name}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {production.description}
              </p>

              {/* Production Switcher */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Andere producties
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {productionData.map((prod, idx) => (
                    <button
                      key={prod.name}
                      onClick={() => handleProductionChange(productionSlugs[idx])}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        idx === productionIndex
                          ? 'text-black shadow-sm'
                          : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                      }`}
                      style={{
                        backgroundColor: idx === productionIndex ? production.color : undefined,
                      }}
                    >
                      {prod.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* End of Left Column */}

            {/* Right Column - Fixed Height Configuration */}
            <div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex flex-col">
                {/* Header with gradient accent */}
                <div className="relative px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent rounded-t-2xl" />
                  <h2 className="relative text-lg font-bold text-gray-900 dark:text-gray-100">
                    Configureer je bestelling
                  </h2>
                </div>

                {/* Content */}
                <div className="flex-1 px-6 py-4 space-y-4">
                  {/* Voice Selection - Redesigned */}
                  <div>
                    <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                      <Mic className="w-4 h-4 text-green-500" />
                      Selecteer een stem
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setVoiceDropdownOpen(!voiceDropdownOpen)}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                          selectedVoiceover
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800'
                        }`}
                      >
                        {selectedVoiceover ? (
                          <div className="flex items-center gap-3">
                            {selectedVoiceover.profilePhoto && (
                              <Image
                                src={selectedVoiceover.profilePhoto}
                                alt={selectedVoiceover.name}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                              />
                            )}
                            <div className="text-left">
                              <p className="font-semibold text-gray-900 dark:text-gray-100">
                                {selectedVoiceover.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {selectedVoiceover.styleTags?.slice(0, 2).join(', ')}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 font-medium">
                            Kies een voice-over artiest
                          </span>
                        )}
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${voiceDropdownOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {voiceDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto"
                          >
                            {voiceovers.map((voice) => (
                              <button
                                key={voice.id}
                                onClick={() => {
                                  setSelectedVoiceover({
                                    id: voice.id,
                                    name: voice.name,
                                    profilePhoto: voice.profilePhoto?.url,
                                    styleTags:
                                      voice.styleTags?.map((st) => st.customTag || st.tag) || [],
                                  });
                                  setVoiceDropdownOpen(false);
                                }}
                                className={`w-full px-4 py-3 transition-colors flex items-center gap-3 ${
                                  selectedVoiceover?.id === voice.id
                                    ? 'bg-green-50 dark:bg-green-900/20'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                              >
                                {voice.profilePhoto?.url && (
                                  <Image
                                    src={voice.profilePhoto.url}
                                    alt={voice.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover flex-shrink-0"
                                  />
                                )}
                                <div className="flex-1 text-left">
                                  <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {voice.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {voice.styleTags
                                      ?.slice(0, 3)
                                      .map((st) => st.customTag || st.tag)
                                      .join(', ')}
                                  </p>
                                </div>
                                {selectedVoiceover?.id === voice.id && (
                                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                )}
                              </button>
                            ))}
                            <Link
                              href="/voiceovers"
                              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-t-2 border-gray-100 dark:border-gray-800"
                            >
                              <Users className="w-4 h-4" />
                              Bekijk alle stemmen
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Words/Versions Selection - Compact */}
                  <div>
                    <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 block">
                      {production.titleTwo}
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setWordsDropdownOpen(!wordsDropdownOpen)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900 transition-all flex items-center justify-between text-sm"
                      >
                        <span
                          className={
                            selectedWords
                              ? 'text-gray-900 dark:text-gray-100 font-medium'
                              : 'text-gray-500 dark:text-gray-400'
                          }
                        >
                          {selectedWords || 'Selecteer een optie'}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${wordsDropdownOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {wordsDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-40 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
                          >
                            {production.itemlistTwo.map((item) => (
                              <button
                                key={item.item}
                                onClick={() => {
                                  setSelectedWords(item.item);
                                  setWordsDropdownOpen(false);
                                }}
                                className="w-full px-3 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex justify-between items-center"
                              >
                                <span className="text-gray-900 dark:text-gray-100">
                                  {item.item}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-xs">
                                  {item.price === 0 ? '+€0' : `+€${item.price}`}
                                </span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Extra Options - New Design */}
                  <div>
                    <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 block">
                      {production.titleThree}
                    </label>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 space-y-2">
                      {production.itemlistThree.map((option) => {
                        const isSelected = selectedOptions.has(option.item);
                        const isDisabled =
                          option.dependencies?.some((dep) => !selectedOptions.has(dep)) ?? false;
                        const isOpen = openAccordions.has(option.item);

                        return (
                          <div key={option.item} className={`${isDisabled ? 'opacity-50' : ''}`}>
                            <div className="flex items-start gap-2">
                              <button
                                onClick={() => !isDisabled && handleOptionToggle(option.item)}
                                disabled={isDisabled}
                                className={`relative w-5 h-5 rounded-md flex-shrink-0 mt-0.5 transition-all ${
                                  isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                                }`}
                              >
                                <div
                                  className={`absolute inset-0 rounded-md border-2 transition-all ${
                                    isSelected
                                      ? 'border-green-500 bg-green-500'
                                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                                  }`}
                                />
                                <AnimatePresence>
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0, opacity: 0 }}
                                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                      className="absolute inset-0 flex items-center justify-center"
                                    >
                                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </button>
                              <div
                                className="flex-1 cursor-pointer"
                                onClick={() => toggleAccordion(option.item)}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <p
                                      className={`text-sm font-medium ${
                                        isSelected
                                          ? 'text-gray-900 dark:text-gray-100'
                                          : 'text-gray-700 dark:text-gray-300'
                                      }`}
                                    >
                                      {option.item}
                                    </p>
                                    {!isOpen && option.dependencies && (
                                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
                                        Vereist: {option.dependencies.join(', ')}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      +€{option.price}
                                    </span>
                                    <ChevronDown
                                      className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-transform ${
                                        isOpen ? 'rotate-180' : ''
                                      }`}
                                    />
                                  </div>
                                </div>
                                <AnimatePresence>
                                  {isOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                                        {option.infoText}
                                      </p>
                                      {option.dependencies && (
                                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                          Vereist: {option.dependencies.join(', ')}
                                        </p>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Region Selection (if applicable) - Compact */}
                  {production.uitzendgebied && (
                    <div>
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                        Uitzendgebied
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {production.uitzendgebied.map((region) => (
                          <button
                            key={region.name}
                            onClick={() => setSelectedRegion(region.name)}
                            className={`px-2.5 py-1.5 rounded-md border transition-all text-sm ${
                              selectedRegion === region.name
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-gray-100'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <p className="font-medium capitalize">{region.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              +€{region.price}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer with Total and CTA - Always Visible */}
                <div className="px-6 py-4 bg-gradient-to-t from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-b-2xl border-t border-gray-100 dark:border-gray-800">
                  {/* Order Summary */}
                  <div className="space-y-2 mb-3">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      Jouw bestelling
                    </p>

                    {/* Selected Items */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{production.name}</span>
                        <span className="font-medium">€{production.price}</span>
                      </div>

                      {selectedVoiceover && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Mic className="w-3 h-3" />
                            {selectedVoiceover.name}
                          </span>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                      )}

                      {selectedWords && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {selectedWords}{' '}
                            {production.name === 'Radiospot' ||
                            production.name === 'TV Commercial' ||
                            production.name === 'Web Commercial'
                              ? 'versies'
                              : 'woorden'}
                          </span>
                          {production.itemlistTwo.find((item) => item.item === selectedWords)
                            ?.price !== 0 && (
                            <span className="font-medium">
                              +€
                              {production.itemlistTwo.find((item) => item.item === selectedWords)
                                ?.price || 0}
                            </span>
                          )}
                        </div>
                      )}

                      {Array.from(selectedOptions).map((option) => {
                        const optionData = production.itemlistThree.find(
                          (item) => item.item === option
                        );
                        return (
                          optionData && (
                            <div key={option} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">✓ {option}</span>
                              <span className="font-medium">+€{optionData.price}</span>
                            </div>
                          )
                        );
                      })}

                      {selectedRegion && production.uitzendgebied && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{selectedRegion}</span>
                          <span className="font-medium">
                            +€
                            {production.uitzendgebied.find((item) => item.name === selectedRegion)
                              ?.price || 0}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Totaal</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        €{calculateTotal()}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={!selectedVoiceover || !selectedWords}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                      selectedVoiceover && selectedWords
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Toevoegen aan winkelwagen
                  </motion.button>
                </div>
              </div>
            </div>
            {/* End of Right Column */}
          </div>
          {/* End of grid */}
        </div>
      </div>
    </div>
  );
});
