// Voiceover Section Header V5: Bento Grid Style
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Zap, Star, TrendingUp, Globe, Heart } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

interface VoiceoverSectionHeaderV5Props {
  allTags: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function VoiceoverSectionHeaderV5({
  allTags,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: VoiceoverSectionHeaderV5Props) {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const quickFilters = [
    {
      icon: Zap,
      label: 'Populair',
      action: () => onCategoryChange('Helder'),
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Star,
      label: 'Premium',
      action: () => onCategoryChange('Zakelijk'),
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      label: 'Trending',
      action: () => onCategoryChange('Jong & Energiek'),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Globe,
      label: 'Internationaal',
      action: () => onCategoryChange('Meertalig'),
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta mb-16`}>
      {/* Bento Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-6 mb-12">
        {/* Title Card - Spans 2 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

          <div className="relative z-10">
            <h2 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
              Vind de perfecte
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                voice-over
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-md">
              24 professionele stemmen voor elk project. Van commercials tot documentaires.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-8 relative z-10">
            <div>
              <p className="text-3xl font-bold text-white">24</p>
              <p className="text-gray-400 text-sm">Stemmen</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">12</p>
              <p className="text-gray-400 text-sm">Stijlen</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">4.9</p>
              <p className="text-gray-400 text-sm">Rating</p>
            </div>
          </div>
        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Zoeken
          </h3>

          <input
            type="text"
            placeholder="Naam of stijl..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent font-plus-jakarta text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />

          <div className="mt-4 space-y-2">
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-600 dark:text-gray-400">
              💡 Tip: Zoek op {'"'}warm{'"'} voor vriendelijke stemmen
            </button>
          </div>
        </motion.div>
      </div>

      {/* Quick Filter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickFilters.map((filter, index) => (
          <motion.button
            key={filter.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setActiveCard(filter.label)}
            onMouseLeave={() => setActiveCard(null)}
            onClick={filter.action}
            className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden group"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${filter.color} opacity-0 group-hover:opacity-10 transition-opacity`}
            />

            <div className="relative z-10">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${filter.color} rounded-xl flex items-center justify-center mb-3`}
              >
                <filter.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{filter.label}</h4>
            </div>

            {activeCard === filter.label && (
              <motion.div
                className="absolute top-2 right-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Category Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Filter op categorie</h3>
          {selectedCategory !== 'Alle' && (
            <button
              onClick={() => onCategoryChange('Alle')}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Wis filter ×
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange('Alle')}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
              selectedCategory === 'Alle'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Alle ({allTags.length + 1})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onCategoryChange(tag)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                selectedCategory === tag
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
