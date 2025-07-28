'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

interface ProductionType {
  name: string;
  price: number;
  description: string;
  videoUrl: string;
  color: string;
  accentColor: string;
}

interface ProductionTabsProps {
  onSelect: (index: number) => void;
  selectedProduction: number | null;
}

const productionData: ProductionType[] = [
  {
    name: 'Videoproductie',
    price: 175,
    description:
      "Videoproducties zijn video's voor intern gebruik of online plaatsing, zonder advertentiebudget. Bij inzet als betaalde advertentie kies je voor 'Web Commercial'.",
    videoUrl: '/videos/videoproductie.mp4',
    color: '#18f109',
    accentColor: '#14c007',
  },
  {
    name: 'E-learning',
    price: 200,
    description:
      "E-learning video's worden gebruikt voor training, onboarding of instructie, bedoeld voor intern of educatief gebruik — niet als promotie of advertentie.",
    videoUrl: '/videos/e-learning.mp4',
    color: '#4b9eff',
    accentColor: '#3a8de8',
  },
  {
    name: 'Radiospots',
    price: 150,
    description:
      'Radiospots worden uitgezonden via radio of streamingdiensten met als doel een product, dienst of merk te promoten.',
    videoUrl: '/videos/radiospot.mp4',
    color: '#ff6b6b',
    accentColor: '#e85d5d',
  },
  {
    name: 'TV Commercial',
    price: 200,
    description:
      'TV commercials zijn professionele producties voor televisie-uitzending. Met hoge broadcast kwaliteit, geschikt voor nationale campagnes.',
    videoUrl: '/videos/tv-commercial.mp4',
    color: '#a78bfa',
    accentColor: '#9775f5',
  },
  {
    name: 'Web Commercial',
    price: 175,
    description:
      'Web commercials zijn online video-advertenties voor betaalde campagnes op social media, YouTube, Google Display en andere online platformen.',
    videoUrl: '/videos/web-commercial.mp4',
    color: '#f59e0b',
    accentColor: '#dc8a09',
  },
  {
    name: 'Voice Response',
    price: 150,
    description: "Voice Response wordt gebruikt voor keuzemenu's (IVR), voicemails en wachtrijen.",
    videoUrl: '/videos/voice-response.mp4',
    color: '#10b981',
    accentColor: '#0ea571',
  },
];

export function ProductionTabs({ onSelect, selectedProduction }: ProductionTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentProduction = productionData[activeTab];

  useEffect(() => {
    // Auto-play video when component mounts or activeTab changes
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [activeTab]);

  const handleSelect = () => {
    onSelect(activeTab);
  };

  return (
    <div className={`${plusJakarta.variable} ${instrumentSerif.variable} font-plus-jakarta`}>
      <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
        <span className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black font-bold">
          1
        </span>
        Kies je productie
      </h3>

      {/* Tabs Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-lg">
          {productionData.map((production, index) => (
            <motion.button
              key={production.name}
              onClick={() => setActiveTab(index)}
              className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === index
                  ? 'text-black shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{
                backgroundColor: activeTab === index ? production.color : 'transparent',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {production.name}
              <span className="hidden sm:inline ml-2 text-xs opacity-70">€{production.price}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative bg-white dark:bg-card rounded-xl overflow-hidden shadow-xl max-w-4xl mx-auto"
          style={{
            boxShadow: `0 20px 40px -20px ${currentProduction.color}20`,
          }}
        >
          {/* Video Header */}
          <div className="relative h-64 sm:h-80 overflow-hidden bg-black">
            <video
              ref={videoRef}
              src={currentProduction.videoUrl}
              loop
              muted
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold mb-3 font-instrument-serif">
                  {currentProduction.name}
                </h2>
                <div
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-black"
                  style={{ backgroundColor: currentProduction.color }}
                >
                  vanaf €{currentProduction.price}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-6 sm:p-8">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base text-muted-foreground leading-relaxed mb-6"
            >
              {currentProduction.description}
            </motion.p>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSelect}
              className={`w-full sm:w-auto px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedProduction === activeTab ? 'text-black ring-2 ring-offset-2' : 'text-black'
              }`}
              style={
                {
                  backgroundColor: currentProduction.color,
                  '--tw-ring-color': currentProduction.color,
                } as React.CSSProperties
              }
            >
              {selectedProduction === activeTab ? '✓ Geselecteerd' : 'Selecteer deze productie'}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
