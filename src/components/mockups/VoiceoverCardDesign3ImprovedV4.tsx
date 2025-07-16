// Design 3 Improved V4: Premium Glass with Tag Animation
'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ArrowRight, Clock } from 'lucide-react';
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

export function VoiceoverCardDesign3ImprovedV4({
  voice,
  isSelected,
  onSelect,
}: VoiceoverCardProps) {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isPlaying && !isDragging) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isDragging]);

  const handlePlayClick = () => {
    if (!showPlayer) {
      setShowPlayer(true);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = progressRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setProgress(Math.max(0, Math.min(100, percentage)));
    }
  };

  return (
    <motion.div
      className={`${plusJakarta.variable} font-plus-jakarta group`}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden shadow-2xl">
        {/* Full Image */}
        {voice.profilePhoto ? (
          <Image
            src={voice.profilePhoto}
            alt={voice.name}
            fill
            className="absolute inset-0 object-cover filter grayscale"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
        )}

        {/* Premium Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Availability Display */}
        {!voice.beschikbaar ? (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-center gap-2">
              <Clock size={16} className="text-amber-400" />
              <span className="text-white text-sm font-medium">
                Beschikbaar op: {voice.availabilityText || '15 januari'}
              </span>
            </div>
          </div>
        ) : (
          <div className="absolute top-4 right-4">
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-4 h-4 rounded-full bg-green-500 shadow-lg shadow-green-500/50"
            />
          </div>
        )}

        {/* Content Area */}
        <div className="absolute bottom-0 left-0 right-0">
          {/* Name Section */}
          <div className="px-6 pb-4">
            <h1 className="font-plus-jakarta text-[4.5rem] leading-[0.8] font-black text-white">
              {voice.name}
            </h1>

            {/* Animated Tag Display */}
            <div className="mt-3 h-8 relative overflow-hidden">
              <motion.div
                animate={{ y: [-32, -64, -96, -128, 0] }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'linear',
                  repeatDelay: 1,
                }}
                className="space-y-2"
              >
                {[...voice.tags, ...voice.tags].map((tag, index) => (
                  <div key={`${tag}-${index}`} className="h-8 flex items-center">
                    <span className="text-white/80 text-sm bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Premium Glass Control */}
          <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border-t border-white/20">
            <div className="p-5">
              <div className="flex items-center justify-between">
                {/* Play Section */}
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={handlePlayClick}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                      {isPlaying ? (
                        <Pause size={24} className="text-white" />
                      ) : (
                        <Play size={24} className="text-white ml-0.5" />
                      )}
                    </div>
                    {isPlaying && (
                      <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                    )}
                  </motion.button>

                  <div>
                    <p className="text-white font-medium text-sm">
                      {showPlayer ? voice.demos[activeDemo].title : 'Demo afspelen'}
                    </p>
                    <p className="text-white/50 text-xs">Klik om te starten</p>
                  </div>
                </div>

                {/* Action Button */}
                {voice.beschikbaar && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSelect}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                        : 'bg-white/90 text-gray-900 hover:bg-white'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        Ga verder <ArrowRight size={16} />
                      </>
                    ) : (
                      'Boeken'
                    )}
                  </motion.button>
                )}
              </div>

              {/* Premium Player */}
              <AnimatePresence>
                {showPlayer && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    {/* Demo Selector */}
                    <div className="flex gap-2 mb-4">
                      {voice.demos.map((demo, index) => (
                        <motion.button
                          key={demo.id}
                          onClick={() => {
                            setActiveDemo(index);
                            setProgress(0);
                          }}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                            activeDemo === index
                              ? 'bg-gradient-to-r from-white/20 to-white/10 text-white border border-white/20'
                              : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {demo.title}
                        </motion.button>
                      ))}
                    </div>

                    {/* Interactive Progress */}
                    <div className="space-y-2">
                      <div
                        ref={progressRef}
                        className="relative h-2 bg-white/10 rounded-full cursor-pointer"
                        onClick={handleProgressDrag}
                        onMouseDown={() => setIsDragging(true)}
                        onMouseMove={(e) => isDragging && handleProgressDrag(e)}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseLeave={() => setIsDragging(false)}
                      >
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-white to-white/60 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                        <motion.div
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl cursor-grab active:cursor-grabbing"
                          style={{ left: `calc(${progress}% - 8px)` }}
                          whileHover={{ scale: 1.3 }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-white/60">
                        <span>{Math.floor((progress / 100) * 90)}s</span>
                        <span>{voice.demos[activeDemo].duration}</span>
                      </div>
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
