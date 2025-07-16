// Voiceover Section Header V2 Improved D: Visual Category Cards
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Layers, ChevronDown, Mic, Zap, Heart, Globe, Star } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

interface VoiceoverSectionHeaderV2ImprovedDProps {
  allTags: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function VoiceoverSectionHeaderV2ImprovedD({
  allTags,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: VoiceoverSectionHeaderV2ImprovedDProps) {
  const [showAllFilters, setShowAllFilters] = useState(false);

  // Category icons mapping
  const categoryIcons: { [key: string]: React.ReactElement } = {
    'Warm & Vriendelijk': <Heart className="w-5 h-5" />,
    Zakelijk: <Layers className="w-5 h-5" />,
    'Jong & Energiek': <Zap className="w-5 h-5" />,
    Meertalig: <Globe className="w-5 h-5" />,
    Commercieel: <Star className="w-5 h-5" />,
  };

  const getIcon = (tag: string) => categoryIcons[tag] || <Mic className="w-5 h-5" />;

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta mb-16`}>
      {/* Title and Search Section */}
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-7xl md:text-8xl font-black leading-[0.85] mb-6"
        >
          <span className="text-gray-900 dark:text-white">Jouw perfecte</span>
          <span className="block mt-2 relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600">
              voice-over
            </span>
            <motion.div
              className="absolute -inset-x-4 -inset-y-2 bg-gradient-to-r from-orange-600/20 via-pink-600/20 to-purple-600/20 blur-xl"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10"
        >
          24 unieke stemmen voor elk project. Van podcast tot commercial.
        </motion.p>

        {/* Centered Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto relative"
        >
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Zoek stemmen..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 font-plus-jakarta text-lg text-gray-900 dark:text-white placeholder-gray-400 shadow-xl hover:shadow-2xl transition-all"
          />
        </motion.div>
      </div>

      {/* Visual Filter Categories */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filter op categorie
          </h3>
          <button
            onClick={() => setShowAllFilters(!showAllFilters)}
            className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
          >
            {showAllFilters ? 'Minder tonen' : `Alle ${allTags.length} categorieën`}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showAllFilters ? 'rotate-180' : ''}`}
            />
          </button>
        </motion.div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* All Voices Card */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCategoryChange('Alle')}
            className={`col-span-2 md:col-span-1 lg:col-span-2 p-6 rounded-2xl transition-all ${
              selectedCategory === 'Alle'
                ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-600/20'
                : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  selectedCategory === 'Alle' ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                <Layers className="w-6 h-6" />
              </div>
              <span className="font-semibold">Alle stemmen</span>
              <span
                className={`text-sm mt-1 ${
                  selectedCategory === 'Alle' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                24 voices
              </span>
            </div>
          </motion.button>

          {/* Category Cards */}
          {allTags.slice(0, showAllFilters ? allTags.length : 4).map((tag, index) => (
            <motion.button
              key={tag}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * (index + 1) }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCategoryChange(tag)}
              className={`p-6 rounded-2xl transition-all ${
                selectedCategory === tag
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-600/20'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                    selectedCategory === tag ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  {getIcon(tag)}
                </div>
                <span className="font-medium text-sm line-clamp-2">{tag}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Show More/Less Indicator */}
        <AnimatePresence>
          {!showAllFilters && allTags.length > 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mt-4"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400">
                +{allTags.length - 4} meer categorieën
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Filter Bar */}
      <AnimatePresence>
        {selectedCategory !== 'Alle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-8 flex items-center justify-center"
          >
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <span className="text-purple-700 dark:text-purple-300 font-medium">
                Filter: {selectedCategory}
              </span>
              <button
                onClick={() => onCategoryChange('Alle')}
                className="p-1 hover:bg-purple-200 dark:hover:bg-purple-800/50 rounded-full transition-colors"
              >
                <span className="sr-only">Verwijder filter</span>
                <svg
                  className="w-4 h-4 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
