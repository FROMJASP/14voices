'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';
import { ChevronRight, Circle, CheckCircle2 } from 'lucide-react';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
});

const productionTypes = [
  { name: 'Videoproductie', price: 175 },
  { name: 'E-learning', price: 200 },
  { name: 'Radiospot', price: 150 },
  { name: 'TV Commercial', price: 250 },
  { name: 'Web Commercial', price: 400 },
  { name: 'Voice Response', price: 150 },
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

export function PriceCalculatorV3() {
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

  const steps = [
    { title: 'Productiesoort', subtitle: 'Kies je type project' },
    { title: 'Aantal woorden', subtitle: 'Hoeveel tekst heb je?' },
    { title: 'Extra opties', subtitle: 'Maak het perfect' },
    { title: 'Overzicht', subtitle: 'Bevestig je keuze' },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-b from-white to-gray-50 ${plusJakarta.className}`}>
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className={`text-6xl mb-4 ${instrumentSerif.className}`}>
            Jouw voice-over reis
          </h1>
          <p className="text-xl text-gray-600">In 4 eenvoudige stappen naar je perfecte voice-over</p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mb-16">
          <div className="absolute left-0 right-0 top-8 h-1 bg-gray-200">
            <motion.div
              className="absolute left-0 top-0 h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  onClick={() => index <= currentStep && setCurrentStep(index)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer transition-all ${
                    index <= currentStep
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : (
                    <span className="text-xl font-semibold">{index + 1}</span>
                  )}
                </motion.div>
                <h3 className={`font-semibold ${index === currentStep ? 'text-primary' : 'text-gray-600'}`}>
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{step.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl shadow-xl p-12"
          >
            {/* Step 1: Production Type */}
            {currentStep === 0 && (
              <div>
                <h2 className="text-3xl font-semibold mb-8">Kies je productiesoort</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {productionTypes.map((type, index) => (
                    <motion.button
                      key={type.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedType(index)}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        selectedType === index
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="text-lg font-semibold mb-2">{type.name}</h3>
                      <p className="text-3xl font-light text-primary">€{type.price}</p>
                    </motion.button>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentStep(1)}
                  className="mt-8 bg-primary text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 ml-auto"
                >
                  Volgende stap
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            )}

            {/* Step 2: Word Count */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-3xl font-semibold mb-8">Hoeveel woorden bevat je tekst?</h2>
                <div className="space-y-4">
                  {wordRanges.map((range, index) => (
                    <motion.button
                      key={range.range}
                      whileHover={{ x: 10 }}
                      onClick={() => setSelectedWords(index)}
                      className={`w-full p-6 rounded-2xl border-2 transition-all flex justify-between items-center ${
                        selectedWords === index
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-lg">{range.range} woorden</span>
                      {range.price > 0 && (
                        <span className="text-lg text-primary">+€{range.price}</span>
                      )}
                    </motion.button>
                  ))}
                </div>
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="text-gray-600 px-6 py-3 rounded-full hover:bg-gray-100 transition-all"
                  >
                    Vorige
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(2)}
                    className="bg-primary text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2"
                  >
                    Volgende stap
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            )}

            {/* Step 3: Extras */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-3xl font-semibold mb-8">Selecteer extra opties</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className={`p-6 rounded-2xl border-2 transition-all flex justify-between items-center ${
                        selectedExtras.includes(extra.name)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {selectedExtras.includes(extra.name) ? (
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400" />
                        )}
                        <span className="text-lg">{extra.name}</span>
                      </div>
                      <span className="text-lg text-primary">+€{extra.price}</span>
                    </motion.button>
                  ))}
                </div>
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-gray-600 px-6 py-3 rounded-full hover:bg-gray-100 transition-all"
                  >
                    Vorige
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(3)}
                    className="bg-primary text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2"
                  >
                    Bekijk overzicht
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            )}

            {/* Step 4: Summary */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-3xl font-semibold mb-8">Jouw voice-over pakket</h2>
                <div className="bg-gray-50 rounded-2xl p-8 mb-8">
                  <div className="space-y-4">
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600">Productiesoort</span>
                      <span className="font-semibold">{productionTypes[selectedType].name}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600">Basis prijs</span>
                      <span className="font-semibold">€{productionTypes[selectedType].price}</span>
                    </div>
                    {wordRanges[selectedWords].price > 0 && (
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-600">Woorden ({wordRanges[selectedWords].range})</span>
                        <span className="font-semibold">+€{wordRanges[selectedWords].price}</span>
                      </div>
                    )}
                    {selectedExtras.map(extra => {
                      const found = extras.find(e => e.name === extra);
                      return found ? (
                        <div key={extra} className="flex justify-between text-lg">
                          <span className="text-gray-600">{found.name}</span>
                          <span className="font-semibold">+€{found.price}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                  <div className="border-t border-gray-300 mt-6 pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xl text-gray-600">Totaal excl. BTW</span>
                      <span className="text-4xl font-bold text-primary">€{total}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-gray-600 px-6 py-3 rounded-full hover:bg-gray-100 transition-all"
                  >
                    Aanpassen
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary text-white px-12 py-4 rounded-full font-semibold text-lg"
                  >
                    Nu boeken
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}