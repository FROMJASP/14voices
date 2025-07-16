// Voiceover Section Header V3: Interactive Tag Cloud
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

interface VoiceoverSectionHeaderV3Props {
  allTags: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function VoiceoverSectionHeaderV3({
  allTags,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: VoiceoverSectionHeaderV3Props) {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  // Arrange tags in a cloud-like pattern
  const getTagStyle = (index: number) => {
    const styles = [
      'col-span-2',
      'col-span-1',
      'col-span-1',
      'col-span-2',
      'col-span-1',
      'col-span-2',
      'col-span-1',
      'col-span-1',
      'col-span-2',
      'col-span-1',
    ];
    return styles[index % styles.length];
  };

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta mb-16`}>
      {/* Title with Integrated Search */}
      <div className="max-w-4xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white leading-tight">
            Welke{' '}
            <span className="relative inline-block">
              stem
              <Sparkles className="absolute -top-6 -right-6 w-8 h-8 text-yellow-500 animate-pulse" />
            </span>{' '}
            zoek je?
          </h2>
        </motion.div>

        {/* Integrated Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative flex items-center">
              <Search className="absolute left-6 w-5 h-5 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Type een naam of stijl..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 font-plus-jakarta text-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              />
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => onSearchChange('')}
                  className="absolute right-6 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-gray-600 dark:text-gray-300">×</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Interactive Tag Cloud */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-5xl mx-auto"
      >
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">Of kies een categorie:</p>

        <div className="grid grid-cols-4 md:grid-cols-6 gap-3 px-4">
          {/* All Voices - Special Style */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange('Alle')}
            onMouseEnter={() => setHoveredTag('Alle')}
            onMouseLeave={() => setHoveredTag(null)}
            className={`col-span-2 relative px-6 py-4 rounded-2xl font-semibold transition-all ${
              selectedCategory === 'Alle'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl'
                : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700'
            }`}
          >
            <span className="relative z-10">Alle stemmen</span>
            {hoveredTag === 'Alle' && selectedCategory !== 'Alle' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </motion.button>

          {/* Tag Cloud */}
          {allTags.map((tag, index) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(tag)}
              onMouseEnter={() => setHoveredTag(tag)}
              onMouseLeave={() => setHoveredTag(null)}
              className={`${getTagStyle(index)} relative px-4 py-3 rounded-xl font-medium transition-all ${
                selectedCategory === tag
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
            >
              <span className="relative z-10 text-sm md:text-base">{tag}</span>
              {hoveredTag === tag && selectedCategory !== tag && (
                <motion.div
                  className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-700 dark:text-gray-300">24 stemmen</span>{' '}
            gevonden
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
