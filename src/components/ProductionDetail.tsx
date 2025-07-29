'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';
import { ChevronLeft, ChevronDown, Info, ShoppingCart, Users } from 'lucide-react';
import Link from 'next/link';

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

// Production data types and content (same as before)
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
    name: 'Radiospots',
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
    ],
  },
  {
    name: 'TV Commercial',
    price: 200,
    description:
      'TV commercials zijn professionele producties voor televisie-uitzending. Met hoge broadcast kwaliteit, geschikt voor nationale campagnes.',
    videoUrl: '/videos/tv-commercial.mp4',
    color: '#a78bfa',
    accentColor: '#9775f5',
    titleTwo: 'Aantal versies',
    itemlistTwo: [
      { item: '1', price: 0 },
      { item: '2', price: 240 },
      { item: '3', price: 410 },
      { item: '4', price: 560 },
      { item: '5', price: 690 },
    ],
    titleThree: 'Extra Opties',
    itemlistThree: [
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
    ],
    uitzendgebied: [
      { name: 'regionaal', price: 0 },
      { name: 'nationaal', price: 250 },
    ],
  },
  {
    name: 'Web Commercial',
    price: 175,
    description:
      'Web commercials zijn online video-advertenties voor betaalde campagnes op social media, YouTube, Google Display en andere online platformen.',
    videoUrl: '/videos/web-commercial.mp4',
    color: '#f59e0b',
    accentColor: '#dc8a09',
    titleTwo: 'Aantal versies',
    itemlistTwo: [
      { item: '1', price: 0 },
      { item: '2', price: 215 },
      { item: '3', price: 355 },
      { item: '4', price: 475 },
      { item: '5', price: 575 },
    ],
    titleThree: 'Extra Opties',
    itemlistThree: [
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

interface ProductionDetailProps {
  productionIndex: number;
  onAddToCart: (data: {
    productionIndex: number;
    selectedWords: string | null;
    selectedOptions: Set<string>;
    selectedRegion: string | null;
    customWordCount: string;
    total: number;
  }) => void;
  onBack: () => void;
}

export function ProductionDetail({ productionIndex, onAddToCart, onBack }: ProductionDetailProps) {
  const [selectedWords, setSelectedWords] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [selectedRegion] = useState<string | null>(null);
  const [customWordCount] = useState('');
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const production = productionData[productionIndex];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Calculate total price
  const calculateTotal = () => {
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
  };

  const handleOptionToggle = (option: string) => {
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
  };

  const handleAddToCart = () => {
    onAddToCart({
      productionIndex,
      selectedWords,
      selectedOptions,
      selectedRegion,
      customWordCount,
      total: calculateTotal(),
    });
  };

  return (
    <div
      className={`${plusJakarta.variable} ${instrumentSerif.variable} font-plus-jakarta min-h-screen`}
    >
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Terug naar producties
            </button>

            <Link
              href="/voice-overs"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <Users className="w-4 h-4" />
              Kies een stem
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
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

            <h1 className="text-3xl lg:text-4xl font-bold mb-4 font-instrument-serif">
              {production.name}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {production.description}
            </p>

            {/* Production Switcher */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Andere producties</h3>
              <div className="grid grid-cols-3 gap-2">
                {productionData.map((prod, idx) => (
                  <button
                    key={prod.name}
                    onClick={() => (window.location.href = `?production=${idx}`)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      idx === productionIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {prod.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Configuration */}
          <div className="bg-white dark:bg-card rounded-xl shadow-lg p-6 lg:p-8">
            <div className="mb-6">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-2xl font-semibold">Configureer je bestelling</h2>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">vanaf</p>
                  <p className="text-3xl font-bold" style={{ color: production.color }}>
                    €{production.price}
                  </p>
                </div>
              </div>
            </div>

            {/* Words/Versions Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">{production.titleTwo}</h3>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full p-4 rounded-lg border-2 border-border hover:border-muted-foreground transition-all flex items-center justify-between"
                >
                  <span className="font-medium">{selectedWords || 'Selecteer een optie'}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 bg-white dark:bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                    >
                      {production.itemlistTwo.map((item) => (
                        <button
                          key={item.item}
                          onClick={() => {
                            setSelectedWords(item.item);
                            setDropdownOpen(false);
                          }}
                          className="w-full p-3 text-left hover:bg-muted transition-colors flex justify-between items-center"
                        >
                          <span>{item.item}</span>
                          <span className="text-sm text-muted-foreground">+€{item.price}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Extra Options */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">{production.titleThree}</h3>
              <div className="space-y-2">
                {production.itemlistThree.map((option) => {
                  const isSelected = selectedOptions.has(option.item);
                  const isDisabled = option.dependencies?.some((dep) => !selectedOptions.has(dep));

                  return (
                    <motion.div
                      key={option.item}
                      className={`relative ${isDisabled ? 'opacity-50' : ''}`}
                    >
                      <button
                        onClick={() => !isDisabled && handleOptionToggle(option.item)}
                        onMouseEnter={() => setHoveredOption(option.item)}
                        onMouseLeave={() => setHoveredOption(null)}
                        disabled={isDisabled}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                        } ${
                          isSelected
                            ? 'border-2 shadow-md'
                            : 'border-border hover:border-muted-foreground'
                        }`}
                        style={{
                          borderColor: isSelected ? production.color : undefined,
                          backgroundColor: isSelected ? `${production.color}10` : undefined,
                        }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                                isSelected ? 'border-current' : 'border-gray-300'
                              }`}
                              style={{
                                borderColor: isSelected ? production.color : undefined,
                                backgroundColor: isSelected ? production.color : undefined,
                              }}
                            >
                              {isSelected && (
                                <svg
                                  className="w-full h-full p-0.5"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                >
                                  <path
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    fill="currentColor"
                                    className="text-black"
                                  />
                                </svg>
                              )}
                            </div>
                            <p className="font-medium text-sm">{option.item}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">+€{option.price}</span>
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      </button>

                      {hoveredOption === option.item && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute z-10 p-3 bg-black text-white text-xs rounded-lg mt-1 max-w-xs"
                        >
                          {option.infoText}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Total and CTA */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-6">
                <p className="text-lg font-medium">Totaal</p>
                <p className="text-3xl font-bold" style={{ color: production.color }}>
                  €{calculateTotal()}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full py-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-black"
                style={{ backgroundColor: production.color }}
              >
                <ShoppingCart className="w-5 h-5" />
                Voeg toe aan winkelwagen
              </motion.button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Volgende stap: kies een stem voor je productie
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
