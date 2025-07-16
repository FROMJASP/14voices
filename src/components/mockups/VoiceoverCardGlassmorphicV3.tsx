// Glassmorphic Variation 3: Minimal Bottom Overlay
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronUp } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

interface Demo {
  id: string;
  title: string;
  url: string;
  duration: string;
}

interface VoiceoverCardProps {
  voice: {
    id: string;
    name: string;
    profilePhoto?: string | null;
    tags: string[];
    beschikbaar: boolean;
    availabilityText?: string;
    demos: Demo[];
  };
  isSelected: boolean;
  onSelect: () => void;
}

export function VoiceoverCardGlassmorphicV3({ voice, isSelected, onSelect }: VoiceoverCardProps) {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);

  React.useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <motion.div
      className={`${plusJakarta.variable} font-plus-jakarta group`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-xl bg-black">
        {/* Full Image with Black & White Filter */}
        {voice.profilePhoto ? (
          <Image
            src={voice.profilePhoto}
            alt={voice.name}
            fill
            className="absolute inset-0 object-cover filter grayscale brightness-90"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-600 to-gray-800" />
        )}

        {/* Status Dot - Minimal */}
        <div
          className={`absolute top-3 right-3 w-2 h-2 rounded-full ${
            voice.beschikbaar ? 'bg-green-500' : 'bg-red-500'
          }`}
        />

        {/* Bottom Section with Typography */}
        <div className="absolute bottom-0 left-0 right-0">
          {/* Name Section */}
          <div className="px-4 pb-3">
            <h1 className="font-plus-jakarta text-5xl font-bold text-white leading-none mb-2">
              {voice.name}
            </h1>
            <div className="flex gap-2 text-xs text-white/70">
              {voice.tags.map((tag, index) => (
                <React.Fragment key={tag}>
                  {index > 0 && <span>•</span>}
                  <span>{tag}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Minimal Glass Bar */}
          <div className="bg-white/10 backdrop-blur-sm border-t border-white/20">
            <div className="px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setShowPlayer(!showPlayer)}
                className="flex items-center gap-2 text-white/80 hover:text-white text-sm"
              >
                <Play size={14} />
                <span>Luister demo</span>
                <ChevronUp
                  className={`w-4 h-4 transition-transform ${showPlayer ? 'rotate-180' : ''}`}
                />
              </button>

              <motion.button
                whileHover={{ scale: voice.beschikbaar ? 1.05 : 1 }}
                whileTap={{ scale: voice.beschikbaar ? 0.95 : 1 }}
                onClick={onSelect}
                disabled={!voice.beschikbaar}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  !voice.beschikbaar
                    ? 'bg-gray-500/30 text-gray-400 cursor-not-allowed'
                    : isSelected
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                {!voice.beschikbaar ? 'Bezet' : isSelected ? 'Geboekt' : 'Boeken'}
              </motion.button>
            </div>

            {/* Expandable Player */}
            <AnimatePresence>
              {showPlayer && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/10"
                >
                  <div className="p-4 space-y-3">
                    {/* Demo Buttons */}
                    <div className="flex gap-2">
                      {voice.demos.map((demo, index) => (
                        <button
                          key={demo.id}
                          onClick={() => {
                            setActiveDemo(index);
                            setProgress(0);
                            setIsPlaying(false);
                          }}
                          className={`flex-1 py-1.5 px-2 rounded text-xs transition-all ${
                            activeDemo === index
                              ? 'bg-white/20 text-white'
                              : 'text-white/60 hover:text-white/80'
                          }`}
                        >
                          {demo.title}
                        </button>
                      ))}
                    </div>

                    {/* Player Bar */}
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white"
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                      </motion.button>

                      <div className="flex-1">
                        <div className="relative h-0.5 bg-white/20 rounded-full">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-white rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                          <motion.div
                            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full"
                            style={{ left: `calc(${progress}% - 5px)` }}
                          />
                        </div>
                      </div>

                      <span className="text-xs text-white/60">
                        {voice.demos[activeDemo].duration}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
