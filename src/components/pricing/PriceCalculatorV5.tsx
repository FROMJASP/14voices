'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';
import { ArrowRight, Star, Zap, Award } from 'lucide-react';

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
  { name: 'Videoproductie', price: 175, tagline: 'Voor bedrijfsfilms' },
  { name: 'E-learning', price: 200, tagline: 'Educatief & helder' },
  { name: 'Radiospot', price: 150, tagline: 'Pakkend & kort' },
  { name: 'TV Commercial', price: 250, tagline: 'Broadcast kwaliteit' },
  { name: 'Web Commercial', price: 400, tagline: 'Online campagnes' },
  { name: 'Voice Response', price: 150, tagline: 'Telefoon systemen' },
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

export function PriceCalculatorV5() {
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

  return (
    <div className={`min-h-screen bg-[#faf8f3] ${plusJakarta.className}`}>
      {/* Magazine Header */}
      <div className="border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest mb-2">Voice-over Prijzen</p>
              <h1 className={`text-6xl ${instrumentSerif.className}`}>
                De Tarievenkaart
              </h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Seizoen 2024</p>
              <p className="text-3xl font-bold">Nr. 14</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8">
            {/* Production Types - Magazine Style */}
            <div className="mb-12">
              <h2 className={`text-4xl mb-8 ${instrumentSerif.className}`}>
                <span className="bg-primary px-4 py-2 mr-3">01</span>
                Productiesoort
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {productionTypes.map((type, index) => (
                  <motion.button
                    key={type.name}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedType(index)}
                    className={`text-left p-6 border-4 transition-all ${
                      selectedType === index
                        ? 'border-black bg-primary/10'
                        : 'border-transparent bg-white hover:border-gray-300'
                    }`}
                  >
                    <h3 className="text-2xl font-bold mb-1">{type.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 italic">{type.tagline}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-light">€{type.price}</span>
                      <span className="text-sm text-gray-500">basis</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Word Count - Editorial Style */}
            <div className="mb-12">
              <h2 className={`text-4xl mb-8 ${instrumentSerif.className}`}>
                <span className="bg-primary px-4 py-2 mr-3">02</span>
                Tekstlengte
              </h2>
              <div className="bg-white p-8 border-4 border-black">
                <div className="flex justify-between items-center mb-6">
                  {wordRanges.map((range, index) => (
                    <button
                      key={range.range}
                      onClick={() => setSelectedWords(index)}
                      className={`text-center px-4 py-2 transition-all ${
                        selectedWords === index
                          ? 'bg-black text-white scale-110'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <p className="text-sm font-bold">{range.range}</p>
                      {range.price > 0 && (
                        <p className="text-xs mt-1">+€{range.price}</p>
                      )}
                    </button>
                  ))}
                </div>
                <div className="h-4 bg-gray-200 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-black"
                    animate={{ width: `${((selectedWords + 1) / wordRanges.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Extras - Newspaper Classifieds Style */}
            <div>
              <h2 className={`text-4xl mb-8 ${instrumentSerif.className}`}>
                <span className="bg-primary px-4 py-2 mr-3">03</span>
                Extra's
              </h2>
              <div className="bg-white border-4 border-black p-6">
                <div className="grid grid-cols-1 divide-y-2 divide-dashed divide-gray-300">
                  {extras.map((extra) => (
                    <button
                      key={extra.name}
                      onClick={() => {
                        if (selectedExtras.includes(extra.name)) {
                          setSelectedExtras(selectedExtras.filter(e => e !== extra.name));
                        } else {
                          setSelectedExtras([...selectedExtras, extra.name]);
                        }
                      }}
                      className={`py-4 px-2 flex justify-between items-center transition-all ${
                        selectedExtras.includes(extra.name)
                          ? 'bg-yellow-100'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 border-2 border-black ${
                          selectedExtras.includes(extra.name) ? 'bg-black' : 'bg-white'
                        }`} />
                        <span className="font-medium">{extra.name}</span>
                      </div>
                      <span className="font-bold">+€{extra.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4">
            {/* Price Display - Vintage Ad Style */}
            <div className="sticky top-8">
              <div className="bg-black text-white p-8 mb-8">
                <div className="border-4 border-white p-6">
                  <p className="text-sm uppercase tracking-widest mb-2 text-center">Totale Investering</p>
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="absolute -top-4 -left-4">
                        <Star className="w-8 h-8 text-primary fill-primary" />
                      </div>
                      <div className="absolute -bottom-4 -right-4">
                        <Star className="w-8 h-8 text-primary fill-primary" />
                      </div>
                      <div className="text-6xl font-bold">€{total}</div>
                    </div>
                  </div>
                  <p className="text-xs text-center mt-4 uppercase tracking-wider">Exclusief BTW</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-primary text-black py-4 font-bold text-lg border-4 border-black hover:shadow-[8px_8px_0px_0px_#000000] transition-all flex items-center justify-center gap-2"
              >
                BESTEL NU
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              {/* Testimonial Box */}
              <div className="mt-8 bg-white border-4 border-black p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5" />
                  <p className="font-bold">Klantbeoordeling</p>
                </div>
                <p className="italic text-gray-700 mb-2">
                  "Uitstekende kwaliteit en snelle levering. De voice-over gaf onze video precies de professionele uitstraling die we zochten."
                </p>
                <p className="text-sm font-bold">- Marketing Manager, Tech Startup</p>
              </div>

              {/* Contact Box */}
              <div className="mt-8 bg-yellow-100 border-4 border-black p-6">
                <Zap className="w-8 h-8 mb-3" />
                <p className="font-bold mb-2">Vragen over prijzen?</p>
                <p className="text-sm">Neem contact op voor een persoonlijke offerte op maat.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}