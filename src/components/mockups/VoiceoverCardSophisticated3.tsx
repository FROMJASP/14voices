// Sophisticated Design 3: Glassmorphic Overlay
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Sparkles, Volume2 } from 'lucide-react';
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

export function VoiceoverCardSophisticated3({ voice, isSelected, onSelect }: VoiceoverCardProps) {
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
    <motion.div
      className={`${plusJakarta.variable} font-plus-jakarta group`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
        {/* Background Image */}
        {voice.profilePhoto ? (
          <Image
            src={voice.profilePhoto}
            alt={voice.name}
            fill
            className="absolute inset-0 object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-600 to-gray-800" />
        )}

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        {/* Content Container */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Top Section */}
          <div>
            {/* Availability Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-medium ${
                voice.beschikbaar
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              {voice.beschikbaar ? 'Beschikbaar' : voice.availabilityText}
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className="space-y-4">
            {/* Name and Tags */}
            <div>
              <h3 className="font-plus-jakarta text-4xl font-bold text-white mb-3">{voice.name}</h3>
              <div className="flex flex-wrap gap-2">
                {voice.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-xs border border-white/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Glassmorphic Player */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              {/* Demo Selector */}
              <div className="flex gap-1 mb-3">
                {voice.demos.map((demo, index) => (
                  <button
                    key={demo.id}
                    onClick={() => {
                      setActiveDemo(index);
                      setProgress(0);
                      setIsPlaying(false);
                    }}
                    className={`flex-1 py-1 text-xs font-medium transition-all rounded-md ${
                      activeDemo === index
                        ? 'bg-white/20 text-white'
                        : 'text-white/60 hover:text-white/80'
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
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </motion.button>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/80 font-medium">
                      {voice.demos[activeDemo].title}
                    </span>
                    <span className="text-xs text-white/60">
                      {voice.demos[activeDemo].duration}
                    </span>
                  </div>
                  <div
                    className="relative h-1.5 bg-white/20 rounded-full cursor-pointer"
                    onClick={handleProgressClick}
                  >
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-white rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg"
                      style={{ left: `calc(${progress}% - 7px)` }}
                    />
                  </div>
                </div>

                <Volume2 className="w-4 h-4 text-white/60" />
              </div>
            </div>

            {/* Book Button */}
            <motion.button
              whileHover={{ scale: voice.beschikbaar ? 1.02 : 1 }}
              whileTap={{ scale: voice.beschikbaar ? 0.98 : 1 }}
              onClick={onSelect}
              disabled={!voice.beschikbaar}
              className={`w-full py-3 rounded-xl font-medium text-sm transition-all backdrop-blur-sm border ${
                !voice.beschikbaar
                  ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed border-gray-500/30'
                  : isSelected
                    ? 'bg-green-500/80 text-white border-green-500/50'
                    : 'bg-white/90 text-gray-900 hover:bg-white border-white/50'
              }`}
            >
              {!voice.beschikbaar
                ? 'Niet beschikbaar'
                : isSelected
                  ? 'Geboekt ✓'
                  : 'Boek deze stem'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
