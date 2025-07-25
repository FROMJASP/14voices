'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Check, Info, Sparkles } from 'lucide-react';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const productionTypes = [
  { name: 'Videoproductie', price: 175, color: 'from-blue-500 to-cyan-500' },
  { name: 'E-learning', price: 200, color: 'from-purple-500 to-pink-500' },
  { name: 'Radiospot', price: 150, color: 'from-orange-500 to-red-500' },
  { name: 'TV Commercial', price: 250, color: 'from-green-500 to-teal-500' },
  { name: 'Web Commercial', price: 400, color: 'from-indigo-500 to-purple-500' },
  { name: 'Voice Response', price: 150, color: 'from-yellow-500 to-orange-500' },
];

const wordRanges = [
  { range: '0 - 250', price: 0 },
  { range: '250 - 500', price: 50 },
  { range: '500 - 1000', price: 150 },
  { range: '1000 - 1500', price: 225 },
  { range: '1500+', price: 350 },
];

const extras = [
  { name: 'Audio Cleanup', price: 50, icon: '🎵' },
  { name: 'Editing', price: 50, icon: '✂️' },
  { name: 'Mixage', price: 100, icon: '🎛️' },
  { name: 'Sound Design', price: 100, icon: '🎨' },
  { name: 'Klantregie', price: 75, icon: '🎬' },
  { name: 'Copywriting', price: 125, icon: '✍️' },
  { name: 'Inspreken op beeld', price: 75, icon: '📹' },
];

export function PriceCalculatorV1() {
  const [selectedType, setSelectedType] = useState(0);
  const [selectedWords, setSelectedWords] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const total = useMemo(() => {
    let price = productionTypes[selectedType].price;
    price += wordRanges[selectedWords].price;
    selectedExtras.forEach(extra => {
      const found = extras.find(e => e.name === extra);
      if (found) price += found.price;
    });
    return price;
  }, [selectedType, selectedWords, selectedExtras]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-white ${plusJakarta.className}`}>
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-light text-gray-900 mb-4">
            Bereken je <span className="font-semibold text-primary">voice-over</span> prijs
          </h1>
          <p className="text-xl text-gray-600">
            Transparante prijzen, professionele kwaliteit
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Production Type */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-3xl">1</span>
                Productiesoort
              </h2>
              
              <div className="space-y-3">
                {productionTypes.map((type, index) => (
                  <motion.button
                    key={type.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedType(index)}
                    className={`w-full text-left p-4 rounded-2xl transition-all ${
                      selectedType === index
                        ? 'bg-gradient-to-r text-white shadow-lg transform scale-105'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    style={{
                      backgroundImage: selectedType === index ? `linear-gradient(to right, var(--tw-gradient-stops))` : undefined,
                      '--tw-gradient-from': selectedType === index ? type.color.split(' ')[1] : undefined,
                      '--tw-gradient-to': selectedType === index ? type.color.split(' ')[3] : undefined,
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{type.name}</span>
                      <span className="text-xl font-light">€{type.price}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {selectedType === 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-blue-50 rounded-xl"
                >
                  <p className="text-sm text-gray-700">
                    Videoproducties zijn video's die intern worden gebruikt, bijvoorbeeld als bedrijfsfilm, 
                    of extern via de website of sociale media — zonder inzet van advertentiebudget.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Middle Column - Word Count & Extras */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            {/* Word Count */}
            <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-3xl">2</span>
                Aantal woorden
              </h2>
              
              <div className="space-y-2">
                {wordRanges.map((range, index) => (
                  <button
                    key={range.range}
                    onClick={() => setSelectedWords(index)}
                    className={`w-full p-3 rounded-xl transition-all flex justify-between items-center ${
                      selectedWords === index
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <span>{range.range}</span>
                    {range.price > 0 && (
                      <span className="text-sm">+€{range.price}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-3xl">3</span>
                Extra Opties
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                {extras.map((extra) => (
                  <button
                    key={extra.name}
                    onClick={() => {
                      if (selectedExtras.includes(extra.name)) {
                        setSelectedExtras(selectedExtras.filter(e => e !== extra.name));
                      } else {
                        setSelectedExtras([...selectedExtras, extra.name]);
                      }
                    }}
                    className={`p-3 rounded-xl transition-all flex items-center gap-2 ${
                      selectedExtras.includes(extra.name)
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{extra.icon}</span>
                    <div className="text-left flex-1">
                      <div className="text-sm font-medium">{extra.name}</div>
                      <div className="text-xs opacity-80">+€{extra.price}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-8 shadow-lg sticky top-8">
              <h2 className="text-2xl font-semibold mb-8">Overzicht</h2>
              
              {/* Selected Items */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-300">Productie</span>
                  <span>{productionTypes[selectedType].name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Basis prijs</span>
                  <span>€{productionTypes[selectedType].price}</span>
                </div>
                
                {wordRanges[selectedWords].price > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Woorden ({wordRanges[selectedWords].range})</span>
                    <span>+€{wordRanges[selectedWords].price}</span>
                  </div>
                )}
                
                {selectedExtras.map(extra => {
                  const found = extras.find(e => e.name === extra);
                  return found ? (
                    <div key={extra} className="flex justify-between">
                      <span className="text-gray-300">{found.name}</span>
                      <span>+€{found.price}</span>
                    </div>
                  ) : null;
                })}
              </div>
              
              <div className="border-t border-gray-700 pt-6">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-gray-300">Totaal excl. BTW</span>
                  <span className="text-4xl font-light">€{total}</span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-primary text-black py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2"
                >
                  Nu boeken
                  <Sparkles className="w-5 h-5" />
                </motion.button>
                
                <p className="text-sm text-gray-400 mt-4 text-center">
                  Heb je vragen? Neem contact op voor een persoonlijke offerte.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}