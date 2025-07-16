// Footer-Inspired Design 5: Full Width Minimal
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ArrowRight } from 'lucide-react';
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

export function VoiceoverCardFooterStyle5({ voice, isSelected, onSelect }: VoiceoverCardProps) {
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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setProgress(percentage);
  };

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta`}>
      <div className="relative bg-[#fcf9f5] dark:bg-gray-950">
        {/* Full Width Photo */}
        <div className="relative h-96 overflow-hidden">
          {voice.profilePhoto ? (
            <Image src={voice.profilePhoto} alt={voice.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
          )}

          {/* Overlay with Name */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="font-plus-jakarta text-6xl font-bold text-white mb-4">{voice.name}</h1>
            <div className="flex items-center gap-4">
              {voice.tags.map((tag, index) => (
                <React.Fragment key={tag}>
                  <span className="text-white/90">{tag}</span>
                  {index < voice.tags.length - 1 && <span className="text-white/50">•</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-8 py-6">
          {/* Status Bar */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
            <div
              className={`flex items-center gap-3 text-lg font-medium ${
                voice.beschikbaar
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${voice.beschikbaar ? 'bg-green-500' : 'bg-red-500'}`}
              />
              {voice.beschikbaar
                ? 'Direct beschikbaar'
                : voice.availabilityText || 'Niet beschikbaar'}
            </div>

            <motion.button
              whileHover={{ scale: voice.beschikbaar ? 1.05 : 1 }}
              whileTap={{ scale: voice.beschikbaar ? 0.95 : 1 }}
              onClick={onSelect}
              disabled={!voice.beschikbaar}
              className={`px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
                !voice.beschikbaar
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isSelected
                    ? 'bg-green-600 text-white'
                    : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 group'
              }`}
            >
              {!voice.beschikbaar ? (
                'Niet beschikbaar'
              ) : isSelected ? (
                'Geboekt ✓'
              ) : (
                <>
                  Boek nu
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </div>

          {/* Audio Player Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Luister naar demo&apos;s
            </h3>

            {/* Demo Selector */}
            <div className="flex gap-4">
              {voice.demos.map((demo, index) => (
                <button
                  key={demo.id}
                  onClick={() => {
                    setActiveDemo(index);
                    setProgress(0);
                    setIsPlaying(false);
                  }}
                  className={`pb-2 font-medium transition-all border-b-2 ${
                    activeDemo === index
                      ? 'text-gray-900 dark:text-white border-gray-900 dark:border-white'
                      : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {demo.title}
                </button>
              ))}
            </div>

            {/* Player */}
            <div className="bg-black dark:bg-white rounded-2xl p-1">
              <div className="flex items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-6 text-white dark:text-black"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
                </motion.button>

                <div className="flex-1 pr-6 cursor-pointer" onClick={handleProgressClick}>
                  <div className="mb-2">
                    <h4 className="text-white dark:text-black font-medium">
                      {voice.demos[activeDemo].title}
                    </h4>
                    <p className="text-white/60 dark:text-black/60 text-sm">
                      {voice.name} • {voice.demos[activeDemo].duration}
                    </p>
                  </div>

                  <div className="relative h-1 bg-white/20 dark:bg-black/20 rounded-full">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-white dark:bg-black rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-black rounded-full shadow-lg"
                      style={{ left: `calc(${progress}% - 8px)` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
