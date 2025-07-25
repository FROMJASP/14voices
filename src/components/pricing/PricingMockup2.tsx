'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, Zap, Users, Building } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PricingTier {
  name: string;
  icon: any;
  basePrice: number;
  pricePerWord: number;
  features: string[];
  color: string;
  description: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Basis',
    icon: Zap,
    basePrice: 25,
    pricePerWord: 0.10,
    features: [
      'Standaard stemmen',
      '48 uur levering',
      'MP3 formaat',
      'Basis revisies',
    ],
    color: 'from-blue-500 to-cyan-500',
    description: 'Voor kleine projecten',
  },
  {
    name: 'Professional',
    icon: Users,
    basePrice: 75,
    pricePerWord: 0.08,
    features: [
      'Premium stemmen',
      '24 uur levering',
      'Alle audio formaten',
      'Onbeperkte revisies',
      'Audio nabewerking',
      'Script consultatie',
    ],
    color: 'from-[#18f109] to-[#efd243]',
    description: 'Meest gekozen',
  },
  {
    name: 'Enterprise',
    icon: Building,
    basePrice: 150,
    pricePerWord: 0.06,
    features: [
      'Exclusieve stemmen',
      'Directe levering',
      'Broadcast kwaliteit',
      'Volledige post-productie',
      'Dedicated producer',
      'Multi-language support',
      'API toegang',
    ],
    color: 'from-purple-500 to-pink-500',
    description: 'Voor grote producties',
  },
];

export function PricingMockup2() {
  const [wordCount, setWordCount] = useState(500);
  const [selectedTier, setSelectedTier] = useState(1); // Default to Professional
  const [animatedPrice, setAnimatedPrice] = useState(0);

  const calculatePrice = (tier: PricingTier) => {
    return tier.basePrice + (wordCount * tier.pricePerWord);
  };

  useEffect(() => {
    const targetPrice = calculatePrice(pricingTiers[selectedTier]);
    const duration = 500;
    const steps = 30;
    const increment = (targetPrice - animatedPrice) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setAnimatedPrice(prev => {
        const newPrice = prev + increment;
        if (currentStep >= steps) {
          clearInterval(timer);
          return targetPrice;
        }
        return newPrice;
      });
    }, duration / steps);

    return () => clearInterval(timer);
  }, [wordCount, selectedTier]);

  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#18f109]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#efd243]/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Plus_Jakarta_Sans']">
            Bereken Je Project Prijs
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Pas de prijs aan op basis van jouw exacte behoeften
          </p>
        </motion.div>

        {/* Interactive Slider Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 mb-12 border border-gray-700"
        >
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left side - Slider controls */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-8">
                Hoeveel woorden heeft je project?
              </h3>
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Aantal woorden</span>
                  <span className="text-3xl font-bold text-white">{wordCount.toLocaleString()}</span>
                </div>
                
                <div className="relative">
                  <input
                    type="range"
                    min="50"
                    max="5000"
                    step="50"
                    value={wordCount}
                    onChange={(e) => setWordCount(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #18f109 0%, #18f109 ${(wordCount / 5000) * 100}%, #374151 ${(wordCount / 5000) * 100}%, #374151 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>50</span>
                    <span>1000</span>
                    <span>2500</span>
                    <span>5000</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Info size={16} />
                  <span>Gemiddelde leestijd: ~{Math.round(wordCount / 150)} minuten</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Info size={16} />
                  <span>Geschatte opnametijd: ~{Math.round(wordCount / 100)} minuten</span>
                </div>
              </div>
            </div>

            {/* Right side - Price display */}
            <div className="flex items-center justify-center">
              <motion.div 
                className="text-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5 }}
                key={animatedPrice}
              >
                <p className="text-gray-400 mb-2">Geschatte prijs</p>
                <div className="relative">
                  <span className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-[#18f109] to-[#efd243] bg-clip-text text-transparent">
                    €{Math.round(animatedPrice)}
                  </span>
                  <motion.div
                    className="absolute -inset-4 bg-gradient-to-r from-[#18f109]/20 to-[#efd243]/20 blur-xl"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <p className="text-gray-400 mt-4">
                  {pricingTiers[selectedTier].name} pakket
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Tier Selection */}
        <div className="grid md:grid-cols-3 gap-6">
          {pricingTiers.map((tier, index) => {
            const Icon = tier.icon;
            const price = calculatePrice(tier);
            
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => setSelectedTier(index)}
                className={`relative cursor-pointer group ${
                  selectedTier === index ? 'ring-2 ring-offset-2 ring-offset-gray-900' : ''
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${tier.color} rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity ${
                  selectedTier === index ? 'opacity-30' : ''
                }`} />
                
                <div className="relative bg-gray-800/80 backdrop-blur rounded-2xl p-6 h-full border border-gray-700 group-hover:border-gray-600 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${tier.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white">{tier.name}</h4>
                        <p className="text-sm text-gray-400">{tier.description}</p>
                      </div>
                    </div>
                    {selectedTier === index && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-gradient-to-r from-[#18f109] to-[#efd243] rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-3xl font-bold text-white">
                      €{Math.round(price)}
                    </p>
                    <p className="text-sm text-gray-400">
                      €{tier.basePrice} basis + €{tier.pricePerWord}/woord
                    </p>
                  </div>

                  <ul className="space-y-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-[#18f109]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-[#18f109] to-[#efd243] text-gray-900 font-semibold rounded-lg hover:shadow-xl hover:shadow-[#18f109]/25 transform hover:scale-105 transition-all duration-300">
            Start Met {pricingTiers[selectedTier].name} Pakket
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Geen creditcard nodig • Direct beginnen • 100% tevredenheidsgarantie
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: #18f109;
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(24, 241, 9, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #18f109;
          cursor: pointer;
          border-radius: 50%;
          border: none;
          box-shadow: 0 0 10px rgba(24, 241, 9, 0.5);
        }
      `}</style>
    </section>
  );
}