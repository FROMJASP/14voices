'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Sparkles, Zap, Star, ChevronRight } from 'lucide-react';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

interface ProductionType {
  name: string;
  price: number;
  description: string;
  gradient: string;
  words: Array<{ range: string; price: number }>;
  extras: Array<{ name: string; price: number; icon: React.ReactNode }>;
  regions?: Array<{ name: string; price: number }>;
}

const productions: ProductionType[] = [
  {
    name: 'Videoproductie',
    price: 175,
    description: 'Breng je verhaal tot leven',
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    words: [
      { range: '0-250', price: 0 },
      { range: '250-500', price: 50 },
      { range: '500-1000', price: 150 },
      { range: '1000+', price: 225 },
    ],
    extras: [
      { name: 'Audio Magic', price: 50, icon: <Sparkles className="w-5 h-5" /> },
      { name: 'Video Editing', price: 100, icon: <Zap className="w-5 h-5" /> },
      { name: 'Sync Master', price: 75, icon: <Star className="w-5 h-5" /> },
    ],
  },
  {
    name: 'E-learning',
    price: 225,
    description: 'Educatie met impact',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    words: [
      { range: '0-250', price: 0 },
      { range: '250-500', price: 50 },
      { range: '500-1000', price: 150 },
      { range: '1000+', price: 225 },
    ],
    extras: [
      { name: 'Audio Magic', price: 50, icon: <Sparkles className="w-5 h-5" /> },
      { name: 'Muziek & SFX', price: 125, icon: <Zap className="w-5 h-5" /> },
    ],
  },
  {
    name: 'Radiospot',
    price: 300,
    description: 'Jouw boodschap op de radio',
    gradient: 'from-orange-600 via-red-600 to-pink-600',
    words: [
      { range: '0-50', price: 0 },
      { range: '50-100', price: 75 },
      { range: '100-150', price: 150 },
      { range: '150+', price: 250 },
    ],
    extras: [
      { name: 'Audio Magic', price: 50, icon: <Sparkles className="w-5 h-5" /> },
      { name: 'Muziek & SFX', price: 125, icon: <Zap className="w-5 h-5" /> },
    ],
    regions: [
      { name: 'Lokaal', price: 0 },
      { name: 'Regionaal', price: 150 },
      { name: 'Landelijk', price: 300 },
    ],
  },
];

export function Interactive3DCalculator() {
  const [selectedProd, setSelectedProd] = useState(0);
  const [selectedWord, setSelectedWord] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const current = productions[selectedProd];

  const total = useMemo(() => {
    let price = current.price;
    price += current.words[selectedWord].price;
    
    selectedExtras.forEach(extra => {
      const found = current.extras.find(e => e.name === extra);
      if (found) price += found.price;
    });

    if (selectedRegion && current.regions) {
      const region = current.regions.find(r => r.name === selectedRegion);
      if (region) price += region.price;
    }

    return price;
  }, [selectedProd, selectedWord, selectedExtras, selectedRegion, current]);

  return (
    <div className={`min-h-screen bg-gray-900 text-white overflow-hidden ${plusJakarta.className}`}>
      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${i % 2 ? 'rgba(124, 58, 237, 0.3)' : 'rgba(59, 130, 246, 0.3)'} 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Voice-over Studio
          </h1>
          <p className="text-xl text-gray-300">Creëer magie met professionele stemmen</p>
        </motion.div>

        {/* 3D Production Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 perspective-1000">
          {productions.map((prod, index) => (
            <motion.div
              key={prod.name}
              initial={{ opacity: 0, rotateY: -30 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ delay: index * 0.2 }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => {
                setSelectedProd(index);
                setSelectedWord(0);
                setSelectedExtras([]);
                setSelectedRegion('');
              }}
              style={{
                transform: hoveredCard === index
                  ? 'translateZ(50px) rotateY(5deg) scale(1.05)'
                  : 'translateZ(0) rotateY(0) scale(1)',
                transformStyle: 'preserve-3d',
              }}
              className="relative cursor-pointer transition-all duration-500"
            >
              <div className={`p-8 rounded-3xl bg-gradient-to-br ${prod.gradient} ${
                selectedProd === index ? 'ring-4 ring-white ring-opacity-50' : ''
              }`}>
                <div className="absolute inset-0 rounded-3xl bg-black opacity-30" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-2">{prod.name}</h3>
                  <p className="text-white/80 mb-4">{prod.description}</p>
                  <div className="text-4xl font-light">€{prod.price}</div>
                  <div className="text-sm text-white/60">startprijs</div>
                </div>
                {selectedProd === index && (
                  <motion.div
                    layoutId="selector3d"
                    className="absolute inset-0 rounded-3xl ring-4 ring-white ring-opacity-70"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Configuration Panel */}
        <motion.div
          key={selectedProd}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20"
        >
          {/* Word Count */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-sm">1</span>
              Aantal woorden
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {current.words.map((word, idx) => (
                <motion.button
                  key={word.range}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedWord(idx)}
                  className={`p-4 rounded-2xl font-medium transition-all ${
                    selectedWord === idx
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {word.range}
                  {word.price > 0 && (
                    <div className="text-sm mt-1 opacity-80">+€{word.price}</div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Regions */}
          {current.regions && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-sm">2</span>
                Uitzendgebied
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {current.regions.map((region) => (
                  <motion.button
                    key={region.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedRegion(region.name)}
                    className={`p-4 rounded-2xl font-medium transition-all ${
                      selectedRegion === region.name
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {region.name}
                    {region.price > 0 && (
                      <div className="text-sm mt-1 opacity-80">+€{region.price}</div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Extras */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-sm">
                {current.regions ? '3' : '2'}
              </span>
              Extra features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {current.extras.map((extra) => {
                const isSelected = selectedExtras.includes(extra.name);
                return (
                  <motion.button
                    key={extra.name}
                    whileHover={{ scale: 1.02, rotateY: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedExtras(selectedExtras.filter(e => e !== extra.name));
                      } else {
                        setSelectedExtras([...selectedExtras, extra.name]);
                      }
                    }}
                    className={`p-6 rounded-2xl transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-white/20' : 'bg-white/10'
                        }`}>
                          {extra.icon}
                        </div>
                        <span className="font-medium">{extra.name}</span>
                      </div>
                      <span className="font-bold">+€{extra.price}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Price Display */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 p-1 rounded-3xl">
            <div className="bg-gray-900 rounded-3xl px-12 py-8">
              <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                €{total}
              </div>
              <p className="text-gray-400 mb-6">Totale investering</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 mx-auto"
              >
                Start je project
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}