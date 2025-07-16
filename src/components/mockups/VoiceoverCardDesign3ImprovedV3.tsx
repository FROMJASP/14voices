// Design 3 Improved V3: Minimalist with Inline Tags
'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronRight, Calendar } from 'lucide-react';
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

export function VoiceoverCardDesign3ImprovedV3({
  voice,
  isSelected,
  onSelect,
}: VoiceoverCardProps) {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

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
      setTimeout(() => setIsPlaying(true), 200);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
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
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative aspect-[3/4.5] rounded-lg overflow-hidden shadow-xl bg-black">
        {/* Full Image */}
        {voice.profilePhoto ? (
          <Image
            src={voice.profilePhoto}
            alt={voice.name}
            fill
            className="absolute inset-0 object-cover filter grayscale-[90%] brightness-90"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-600 to-gray-800" />
        )}

        {/* Minimal Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Availability or Status */}
        <div className="absolute top-3 right-3">
          {!voice.beschikbaar ? (
            <div className="bg-black/70 backdrop-blur-sm rounded-md px-3 py-1.5 flex items-center gap-1.5">
              <Calendar size={12} className="text-white/80" />
              <span className="text-xs text-white/80">
                Beschikbaar op: {voice.availabilityText || '15 jan'}
              </span>
            </div>
          ) : (
            <div className="w-3.5 h-3.5 rounded-full bg-green-500 ring-2 ring-green-500/30" />
          )}
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0">
          {/* Name and Inline Tags */}
          <div className="px-5 pb-3">
            <h1 className="font-plus-jakarta text-[3.5rem] leading-[0.9] font-bold text-white mb-2">
              {voice.name}
            </h1>

            {/* Inline Tags with Separators */}
            <div className="text-sm text-white/70">
              {voice.tags.map((tag, index) => (
                <span key={tag}>
                  {tag}
                  {index < voice.tags.length - 1 && <span className="mx-2">•</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Minimal Control Bar */}
          <div className="bg-white/5 backdrop-blur-xl border-t border-white/10">
            <div className="px-5 py-3.5">
              <div className="flex items-center justify-between">
                {/* Integrated Play */}
                <button onClick={handlePlayClick} className="flex items-center gap-3 group/play">
                  <div className="w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                    {showPlayer && isPlaying ? (
                      <Pause size={18} className="text-white" />
                    ) : (
                      <Play size={18} className="text-white ml-0.5" />
                    )}
                  </div>
                  <span className="text-white text-sm group-hover/play:translate-x-0.5 transition-transform">
                    Luister demo
                  </span>
                </button>

                {/* Book/Continue Button */}
                {voice.beschikbaar && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onSelect}
                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-white text-gray-900'
                        : 'bg-white/90 text-gray-900 hover:bg-white'
                    }`}
                  >
                    {isSelected ? 'Ga verder' : 'Boeken'}
                    <ChevronRight size={16} className={isSelected ? 'animate-pulse' : ''} />
                  </motion.button>
                )}
              </div>

              {/* Expandable Player */}
              <AnimatePresence>
                {showPlayer && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-3">
                      {/* Demo Dots */}
                      <div className="flex justify-center gap-4">
                        {voice.demos.map((demo, index) => (
                          <button
                            key={demo.id}
                            onClick={() => {
                              setActiveDemo(index);
                              setProgress(0);
                            }}
                            className="group/demo"
                          >
                            <div
                              className={`h-1.5 transition-all rounded-full ${
                                activeDemo === index
                                  ? 'w-8 bg-white'
                                  : 'w-1.5 bg-white/30 group-hover/demo:bg-white/50'
                              }`}
                            />
                            <p
                              className={`text-[10px] mt-1 transition-opacity ${
                                activeDemo === index ? 'text-white/70' : 'text-transparent'
                              }`}
                            >
                              {demo.title}
                            </p>
                          </button>
                        ))}
                      </div>

                      {/* Sleek Progress Bar */}
                      <div
                        ref={progressRef}
                        className="relative h-1 bg-white/10 rounded-full cursor-pointer mx-2"
                        onClick={handleProgressClick}
                      >
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-white/70 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                        <motion.div
                          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg cursor-pointer hover:scale-125 transition-transform"
                          style={{ left: `calc(${progress}% - 6px)` }}
                          drag="x"
                          dragConstraints={progressRef}
                          dragElastic={0}
                          onDrag={(_, info) => {
                            const rect = progressRef.current?.getBoundingClientRect();
                            if (rect) {
                              const percentage = ((info.point.x - rect.left) / rect.width) * 100;
                              setProgress(Math.max(0, Math.min(100, percentage)));
                            }
                          }}
                        />
                      </div>

                      {/* Time */}
                      <div className="text-center text-xs text-white/50">
                        {voice.demos[activeDemo].duration}
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
