'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Gem, Crown, Star, Plus, Check, ArrowUpRight } from 'lucide-react';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

interface ProductionTier {
  name: string;
  icon: React.ReactNode;
  basePrice: number;
  description: string;
  gradient: string;
  features: string[];
  wordTiers: Array<{ range: string; multiplier: number }>;
}

const tiers: ProductionTier[] = [
  {
    name: 'Essential',
    icon: <Star className="w-6 h-6" />,
    basePrice: 175,
    description: 'Perfect voor starters',
    gradient: 'from-emerald-400/20 to-teal-400/20',
    features: ['Professionele stem', 'WAV bestand', '1 revisie'],
    wordTiers: [
      { range: '0-250', multiplier: 1 },
      { range: '250-500', multiplier: 1.3 },
      { range: '500+', multiplier: 1.8 },
    ],
  },
  {
    name: 'Professional',
    icon: <Crown className="w-6 h-6" />,
    basePrice: 300,
    description: 'De populaire keuze',
    gradient: 'from-purple-400/20 to-pink-400/20',
    features: ['Premium stem selectie', 'Audio mastering', '3 revisies', 'Snelle levering'],
    wordTiers: [
      { range: '0-250', multiplier: 1 },
      { range: '250-500', multiplier: 1.25 },
      { range: '500+', multiplier: 1.7 },
    ],
  },
  {
    name: 'Enterprise',
    icon: <Gem className="w-6 h-6" />,
    basePrice: 500,
    description: 'Volledig maatwerk',
    gradient: 'from-amber-400/20 to-orange-400/20',
    features: ['Exclusieve stemmen', 'Full production', 'Onbeperkte revisies', 'Priority support', 'Multi-format export'],
    wordTiers: [
      { range: '0-500', multiplier: 1 },
      { range: '500-1000', multiplier: 1.2 },
      { range: '1000+', multiplier: 1.5 },
    ],
  },
];

const addons = [
  { name: 'Muziek compositie', price: 250, description: 'Originele muziek op maat' },
  { name: 'Sound design', price: 150, description: 'Professionele geluidseffecten' },
  { name: 'Meerdere talen', price: 200, description: 'Vertaling en opname' },
  { name: 'Video sync', price: 100, description: 'Perfecte timing met beeld' },
];

export function GlassmorphismCalculator() {
  const [selectedTier, setSelectedTier] = useState(1);
  const [selectedWords, setSelectedWords] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);

  const currentTier = tiers[selectedTier];

  const totalPrice = useMemo(() => {
    let price = currentTier.basePrice * currentTier.wordTiers[selectedWords].multiplier;
    
    selectedAddons.forEach(addon => {
      const found = addons.find(a => a.name === addon);
      if (found) price += found.price;
    });

    return Math.round(price);
  }, [selectedTier, selectedWords, selectedAddons, currentTier]);

  return (
    <div className={`min-h-screen bg-black text-white overflow-hidden ${plusJakarta.className}`}>
      {/* Animated gradient background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-blue-900/30" />
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-7xl font-light mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Premium Voice-overs
            </span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Exclusieve stemmen voor merken die excelleren
          </p>
        </motion.div>

        {/* Tier Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredTier(index)}
              onMouseLeave={() => setHoveredTier(null)}
              onClick={() => setSelectedTier(index)}
              className="relative cursor-pointer"
            >
              {/* Glass card */}
              <div className={`relative p-8 rounded-3xl backdrop-blur-xl transition-all duration-500 ${
                selectedTier === index
                  ? 'bg-white/20 scale-105'
                  : 'bg-white/10 hover:bg-white/15'
              }`}>
                {/* Border gradient */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${tier.gradient} opacity-50`} />
                <div className="absolute inset-[1px] rounded-3xl bg-black/40 backdrop-blur-xl" />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center mb-6`}>
                    {tier.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-semibold mb-2">{tier.name}</h3>
                  <p className="text-white/60 mb-6">{tier.description}</p>
                  
                  {/* Price */}
                  <div className="mb-8">
                    <span className="text-4xl font-light">€{tier.basePrice}</span>
                    <span className="text-white/40 ml-2">vanaf</span>
                  </div>
                  
                  {/* Features */}
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Selection indicator */}
                {selectedTier === index && (
                  <motion.div
                    layoutId="tierSelector"
                    className="absolute inset-0 rounded-3xl ring-2 ring-white/50"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Configuration */}
        <motion.div
          key={selectedTier}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-16"
        >
          {/* Word count selection */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-8">
            <h3 className="text-2xl font-semibold mb-6">Script lengte</h3>
            <div className="grid grid-cols-3 gap-4">
              {currentTier.wordTiers.map((wordTier, index) => (
                <button
                  key={wordTier.range}
                  onClick={() => setSelectedWords(index)}
                  className={`p-6 rounded-2xl backdrop-blur-xl transition-all ${
                    selectedWords === index
                      ? 'bg-white/20 ring-2 ring-white/50'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-lg font-medium mb-2">{wordTier.range} woorden</div>
                  <div className="text-sm text-white/60">
                    {wordTier.multiplier > 1 && `${((wordTier.multiplier - 1) * 100).toFixed(0)}% toeslag`}
                    {wordTier.multiplier === 1 && 'Basis tarief'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <h3 className="text-2xl font-semibold mb-6">Premium add-ons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addons.map((addon) => (
                <button
                  key={addon.name}
                  onClick={() => {
                    if (selectedAddons.includes(addon.name)) {
                      setSelectedAddons(selectedAddons.filter(a => a !== addon.name));
                    } else {
                      setSelectedAddons([...selectedAddons, addon.name]);
                    }
                  }}
                  className={`p-6 rounded-2xl backdrop-blur-xl transition-all flex items-center justify-between ${
                    selectedAddons.includes(addon.name)
                      ? 'bg-white/20 ring-2 ring-white/50'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium mb-1">{addon.name}</div>
                    <div className="text-sm text-white/60">{addon.description}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">+€{addon.price}</span>
                    <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                      selectedAddons.includes(addon.name)
                        ? 'bg-white border-white'
                        : 'border-white/40'
                    }`}>
                      {selectedAddons.includes(addon.name) && (
                        <Check className="w-full h-full p-0.5 text-black" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Price summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-block">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-[1px] rounded-3xl">
              <div className="bg-black/80 backdrop-blur-xl rounded-3xl p-12">
                <p className="text-white/60 mb-2">Jouw investering</p>
                <div className="text-7xl font-light mb-8 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  €{totalPrice}
                </div>
                <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-medium transition-all hover:scale-105">
                  <span className="flex items-center gap-2">
                    Start premium project
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}