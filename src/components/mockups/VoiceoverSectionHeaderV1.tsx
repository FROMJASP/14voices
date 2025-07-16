// Voiceover Section Header V1: Minimalist Elegance
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

interface VoiceoverSectionHeaderV1Props {
  allTags: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function VoiceoverSectionHeaderV1({
  allTags,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: VoiceoverSectionHeaderV1Props) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta mb-16`}>
      {/* Title Section */}
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-7xl md:text-8xl font-black text-gray-900 dark:text-white leading-[0.9] mb-6"
        >
          Vind jouw
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-900 dark:from-gray-300 dark:to-white">
            perfecte stem
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Ontdek professionele stemmen voor jouw project. Van commercials tot documentaires.
        </motion.p>
      </div>

      {/* Search Bar - Centered */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto mb-10"
      >
        <div
          className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl blur-xl opacity-50" />
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Zoek op naam, stijl of eigenschap..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-14 pr-6 py-5 bg-white dark:bg-gray-800 border-2 border-transparent rounded-2xl focus:outline-none focus:border-gray-900 dark:focus:border-white font-plus-jakarta text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-lg text-lg transition-all"
            />
          </div>
        </div>
      </motion.div>

      {/* Filter Tags - Minimalist Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center"
      >
        <div className="flex gap-3 overflow-x-auto pb-4 px-4 max-w-4xl">
          <button
            onClick={() => onCategoryChange('Alle')}
            className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
              selectedCategory === 'Alle'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Alle stemmen
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onCategoryChange(tag)}
              className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
                selectedCategory === tag
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Active Filter Indicator */}
      {selectedCategory !== 'Alle' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-6"
        >
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Filter actief: <span className="font-semibold">{selectedCategory}</span>
          </span>
        </motion.div>
      )}
    </div>
  );
}
