'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Check, Plus, Minus, ArrowRight } from 'lucide-react';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

interface PriceItem {
  item: string;
  price: number;
}

interface ExtraOption {
  item: string;
  price: number;
  infoText: string;
}

interface ProductionType {
  name: string;
  price: number;
  description: string;
  icon: string;
  color: string;
  itemlistTwo: PriceItem[];
  itemlistThree: ExtraOption[];
  uitzendgebied?: Array<{ name: string; price: number }>;
}

const productionTypes: ProductionType[] = [
  {
    name: 'Videoproductie',
    price: 175,
    description: 'Voor bedrijfsfilms en sociale media',
    icon: '🎬',
    color: 'from-blue-600 to-cyan-600',
    itemlistTwo: [
      { item: '0 - 250', price: 0 },
      { item: '250 - 500', price: 50 },
      { item: '500 - 1000', price: 150 },
      { item: '1000 - 1500', price: 225 },
      { item: '1500+', price: 350 },
    ],
    itemlistThree: [
      { item: 'Audio Cleanup', price: 50, infoText: 'Professionele audio bewerking' },
      { item: 'Editing', price: 100, infoText: 'Video montage en effecten' },
      { item: 'Synchronisatie', price: 75, infoText: 'Perfect getimede ondertiteling' },
    ],
  },
  {
    name: 'E-learning',
    price: 225,
    description: 'Educatieve content met impact',
    icon: '🎓',
    color: 'from-purple-600 to-pink-600',
    itemlistTwo: [
      { item: '0 - 250', price: 0 },
      { item: '250 - 500', price: 50 },
      { item: '500 - 1000', price: 150 },
      { item: '1000 - 1500', price: 225 },
      { item: '1500+', price: 350 },
    ],
    itemlistThree: [
      { item: 'Audio Cleanup', price: 50, infoText: 'Professionele audio bewerking' },
      { item: 'Muziek & SFX', price: 125, infoText: 'Achtergrondmuziek en effecten' },
    ],
  },
  {
    name: 'Radiospot',
    price: 300,
    description: 'Pakkende radioboodschappen',
    icon: '📻',
    color: 'from-orange-600 to-red-600',
    itemlistTwo: [
      { item: '0 - 50', price: 0 },
      { item: '50 - 100', price: 75 },
      { item: '100 - 150', price: 150 },
      { item: '150+', price: 250 },
    ],
    itemlistThree: [
      { item: 'Audio Cleanup', price: 50, infoText: 'Professionele audio bewerking' },
      { item: 'Muziek & SFX', price: 125, infoText: 'Achtergrondmuziek en effecten' },
    ],
    uitzendgebied: [
      { name: 'Lokaal', price: 0 },
      { name: 'Regionaal', price: 150 },
      { name: 'Landelijk', price: 300 },
    ],
  },
];

export function AppleStyleCalculator() {
  const [selectedProduction, setSelectedProduction] = useState(0);
  const [selectedWords, setSelectedWords] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');

  const currentProduction = productionTypes[selectedProduction];

  const calculatePrice = useMemo(() => {
    let total = currentProduction.price;
    total += currentProduction.itemlistTwo[selectedWords].price;
    
    selectedOptions.forEach(option => {
      const extra = currentProduction.itemlistThree.find(e => e.item === option);
      if (extra) total += extra.price;
    });

    if (selectedRegion && currentProduction.uitzendgebied) {
      const region = currentProduction.uitzendgebied.find(r => r.name === selectedRegion);
      if (region) total += region.price;
    }

    return total;
  }, [selectedProduction, selectedWords, selectedOptions, selectedRegion, currentProduction]);

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-white ${plusJakarta.className}`}>
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-light text-gray-900 mb-4">
            Kies je voice-over
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professionele stemmen voor elk project. Transparante prijzen, geen verrassingen.
          </p>
        </motion.div>

        {/* Production Type Selector */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productionTypes.map((type, index) => (
              <motion.button
                key={type.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setSelectedProduction(index);
                  setSelectedWords(0);
                  setSelectedOptions([]);
                  setSelectedRegion('');
                }}
                className={`relative p-8 rounded-3xl transition-all duration-300 ${
                  selectedProduction === index
                    ? 'bg-white shadow-2xl scale-105 border-2 border-gray-200'
                    : 'bg-white/50 hover:bg-white hover:shadow-xl'
                }`}
              >
                <div className="text-5xl mb-4">{type.icon}</div>
                <h3 className="text-2xl font-semibold mb-2">{type.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                <div className="text-3xl font-light">€{type.price}</div>
                <div className="text-sm text-gray-500">vanaf</div>
                {selectedProduction === index && (
                  <motion.div
                    layoutId="selector"
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${type.color} opacity-10`}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Configuration Section */}
        <motion.div
          key={selectedProduction}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-xl p-12 mb-12"
        >
          {/* Word Count */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6">Aantal woorden</h3>
            <div className="flex flex-wrap gap-4">
              {currentProduction.itemlistTwo.map((item, index) => (
                <button
                  key={item.item}
                  onClick={() => setSelectedWords(index)}
                  className={`px-8 py-4 rounded-full text-lg transition-all ${
                    selectedWords === index
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {item.item}
                  {item.price > 0 && (
                    <span className="ml-2 text-sm opacity-70">+€{item.price}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Region Selection */}
          {currentProduction.uitzendgebied && (
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6">Uitzendgebied</h3>
              <div className="flex flex-wrap gap-4">
                {currentProduction.uitzendgebied.map((region) => (
                  <button
                    key={region.name}
                    onClick={() => setSelectedRegion(region.name)}
                    className={`px-8 py-4 rounded-full text-lg transition-all ${
                      selectedRegion === region.name
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {region.name}
                    {region.price > 0 && (
                      <span className="ml-2 text-sm opacity-70">+€{region.price}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extra Options */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Extra opties</h3>
            <div className="space-y-4">
              {currentProduction.itemlistThree.map((option) => (
                <button
                  key={option.item}
                  onClick={() => {
                    if (selectedOptions.includes(option.item)) {
                      setSelectedOptions(selectedOptions.filter(o => o !== option.item));
                    } else {
                      setSelectedOptions([...selectedOptions, option.item]);
                    }
                  }}
                  className={`w-full p-6 rounded-2xl flex items-center justify-between transition-all ${
                    selectedOptions.includes(option.item)
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-lg font-medium">{option.item}</div>
                    <div className={`text-sm mt-1 ${
                      selectedOptions.includes(option.item) ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {option.infoText}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg">+€{option.price}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedOptions.includes(option.item)
                        ? 'bg-white border-white'
                        : 'border-gray-400'
                    }`}>
                      {selectedOptions.includes(option.item) && (
                        <Check className="w-4 h-4 text-gray-900" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Price Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 text-white rounded-3xl p-12 text-center"
        >
          <div className="text-6xl font-light mb-4">€{calculatePrice}</div>
          <p className="text-gray-400 mb-8">Totaal excl. BTW</p>
          <button className="bg-white text-gray-900 px-12 py-4 rounded-full text-lg font-medium hover:scale-105 transition-transform flex items-center gap-2 mx-auto">
            Nu boeken
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}