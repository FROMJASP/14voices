'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';
import { Info, ArrowRight } from 'lucide-react';

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

interface ProductionCardsProps {
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

export function ProductionCards({ onSelect, selectedProduction }: ProductionCardsProps) {
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  useEffect(() => {
    // Auto-play all videos on mount
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video.play().catch(() => {});
      }
    });
  }, []);

  return (
    <div className={`${plusJakarta.variable} ${instrumentSerif.variable} font-plus-jakarta`}>
      <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
        <span className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black font-bold">
          1
        </span>
        Kies je productie
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 max-w-[1400px] mx-auto">
        {productionData.map((production, index) => (
          <motion.div
            key={production.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
            onClick={() => onSelect(index)}
            className="relative group cursor-pointer"
          >
            <motion.div
              className={`relative bg-white dark:bg-card rounded-xl overflow-hidden transition-all duration-300 h-[420px] flex flex-col ${
                selectedProduction === index
                  ? 'ring-2 shadow-xl transform scale-[1.02]'
                  : 'ring-1 ring-border hover:ring-2 hover:shadow-lg'
              }`}
              style={
                {
                  '--ring-color': selectedProduction === index ? production.color : 'transparent',
                  boxShadow:
                    selectedProduction === index
                      ? `0 10px 30px -10px ${production.color}40, 0 0 0 2px ${production.color}`
                      : undefined,
                } as React.CSSProperties
              }
              whileHover={{ y: -2 }}
            >
              {/* Video Header */}
              <div className="relative h-40 overflow-hidden bg-black flex-shrink-0">
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={production.videoUrl}
                  loop
                  muted
                  autoPlay
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />

                {/* Selection Indicator */}
                <AnimatePresence>
                  {selectedProduction === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: production.color }}
                    >
                      <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Price Badge */}
                <div
                  className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-sm font-semibold text-black"
                  style={{ backgroundColor: production.color }}
                >
                  vanaf €{production.price}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col flex-grow">
                {/* Title and Description */}
                <div className="flex-grow">
                  <h4 className="text-lg font-bold mb-3 text-foreground font-instrument-serif">
                    {production.name}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {production.description}
                  </p>
                </div>

                {/* CTA Button - Always visible */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full mt-4 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                    selectedProduction === index
                      ? 'text-black'
                      : 'bg-muted hover:bg-accent text-foreground'
                  }`}
                  style={{
                    backgroundColor: selectedProduction === index ? production.color : undefined,
                  }}
                >
                  <span>
                    {selectedProduction === index ? 'Geselecteerd' : 'Selecteer deze productie'}
                  </span>
                  {selectedProduction !== index && <ArrowRight size={16} />}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Info Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-4 bg-muted/50 rounded-lg flex items-start gap-3"
      >
        <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Kies het type productie dat het beste past bij jouw project. Hover over een kaart om een
          preview te zien en klik om te selecteren.
        </p>
      </motion.div>
    </div>
  );
}
