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

// Aurora gradient components
const AnimatedAuroraGradient = ({ colors }: { colors: string[] }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -inset-[100%] opacity-30 animate-[spin_20s_linear_infinite]">
      <div className={`absolute inset-0 bg-gradient-conic ${colors.join(' ')}`} />
    </div>
  </div>
);

const DotPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
      <svg width="100%" height="100%">
        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="2" fill="currentColor" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  </div>
);

export function VoiceoverAuroraThemeMockups() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={`space-y-24 p-4 md:p-8 bg-gray-50 ${plusJakarta.variable} font-plus-jakarta`}>
      
      {/* Version 1: Orange Aurora with Glass Morphism */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">VERSION 1: Orange Aurora with Glass Morphism</h3>
        
        <div className="bg-gradient-to-br from-amber-900 via-orange-900 to-amber-900 dark:from-black dark:via-orange-950 dark:to-black min-h-screen p-4 md:p-8 relative overflow-hidden">
          <AnimatedAuroraGradient colors={['from-orange-400', 'via-amber-400', 'to-orange-400']} />
          <DotPattern />
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4">
                <span className="relative inline-block">
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 blur-xl opacity-70 animate-pulse" />
                  <span className="relative bg-gradient-to-r from-orange-200 via-amber-200 to-orange-200 bg-clip-text text-transparent animate-[gradient_3s_ease-in-out_infinite] bg-[length:200%_auto]">
                    Vind jouw ideale stem
                  </span>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-orange-200/80 max-w-2xl mx-auto">
                14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
              </p>
            </div>

            {/* Search & Filter Section - Above Cards */}
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-300" />
                  <input
                    type="text"
                    placeholder="Zoek op naam of stijl..."
                    className="w-full pl-12 pr-4 py-3 bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['Warm', 'Helder', 'Autoriteit', 'Urban'].map((tag) => (
                    <button
                      key={tag}
                      className={`px-4 py-2.5 backdrop-blur-sm rounded-xl transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                          : 'bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 text-white/90 hover:bg-white/20'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                  <button className="px-3 py-2.5 bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-xl text-white/90 hover:bg-white/20">
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Voiceover Cards */}
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sampleVoices.map((voice) => (
                  <div key={voice.id} className="transform transition-all hover:scale-[1.02]">
                    <div className="bg-white/95 dark:bg-gray-900/95 rounded-xl p-1">
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

      {/* Version 2: Warm Sunset Aurora */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">VERSION 2: Warm Sunset Aurora</h3>
        
        <div className="bg-gradient-to-br from-orange-950 via-red-950 to-amber-950 dark:from-black dark:via-red-950 dark:to-black min-h-screen p-4 md:p-8 relative overflow-hidden">
          <AnimatedAuroraGradient colors={['from-red-500', 'via-orange-500', 'to-yellow-500']} />
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4">
                <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent animate-[shimmer_3s_linear_infinite] bg-[length:200%_auto]">
                  Vind jouw ideale stem
                </span>
              </h1>
              <p className="text-lg md:text-xl text-orange-100/70 max-w-2xl mx-auto">
                14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
              </p>
            </div>

            {/* Unified Search & Filter Bar */}
            <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-2 mb-8">
              <div className="flex flex-col lg:flex-row gap-2">
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                    <input
                      type="text"
                      placeholder="Zoek een stem..."
                      className="w-full pl-12 pr-4 py-3.5 bg-black/20 backdrop-blur-sm rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-white/60 px-3 hidden lg:block">Filter:</span>
                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                      {['Alle', 'Warm', 'Helder', 'Autoriteit'].map((tag) => (
                        <button
                          key={tag}
                          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                            tag === 'Alle'
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                              : 'bg-black/20 text-white/80 hover:bg-black/30'
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
                  <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transition-shadow p-1">
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

      {/* Version 3: Golden Hour Aurora */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">VERSION 3: Golden Hour Aurora</h3>
        
        <div className="bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900 dark:from-black dark:via-amber-950 dark:to-black min-h-screen p-4 md:p-8 relative overflow-hidden">
          <AnimatedAuroraGradient colors={['from-yellow-400', 'via-amber-500', 'to-orange-600']} />
          <DotPattern />
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 relative">
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 blur-2xl opacity-50" />
                <span className="relative bg-gradient-to-r from-yellow-200 via-amber-100 to-orange-200 bg-clip-text text-transparent">
                  Vind jouw ideale stem
                </span>
              </h1>
              <p className="text-lg md:text-xl text-amber-100/80 max-w-2xl mx-auto">
                14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
              </p>
            </div>

            {/* Floating Search & Filter Panel */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 blur-xl" />
              <div className="relative bg-black/30 backdrop-blur-2xl rounded-2xl border border-white/10 p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                    <input
                      type="text"
                      placeholder="Zoek op naam, stijl of type..."
                      className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-amber-400/30 rounded-xl text-white placeholder-amber-200/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-wrap gap-2 flex-1">
                      {['Warm & Vriendelijk', 'Helder', 'Autoriteit'].map((tag) => (
                        <button
                          key={tag}
                          className="px-4 py-2 bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 rounded-lg text-amber-100 hover:bg-amber-500/30 hover:border-amber-400/50 transition-all"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <button className="p-2.5 bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 rounded-lg text-amber-100 hover:bg-amber-500/30">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-6 text-sm">
                  <span className="text-amber-200/60">Actieve filters:</span>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm flex items-center gap-2">
                      Warm
                      <X className="w-3 h-3 cursor-pointer" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards Container */}
            <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">8 stemmen gevonden</h2>
                <select className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-amber-400">
                  <option>Meest relevant</option>
                  <option>Alfabetisch</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sampleVoices.map((voice) => (
                  <div key={voice.id} className="group">
                    <div className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-900 dark:to-amber-950/50 rounded-xl p-1 group-hover:from-amber-50 group-hover:to-orange-50 dark:group-hover:from-amber-950/50 dark:group-hover:to-orange-950/50 transition-all">
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

      {/* Version 4: Copper Glow Aurora */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">VERSION 4: Copper Glow Aurora</h3>
        
        <div className="bg-gradient-to-br from-orange-950 via-amber-950 to-yellow-950 dark:from-black dark:via-orange-950 dark:to-amber-950 min-h-screen p-4 md:p-8 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-orange-500/30 to-transparent rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-amber-500/30 to-transparent rounded-full blur-3xl animate-pulse animation-delay-2000" />
          </div>
          <AnimatedAuroraGradient colors={['from-orange-600', 'via-transparent', 'to-amber-600']} />
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4">
                <span className="bg-gradient-to-br from-orange-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,146,60,0.5)]">
                  Vind jouw ideale stem
                </span>
              </h1>
              <p className="text-lg md:text-xl text-orange-200/70 max-w-2xl mx-auto">
                14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
              </p>
            </div>

            {/* Compact Filter Bar */}
            <div className="bg-gradient-to-r from-black/40 via-black/30 to-black/40 backdrop-blur-2xl rounded-full p-1.5 mb-8 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-1.5">
                <div className="flex-1 relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
                  <input
                    type="text"
                    placeholder="Zoek..."
                    className="w-full pl-11 pr-5 py-3 bg-black/30 backdrop-blur-sm rounded-full text-white placeholder-orange-300/50 focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all text-sm"
                  />
                </div>
                <div className="flex gap-1.5">
                  {['Alle', 'Warm', 'Helder', 'Urban'].map((tag) => (
                    <button
                      key={tag}
                      className={`px-4 py-3 rounded-full text-sm transition-all whitespace-nowrap ${
                        tag === 'Alle'
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                          : 'bg-black/30 text-orange-200 hover:bg-black/40'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                  <button className="px-3 py-3 bg-black/30 rounded-full text-orange-200 hover:bg-black/40">
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
                  <div className="bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/50 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all p-1">
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

      {/* Version 5: Ember Aurora Minimalist */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">VERSION 5: Ember Aurora Minimalist</h3>
        
        <div className="bg-gradient-to-b from-gray-950 via-orange-950/50 to-gray-950 dark:from-black dark:via-orange-950/30 dark:to-black min-h-screen p-4 md:p-8 relative overflow-hidden">
          <AnimatedAuroraGradient colors={['from-orange-500/20', 'via-transparent', 'to-amber-500/20']} />
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Minimal Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
                Vind jouw ideale stem
              </h1>
              <p className="text-orange-300/70">
                14 professioneel getrainde voice-overs
              </p>
            </div>

            {/* Inline Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400/60" />
                <input
                  type="text"
                  placeholder="Zoek een stem..."
                  className="w-full pl-11 pr-4 py-2.5 bg-white/5 backdrop-blur-sm border border-orange-400/20 rounded-lg text-white placeholder-orange-300/40 focus:outline-none focus:bg-white/10 focus:border-orange-400/40 transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-orange-300/60">Quick filters:</span>
                {['Warm', 'Helder', 'Autoriteit'].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1.5 text-sm border border-orange-400/20 rounded-md text-orange-300/80 hover:bg-orange-400/10 hover:border-orange-400/40 hover:text-orange-300 transition-all"
                  >
                    {tag}
                  </button>
                ))}
                <button className="p-1.5 border border-orange-400/20 rounded-md text-orange-300/60 hover:bg-orange-400/10 hover:border-orange-400/40">
                  <Filter className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Clean Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sampleVoices.map((voice) => (
                <div key={voice.id} className="group cursor-pointer">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-amber-500/0 group-hover:from-orange-500/10 group-hover:to-amber-500/10 rounded-xl transition-all duration-300" />
                    <div className="relative bg-white/95 dark:bg-gray-900/95 rounded-xl overflow-hidden">
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
              <button className="px-6 py-2.5 border border-orange-400/30 rounded-lg text-orange-300/80 hover:bg-orange-400/10 hover:border-orange-400/50 hover:text-orange-300 transition-all">
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