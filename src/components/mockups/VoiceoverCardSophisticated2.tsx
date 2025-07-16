// Sophisticated Design 2: Cinematic Split View
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Headphones, Calendar } from 'lucide-react';
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

export function VoiceoverCardSophisticated2({ voice, isSelected, onSelect }: VoiceoverCardProps) {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDemos, setShowDemos] = useState(false);

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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative bg-gray-900 dark:bg-black rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Split View Container */}
        <div className="relative aspect-[3/4] flex">
          {/* Left Side - Photo */}
          <div className="relative w-1/2 overflow-hidden">
            {voice.profilePhoto ? (
              <Image src={voice.profilePhoto} alt={voice.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800" />
            )}

            {/* Diagonal Overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-900/50 to-gray-900"
              style={{ clipPath: 'polygon(60% 0, 100% 0, 100% 100%, 0% 100%)' }}
            />
          </div>

          {/* Right Side - Content */}
          <div className="relative w-1/2 bg-gray-900 flex flex-col justify-between p-6">
            {/* Header */}
            <div>
              <h3 className="font-plus-jakarta text-4xl font-bold text-white mb-3">{voice.name}</h3>

              {/* Availability Badge */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                  voice.beschikbaar
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                <Calendar className="w-3 h-3" />
                {voice.beschikbaar ? 'Nu beschikbaar' : voice.availabilityText}
              </div>

              {/* Tags */}
              <div className="mt-6 space-y-2">
                {voice.tags.map((tag) => (
                  <div key={tag} className="text-gray-400 text-sm">
                    • {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* Player Section */}
            <div>
              {/* Mini Player */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDemos(!showDemos)}
                className="w-full bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3 hover:bg-white/20 transition-all mb-4"
              >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-gray-900" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white text-sm font-medium">Luister demo{'"'}s</p>
                  <p className="text-gray-400 text-xs">{voice.demos.length} beschikbaar</p>
                </div>
              </motion.button>

              {/* Book Button */}
              <motion.button
                whileHover={{ scale: voice.beschikbaar ? 1.02 : 1 }}
                whileTap={{ scale: voice.beschikbaar ? 0.98 : 1 }}
                onClick={onSelect}
                disabled={!voice.beschikbaar}
                className={`w-full py-3 rounded-lg font-medium text-sm transition-all ${
                  !voice.beschikbaar
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : isSelected
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                {!voice.beschikbaar ? 'Niet beschikbaar' : isSelected ? 'Geboekt ✓' : 'Boek stem'}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Expandable Demo Player */}
        <AnimatePresence>
          {showDemos && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-black border-t border-gray-800"
            >
              <div className="p-4">
                {/* Demo Tabs */}
                <div className="flex gap-2 mb-3">
                  {voice.demos.map((demo, index) => (
                    <button
                      key={demo.id}
                      onClick={() => {
                        setActiveDemo(index);
                        setProgress(0);
                        setIsPlaying(false);
                      }}
                      className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
                        activeDemo === index
                          ? 'bg-white text-gray-900'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {demo.title}
                    </button>
                  ))}
                </div>

                {/* Player Controls */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 bg-white text-gray-900 rounded-full flex items-center justify-center"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                  </motion.button>

                  <div className="flex-1">
                    <div className="relative h-1 bg-gray-800 rounded-full">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-white rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
                        style={{ left: `calc(${progress}% - 6px)` }}
                      />
                    </div>
                  </div>

                  <span className="text-xs text-gray-400">{voice.demos[activeDemo].duration}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
