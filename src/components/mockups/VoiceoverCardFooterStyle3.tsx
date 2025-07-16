// Footer-Inspired Design 3: Minimal Border Style
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
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

export function VoiceoverCardFooterStyle3({ voice, isSelected, onSelect }: VoiceoverCardProps) {
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
    <div className={`${plusJakarta.variable} font-plus-jakarta`}>
      <div className="relative border-2 border-gray-200 dark:border-gray-800 rounded-none bg-[#fcf9f5] dark:bg-gray-950">
        {/* Large Square Photo */}
        <div className="aspect-square relative">
          {voice.profilePhoto ? (
            <Image src={voice.profilePhoto} alt={voice.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-800" />
          )}
        </div>

        {/* Content with Border */}
        <div className="border-t-2 border-gray-200 dark:border-gray-800">
          {/* Name Section */}
          <div className="px-6 py-4 border-b-2 border-gray-200 dark:border-gray-800">
            <h2 className="font-plus-jakarta text-2xl font-semibold text-gray-900 dark:text-white">
              {voice.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-sm font-medium ${
                  voice.beschikbaar
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {voice.beschikbaar ? 'BESCHIKBAAR' : 'BEZET'}
              </span>
              {!voice.beschikbaar && voice.availabilityText && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  • {voice.availabilityText}
                </span>
              )}
            </div>
          </div>

          {/* Tags Section */}
          <div className="px-6 py-4 border-b-2 border-gray-200 dark:border-gray-800">
            <p className="text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
              STIJLEN
            </p>
            <div className="space-y-1">
              {voice.tags.map((tag) => (
                <div key={tag} className="text-gray-900 dark:text-white">
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Demos Section */}
          <div className="px-6 py-4 border-b-2 border-gray-200 dark:border-gray-800">
            <p className="text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-4">
              DEMO&apos;S
            </p>

            {/* Demo List */}
            <div className="space-y-3">
              {voice.demos.map((demo, index) => (
                <div
                  key={demo.id}
                  className={`p-3 border-2 cursor-pointer transition-all ${
                    activeDemo === index
                      ? 'border-gray-900 dark:border-white bg-white dark:bg-gray-900'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                  onClick={() => {
                    setActiveDemo(index);
                    setProgress(0);
                    setIsPlaying(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-medium ${
                        activeDemo === index
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {demo.title}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {demo.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Player */}
            <div className="mt-4 border-2 border-gray-900 dark:border-white p-4">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 border-2 border-gray-900 dark:border-white flex items-center justify-center hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                </motion.button>

                <div className="flex-1">
                  <div className="relative h-2 bg-gray-200 dark:bg-gray-800">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gray-900 dark:bg-white"
                      style={{ width: `${progress}%` }}
                    />
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-900 dark:bg-white border-2 border-white dark:border-gray-900"
                      style={{ left: `calc(${progress}% - 8px)` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Book Button */}
          <motion.button
            whileHover={{ scale: voice.beschikbaar ? 1.02 : 1 }}
            whileTap={{ scale: voice.beschikbaar ? 0.98 : 1 }}
            onClick={onSelect}
            disabled={!voice.beschikbaar}
            className={`w-full py-6 font-semibold text-lg transition-all border-t-2 ${
              !voice.beschikbaar
                ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed border-gray-200 dark:border-gray-800'
                : isSelected
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100 border-gray-900 dark:border-white'
            }`}
          >
            {!voice.beschikbaar ? 'NIET BESCHIKBAAR' : isSelected ? 'GEBOEKT ✓' : 'BOEKEN'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
