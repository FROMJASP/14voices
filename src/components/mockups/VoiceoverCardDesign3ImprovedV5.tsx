// Design 3 Improved V5: Elegant Overlay with Tag Grid
'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayIcon, PauseIcon, CalendarIcon, ChevronRightIcon } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
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

export function VoiceoverCardDesign3ImprovedV5({
  voice,
  isSelected,
  onSelect,
}: VoiceoverCardProps) {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const [hoveredTag, setHoveredTag] = useState<number | null>(null);

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
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = progressRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setProgress(Math.max(0, Math.min(100, percentage)));
    }
  };

  return (
    <motion.div className={`${plusJakarta.variable} font-plus-jakarta group`}>
      <div className="relative aspect-[3/4.5] rounded-3xl overflow-hidden shadow-2xl bg-gray-900">
        {/* Full Image */}
        {voice.profilePhoto ? (
          <Image
            src={voice.profilePhoto}
            alt={voice.name}
            fill
            className="absolute inset-0 object-cover filter grayscale-[85%] contrast-110"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
        )}

        {/* Elegant Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/95" />

        {/* Availability Banner */}
        {!voice.beschikbaar && (
          <div className="absolute top-0 left-0 right-0">
            <div className="bg-gradient-to-r from-amber-600/90 via-orange-600/90 to-amber-600/90 backdrop-blur-sm py-3">
              <div className="flex items-center justify-center gap-2">
                <CalendarIcon size={14} className="text-white" />
                <span className="text-white text-sm font-medium tracking-wide">
                  Beschikbaar op: {voice.availabilityText || '15 januari 2024'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Green Status - Only for Available */}
        {voice.beschikbaar && (
          <div className="absolute top-5 right-5">
            <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg">
              <div className="w-4 h-4 rounded-full bg-green-500 animate-ping" />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Tag Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {voice.tags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredTag(index)}
                onHoverEnd={() => setHoveredTag(null)}
                className={`text-center py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                  hoveredTag === index
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-white/80 backdrop-blur-sm'
                }`}
              >
                {tag}
              </motion.div>
            ))}
          </div>

          {/* Name */}
          <h1 className="font-plus-jakarta text-[4.2rem] leading-[0.85] font-extrabold text-white mb-4 tracking-tight">
            {voice.name}
          </h1>

          {/* Elegant Control Section */}
          <div className="bg-black/50 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between">
                {/* Play Control */}
                <motion.button
                  onClick={handlePlayClick}
                  className="flex items-center gap-3"
                  whileHover={{ x: 2 }}
                >
                  <div className="w-12 h-12 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center transition-all">
                    {showPlayer && isPlaying ? (
                      <PauseIcon size={20} className="text-white" fill="white" />
                    ) : (
                      <PlayIcon size={20} className="text-white ml-0.5" fill="white" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">
                      {showPlayer ? voice.demos[activeDemo].title : 'Demo afspelen'}
                    </p>
                    <p className="text-white/50 text-xs">{voice.demos[activeDemo].duration}</p>
                  </div>
                </motion.button>

                {/* Action Button */}
                {voice.beschikbaar && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSelect}
                    className={`group px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-white text-gray-900 shadow-lg'
                        : 'bg-white/85 text-gray-900 hover:bg-white backdrop-blur-sm'
                    }`}
                  >
                    {isSelected ? 'Ga verder' : 'Boeken'}
                    <ChevronRightIcon
                      size={16}
                      className={`transition-transform ${
                        isSelected ? 'translate-x-0.5' : 'group-hover:translate-x-0.5'
                      }`}
                    />
                  </motion.button>
                )}
              </div>

              {/* Expandable Advanced Player */}
              <AnimatePresence>
                {showPlayer && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    {/* Demo Pills */}
                    <div className="flex gap-1.5 mb-4">
                      {voice.demos.map((demo, index) => (
                        <button
                          key={demo.id}
                          onClick={() => {
                            setActiveDemo(index);
                            setProgress(0);
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            activeDemo === index
                              ? 'bg-white text-gray-900'
                              : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
                          }`}
                        >
                          {demo.title}
                        </button>
                      ))}
                    </div>

                    {/* Seekable Progress Bar */}
                    <div className="space-y-2">
                      <div
                        ref={progressRef}
                        className="relative h-1.5 bg-white/10 rounded-full cursor-pointer group/progress"
                        onClick={handleSeek}
                      >
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/90 to-white/70 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                        <motion.div
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl opacity-0 group-hover/progress:opacity-100 transition-opacity cursor-pointer"
                          style={{ left: `calc(${progress}% - 8px)` }}
                          drag="x"
                          dragConstraints={progressRef}
                          dragElastic={0}
                          onDrag={(_, info) => {
                            const rect = progressRef.current?.getBoundingClientRect();
                            if (rect) {
                              const x = info.point.x - rect.left;
                              const percentage = (x / rect.width) * 100;
                              setProgress(Math.max(0, Math.min(100, percentage)));
                            }
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-[10px] text-white/40 font-light">
                        <span>0:00</span>
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
