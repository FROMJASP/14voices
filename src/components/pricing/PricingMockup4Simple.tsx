'use client';

import { motion } from 'framer-motion';
import { Check, Star, Sparkles, Headphones, Mic, Radio } from 'lucide-react';
import { useState } from 'react';

interface PricingCard {
  id: string;
  name: string;
  icon: any;
  price: string;
  duration: string;
  description: string;
  features: string[];
  gradient: string;
  popular?: boolean;
}

const pricingCards: PricingCard[] = [
  {
    id: 'starter',
    name: 'Voice Starter',
    icon: Mic,
    price: '€79',
    duration: 'per stem',
    description: 'Perfect voor podcasts en kleine projecten',
    features: [
      'Tot 1000 woorden',
      'Keuze uit 5 stemmen',
      '48 uur levering',
      'WAV & MP3 export',
      'Basis audio editing',
    ],
    gradient: 'from-cyan-400 via-blue-500 to-purple-600',
  },
  {
    id: 'pro',
    name: 'Voice Pro',
    icon: Headphones,
    price: '€199',
    duration: 'per productie',
    description: 'Voor professionele producties',
    features: [
      'Tot 5000 woorden',
      'Alle premium stemmen',
      '24 uur express levering',
      'Alle audio formaten',
      'Geavanceerde post-productie',
      'Muziek & sound effects',
      'Onbeperkte revisies',
    ],
    gradient: 'from-[#18f109] via-[#efd243] to-[#18f109]',
    popular: true,
  },
  {
    id: 'studio',
    name: 'Voice Studio',
    icon: Radio,
    price: '€499',
    duration: 'per campagne',
    description: 'Complete audio productie service',
    features: [
      'Onbeperkt aantal woorden',
      'Exclusieve studio stemmen',
      'Same-day levering',
      'Broadcast kwaliteit',
      'Volledige sound design',
      'Multi-language support',
      'Dedicated audio engineer',
      'API integratie',
    ],
    gradient: 'from-orange-400 via-pink-500 to-purple-600',
  },
];

export function PricingMockup4Simple() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="relative min-h-screen py-24 px-4 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-black" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#18f109]/20 to-[#efd243]/20 backdrop-blur-xl rounded-full px-4 py-2 mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#18f109]" />
            <span className="text-sm font-medium text-gray-300">Nieuwe Prijzen 2024</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-[#18f109] via-[#efd243] to-[#18f109] bg-clip-text text-transparent">
              Premium Voice-Over
            </span>
            <br />
            Pakketten
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Kies je pakket en ervaar de magie van professionele voice-over
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {pricingCards.map((card, index) => {
            const Icon = card.icon;
            
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative group"
              >
                {/* Glow effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-3xl blur-2xl`}
                  animate={{ 
                    scale: hoveredCard === card.id ? 1.2 : 1,
                    opacity: hoveredCard === card.id ? 0.6 : 0.3
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Card */}
                <motion.div 
                  className="relative bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 h-full border border-gray-800 overflow-hidden"
                  whileHover={{ 
                    y: -10,
                    borderColor: 'rgba(255,255,255,0.2)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${card.gradient}`} />

                  {/* Popular badge */}
                  {card.popular && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.2 + 0.5, type: 'spring' }}
                      className="absolute -top-4 -right-4"
                    >
                      <div className="relative">
                        <Star className="w-20 h-20 text-[#efd243] fill-[#efd243]" />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">
                          TOP
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${card.gradient} mb-6`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Title & Description */}
                    <h3 className="text-2xl font-bold text-white mb-2">{card.name}</h3>
                    <p className="text-gray-400 mb-6">{card.description}</p>

                    {/* Price */}
                    <div className="mb-8">
                      <motion.div
                        className="inline-block"
                        animate={{ 
                          scale: hoveredCard === card.id ? [1, 1.05, 1] : 1
                        }}
                        transition={{ duration: 2, repeat: hoveredCard === card.id ? Infinity : 0 }}
                      >
                        <span className={`text-5xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                          {card.price}
                        </span>
                      </motion.div>
                      <span className="text-gray-400 ml-2">{card.duration}</span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {card.features.map((feature, i) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 + i * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className={`p-1 rounded-full bg-gradient-to-r ${card.gradient}`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r ${card.gradient} relative overflow-hidden`}
                    >
                      <span className="relative z-10">
                        {card.popular ? 'Start Nu' : 'Meer Info'}
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-20"
        >
          <p className="text-gray-500 mb-8">
            Alle prijzen zijn exclusief BTW • 30 dagen geld-terug-garantie • Geen verborgen kosten
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-gray-400"
            >
              <div className="w-2 h-2 bg-[#18f109] rounded-full animate-pulse" />
              <span>24/7 Support</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-gray-400"
            >
              <div className="w-2 h-2 bg-[#efd243] rounded-full animate-pulse" />
              <span>Instant Setup</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-gray-400"
            >
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span>API Access</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}