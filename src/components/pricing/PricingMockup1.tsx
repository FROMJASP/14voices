'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
}

const plans: PricingPlan[] = [
  {
    name: 'Starter',
    price: '€49',
    period: 'per project',
    description: 'Perfect voor kleine projecten en beginners',
    features: [
      'Tot 500 woorden',
      '1 voice-over artiest',
      'Standaard levering (48 uur)',
      'MP3 export',
      'Basis ondersteuning',
    ],
    ctaText: 'Start Nu',
  },
  {
    name: 'Professional',
    price: '€149',
    period: 'per project',
    description: 'Ideaal voor professionele producties',
    features: [
      'Tot 2000 woorden',
      'Keuze uit 3 voice-over artiesten',
      'Express levering (24 uur)',
      'WAV + MP3 export',
      'Audio nabewerking',
      'Prioriteit ondersteuning',
    ],
    highlighted: true,
    ctaText: 'Meest Populair',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'op aanvraag',
    description: 'Voor grootschalige projecten en bureaus',
    features: [
      'Onbeperkt aantal woorden',
      'Toegang tot alle artiesten',
      'Directe levering',
      'Alle export formaten',
      'Volledige post-productie',
      'Dedicated account manager',
      'SLA garantie',
    ],
    ctaText: 'Contact Opnemen',
  },
];

export function PricingMockup1() {
  const [billingPeriod, setBillingPeriod] = useState<'project' | 'monthly'>('project');

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#18f109]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#efd243]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-['Plus_Jakarta_Sans']">
            Transparante Prijzen
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kies het pakket dat bij jouw project past. Geen verborgen kosten, altijd duidelijk.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white rounded-full p-1 shadow-lg">
            <button
              onClick={() => setBillingPeriod('project')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingPeriod === 'project'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Per Project
            </button>
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Maandelijks
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="relative group"
            >
              {/* Gradient border effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${
                plan.highlighted 
                  ? 'from-[#18f109] via-[#efd243] to-[#18f109]' 
                  : 'from-gray-200 to-gray-300'
              } p-[2px] ${plan.highlighted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300`}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#18f109] via-[#efd243] to-[#18f109] blur-md opacity-50 animate-pulse" />
              </div>

              {/* Card content */}
              <div className="relative bg-white rounded-2xl p-8 h-full transform transition-transform duration-300 group-hover:-translate-y-1">
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#18f109] to-[#efd243] text-white text-sm font-semibold px-4 py-1 rounded-full flex items-center gap-1">
                      <Sparkles size={14} />
                      Aanbevolen
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#18f109] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-[#18f109] to-[#efd243] text-white hover:shadow-lg hover:shadow-[#18f109]/25 transform hover:scale-105'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}>
                  {plan.ctaText}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gray-600 mb-4">Vertrouwd door meer dan 500+ bedrijven</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50">
            {['RTL', 'NOS', 'Videoland', 'Netflix', 'Spotify'].map((brand) => (
              <div key={brand} className="text-2xl font-bold text-gray-400">
                {brand}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}