// Glassmorphic V3 Improved 3: Side Tags with Circular Play
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Calendar } from 'lucide-react';
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

export function VoiceoverCardGlassmorphicV3Improved3({
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
    setShowPlayer(!showPlayer);
    if (!showPlayer) {
      setTimeout(() => setIsPlaying(true), 300);
    }
  };

  return (
    <motion.div className={`${plusJakarta.variable} font-plus-jakarta group`}>
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl bg-black">
        {/* Full Image */}
        {voice.profilePhoto ? (
          <Image
            src={voice.profilePhoto}
            alt={voice.name}
            fill
            className="absolute inset-0 object-cover filter grayscale brightness-95 group-hover:brightness-105 transition-all duration-500"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-600 to-gray-800" />
        )}

        {/* Soft Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Status Dot with Glow */}
        <div
          className={`absolute top-5 right-5 w-4 h-4 rounded-full ${
            voice.beschikbaar ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          <div
            className={`absolute inset-0 rounded-full ${
              voice.beschikbaar ? 'bg-green-500' : 'bg-red-500'
            } animate-ping opacity-50`}
          />
        </div>

        {/* Side Tags - Vertical */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 writing-mode-vertical">
          <div className="flex flex-col gap-2">
            {voice.tags.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-xs text-white/60 tracking-wider uppercase"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0">
          {/* Name */}
          <div className="px-6 pb-4">
            <h1 className="font-plus-jakarta text-6xl font-black text-white leading-[0.85]">
              {voice.name}
            </h1>
          </div>

          {/* Glass Control Bar */}
          <div className="bg-black/40 backdrop-blur-xl border-t border-white/10">
            <div className="p-4">
              <div className="flex items-center justify-between">
                {/* Circular Play Button */}
                <motion.button
                  onClick={handlePlayClick}
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                    {showPlayer && isPlaying ? (
                      <Pause size={22} className="text-white" />
                    ) : (
                      <Play size={22} className="text-white ml-0.5" />
                    )}
                  </div>
                  {/* Progress Ring */}
                  {showPlayer && (
                    <svg className="absolute inset-0 w-14 h-14 -rotate-90">
                      <circle
                        cx="28"
                        cy="28"
                        r="26"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="2"
                        fill="none"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r="26"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 26}`}
                        strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress / 100)}`}
                        className="transition-all duration-100"
                      />
                    </svg>
                  )}
                </motion.button>

                {/* Demo Info */}
                <div className="flex-1 px-4">
                  <p className="text-white text-sm font-medium">{voice.demos[activeDemo].title}</p>
                  <p className="text-white/50 text-xs">Klik om demo te beluisteren</p>
                </div>

                {/* Book Button */}
                <motion.button
                  whileHover={{ scale: voice.beschikbaar ? 1.05 : 1 }}
                  whileTap={{ scale: voice.beschikbaar ? 0.95 : 1 }}
                  onClick={onSelect}
                  disabled={!voice.beschikbaar}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                    !voice.beschikbaar
                      ? 'bg-gray-700 text-gray-100 border border-gray-600'
                      : isSelected
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {!voice.beschikbaar ? (
                    <>
                      <Calendar size={14} />
                      <span>Vanaf {voice.availabilityText || '15 jan'}</span>
                    </>
                  ) : isSelected ? (
                    'Geselecteerd ✓'
                  ) : (
                    'Boeken'
                  )}
                </motion.button>
              </div>

              {/* Expandable Demos */}
              <AnimatePresence>
                {showPlayer && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 pt-3 border-t border-white/10"
                  >
                    <div className="flex gap-2">
                      {voice.demos.map((demo, index) => (
                        <button
                          key={demo.id}
                          onClick={() => {
                            setActiveDemo(index);
                            setProgress(0);
                          }}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                            activeDemo === index
                              ? 'bg-white/20 text-white'
                              : 'text-white/50 hover:text-white/80'
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
        </div>
      </div>
    </motion.div>
  );
}
