'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instrument_Serif, Plus_Jakarta_Sans } from 'next/font/google';
import { ArrowRight, ArrowLeft, Check, Sparkles, Play, FileText, Radio } from 'lucide-react';

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

interface StoryStep {
  id: string;
  title: string;
  subtitle: string;
  illustration: React.ReactNode;
}

const steps: StoryStep[] = [
  {
    id: 'type',
    title: 'Wat voor project heb je?',
    subtitle: 'Elk verhaal begint met een keuze',
    illustration: (
      <div className="relative w-64 h-64 mx-auto">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-blue-500/20 blur-xl"
        />
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Play className="w-10 h-10 text-white" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <FileText className="w-10 h-10 text-white" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Radio className="w-10 h-10 text-white" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-24 h-24 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'length',
    title: 'Hoe lang is je script?',
    subtitle: 'Korte boodschap of uitgebreid verhaal?',
    illustration: (
      <div className="relative w-64 h-64 mx-auto">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 blur-xl"
        />
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ width: 0 }}
                animate={{ width: `${i * 60}px` }}
                transition={{ delay: i * 0.2 }}
                className="h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'extras',
    title: 'Maak het magisch',
    subtitle: 'Voeg extra\'s toe voor een professioneel resultaat',
    illustration: (
      <div className="relative w-64 h-64 mx-auto">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="relative w-48 h-48"
          >
            {[0, 72, 144, 216, 288].map((deg, i) => (
              <motion.div
                key={i}
                className="absolute w-12 h-12 bg-gradient-to-br from-primary to-green-400 rounded-full"
                style={{
                  transform: `rotate(${deg}deg) translateX(80px)`,
                }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    ),
  },
];

const productionTypes = [
  {
    name: 'Videoproductie',
    icon: <Play className="w-8 h-8" />,
    price: 175,
    color: 'from-purple-500 to-pink-500',
    description: 'Perfect voor bedrijfsfilms en sociale media',
  },
  {
    name: 'E-learning',
    icon: <FileText className="w-8 h-8" />,
    price: 225,
    color: 'from-blue-500 to-cyan-500',
    description: 'Educatieve content die blijft hangen',
  },
  {
    name: 'Radiospot',
    icon: <Radio className="w-8 h-8" />,
    price: 300,
    color: 'from-orange-500 to-red-500',
    description: 'Jouw boodschap op de golven',
  },
];

const wordRanges = [
  { label: 'Kort & krachtig', range: '0-250', price: 0 },
  { label: 'Gemiddeld', range: '250-500', price: 50 },
  { label: 'Uitgebreid', range: '500-1000', price: 150 },
  { label: 'Episch', range: '1000+', price: 225 },
];

const extras = [
  { name: 'Audio Cleanup', price: 50, description: 'Kristalhelder geluid' },
  { name: 'Editing', price: 100, description: 'Professionele montage' },
  { name: 'Muziek & SFX', price: 125, description: 'De perfecte sfeer' },
];

export function StorytellingCalculator() {
  const [currentStep, setCurrentStep] = useState(0);
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

  const canProceed = currentStep < steps.length - 1;
  const canGoBack = currentStep > 0;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#fcf9f5] to-white ${plusJakarta.className}`}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                    index <= currentStep
                      ? 'bg-primary text-black'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </motion.div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-4 bg-gray-200 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: index < currentStep ? '100%' : '0%' }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Stap {currentStep + 1} van {steps.length}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-3xl shadow-xl p-12"
          >
            {/* Step Header */}
            <div className="text-center mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-5xl mb-4 ${instrumentSerif.className}`}
              >
                {steps[currentStep].title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-gray-600"
              >
                {steps[currentStep].subtitle}
              </motion.p>
            </div>

            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              {steps[currentStep].illustration}
            </motion.div>

            {/* Step Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {productionTypes.map((type, index) => (
                    <motion.button
                      key={type.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedType(index)}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        selectedType === index
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center text-white mb-4 mx-auto`}>
                        {type.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{type.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{type.description}</p>
                      <div className="text-2xl font-light">€{type.price}</div>
                    </motion.button>
                  ))}
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {wordRanges.map((range, index) => (
                    <motion.button
                      key={range.range}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedWords(index)}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        selectedWords === index
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">
                        {['📝', '📄', '📚', '📖'][index]}
                      </div>
                      <h4 className="font-semibold mb-1">{range.label}</h4>
                      <p className="text-sm text-gray-600 mb-2">{range.range} woorden</p>
                      {range.price > 0 && (
                        <p className="text-primary font-medium">+€{range.price}</p>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  {extras.map((extra) => (
                    <motion.button
                      key={extra.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (selectedExtras.includes(extra.name)) {
                          setSelectedExtras(selectedExtras.filter(e => e !== extra.name));
                        } else {
                          setSelectedExtras([...selectedExtras, extra.name]);
                        }
                      }}
                      className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${
                        selectedExtras.includes(extra.name)
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          selectedExtras.includes(extra.name)
                            ? 'bg-primary text-black'
                            : 'bg-gray-100'
                        }`}>
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold">{extra.name}</h4>
                          <p className="text-sm text-gray-600">{extra.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-semibold">+€{extra.price}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-12">
              <button
                onClick={() => canGoBack && setCurrentStep(currentStep - 1)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                  canGoBack
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!canGoBack}
              >
                <ArrowLeft className="w-5 h-5" />
                Vorige
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Jouw investering</p>
                <p className="text-3xl font-semibold">€{total}</p>
              </div>

              {canProceed ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-full hover:scale-105 transition-all font-medium"
                >
                  Volgende
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-green-400 text-black rounded-full hover:scale-105 transition-all font-semibold shadow-lg">
                  Begin je project
                  <Sparkles className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}