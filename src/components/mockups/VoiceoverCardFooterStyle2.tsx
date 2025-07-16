// Footer-Inspired Design 2: Newsletter Style Layout
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

export function VoiceoverCardFooterStyle2({ voice, isSelected, onSelect }: VoiceoverCardProps) {
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
      <div className="relative bg-[#fcf9f5] dark:bg-gray-950 p-8 rounded-lg">
        <div className="flex gap-8">
          {/* Left: Photo */}
          <div className="w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
            {voice.profilePhoto ? (
              <Image src={voice.profilePhoto} alt={voice.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
            )}
          </div>

          {/* Right: Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <h1 className="font-plus-jakarta text-4xl font-semibold mb-2 text-gray-900 dark:text-white">
                {voice.name}
              </h1>
              <p className="font-plus-jakarta text-2xl text-gray-600 dark:text-gray-400">
                Professionele stemartiest
              </p>
            </div>

            {/* Status and Tags */}
            <div className="mb-6">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-3 ${
                  voice.beschikbaar
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${voice.beschikbaar ? 'bg-green-500' : 'bg-red-500'}`}
                />
                {voice.beschikbaar
                  ? 'Direct beschikbaar'
                  : voice.availabilityText || 'Niet beschikbaar'}
              </div>

              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                {voice.tags.map((tag, index) => (
                  <React.Fragment key={tag}>
                    <span>{tag}</span>
                    {index < voice.tags.length - 1 && <span>•</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Audio Player Section */}
            <div className="space-y-4">
              {/* Demo Selector Tabs */}
              <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800">
                {voice.demos.map((demo, index) => (
                  <button
                    key={demo.id}
                    onClick={() => {
                      setActiveDemo(index);
                      setProgress(0);
                      setIsPlaying(false);
                    }}
                    className={`px-4 py-2 font-medium transition-all relative ${
                      activeDemo === index
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {demo.title}
                    {activeDemo === index && (
                      <motion.div
                        layoutId="activeDemo"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Player Controls */}
              <div className="relative bg-black dark:bg-white rounded-full overflow-hidden">
                <div className="flex items-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-8 py-4 text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                  </motion.button>

                  <div className="flex-1 py-4 pr-8 cursor-pointer" onClick={handleProgressClick}>
                    <div className="relative h-1 bg-white/20 dark:bg-black/20 rounded-full">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-white dark:bg-black rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-white/70 dark:text-black/70">
                      <span>{voice.demos[activeDemo].title}</span>
                      <span>{voice.demos[activeDemo].duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Button */}
            <div className="mt-6">
              <motion.button
                whileHover={{ scale: voice.beschikbaar ? 1.02 : 1 }}
                whileTap={{ scale: voice.beschikbaar ? 0.98 : 1 }}
                onClick={onSelect}
                disabled={!voice.beschikbaar}
                className={`relative overflow-hidden rounded-full font-semibold transition-all ${
                  !voice.beschikbaar
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed px-8 py-3'
                    : isSelected
                      ? 'bg-green-600 text-white px-8 py-3'
                      : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 group'
                }`}
              >
                {!voice.beschikbaar ? (
                  'Niet beschikbaar'
                ) : isSelected ? (
                  '✓ Stem geboekt'
                ) : (
                  <div className="px-8 py-3 flex items-center gap-2">
                    <span>Boek deze stem</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
