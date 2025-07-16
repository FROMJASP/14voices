// Glassmorphic Variation 4: Floating Glass Card
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Disc } from 'lucide-react';
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

export function VoiceoverCardGlassmorphicV4({ voice, isSelected, onSelect }: VoiceoverCardProps) {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
        {/* Full Black and White Image */}
        {voice.profilePhoto ? (
          <Image
            src={voice.profilePhoto}
            alt={voice.name}
            fill
            className="absolute inset-0 object-cover filter grayscale contrast-110"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-600 to-gray-800" />
        )}

        {/* Subtle Vignette */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Status Dot - Top Left */}
        <div
          className={`absolute top-4 left-4 w-2.5 h-2.5 rounded-full ${
            voice.beschikbaar ? 'bg-green-500' : 'bg-red-500'
          } ring-2 ring-white/20`}
        />

        {/* Large Typography - Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-plus-jakarta text-7xl font-bold text-white text-center leading-tight drop-shadow-2xl">
            {voice.name}
          </h1>
        </div>

        {/* Floating Glass Card - Bottom Center */}
        <div className="absolute bottom-6 left-6 right-6">
          <motion.div
            className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Tags - Compact */}
            <div className="flex gap-2 mb-3 text-xs text-white/70">
              {voice.tags.map((tag, index) => (
                <React.Fragment key={tag}>
                  {index > 0 && <span>·</span>}
                  <span>{tag}</span>
                </React.Fragment>
              ))}
            </div>

            {/* Integrated Player */}
            <div className="space-y-3">
              {/* Current Demo Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Disc className="w-4 h-4 text-white/60 animate-spin-slow" />
                  <span className="text-sm text-white font-medium">
                    {voice.demos[activeDemo].title}
                  </span>
                </div>
                <span className="text-xs text-white/60">{voice.demos[activeDemo].duration}</span>
              </div>

              {/* Progress with Play Button */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </motion.button>

                <div className="flex-1">
                  <div className="relative h-1 bg-white/10 rounded-full">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-white/80 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
                      style={{ left: `calc(${progress}% - 6px)` }}
                    />
                  </div>
                </div>
              </div>

              {/* Demo Dots */}
              <div className="flex justify-center gap-2">
                {voice.demos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveDemo(index);
                      setProgress(0);
                      setIsPlaying(false);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      activeDemo === index ? 'w-4 bg-white' : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>

              {/* Book Button */}
              <motion.button
                whileHover={{ scale: voice.beschikbaar ? 1.02 : 1 }}
                whileTap={{ scale: voice.beschikbaar ? 0.98 : 1 }}
                onClick={onSelect}
                disabled={!voice.beschikbaar}
                className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
                  !voice.beschikbaar
                    ? 'bg-white/5 text-gray-400 cursor-not-allowed'
                    : isSelected
                      ? 'bg-green-500/80 text-white backdrop-blur-sm'
                      : 'bg-white/90 text-gray-900 hover:bg-white backdrop-blur-sm'
                }`}
              >
                {!voice.beschikbaar ? 'Niet beschikbaar' : isSelected ? 'Geboekt ✓' : 'Selecteer'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
