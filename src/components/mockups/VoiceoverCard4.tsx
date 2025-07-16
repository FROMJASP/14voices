// Mockup 4: Instagram Stories-inspired Design
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

interface VoiceoverCardProps {
  voice: {
    id: string;
    name: string;
    profilePhoto?: string | null;
    tags: string[];
    beschikbaar: boolean;
    demos: Array<{ url: string; title: string }>;
  };
  isSelected: boolean;
  onSelect: () => void;
}

export function VoiceoverCard4({ voice, isSelected, onSelect }: VoiceoverCardProps) {
  const [isLiked, setIsLiked] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <motion.div
      className={`${plusJakarta.variable} font-plus-jakarta relative`}
      whileHover={{ y: -8 }}
    >
      {/* Story Card */}
      <div
        className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl overflow-hidden aspect-[9/16] cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        {/* Profile Image Background */}
        {voice.profilePhoto && (
          <div className="relative absolute inset-0">
            <Image src={voice.profilePhoto} alt={voice.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        )}

        {/* Story Ring Effect */}
        <div className="relative absolute top-4 left-4 p-1 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full">
          <div className="bg-white dark:bg-gray-900 p-0.5 rounded-full">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              {voice.profilePhoto ? (
                <Image src={voice.profilePhoto} alt={voice.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400" />
              )}
            </div>
          </div>
        </div>

        {/* Name and Status */}
        <div className="absolute top-4 left-20">
          <h3 className="text-white font-semibold">{voice.name}</h3>
          <p className="text-white/80 text-xs">{voice.beschikbaar ? 'Online' : 'Away'} • 2h</p>
        </div>

        {/* Play Button */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.button
            className="w-20 h-20 bg-white/90 backdrop-blur rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Play className="w-8 h-8 text-gray-900 ml-1" />
          </motion.button>
        </motion.div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Tags as Instagram-style labels */}
          <div className="flex gap-2 mb-4">
            {voice.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs text-white border border-white/30"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Interaction Buttons */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
                className="text-white"
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </motion.button>
              <button className="text-white">
                <MessageCircle className="w-6 h-6" />
              </button>
              <button className="text-white">
                <Send className="w-6 h-6" />
              </button>
            </div>
            <button className="text-white">
              <Bookmark className="w-6 h-6" />
            </button>
          </div>

          {/* Demo Count */}
          <p className="text-white text-sm mb-3">{voice.demos.length} voice demos</p>

          {/* Select Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            disabled={!voice.beschikbaar}
            className={`w-full py-3 rounded-2xl font-medium text-sm transition-all ${
              !voice.beschikbaar
                ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                : isSelected
                  ? 'bg-white text-gray-900'
                  : 'bg-white/20 backdrop-blur text-white border border-white/30 hover:bg-white/30'
            }`}
          >
            {!voice.beschikbaar
              ? 'Niet beschikbaar'
              : isSelected
                ? '✓ Geselecteerd'
                : 'Kies deze stem'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
