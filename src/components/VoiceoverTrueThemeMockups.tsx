'use client';

import React, { useState } from 'react';
import { Search, Filter, X, Play, Sparkles, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { VoiceoverCard } from './VoiceoverCard';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

// Sample voice data
const sampleVoices = [
  { id: '1', name: 'Gina', slug: 'gina', profilePhoto: null, tags: ['Warm', 'Vriendelijk'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '2', name: 'Sophie', slug: 'sophie', profilePhoto: null, tags: ['Helder', 'Professioneel'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '3', name: 'Mark', slug: 'mark', profilePhoto: null, tags: ['Autoriteit', 'Zakelijk'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '4', name: 'Lisa', slug: 'lisa', profilePhoto: null, tags: ['Jong', 'Energiek'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '5', name: 'Tom', slug: 'tom', profilePhoto: null, tags: ['Warm', 'Betrouwbaar'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '6', name: 'Eva', slug: 'eva', profilePhoto: null, tags: ['Urban', 'Modern'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '7', name: 'Jan', slug: 'jan', profilePhoto: null, tags: ['Autoriteit', 'Ervaren'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
  { id: '8', name: 'Nina', slug: 'nina', profilePhoto: null, tags: ['Helder', 'Vriendelijk'], beschikbaar: true, availabilityText: 'Direct beschikbaar', demos: [{ id: '1', title: 'Commercial', url: '#', duration: '0:30' }] },
];

// Aurora gradient components with theme colors
const AnimatedAuroraGradient = ({ colors }: { colors: string[] }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -inset-[100%] opacity-20 animate-[spin_20s_linear_infinite]">
      <div className={`absolute inset-0 bg-gradient-conic ${colors.join(' ')}`} />
    </div>
  </div>
);

const DotPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
      <svg width="100%" height="100%">
        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="2" fill="currentColor" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  </div>
);

export function VoiceoverTrueThemeMockups() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={`space-y-24 p-4 md:p-8 bg-gray-50 ${plusJakarta.variable} font-plus-jakarta`}>
      
      {/* Version 1: Brand Cream Aurora with Green Accents */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">VERSION 1: Brand Cream Aurora with Green Accents</h3>
        
        <div className="bg-[#fcf9f5] dark:bg-gray-950 min-h-screen p-4 md:p-8 relative overflow-hidden">
          <AnimatedAuroraGradient colors={['from-[#18f109]/20', 'via-[#efd243]/20', 'to-[#ffbc70]/20']} />
          <DotPattern />
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4">
                <span className="relative inline-block">
                  <span className="absolute inset-0 bg-gradient-to-r from-[#18f109] via-[#efd243] to-[#ffbc70] blur-xl opacity-30 animate-pulse" />
                  <span className="relative bg-gradient-to-r from-gray-900 via-[#76542d] to-gray-900 dark:from-white dark:via-[#ffdfa8] dark:to-white bg-clip-text text-transparent">
                    Vind jouw ideale stem
                  </span>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
              </p>
            </div>

            {/* Search & Filter Section - Glass morphism with theme colors */}
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#ffbc70]/20 dark:border-[#c57f08]/20 p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c57f08]" />
                  <input
                    type="text"
                    placeholder="Zoek op naam of stijl..."
                    className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-[#ebaa3a]/30 dark:border-[#c57f08]/30 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#18f109] focus:border-[#18f109] transition-all"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['Warm', 'Helder', 'Autoriteit', 'Urban'].map((tag) => (
                    <button
                      key={tag}
                      className={`px-4 py-2.5 backdrop-blur-sm rounded-xl transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-[#18f109] text-black shadow-lg shadow-[#18f109]/25'
                          : 'bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 hover:border-[#18f109] dark:hover:border-[#18f109]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                  <button className="px-3 py-2.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-xl hover:border-[#18f109] dark:hover:border-[#18f109]">
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Voiceover Cards */}
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#ffbc70]/20 dark:border-[#c57f08]/20 p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sampleVoices.map((voice) => (
                  <div key={voice.id} className="transform transition-all hover:scale-[1.02]">
                    <VoiceoverCard
                      voice={voice}
                      isSelected={false}
                      onSelect={() => {}}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version 2: Golden Hour with Green Glow */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">VERSION 2: Golden Hour with Green Glow</h3>
        
        <div className="bg-gradient-to-br from-[#fcf9f5] via-[#fafafa] to-[#fcf9f5] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen p-4 md:p-8 relative overflow-hidden">
          <AnimatedAuroraGradient colors={['from-[#efd243]/30', 'via-[#18f109]/20', 'to-[#ebaa3a]/30']} />
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4">
                <span className="bg-gradient-to-r from-[#c57f08] via-[#efd243] to-[#c57f08] bg-clip-text text-transparent animate-[shimmer_3s_linear_infinite] bg-[length:200%_auto]">
                  Vind jouw ideale stem
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
              </p>
            </div>

            {/* Unified Search & Filter Bar */}
            <div className="bg-gradient-to-r from-white/80 via-[#fcf9f5]/80 to-white/80 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#ebaa3a]/20 p-2 mb-8">
              <div className="flex flex-col lg:flex-row gap-2">
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c57f08]" />
                    <input
                      type="text"
                      placeholder="Zoek een stem..."
                      className="w-full pl-12 pr-4 py-3.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#18f109] transition-all"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 px-3 hidden lg:block">Filter:</span>
                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                      {['Alle', 'Warm', 'Helder', 'Autoriteit'].map((tag) => (
                        <button
                          key={tag}
                          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                            tag === 'Alle'
                              ? 'bg-[#18f109] text-black shadow-lg'
                              : 'bg-white/60 dark:bg-gray-800/60 hover:bg-[#18f109]/10 dark:hover:bg-[#18f109]/10'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sampleVoices.map((voice, index) => (
                <div 
                  key={voice.id} 
                  className="transform transition-all hover:scale-[1.03] hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow">
                    <VoiceoverCard
                      voice={voice}
                      isSelected={false}
                      onSelect={() => {}}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Version 3: Green Primary Focus */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">VERSION 3: Green Primary Focus</h3>
        
        <div className="bg-gradient-to-br from-[#18f109]/5 via-[#fcf9f5] to-[#efd243]/5 dark:from-gray-950 dark:via-gray-900 dark:to-[#c57f08]/5 min-h-screen p-4 md:p-8 relative overflow-hidden">
          <AnimatedAuroraGradient colors={['from-[#18f109]/15', 'via-transparent', 'to-[#18f109]/15']} />
          <DotPattern />
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 relative">
                <span className="absolute inset-0 bg-gradient-to-r from-[#18f109] to-[#efd243] blur-2xl opacity-20" />
                <span className="relative text-gray-900 dark:text-white">
                  Vind jouw ideale stem
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
              </p>
            </div>

            {/* Floating Search & Filter Panel */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-[#18f109]/10 via-[#efd243]/10 to-[#18f109]/10 blur-xl" />
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xl">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c57f08]" />
                    <input
                      type="text"
                      placeholder="Zoek op naam, stijl of type..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#18f109] focus:border-[#18f109] transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-wrap gap-2 flex-1">
                      {['Warm & Vriendelijk', 'Helder', 'Autoriteit'].map((tag) => (
                        <button
                          key={tag}
                          className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#18f109] hover:bg-[#18f109]/5 transition-all"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <button className="p-2.5 bg-[#18f109] text-black rounded-lg shadow-lg hover:bg-[#18f109]/90">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-6 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Actieve filters:</span>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-[#18f109] text-black rounded-full text-sm flex items-center gap-2 font-medium">
                      Warm
                      <X className="w-3 h-3 cursor-pointer" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards Container */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">8 stemmen gevonden</h2>
                <select className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#18f109]">
                  <option>Meest relevant</option>
                  <option>Alfabetisch</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sampleVoices.map((voice) => (
                  <div key={voice.id} className="group">
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-1 group-hover:from-[#18f109]/10 group-hover:to-[#efd243]/10 transition-all">
                      <VoiceoverCard
                        voice={voice}
                        isSelected={false}
                        onSelect={() => {}}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version 4: Sidebar Yellow Glow */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">VERSION 4: Sidebar Yellow Glow</h3>
        
        <div className="bg-[#fcf9f5] dark:bg-gray-950 min-h-screen p-4 md:p-8 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[#efd243]/20 to-transparent rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-[#18f109]/10 to-transparent rounded-full blur-3xl animate-pulse animation-delay-2000" />
          </div>
          <AnimatedAuroraGradient colors={['from-[#efd243]/15', 'via-transparent', 'to-[#ffbc70]/15']} />
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4">
                <span className="bg-gradient-to-br from-[#76542d] via-[#c57f08] to-[#76542d] dark:from-[#ffdfa8] dark:via-[#efd243] dark:to-[#ffdfa8] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(239,210,67,0.3)]">
                  Vind jouw ideale stem
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
              </p>
            </div>

            {/* Compact Filter Bar */}
            <div className="bg-gradient-to-r from-white/90 via-[#fcf9f5]/90 to-white/90 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90 backdrop-blur-2xl rounded-full p-1.5 mb-8 max-w-4xl mx-auto shadow-xl">
              <div className="flex flex-col sm:flex-row gap-1.5">
                <div className="flex-1 relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c57f08]" />
                  <input
                    type="text"
                    placeholder="Zoek..."
                    className="w-full pl-11 pr-5 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#18f109] transition-all text-sm"
                  />
                </div>
                <div className="flex gap-1.5">
                  {['Alle', 'Warm', 'Helder', 'Urban'].map((tag) => (
                    <button
                      key={tag}
                      className={`px-4 py-3 rounded-full text-sm transition-all whitespace-nowrap ${
                        tag === 'Alle'
                          ? 'bg-[#18f109] text-black shadow-lg shadow-[#18f109]/25'
                          : 'bg-white/70 dark:bg-gray-800/70 hover:bg-[#efd243]/20'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                  <button className="px-3 py-3 bg-white/70 dark:bg-gray-800/70 rounded-full hover:bg-[#efd243]/20">
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Minimal Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sampleVoices.map((voice, index) => (
                <div 
                  key={voice.id} 
                  className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl hover:shadow-[#efd243]/10 transition-all">
                    <VoiceoverCard
                      voice={voice}
                      isSelected={false}
                      onSelect={() => {}}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Version 5: Minimalist Brand */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">VERSION 5: Minimalist Brand</h3>
        
        <div className="bg-[#fcf9f5] dark:bg-gray-950 min-h-screen p-4 md:p-8 relative overflow-hidden">
          <AnimatedAuroraGradient colors={['from-[#18f109]/10', 'via-transparent', 'to-[#ebaa3a]/10']} />
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Minimal Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white">
                Vind jouw ideale stem
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                14 professioneel getrainde voice-overs
              </p>
            </div>

            {/* Inline Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c57f08]/60" />
                <input
                  type="text"
                  placeholder="Zoek een stem..."
                  className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-[#18f109] transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Quick filters:</span>
                {['Warm', 'Helder', 'Autoriteit'].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-800 rounded-md hover:bg-[#18f109]/10 hover:border-[#18f109] transition-all"
                  >
                    {tag}
                  </button>
                ))}
                <button className="p-1.5 border border-gray-200 dark:border-gray-800 rounded-md hover:bg-[#18f109]/10 hover:border-[#18f109]">
                  <Filter className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Clean Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sampleVoices.map((voice) => (
                <div key={voice.id} className="group cursor-pointer">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#18f109]/0 to-[#efd243]/0 group-hover:from-[#18f109]/5 group-hover:to-[#efd243]/5 rounded-xl transition-all duration-300" />
                    <div className="relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                      <VoiceoverCard
                        voice={voice}
                        isSelected={false}
                        onSelect={() => {}}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="px-6 py-2.5 border border-[#c57f08]/30 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-[#efd243]/10 hover:border-[#c57f08]/50 transition-all">
                Toon meer stemmen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

<style jsx>{`
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes gradient {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
`}</style>