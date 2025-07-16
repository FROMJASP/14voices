'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';
import { Check, Info, Calculator, User } from 'lucide-react';
import { useVoiceover, scrollToVoiceovers } from '@/contexts/VoiceoverContext';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
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
  titleOne: string;
  titleTwo: string;
  itemlistTwo: PriceItem[];
  titleThree: string;
  itemlistThree: ExtraOption[];
  explainText?: string;
  uitzendgebied?: Array<{ name: string; price: number }>;
}

// Production data
const productionData: ProductionType[] = [
  {
    name: 'Videoproductie',
    price: 175,
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
    name: 'Radiocommercial',
    price: 150,
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

export function PriceCalculator() {
  const [selectedProduction, setSelectedProduction] = useState(productionData[0].name);
  const [selectedWords, setSelectedWords] = useState(productionData[0].itemlistTwo[0].item);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [selectedRegion, setSelectedRegion] = useState<string>('regionaal');
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const { selectedVoiceover, clearSelection } = useVoiceover();

  const currentProduction = useMemo(
    () => productionData.find((prod) => prod.name === selectedProduction) || productionData[0],
    [selectedProduction]
  );

  const calculateTotal = useMemo(() => {
    let total = currentProduction.price;

    // Add word/version price
    const wordItem = currentProduction.itemlistTwo.find((item) => item.item === selectedWords);
    if (wordItem) total += wordItem.price;

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
  }, [currentProduction, selectedWords, selectedOptions, selectedRegion]);

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

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
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
      className={`py-16 bg-[#fcf9f5] dark:bg-gray-950 ${plusJakarta.variable}`}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-primary" />
            <h2 className="font-plus-jakarta text-4xl md:text-5xl font-bold">Prijscalculator</h2>
          </div>
          <p className="font-plus-jakarta text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Bereken direct de prijs voor jouw voice-over project. Selecteer het type productie, de
            lengte en eventuele extra opties.
          </p>
        </motion.div>

        {/* Calculator Grid */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Column 1: Production Type */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="font-plus-jakarta text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Productiesoort
            </h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {productionData.map((production) => (
                <motion.label
                  key={production.name}
                  variants={itemVariants}
                  className={`
                    flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200
                    ${
                      selectedProduction === production.name
                        ? 'bg-primary text-white shadow-md transform scale-105'
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="production"
                    value={production.name}
                    checked={selectedProduction === production.name}
                    onChange={() => {
                      setSelectedProduction(production.name);
                      setSelectedWords(production.itemlistTwo[0].item);
                      setSelectedOptions(new Set());
                    }}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between w-full">
                    <span className="font-plus-jakarta font-medium">{production.name}</span>
                    <span className="font-plus-jakarta text-sm font-semibold">
                      €{production.price}
                    </span>
                  </div>
                </motion.label>
              ))}
            </motion.div>
          </motion.div>

          {/* Column 2: Word Count / Versions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="font-plus-jakarta text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
              {currentProduction.titleTwo}
            </h3>
            {currentProduction.explainText && (
              <p className="font-plus-jakarta text-sm text-gray-600 dark:text-gray-400 mb-4">
                {currentProduction.explainText}
              </p>
            )}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {currentProduction.itemlistTwo.map((item) => (
                <motion.label
                  key={item.item}
                  variants={itemVariants}
                  className={`
                    flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200
                    ${
                      selectedWords === item.item
                        ? 'bg-primary text-white shadow-md transform scale-105'
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="words"
                    value={item.item}
                    checked={selectedWords === item.item}
                    onChange={() => setSelectedWords(item.item)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between w-full">
                    <span className="font-plus-jakarta font-medium">{item.item}</span>
                    {item.price > 0 && (
                      <span className="font-plus-jakarta text-sm font-semibold">
                        +€{item.price}
                      </span>
                    )}
                  </div>
                </motion.label>
              ))}
            </motion.div>

            {/* Region Selection */}
            {currentProduction.uitzendgebied && (
              <div className="mt-6">
                <h4 className="font-plus-jakarta text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Uitzendgebied
                </h4>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {currentProduction.uitzendgebied.map((region) => (
                    <motion.label
                      key={region.name}
                      variants={itemVariants}
                      className={`
                        flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200
                        ${
                          selectedRegion === region.name
                            ? 'bg-primary text-white shadow-md transform scale-105'
                            : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="radio"
                        name="region"
                        value={region.name}
                        checked={selectedRegion === region.name}
                        onChange={() => setSelectedRegion(region.name)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between w-full">
                        <span className="font-plus-jakarta font-medium capitalize">
                          {region.name}
                        </span>
                        {region.price > 0 && (
                          <span className="font-plus-jakarta text-sm font-semibold">
                            +€{region.price}
                          </span>
                        )}
                      </div>
                    </motion.label>
                  ))}
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Column 3: Extra Options */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="font-plus-jakarta text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Extra Opties
            </h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {currentProduction.itemlistThree.map((option) => {
                const isSelected = selectedOptions.has(option.item);
                const isDisabled = option.dependencies?.some((dep) => !selectedOptions.has(dep));

                return (
                  <motion.div key={option.item} variants={itemVariants} className="relative">
                    <label
                      className={`
                        flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200
                        ${
                          isSelected
                            ? 'bg-primary text-white shadow-md transform scale-105'
                            : isDisabled
                              ? 'bg-gray-50 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                              : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
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
                        <div className="flex items-center gap-2">
                          <div
                            className={`
                              w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                              ${
                                isSelected
                                  ? 'bg-white border-white'
                                  : 'border-gray-400 dark:border-gray-600'
                              }
                            `}
                          >
                            {isSelected && <Check className="w-3 h-3 text-primary" />}
                          </div>
                          <span className="font-plus-jakarta font-medium">{option.item}</span>
                          <Info className="w-4 h-4 opacity-60" />
                        </div>
                        <span className="font-plus-jakarta text-sm font-semibold">
                          +€{option.price}
                        </span>
                      </div>
                    </label>

                    {/* Tooltip */}
                    <AnimatePresence>
                      {hoveredOption === option.item && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 right-0 top-full mt-2 p-3 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-xl z-10"
                        >
                          <p className="font-plus-jakarta">{option.infoText}</p>
                          {option.dependencies && (
                            <p className="font-plus-jakarta mt-2 text-yellow-300">
                              Vereist: {option.dependencies.join(', ')}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Column 4: Total Price */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-primary text-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="font-plus-jakarta text-2xl font-semibold mb-6">Totaalprijs</h3>

            {/* Selected Voiceover */}
            {selectedVoiceover ? (
              <div className="mb-6 pb-4 border-b border-white/20">
                <p className="font-plus-jakarta text-sm opacity-80 mb-2">
                  Geselecteerde voice-over
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 flex-shrink-0 relative">
                    {selectedVoiceover.profilePhoto ? (
                      <Image
                        src={selectedVoiceover.profilePhoto}
                        alt={selectedVoiceover.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white/60" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-plus-jakarta font-semibold">{selectedVoiceover.name}</p>
                    <button
                      onClick={() => {
                        clearSelection();
                        scrollToVoiceovers();
                      }}
                      className="font-plus-jakarta text-xs underline opacity-80 hover:opacity-100"
                    >
                      Wijzig selectie
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 pb-4 border-b border-white/20">
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
                  <p className="font-plus-jakarta text-sm font-medium mb-2">
                    Selecteer eerst een voice-over
                  </p>
                  <button
                    onClick={scrollToVoiceovers}
                    className="font-plus-jakarta text-sm underline hover:no-underline"
                  >
                    Bekijk beschikbare stemmen
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Summary */}
              <div className="space-y-2 pb-4 border-b border-white/20">
                <div className="flex justify-between text-sm">
                  <span className="font-plus-jakarta">{selectedProduction}</span>
                  <span className="font-plus-jakarta font-semibold">
                    €{currentProduction.price}
                  </span>
                </div>

                {selectedWords &&
                  (currentProduction.itemlistTwo.find((item) => item.item === selectedWords)
                    ?.price ?? 0) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="font-plus-jakarta">{selectedWords}</span>
                      <span className="font-plus-jakarta font-semibold">
                        +€
                        {
                          currentProduction.itemlistTwo.find((item) => item.item === selectedWords)
                            ?.price
                        }
                      </span>
                    </div>
                  )}

                {currentProduction.uitzendgebied && selectedRegion !== 'regionaal' && (
                  <div className="flex justify-between text-sm">
                    <span className="font-plus-jakarta capitalize">{selectedRegion}</span>
                    <span className="font-plus-jakarta font-semibold">
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
                      <span className="font-plus-jakarta">{option}</span>
                      <span className="font-plus-jakarta font-semibold">+€{optionData?.price}</span>
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
                className="text-center py-4"
              >
                <p className="font-plus-jakarta text-sm mb-2">Geschatte prijs</p>
                <p className="font-plus-jakarta text-5xl font-bold">€{calculateTotal}</p>
                <p className="font-plus-jakarta text-xs mt-2 opacity-80">Excl. BTW</p>
              </motion.div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBooking}
                className="w-full bg-white text-primary font-plus-jakarta font-semibold py-4 px-6 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Boeken
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
