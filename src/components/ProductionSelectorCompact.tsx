'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';
import { Check, ChevronRight, ChevronDown, Info } from 'lucide-react';

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

interface ProductionSelectorCompactProps {
  onSelect: (data: {
    productionIndex: number;
    selectedWords: string | null;
    selectedOptions: Set<string>;
    selectedRegion: string | null;
    customWordCount: string;
    total: number;
  }) => void;
  selectedProduction: number | null;
}

// Import production data
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

// Pricing formula
const calculateWordPrice = (words: number, productionType: string): number => {
  const rates = {
    Videoproductie: {
      base: 0,
      tiers: [
        { max: 250, rate: 0 },
        { max: 500, rate: 0.2 },
        { max: 1000, rate: 0.3 },
        { max: 1500, rate: 0.45 },
        { max: Infinity, rate: 0.23 },
      ],
    },
    'E-learning': {
      base: 0,
      tiers: [
        { max: 500, rate: 0 },
        { max: 1000, rate: 0.2 },
        { max: 1500, rate: 0.35 },
        { max: 2000, rate: 0.5 },
        { max: Infinity, rate: 0.2 },
      ],
    },
    'Voice Response': {
      base: 0,
      tiers: [
        { max: 500, rate: 0 },
        { max: 1000, rate: 0.2 },
        { max: 1500, rate: 0.35 },
        { max: 2000, rate: 0.5 },
        { max: Infinity, rate: 0.2 },
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

export function ProductionSelectorCompact({
  onSelect,
  selectedProduction,
}: ProductionSelectorCompactProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [customWordCount, setCustomWordCount] = useState('');
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'overview' | 'words' | 'options' | 'summary'>(
    'overview'
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentProduction = productionData[activeIndex];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [activeIndex]);

  // Calculate total price
  const calculateTotal = () => {
    let total = currentProduction.price;

    // Add word/version price
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
  };

  const handleProductionClick = (index: number) => {
    setActiveIndex(index);
    setSelectedWords(null);
    setSelectedOptions(new Set());
    setSelectedRegion(null);
    setCustomWordCount('');
    setCurrentStep('overview');
  };

  const handleOptionToggle = (option: string) => {
    const optionData = currentProduction.itemlistThree.find((item) => item.item === option);
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
      if (optionData?.dependencies) {
        optionData.dependencies.forEach((dep) => newOptions.add(dep));
      }
      newOptions.add(option);
    }

    setSelectedOptions(newOptions);
  };

  const handleComplete = () => {
    onSelect({
      productionIndex: activeIndex,
      selectedWords,
      selectedOptions,
      selectedRegion,
      customWordCount,
      total: calculateTotal(),
    });
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case 'overview':
        return 0;
      case 'words':
        return 33;
      case 'options':
        return 66;
      case 'summary':
        return 100;
      default:
        return 0;
    }
  };

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
          background: #888;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
      <div className={`${plusJakarta.variable} ${instrumentSerif.variable} font-plus-jakarta`}>
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
          {/* Left side - Production List */}
          <div className="lg:w-1/3">
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Kies je productie</h3>
            <div className="space-y-2">
              {productionData.map((production, index) => (
                <motion.div
                  key={production.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleProductionClick(index)}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative cursor-pointer rounded-lg p-4 transition-all duration-200 ${
                    activeIndex === index
                      ? 'bg-white dark:bg-card shadow-lg ring-2'
                      : 'bg-muted/50 hover:bg-muted hover:shadow-md'
                  }`}
                  style={
                    {
                      '--ring-color': activeIndex === index ? production.color : 'transparent',
                      borderColor: activeIndex === index ? production.color : 'transparent',
                    } as React.CSSProperties
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{production.name}</h4>
                      <p className="text-sm text-muted-foreground">vanaf €{production.price}</p>
                    </div>
                    {activeIndex === index && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: production.color }}
                      >
                        <Check className="w-4 h-4 text-black" />
                      </motion.div>
                    )}
                    {activeIndex !== index && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right side - Configuration Card (Fixed Height) */}
          <div className="lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white dark:bg-card rounded-xl overflow-hidden shadow-xl h-[480px] flex flex-col"
                style={{
                  boxShadow: `0 20px 40px -20px ${currentProduction.color}20`,
                }}
              >
                {/* Progress Bar */}
                {currentStep !== 'overview' && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
                    <motion.div
                      className="h-full"
                      style={{ backgroundColor: currentProduction.color }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${getStepProgress()}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}

                {/* Content */}
                {currentStep === 'overview' && (
                  <>
                    {/* Video Section */}
                    <div className="relative h-48 overflow-hidden bg-black">
                      <video
                        ref={videoRef}
                        src={currentProduction.videoUrl}
                        loop
                        muted
                        autoPlay
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h2 className="text-2xl font-bold mb-2 font-instrument-serif">
                          {currentProduction.name}
                        </h2>
                        <div
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold text-black"
                          style={{ backgroundColor: currentProduction.color }}
                        >
                          vanaf €{currentProduction.price}
                        </div>
                      </div>
                    </div>

                    {/* Description Section */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {currentProduction.description}
                      </p>

                      <motion.button
                        whileHover={{
                          scale: 1.02,
                          boxShadow: `0 10px 30px -10px ${currentProduction.color}80`,
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentStep('words')}
                        className="w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 text-black cursor-pointer"
                        style={{ backgroundColor: currentProduction.color }}
                      >
                        Configureren
                      </motion.button>
                    </div>
                  </>
                )}

                {currentStep === 'words' && (
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">{currentProduction.titleTwo}</h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentStep('overview')}
                        className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        Terug
                      </motion.button>
                    </div>

                    {/* Dropdown for word/version selection */}
                    <div className="relative mb-4">
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full p-4 rounded-lg border-2 border-border hover:border-muted-foreground transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-medium">
                          {selectedWords || 'Selecteer een optie'}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-10 w-full mt-2 bg-white dark:bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                          >
                            {currentProduction.itemlistTwo.map((item) => (
                              <button
                                key={item.item}
                                onClick={() => {
                                  setSelectedWords(item.item);
                                  setDropdownOpen(false);
                                }}
                                className="w-full p-3 text-left hover:bg-muted transition-colors cursor-pointer flex justify-between items-center"
                              >
                                <span>{item.item}</span>
                                <span className="text-sm text-muted-foreground">
                                  {item.price > 0 ? `+€${item.price}` : 'Inclusief'}
                                </span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Custom word count if needed */}
                    {selectedWords ===
                      currentProduction.itemlistTwo[currentProduction.itemlistTwo.length - 1]
                        .item && (
                      <motion.input
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        type="number"
                        placeholder="Aantal woorden"
                        value={customWordCount}
                        onChange={(e) => setCustomWordCount(e.target.value)}
                        className="w-full mb-4 px-4 py-3 border rounded-lg text-sm cursor-text"
                        min={selectedWords === '1500+' ? 1501 : 2001}
                      />
                    )}

                    {/* Region selection if applicable */}
                    {currentProduction.uitzendgebied && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-3">Uitzendgebied</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {currentProduction.uitzendgebied.map((region) => (
                            <motion.button
                              key={region.name}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setSelectedRegion(region.name)}
                              className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                                selectedRegion === region.name
                                  ? 'border-2 shadow-md'
                                  : 'border-border hover:border-muted-foreground hover:shadow-sm'
                              }`}
                              style={{
                                borderColor:
                                  selectedRegion === region.name
                                    ? currentProduction.color
                                    : undefined,
                                backgroundColor:
                                  selectedRegion === region.name
                                    ? `${currentProduction.color}10`
                                    : undefined,
                              }}
                            >
                              <p className="font-medium text-sm capitalize">{region.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {region.price > 0 ? `+€${region.price}` : 'Inclusief'}
                              </p>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex-1" />

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep('options')}
                      disabled={!selectedWords}
                      className={`w-full px-6 py-3 rounded-lg font-medium transition-all ${
                        selectedWords
                          ? 'text-black cursor-pointer'
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                      style={{
                        backgroundColor: selectedWords ? currentProduction.color : undefined,
                      }}
                    >
                      Volgende
                    </motion.button>
                  </div>
                )}

                {currentStep === 'options' && (
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">{currentProduction.titleThree}</h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentStep('words')}
                        className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        Terug
                      </motion.button>
                    </div>

                    {/* Extra options in 2-column grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6 overflow-y-auto flex-1 custom-scrollbar">
                      {currentProduction.itemlistThree.map((option) => {
                        const isSelected = selectedOptions.has(option.item);
                        const isDisabled = option.dependencies?.some(
                          (dep) => !selectedOptions.has(dep)
                        );

                        return (
                          <motion.div
                            key={option.item}
                            className={`relative ${isDisabled ? 'opacity-50' : ''}`}
                            whileHover={!isDisabled ? { scale: 1.02 } : {}}
                            whileTap={!isDisabled ? { scale: 0.98 } : {}}
                          >
                            <button
                              onClick={() => !isDisabled && handleOptionToggle(option.item)}
                              onMouseEnter={() => setHoveredOption(option.item)}
                              onMouseLeave={() => setHoveredOption(null)}
                              disabled={isDisabled}
                              className={`w-full p-3 rounded-lg border-2 transition-all text-left text-sm ${
                                isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                              } ${
                                isSelected
                                  ? 'border-2 shadow-md'
                                  : 'border-border hover:border-muted-foreground hover:shadow-sm'
                              }`}
                              style={{
                                borderColor: isSelected ? currentProduction.color : undefined,
                                backgroundColor: isSelected
                                  ? `${currentProduction.color}10`
                                  : undefined,
                              }}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium line-clamp-1">{option.item}</p>
                                <Info className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              </div>
                              <p className="text-xs text-muted-foreground">+€{option.price}</p>
                            </button>

                            {hoveredOption === option.item && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute z-10 p-3 bg-black text-white text-sm rounded-lg mt-1 max-w-xs"
                              >
                                {option.infoText}
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep('summary')}
                      className="w-full px-6 py-3 rounded-lg font-medium transition-all text-black cursor-pointer"
                      style={{ backgroundColor: currentProduction.color }}
                    >
                      Volgende
                    </motion.button>
                  </div>
                )}

                {currentStep === 'summary' && (
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">Overzicht</h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentStep('options')}
                        className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        Terug
                      </motion.button>
                    </div>

                    {/* Summary */}
                    <div className="flex-1 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Productie</span>
                        <span className="font-medium">{currentProduction.name}</span>
                      </div>

                      {selectedWords && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {currentProduction.titleTwo}
                          </span>
                          <span className="font-medium">{selectedWords}</span>
                        </div>
                      )}

                      {selectedRegion && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Uitzendgebied</span>
                          <span className="font-medium capitalize">{selectedRegion}</span>
                        </div>
                      )}

                      {selectedOptions.size > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-muted-foreground mb-2">Extra opties:</p>
                          {Array.from(selectedOptions).map((option) => (
                            <div key={option} className="flex justify-between">
                              <span className="text-muted-foreground">• {option}</span>
                              <span className="font-medium">
                                +€
                                {
                                  currentProduction.itemlistThree.find((o) => o.item === option)
                                    ?.price
                                }
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Total and CTA */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-lg font-semibold">Totaal</p>
                        <p
                          className="text-2xl font-bold"
                          style={{ color: currentProduction.color }}
                        >
                          €{calculateTotal()}
                        </p>
                      </div>

                      <motion.button
                        whileHover={{
                          scale: 1.02,
                          boxShadow: `0 10px 30px -10px ${currentProduction.color}80`,
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleComplete}
                        className="w-full px-6 py-3 rounded-lg font-medium transition-all text-black cursor-pointer"
                        style={{ backgroundColor: currentProduction.color }}
                      >
                        {selectedProduction === activeIndex
                          ? '✓ Productie bijwerken'
                          : 'Selecteer deze productie'}
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
