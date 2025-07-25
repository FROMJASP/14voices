'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Check, Plus, Minus, ArrowRight, Zap } from 'lucide-react';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const productionTypes = [
  { name: 'Videoproductie', price: 175, icon: '🎬', description: 'Bedrijfsfilms & sociale media' },
  { name: 'E-learning', price: 200, icon: '📚', description: 'Educatieve content' },
  { name: 'Radiospot', price: 150, icon: '📻', description: 'Radio commercials' },
  { name: 'TV Commercial', price: 250, icon: '📺', description: 'Televisie reclame' },
  { name: 'Web Commercial', price: 400, icon: '🌐', description: 'Online advertenties' },
  { name: 'Voice Response', price: 150, icon: '📞', description: 'IVR systemen' },
];

const wordRanges = [
  { range: '0 - 250', price: 0, color: '#10b981' },
  { range: '250 - 500', price: 50, color: '#3b82f6' },
  { range: '500 - 1000', price: 150, color: '#8b5cf6' },
  { range: '1000 - 1500', price: 225, color: '#f59e0b' },
  { range: '1500+', price: 350, color: '#ef4444' },
];

const extras = [
  { name: 'Audio Cleanup', price: 50, description: 'Professionele audio nabewerking' },
  { name: 'Editing', price: 50, description: 'Montage en timing' },
  { name: 'Mixage', price: 100, description: 'Audio mixing en mastering' },
  { name: 'Sound Design', price: 100, description: 'Geluidseffecten en sfeer' },
  { name: 'Klantregie', price: 75, description: 'Persoonlijke begeleiding' },
  { name: 'Copywriting', price: 125, description: 'Tekst schrijven' },
  { name: 'Inspreken op beeld', price: 75, description: 'Lipsync voice-over' },
];

export function PriceCalculatorV2() {
  const [selectedType, setSelectedType] = useState(0);
  const [selectedWords, setSelectedWords] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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
    <div className={`min-h-screen bg-black text-white ${plusJakarta.className}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-600/20" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-4">
            Voice-over <span className="text-primary">Calculator</span>
          </h1>
          <p className="text-xl text-gray-400">Bereken direct je investering</p>
        </motion.div>

        {/* Production Type Cards */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
            <span className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black font-bold">1</span>
            Kies je productie
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {productionTypes.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setSelectedType(index)}
                className="relative cursor-pointer"
              >
                <motion.div
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    selectedType === index
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                  }`}
                  animate={{
                    y: hoveredCard === index ? -5 : 0,
                  }}
                >
                  <div className="text-4xl mb-4">{type.icon}</div>
                  <h3 className="text-xl font-semibold mb-1">{type.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{type.description}</p>
                  <div className="text-2xl font-light">€{type.price}</div>
                  
                  {selectedType === index && (
                    <motion.div
                      layoutId="selector"
                      className="absolute -inset-px rounded-2xl border-2 border-primary"
                    />
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Word Count Slider */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
            <span className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black font-bold">2</span>
            Aantal woorden
          </h2>
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-800">
            <div className="flex justify-between mb-4">
              {wordRanges.map((range, index) => (
                <button
                  key={range.range}
                  onClick={() => setSelectedWords(index)}
                  className={`text-center transition-all ${
                    selectedWords === index ? 'scale-110' : 'opacity-50'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: range.color }}
                  />
                  <div className="text-sm">{range.range}</div>
                  {range.price > 0 && (
                    <div className="text-xs text-gray-400">+€{range.price}</div>
                  )}
                </button>
              ))}
            </div>
            <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 via-blue-500 to-red-500"
                initial={{ width: '0%' }}
                animate={{ width: `${((selectedWords + 1) / wordRanges.length) * 100}%` }}
                transition={{ type: 'spring', damping: 20 }}
              />
            </div>
          </div>
        </div>

        {/* Extra Options */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
            <span className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black font-bold">3</span>
            Extra opties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extras.map((extra) => {
              const isSelected = selectedExtras.includes(extra.name);
              return (
                <motion.button
                  key={extra.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedExtras(selectedExtras.filter(e => e !== extra.name));
                    } else {
                      setSelectedExtras([...selectedExtras, extra.name]);
                    }
                  }}
                  className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                  }`}
                >
                  <div className="text-left">
                    <h4 className="font-semibold mb-1">{extra.name}</h4>
                    <p className="text-sm text-gray-400">{extra.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">+€{extra.price}</span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-primary text-black'
                        : 'bg-gray-800'
                    }`}>
                      {isSelected ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Total & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-block bg-gradient-to-r from-gray-900 to-gray-800 p-1 rounded-3xl">
            <div className="bg-black rounded-3xl px-12 py-8">
              <p className="text-gray-400 mb-2">Totale investering</p>
              <div className="text-6xl font-bold mb-6 text-primary">€{total}</div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-black px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 mx-auto"
              >
                Start je project
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}