'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';
import { ChevronLeft, ChevronDown, Info } from 'lucide-react';

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

interface ProductionAccordionProps {
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

export function ProductionAccordion({ onSelect, selectedProduction }: ProductionAccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<
    'overview' | 'configure' | 'words' | 'options' | 'summary'
  >('overview');
  const [selectedWords, setSelectedWords] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [customWordCount, setCustomWordCount] = useState('');
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentProduction = expandedIndex !== null ? productionData[expandedIndex] : null;

  useEffect(() => {
    if (videoRef.current && expandedIndex !== null) {
      videoRef.current.play().catch(() => {});
    }
  }, [expandedIndex]);

  // Calculate total price
  const calculateTotal = () => {
    if (!currentProduction) return 0;
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
    if (expandedIndex === index) {
      setExpandedIndex(null);
      setCurrentStep('overview');
    } else {
      setExpandedIndex(index);
      setSelectedWords(null);
      setSelectedOptions(new Set());
      setSelectedRegion(null);
      setCustomWordCount('');
      setCurrentStep('overview');
    }
  };

  const handleOptionToggle = (option: string) => {
    if (!currentProduction) return;
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
    if (expandedIndex === null || !currentProduction) return;

    onSelect({
      productionIndex: expandedIndex,
      selectedWords,
      selectedOptions,
      selectedRegion,
      customWordCount,
      total: calculateTotal(),
    });
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case 'overview':
        return 0;
      case 'configure':
        return 1;
      case 'words':
        return 1;
      case 'options':
        return 2;
      case 'summary':
        return 3;
      default:
        return 0;
    }
  };

  const StepIndicator = () => {
    const steps = ['Kies', 'Configureer', "Extra's", 'Overzicht'];
    const currentStepNum = getStepNumber();

    return (
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentStepNum ? 'bg-current' : 'bg-gray-300'
              }`}
              style={{
                backgroundColor:
                  index <= currentStepNum && currentProduction
                    ? currentProduction.color
                    : undefined,
              }}
            />
            {index < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-1 transition-all duration-300 ${
                  index < currentStepNum ? 'bg-current' : 'bg-gray-300'
                }`}
                style={{
                  backgroundColor:
                    index < currentStepNum && currentProduction
                      ? currentProduction.color
                      : undefined,
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`${plusJakarta.variable} ${instrumentSerif.variable} font-plus-jakarta`}>
      <div className="max-w-3xl mx-auto">
        <h3 className="text-lg font-semibold mb-6 text-muted-foreground">Kies je productie</h3>

        <div className="space-y-3">
          {productionData.map((production, index) => (
            <motion.div
              key={production.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-lg overflow-hidden"
            >
              {/* Production Header - Always Visible */}
              <motion.button
                onClick={() => handleProductionClick(index)}
                className={`relative w-full h-20 transition-all duration-200 cursor-pointer overflow-hidden ${
                  expandedIndex === index
                    ? 'bg-white dark:bg-card shadow-lg'
                    : 'bg-muted/50 hover:bg-muted hover:shadow-md'
                }`}
                style={{
                  borderLeft:
                    expandedIndex === index
                      ? `4px solid ${production.color}`
                      : '4px solid transparent',
                }}
                whileHover={{ x: expandedIndex !== index ? 4 : 0 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Full Background Video */}
                <div className="absolute inset-0">
                  <video
                    ref={(el) => {
                      if (el) {
                        el.playbackRate = 0.5; // Slow down playback
                        el.play().catch(() => {});

                        // Implement back-and-forth loop
                        let forward = true;
                        el.addEventListener('timeupdate', () => {
                          if (forward && el.currentTime >= el.duration - 0.1) {
                            forward = false;
                            el.playbackRate = -0.5;
                          } else if (!forward && el.currentTime <= 0.1) {
                            forward = true;
                            el.playbackRate = 0.5;
                          }
                        });
                      }
                    }}
                    src={production.videoUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    playsInline
                    autoPlay
                  />
                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3), ${production.color}40)`,
                    }}
                  />
                </div>

                {/* Content on top of video */}
                <div className="relative z-10 flex items-center justify-between px-4 py-4">
                  <div className="text-left">
                    <h4 className="font-semibold text-white mb-1">{production.name}</h4>
                    <p className="text-sm text-white/80">vanaf €{production.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedProduction === index && expandedIndex !== index && (
                      <span className="text-sm font-medium px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white">
                        Geselecteerd
                      </span>
                    )}
                    <motion.div
                      animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                </div>
              </motion.button>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedIndex === index && currentProduction && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-white dark:bg-card"
                  >
                    <div className="p-6 border-t border-border">
                      {/* Step Indicator */}
                      {currentStep !== 'overview' && <StepIndicator />}

                      {/* Overview Step */}
                      {currentStep === 'overview' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {/* Video Section */}
                          <div className="relative h-48 sm:h-64 rounded-lg overflow-hidden bg-black mb-6">
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
                              <h2 className="text-3xl sm:text-4xl font-bold mb-2 font-instrument-serif">
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

                          {/* Description */}
                          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                            {currentProduction.description}
                          </p>

                          {/* Select Button */}
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
                            Selecteer
                          </motion.button>
                        </motion.div>
                      )}

                      {/* Words/Versions Step */}
                      {currentStep === 'words' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                          <div className="flex items-center gap-3 mb-6">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setCurrentStep('overview')}
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              Terug
                            </motion.button>
                            <h3 className="text-xl font-semibold flex-1">
                              {currentProduction.titleTwo}
                            </h3>
                          </div>

                          {/* Dropdown */}
                          <div className="mb-4">
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
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="mt-2 bg-white dark:bg-card border border-border rounded-lg shadow-lg overflow-hidden"
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
                                        +€{item.price}
                                      </span>
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Custom word count */}
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

                          {/* Region selection */}
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
                                      +€{region.price}
                                    </p>
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          )}

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
                        </motion.div>
                      )}

                      {/* Options Step */}
                      {currentStep === 'options' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                          <div className="flex items-center gap-3 mb-6">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setCurrentStep('words')}
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              Terug
                            </motion.button>
                            <h3 className="text-xl font-semibold flex-1">
                              {currentProduction.titleThree}
                            </h3>
                          </div>

                          {/* Options List */}
                          <div className="space-y-2 mb-6">
                            {currentProduction.itemlistThree.map((option) => {
                              const isSelected = selectedOptions.has(option.item);
                              const isDisabled = option.dependencies?.some(
                                (dep) => !selectedOptions.has(dep)
                              );

                              return (
                                <motion.div
                                  key={option.item}
                                  className={`${isDisabled ? 'opacity-50' : ''}`}
                                  whileHover={!isDisabled ? { scale: 1.01 } : {}}
                                  whileTap={!isDisabled ? { scale: 0.99 } : {}}
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
                                        : 'border-border hover:border-muted-foreground hover:shadow-sm'
                                    }`}
                                    style={{
                                      borderColor: isSelected ? currentProduction.color : undefined,
                                      backgroundColor: isSelected
                                        ? `${currentProduction.color}10`
                                        : undefined,
                                    }}
                                  >
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-3 flex-1">
                                        <div
                                          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                                            isSelected ? 'border-current' : 'border-gray-300'
                                          }`}
                                          style={{
                                            borderColor: isSelected
                                              ? currentProduction.color
                                              : undefined,
                                            backgroundColor: isSelected
                                              ? currentProduction.color
                                              : undefined,
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
                                        <span
                                          className="text-sm font-medium"
                                          style={{
                                            color: isSelected ? currentProduction.color : undefined,
                                          }}
                                        >
                                          +€{option.price}
                                        </span>
                                        <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                      </div>
                                    </div>

                                    {/* Dependencies inline */}
                                    {option.dependencies && (
                                      <p className="text-xs text-muted-foreground mt-1 ml-7 italic">
                                        Vereist: {option.dependencies.join(', ')}
                                      </p>
                                    )}
                                  </button>

                                  {/* Tooltip on hover/click for mobile */}
                                  {hoveredOption === option.item && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="absolute z-10 p-3 bg-black text-white text-xs rounded-lg mt-1 mx-2 max-w-[calc(100%-1rem)]"
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
                        </motion.div>
                      )}

                      {/* Summary Step */}
                      {currentStep === 'summary' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                          <div className="flex items-center gap-3 mb-6">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setCurrentStep('options')}
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              Terug
                            </motion.button>
                            <h3 className="text-xl font-semibold flex-1">Overzicht</h3>
                          </div>

                          {/* Summary Details */}
                          <div className="space-y-3 text-sm mb-6">
                            <div className="flex justify-between py-2">
                              <span className="text-muted-foreground">Productie</span>
                              <span className="font-medium">{currentProduction.name}</span>
                            </div>

                            {selectedWords && (
                              <div className="flex justify-between py-2 border-t">
                                <span className="text-muted-foreground">
                                  {currentProduction.titleTwo}
                                </span>
                                <span className="font-medium">{selectedWords}</span>
                              </div>
                            )}

                            {selectedRegion && (
                              <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">Uitzendgebied</span>
                                <span className="font-medium capitalize">{selectedRegion}</span>
                              </div>
                            )}

                            {selectedOptions.size > 0 && (
                              <div className="pt-2 border-t">
                                <p className="text-muted-foreground mb-2">Extra opties:</p>
                                {Array.from(selectedOptions).map((option) => (
                                  <div key={option} className="flex justify-between py-1 pl-4">
                                    <span className="text-muted-foreground">• {option}</span>
                                    <span className="font-medium">
                                      +€
                                      {
                                        currentProduction.itemlistThree.find(
                                          (o) => o.item === option
                                        )?.price
                                      }
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Total */}
                          <div className="border-t pt-4 mb-6">
                            <div className="flex items-center justify-between">
                              <p className="text-lg font-semibold">Totaal</p>
                              <p
                                className="text-2xl font-bold"
                                style={{ color: currentProduction.color }}
                              >
                                €{calculateTotal()}
                              </p>
                            </div>
                          </div>

                          {/* Final Button */}
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
                            {selectedProduction === expandedIndex
                              ? '✓ Productie bijwerken'
                              : 'Selecteer deze productie'}
                          </motion.button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
