'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Sparkles, Volume2, Move } from 'lucide-react';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const productionTypes = [
  { name: 'Videoproductie', price: 175, color: '#3b82f6' },
  { name: 'E-learning', price: 200, color: '#8b5cf6' },
  { name: 'Radiospot', price: 150, color: '#f59e0b' },
  { name: 'TV Commercial', price: 250, color: '#10b981' },
  { name: 'Web Commercial', price: 400, color: '#ef4444' },
  { name: 'Voice Response', price: 150, color: '#ec4899' },
];

const wordRanges = [
  { range: '0 - 250', price: 0 },
  { range: '250 - 500', price: 50 },
  { range: '500 - 1000', price: 150 },
  { range: '1000 - 1500', price: 225 },
  { range: '1500+', price: 350 },
];

const extras = [
  { name: 'Audio Cleanup', price: 50 },
  { name: 'Editing', price: 50 },
  { name: 'Mixage', price: 100 },
  { name: 'Sound Design', price: 100 },
  { name: 'Klantregie', price: 75 },
  { name: 'Copywriting', price: 125 },
  { name: 'Inspreken op beeld', price: 75 },
];

export function PriceCalculatorV4() {
  const [selectedType, setSelectedType] = useState(0);
  const [selectedWords, setSelectedWords] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden ${plusJakarta.className}`}>
      {/* Floating Orbs Background */}
      <div className="fixed inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{
              background: `radial-gradient(circle, ${productionTypes[i]?.color || '#18f109'} 0%, transparent 70%)`,
            }}
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -100, 100, 0],
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
        {/* Floating Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
          style={{
            transform: `translateX(${(mousePosition.x - window.innerWidth / 2) * 0.02}px) translateY(${(mousePosition.y - window.innerHeight / 2) * 0.02}px)`,
          }}
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Voice Calculator 3D
          </h1>
          <p className="text-xl text-gray-400">Drag, select, and build your perfect voice-over</p>
        </motion.div>

        {/* Floating Production Cards */}
        <div className="relative mb-20 h-96">
          <div className="absolute inset-0 flex items-center justify-center">
            {productionTypes.map((type, index) => {
              const angle = (index / productionTypes.length) * 2 * Math.PI;
              const radius = 200;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={type.name}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: selectedType === index ? 1.2 : 1,
                    x,
                    y,
                  }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.3, z: 50 }}
                  onClick={() => setSelectedType(index)}
                  className="absolute cursor-pointer"
                  style={{
                    transform: `translateZ(${selectedType === index ? '50px' : '0px'})`,
                  }}
                >
                  <motion.div
                    className="w-32 h-32 rounded-3xl flex flex-col items-center justify-center p-4 backdrop-blur-xl"
                    style={{
                      background: `linear-gradient(135deg, ${type.color}20, ${type.color}40)`,
                      border: `2px solid ${selectedType === index ? type.color : 'transparent'}`,
                      boxShadow: selectedType === index ? `0 0 30px ${type.color}` : 'none',
                    }}
                    animate={{
                      rotateY: selectedType === index ? 360 : 0,
                    }}
                    transition={{ duration: 1 }}
                  >
                    <Volume2 className="w-8 h-8 mb-2" />
                    <p className="text-xs font-semibold text-center">{type.name}</p>
                    <p className="text-lg font-bold">€{type.price}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Move className="w-8 h-8 text-gray-600 animate-pulse" />
          </div>
        </div>

        {/* Floating Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Word Count Panel */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
            style={{
              transform: `translateY(${Math.sin(Date.now() * 0.001) * 10}px)`,
            }}
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-4">Aantal woorden</h3>
              <div className="space-y-2">
                {wordRanges.map((range, index) => (
                  <motion.button
                    key={range.range}
                    whileHover={{ x: 5 }}
                    onClick={() => setSelectedWords(index)}
                    className={`w-full p-3 rounded-xl transition-all flex justify-between ${
                      selectedWords === index
                        ? 'bg-primary/30 border border-primary'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-sm">{range.range}</span>
                    {range.price > 0 && <span className="text-sm">+€{range.price}</span>}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Extras Panel */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
            style={{
              transform: `translateY(${Math.sin(Date.now() * 0.001 + 2) * 10}px)`,
            }}
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold mb-4">Extra opties</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {extras.map((extra) => (
                  <motion.button
                    key={extra.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (selectedExtras.includes(extra.name)) {
                        setSelectedExtras(selectedExtras.filter(e => e !== extra.name));
                      } else {
                        setSelectedExtras([...selectedExtras, extra.name]);
                      }
                    }}
                    className={`w-full p-3 rounded-xl transition-all flex justify-between text-sm ${
                      selectedExtras.includes(extra.name)
                        ? 'bg-primary/30 border border-primary'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span>{extra.name}</span>
                    <span>+€{extra.price}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Total Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
            style={{
              transform: `translateY(${Math.sin(Date.now() * 0.001 + 4) * 10}px)`,
            }}
          >
            <div className="bg-gradient-to-br from-primary/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-6 border border-primary/50">
              <h3 className="text-xl font-semibold mb-4">Totaal</h3>
              <div className="text-center py-8">
                <motion.div
                  key={total}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-bold mb-4 text-primary"
                >
                  €{total}
                </motion.div>
                <p className="text-sm text-gray-400 mb-6">excl. BTW</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-primary text-black py-3 rounded-2xl font-semibold flex items-center justify-center gap-2"
                >
                  Nu boeken
                  <Sparkles className="w-4 h-4" />
                </motion.button>
              </div>
              <div className="mt-4 p-3 bg-white/5 rounded-xl">
                <p className="text-xs text-center text-gray-400">
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