// Glassmorphic Variation 5: Corner Glass with Diagonal Typography
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

export function VoiceoverCardGlassmorphicV5({ voice, isSelected, onSelect }: VoiceoverCardProps) {
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
    <motion.div className={`${plusJakarta.variable} font-plus-jakarta group`}>
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-xl">
        {/* Full Black and White Image */}
        {voice.profilePhoto ? (
          <Image
            src={voice.profilePhoto}
            alt={voice.name}
            fill
            className="absolute inset-0 object-cover filter grayscale brightness-110 transition-all duration-500 group-hover:brightness-100"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-600 to-gray-800" />
        )}

        {/* Diagonal Typography Overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: 'rotate(-15deg)' }}
        >
          <h1 className="font-plus-jakarta text-8xl font-bold text-white opacity-90 mix-blend-overlay">
            {voice.name}
          </h1>
        </div>

        {/* Status Dot - Integrated */}
        <div className="absolute top-4 right-4">
          <div
            className={`w-3 h-3 rounded-full ${
              voice.beschikbaar ? 'bg-green-500' : 'bg-red-500'
            } shadow-lg animate-pulse`}
          />
        </div>

        {/* Corner Glass Panel */}
        <motion.div
          className="absolute bottom-0 right-0"
          initial={{ x: 100, y: 100 }}
          animate={{ x: 0, y: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-tl-2xl p-5 border-t border-l border-white/20 min-w-[220px]">
            {/* Tags - Vertical Layout */}
            <div className="space-y-1 mb-4 text-xs text-white/80">
              {voice.tags.map((tag) => (
                <div key={tag}>• {tag}</div>
              ))}
            </div>

            {/* Demo Selector - Minimal */}
            <div className="flex gap-1 mb-3">
              {voice.demos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveDemo(index);
                    setProgress(0);
                    setIsPlaying(false);
                  }}
                  className={`flex-1 h-1 rounded-full transition-all ${
                    activeDemo === index ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* Play Controls */}
            <div className="flex items-center gap-3 mb-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </motion.button>

              <div className="flex-1">
                <div className="text-xs text-white/80 mb-1">{voice.demos[activeDemo].title}</div>
                <div className="relative h-1 bg-white/20 rounded-full">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-white rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-white/60 mt-1">{voice.demos[activeDemo].duration}</div>
              </div>
            </div>

            {/* Book Button */}
            <motion.button
              whileHover={{ scale: voice.beschikbaar ? 1.05 : 1 }}
              whileTap={{ scale: voice.beschikbaar ? 0.95 : 1 }}
              onClick={onSelect}
              disabled={!voice.beschikbaar}
              className={`w-full py-2 rounded-md font-medium text-xs transition-all ${
                !voice.beschikbaar
                  ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                  : isSelected
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              {!voice.beschikbaar ? 'Bezet' : isSelected ? 'Geboekt' : 'Boek stem'}
            </motion.button>
          </div>
        </motion.div>

        {/* Hover Effect - Subtle Glow */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.1) 100%)',
          }}
        />
      </div>
    </motion.div>
  );
}
