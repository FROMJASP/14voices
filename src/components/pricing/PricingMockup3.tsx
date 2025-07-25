'use client';

import { motion } from 'framer-motion';
import { Check, X, Minus, Info } from 'lucide-react';
import { useState } from 'react';

interface Feature {
  name: string;
  tooltip?: string;
  starter: boolean | 'limited';
  professional: boolean | 'limited';
  enterprise: boolean | 'limited';
}

const features: Feature[] = [
  {
    name: 'Aantal woorden',
    starter: 'Tot 500',
    professional: 'Tot 2000',
    enterprise: 'Onbeperkt',
  },
  {
    name: 'Voice-over artiesten',
    starter: '1 artiest',
    professional: '3 artiesten',
    enterprise: 'Alle artiesten',
  },
  {
    name: 'Levertijd',
    starter: '48 uur',
    professional: '24 uur',
    enterprise: 'Direct',
  },
  {
    name: 'Audio formaten',
    starter: 'MP3',
    professional: 'MP3, WAV',
    enterprise: 'Alle formaten',
  },
  {
    name: 'Revisies',
    tooltip: 'Aantal keer dat je aanpassingen kunt vragen',
    starter: '2 revisies',
    professional: 'Onbeperkt',
    enterprise: 'Onbeperkt',
  },
  {
    name: 'Audio nabewerking',
    tooltip: 'Professionele audio editing en mixing',
    starter: false,
    professional: true,
    enterprise: true,
  },
  {
    name: 'Muziek & SFX',
    starter: false,
    professional: 'Basis library',
    enterprise: 'Premium library',
  },
  {
    name: 'Script consultatie',
    tooltip: 'Hulp bij het optimaliseren van je script',
    starter: false,
    professional: true,
    enterprise: true,
  },
  {
    name: 'Dedicated producer',
    starter: false,
    professional: false,
    enterprise: true,
  },
  {
    name: 'Multi-language',
    starter: false,
    professional: false,
    enterprise: true,
  },
  {
    name: 'API toegang',
    tooltip: 'Integreer met je eigen systemen',
    starter: false,
    professional: false,
    enterprise: true,
  },
  {
    name: 'SLA garantie',
    starter: false,
    professional: false,
    enterprise: true,
  },
];

export function PricingMockup3() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'professional' | 'enterprise'>('professional');

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-[#18f109]" />
      ) : (
        <X className="w-5 h-5 text-gray-300" />
      );
    }
    return <span className="text-sm font-medium text-gray-900">{value}</span>;
  };

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-['Plus_Jakarta_Sans']">
            Vergelijk Onze Pakketten
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Alle functies overzichtelijk op een rij
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="overflow-x-auto"
        >
          <div className="min-w-[800px]">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 mb-2">
              <div className="col-span-1" />
              
              {/* Starter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setSelectedPlan('starter')}
                className={`cursor-pointer rounded-t-2xl p-6 text-center transition-all ${
                  selectedPlan === 'starter' 
                    ? 'bg-gray-100 shadow-lg scale-105' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">€49</span>
                  <span className="text-gray-600 text-sm block">per project</span>
                </div>
                <button className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                  selectedPlan === 'starter'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}>
                  Kies Starter
                </button>
              </motion.div>

              {/* Professional */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => setSelectedPlan('professional')}
                className={`cursor-pointer rounded-t-2xl p-6 text-center transition-all relative ${
                  selectedPlan === 'professional' 
                    ? 'bg-gradient-to-br from-[#18f109]/10 to-[#efd243]/10 shadow-xl scale-105 ring-2 ring-[#18f109]' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                {selectedPlan === 'professional' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#18f109] to-[#efd243] text-white text-xs font-semibold px-3 py-1 rounded-full">
                      POPULAIR
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">Professional</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">€149</span>
                  <span className="text-gray-600 text-sm block">per project</span>
                </div>
                <button className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                  selectedPlan === 'professional'
                    ? 'bg-gradient-to-r from-[#18f109] to-[#efd243] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}>
                  Kies Professional
                </button>
              </motion.div>

              {/* Enterprise */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => setSelectedPlan('enterprise')}
                className={`cursor-pointer rounded-t-2xl p-6 text-center transition-all ${
                  selectedPlan === 'enterprise' 
                    ? 'bg-gray-900 text-white shadow-xl scale-105' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <h3 className={`text-xl font-bold mb-2 ${
                  selectedPlan === 'enterprise' ? 'text-white' : 'text-gray-900'
                }`}>Enterprise</h3>
                <div className="mb-4">
                  <span className={`text-3xl font-bold ${
                    selectedPlan === 'enterprise' ? 'text-white' : 'text-gray-900'
                  }`}>Custom</span>
                  <span className={`text-sm block ${
                    selectedPlan === 'enterprise' ? 'text-gray-300' : 'text-gray-600'
                  }`}>op aanvraag</span>
                </div>
                <button className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                  selectedPlan === 'enterprise'
                    ? 'bg-white text-gray-900'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}>
                  Contact
                </button>
              </motion.div>
            </div>

            {/* Feature Rows */}
            <div className="bg-gray-50 rounded-b-2xl overflow-hidden">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`grid grid-cols-4 gap-4 px-4 py-4 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-100 transition-colors`}
                  onMouseEnter={() => setHoveredFeature(feature.name)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">{feature.name}</span>
                    {feature.tooltip && (
                      <div className="relative">
                        <Info className="w-4 h-4 text-gray-400" />
                        {hoveredFeature === feature.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10"
                          >
                            {feature.tooltip}
                            <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex justify-center items-center ${
                    selectedPlan === 'starter' ? 'font-semibold' : ''
                  }`}>
                    {renderFeatureValue(feature.starter)}
                  </div>
                  
                  <div className={`flex justify-center items-center ${
                    selectedPlan === 'professional' ? 'font-semibold' : ''
                  }`}>
                    {renderFeatureValue(feature.professional)}
                  </div>
                  
                  <div className={`flex justify-center items-center ${
                    selectedPlan === 'enterprise' ? 'font-semibold' : ''
                  }`}>
                    {renderFeatureValue(feature.enterprise)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">
            Niet zeker welk pakket bij je past? Wij helpen je graag!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-gradient-to-r from-[#18f109] to-[#efd243] text-white font-semibold rounded-lg hover:shadow-lg transition-all">
              Start Gratis Proef
            </button>
            <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-all">
              Plan een Gesprek
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}