'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';
import { Check, ChevronRight } from 'lucide-react';

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

interface ProductionSelectorProps {
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

export function ProductionSelector({ onSelect, selectedProduction }: ProductionSelectorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentProduction = productionData[activeIndex];

  useEffect(() => {
    // Auto-play video when component mounts or activeIndex changes
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [activeIndex]);

  const handleProductionClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleSelect = () => {
    onSelect(activeIndex);
  };

  return (
    <div className={`${plusJakarta.variable} ${instrumentSerif.variable} font-plus-jakarta`}>
      <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
        <span className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black font-bold">
          1
        </span>
        Kies je productie
      </h3>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        {/* Left side - Production List */}
        <div className="lg:w-1/3">
          <div className="space-y-2">
            {productionData.map((production, index) => (
              <motion.div
                key={production.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleProductionClick(index)}
                className={`relative cursor-pointer rounded-lg p-4 transition-all duration-200 ${
                  activeIndex === index
                    ? 'bg-white dark:bg-card shadow-lg ring-2'
                    : 'bg-muted/50 hover:bg-muted'
                }`}
                style={
                  {
                    '--ring-color': activeIndex === index ? production.color : 'transparent',
                    borderColor: activeIndex === index ? production.color : 'transparent',
                  } as React.CSSProperties
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{production.name}</h4>
                    <p className="text-sm text-muted-foreground">vanaf €{production.price}</p>
                  </div>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: production.color }}
                    >
                      <Check className="w-4 h-4 text-black" />
                    </motion.div>
                  )}
                  {activeIndex !== index && (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side - Active Production Card */}
        <div className="lg:w-2/3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white dark:bg-card rounded-xl overflow-hidden shadow-xl"
              style={{
                boxShadow: `0 20px 40px -20px ${currentProduction.color}20`,
              }}
            >
              {/* Video Section */}
              <div className="relative h-64 lg:h-80 overflow-hidden bg-black">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h2 className="text-4xl font-bold mb-2 font-instrument-serif">
                          {currentProduction.name}
                        </h2>
                        <div
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-black"
                          style={{ backgroundColor: currentProduction.color }}
                        >
                          vanaf €{currentProduction.price}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Description Section */}
              <div className="p-8">
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
                  className={`w-full lg:w-auto px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedProduction === activeIndex ? 'text-black' : 'text-black'
                  }`}
                  style={{
                    backgroundColor: currentProduction.color,
                  }}
                >
                  {selectedProduction === activeIndex ? 'Geselecteerd' : 'Selecteer deze productie'}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
