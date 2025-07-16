// Sophisticated Design 4: Editorial Magazine Style
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ArrowUpRight } from 'lucide-react';
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

export function VoiceoverCardSophisticated4({ voice, isSelected, onSelect }: VoiceoverCardProps) {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
      className={`${plusJakarta.variable} font-plus-jakarta`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative bg-[#fcf9f5] dark:bg-gray-950 rounded-sm overflow-hidden shadow-md hover:shadow-xl transition-all duration-500">
        {/* Editorial Layout Container */}
        <div className="relative aspect-[3/4]">
          {/* Main Photo with Magazine-style Treatment */}
          <div className="relative h-3/4 overflow-hidden">
            {voice.profilePhoto ? (
              <>
                <Image
                  src={voice.profilePhoto}
                  alt={voice.name}
                  fill
                  className="object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
                />
                {/* Editorial Overlay */}
                <div className="absolute inset-0 mix-blend-multiply bg-gradient-to-b from-transparent via-transparent to-[#fcf9f5] dark:to-gray-950" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
            )}

            {/* Large Typography Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="font-plus-jakarta text-7xl font-bold leading-none">
                <span className="text-[#fcf9f5] dark:text-gray-950 mix-blend-difference">
                  {voice.name}
                </span>
              </h1>
            </div>

            {/* Status Indicator */}
            <div className="absolute top-6 right-6">
              <motion.div
                animate={{
                  scale: voice.beschikbaar ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: voice.beschikbaar ? Infinity : 0,
                  repeatType: 'reverse',
                }}
                className={`w-3 h-3 rounded-full ${
                  voice.beschikbaar ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-[#fcf9f5] dark:bg-gray-950 p-6">
            {/* Tags in Editorial Style */}
            <div className="flex items-center gap-3 mb-4 text-xs tracking-wider uppercase text-gray-600 dark:text-gray-400">
              {voice.tags.map((tag, index) => (
                <React.Fragment key={tag}>
                  {index > 0 && <span>·</span>}
                  <span>{tag}</span>
                </React.Fragment>
              ))}
            </div>

            {/* Minimalist Player */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 border-2 border-gray-900 dark:border-white rounded-full flex items-center justify-center hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </motion.button>

                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {voice.demos[activeDemo].title}
                  </p>
                  <p className="text-xs text-gray-500">{voice.demos[activeDemo].duration}</p>
                </div>
              </div>

              {/* Editorial Book Button */}
              <motion.button
                whileHover={{ x: voice.beschikbaar ? 4 : 0 }}
                onClick={onSelect}
                disabled={!voice.beschikbaar}
                className={`flex items-center gap-2 text-sm font-medium ${
                  !voice.beschikbaar
                    ? 'text-gray-400 cursor-not-allowed'
                    : isSelected
                      ? 'text-green-600'
                      : 'text-gray-900 dark:text-white hover:underline'
                }`}
              >
                {!voice.beschikbaar ? 'Niet beschikbaar' : isSelected ? 'Geboekt' : 'Selecteer'}
                {voice.beschikbaar && !isSelected && <ArrowUpRight className="w-4 h-4" />}
              </motion.button>
            </div>

            {/* Progress Line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-800">
              <motion.div
                className="h-full bg-gray-900 dark:bg-white"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Hover Demo Selector */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute top-1/2 -translate-y-1/2 left-6"
              >
                <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                  {voice.demos.map((demo, index) => (
                    <button
                      key={demo.id}
                      onClick={() => {
                        setActiveDemo(index);
                        setProgress(0);
                        setIsPlaying(false);
                      }}
                      className={`block w-full text-left px-3 py-2 text-sm rounded transition-all ${
                        activeDemo === index
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {demo.title}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
