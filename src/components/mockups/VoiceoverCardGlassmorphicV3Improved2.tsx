// Glassmorphic V3 Improved 2: Floating Glass with Stacked Tags
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700', '800'],
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

export function VoiceoverCardGlassmorphicV3Improved2({
  voice,
  isSelected,
  onSelect,
}: VoiceoverCardProps) {
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

  const handlePlayClick = () => {
    if (!showPlayer) {
      setShowPlayer(true);
      setTimeout(() => setIsPlaying(true), 300);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      className={`${plusJakarta.variable} font-plus-jakarta group`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl bg-gray-900">
        {/* Full Image with Grayscale */}
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

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* Status Dot - Bigger with Animation */}
        <motion.div
          animate={{ scale: voice.beschikbaar ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute top-4 right-4 w-4 h-4 rounded-full ${
            voice.beschikbaar ? 'bg-green-500' : 'bg-red-500'
          } shadow-lg`}
        />

        {/* Typography and Tags */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Name with Shadow */}
          <h1
            className="font-plus-jakarta text-7xl font-extrabold text-white leading-[0.85] mb-4"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
          >
            {voice.name}
          </h1>

          {/* Stacked Tags */}
          <div className="flex flex-col gap-1 mb-6">
            {voice.tags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-sm text-white/70"
              >
                {tag}
              </motion.div>
            ))}
          </div>

          {/* Floating Glass Card */}
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Control Bar */}
            <div className="p-4 flex items-center justify-between">
              <button onClick={handlePlayClick} className="flex items-center gap-3 group/play">
                <motion.div
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover/play:scale-110 transition-transform"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isPlaying ? (
                    <Pause size={20} className="text-gray-900" />
                  ) : (
                    <Play size={20} className="text-gray-900 ml-0.5" />
                  )}
                </motion.div>
                <div className="text-white">
                  <p className="text-sm font-medium">Demo afspelen</p>
                  <p className="text-xs text-white/60">{voice.demos[activeDemo].title}</p>
                </div>
              </button>

              <motion.button
                whileHover={{ scale: voice.beschikbaar ? 1.05 : 1 }}
                whileTap={{ scale: voice.beschikbaar ? 0.95 : 1 }}
                onClick={onSelect}
                disabled={!voice.beschikbaar}
                className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                  !voice.beschikbaar
                    ? 'bg-gray-800 text-gray-300 border border-gray-600'
                    : isSelected
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg'
                }`}
              >
                {!voice.beschikbaar
                  ? `Vanaf ${voice.availabilityText || '15 jan'}`
                  : isSelected
                    ? 'Geselecteerd ✓'
                    : 'Boeken'}
              </motion.button>
            </div>

            {/* Expandable Player */}
            <AnimatePresence>
              {showPlayer && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="border-t border-white/10 overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    {/* Demo Selector Pills */}
                    <div className="flex gap-2">
                      {voice.demos.map((demo, index) => (
                        <button
                          key={demo.id}
                          onClick={() => {
                            setActiveDemo(index);
                            setProgress(0);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            activeDemo === index
                              ? 'bg-white text-gray-900'
                              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                          }`}
                        >
                          {demo.title}
                        </button>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="relative">
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-white" style={{ width: `${progress}%` }} />
                      </div>
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
                        style={{ left: `calc(${progress}% - 6px)` }}
                      />
                    </div>

                    {/* Time Display */}
                    <div className="flex justify-between text-xs text-white/60">
                      <span>0:00</span>
                      <span>{voice.demos[activeDemo].duration}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
