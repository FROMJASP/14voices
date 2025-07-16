// Design 3 Improved V1: Pills Tags with Interactive Progress
'use client';

import React, { useState, useRef } from 'react';
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

export function VoiceoverCardDesign3ImprovedV1({
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
    setShowPlayer(!showPlayer);
    if (!showPlayer) {
      setTimeout(() => setIsPlaying(true), 300);
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

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleProgressClick(e);
    }
  };

  return (
    <motion.div className={`${plusJakarta.variable} font-plus-jakarta group`}>
      <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden shadow-xl bg-black">
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

        {/* Availability Info - Top Right */}
        {!voice.beschikbaar && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
            <div className="flex items-center gap-2 text-xs text-white">
              <Calendar size={12} />
              <span>Beschikbaar op: {voice.availabilityText || '15 jan'}</span>
            </div>
          </div>
        )}

        {/* Status Dot - Only for Available */}
        {voice.beschikbaar && (
          <div className="absolute top-5 right-5 w-4 h-4 rounded-full bg-green-500">
            <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-50" />
          </div>
        )}

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0">
          {/* Name and Tags */}
          <div className="px-6 pb-4">
            <h1 className="font-plus-jakarta text-6xl font-black text-white leading-[0.85] mb-3">
              {voice.name}
            </h1>

            {/* Pills Style Tags */}
            <div className="flex flex-wrap gap-2">
              {voice.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white/80 border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </div>
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
                </motion.button>

                {/* Demo Info */}
                <div className="flex-1 px-4">
                  <p className="text-white text-sm font-medium">{voice.demos[activeDemo].title}</p>
                  <p className="text-white/50 text-xs">Klik om demo te beluisteren</p>
                </div>

                {/* Book Button - Only for Available */}
                {voice.beschikbaar && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSelect}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      isSelected
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {isSelected ? 'Ga verder' : 'Boeken'}
                  </motion.button>
                )}
              </div>

              {/* Expandable Player with Draggable Progress */}
              <AnimatePresence>
                {showPlayer && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 pt-3 border-t border-white/10"
                  >
                    {/* Demo Buttons */}
                    <div className="flex gap-2 mb-3">
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

                    {/* Interactive Progress Bar */}
                    <div
                      ref={progressRef}
                      className="relative h-2 bg-white/20 rounded-full cursor-pointer"
                      onClick={handleProgressClick}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    >
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-white rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg hover:scale-125 transition-transform"
                        style={{ left: `calc(${progress}% - 8px)` }}
                      />
                    </div>

                    {/* Time Display */}
                    <div className="flex justify-between text-xs text-white/60 mt-2">
                      <span>
                        {Math.floor((progress * 2.4) / 100)}:
                        {String(Math.floor(((progress * 2.4) % 1) * 60)).padStart(2, '0')}
                      </span>
                      <span>{voice.demos[activeDemo].duration}</span>
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
