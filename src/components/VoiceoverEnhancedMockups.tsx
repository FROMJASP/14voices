'use client';

import React, { useState } from 'react';
import { Search, Filter, X, Play, Sparkles, ChevronRight } from 'lucide-react';
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
];

// Magic UI inspired components
const AnimatedText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-block animate-[fadeInUp_0.5s_ease-out] ${className}`}>
    {children}
  </span>
);

const FlickeringGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '40px 40px'
      }} />
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

const AnimatedGradient = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -inset-[100%] opacity-30 animate-[spin_20s_linear_infinite]">
      <div className="absolute inset-0 bg-gradient-conic from-orange-500 via-transparent to-orange-500" />
    </div>
  </div>
);

export function VoiceoverEnhancedMockups() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={`space-y-24 p-4 md:p-8 bg-gray-50 ${plusJakarta.variable} font-plus-jakarta`}>
      
      {/* Enhanced Version 1: Animated Typography with Flickering Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">ENHANCED VERSION 1: Animated Typography & Grid Background</h3>
        
        <div className="bg-gradient-to-br from-orange-50 via-[#fcf9f5] to-amber-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 min-h-screen p-4 md:p-8 relative">
          <FlickeringGrid />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 bg-gradient-to-r from-gray-900 via-orange-900 to-amber-900 dark:from-white dark:via-orange-200 dark:to-amber-200 bg-clip-text text-transparent">
                <AnimatedText>Vind jouw ideale stem</AnimatedText>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                <AnimatedText className="delay-100">
                  14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
                </AnimatedText>
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Enhanced Sidebar with Theme Colors */}
              <div className="lg:w-80">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 dark:border-orange-900/20 p-6 sticky top-4">
                  <h3 className="font-bold mb-4 text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    Zoek & Filter
                  </h3>
                  
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                    <input
                      type="text"
                      placeholder="Zoek een stem..."
                      className="w-full pl-10 pr-4 py-3 bg-orange-50 dark:bg-gray-700 border border-orange-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3 text-sm text-gray-600 dark:text-gray-400">Stijl</h4>
                      <div className="space-y-2">
                        {['Warm & Vriendelijk', 'Helder', 'Autoriteit', 'Urban', 'Zakelijk'].map((tag) => (
                          <label key={tag} className="flex items-center gap-3 p-2.5 hover:bg-orange-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                            <input type="checkbox" className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500" />
                            <span className="flex-1 text-gray-700 dark:text-gray-300">{tag}</span>
                            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                              {Math.floor(Math.random() * 5) + 2}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-orange-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Geselecteerde filters:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm flex items-center gap-2 shadow-sm">
                          Warm
                          <X className="w-3 h-3 cursor-pointer hover:opacity-70" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content with Proper Heights */}
              <div className="flex-1">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 dark:border-orange-900/20 p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-orange-900 dark:from-white dark:to-orange-200 bg-clip-text text-transparent">
                      6 stemmen gevonden
                    </h2>
                    <select className="px-4 py-2 bg-orange-50 dark:bg-gray-700 rounded-lg border border-orange-200 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400">
                      <option>Meest relevant</option>
                      <option>Alfabetisch</option>
                      <option>Nieuwste eerst</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sampleVoices.map((voice) => (
                      <div key={voice.id} className="transform transition-all hover:scale-[1.02] hover:-translate-y-1">
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
        </div>
      </div>

      {/* Enhanced Version 2: Aurora Background with Morphing Text */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">ENHANCED VERSION 2: Aurora Background & Dynamic Text</h3>
        
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-purple-950 dark:to-black min-h-screen p-4 md:p-8 relative overflow-hidden">
          <AnimatedGradient />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent animate-[gradient_3s_ease-in-out_infinite] bg-[length:200%_auto]">
                  Vind jouw ideale stem
                </span>
              </h1>
              <p className="text-lg md:text-xl text-purple-200/80 max-w-2xl mx-auto">
                14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Glass Morphism Sidebar */}
              <div className="lg:w-80">
                <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-6 sticky top-4">
                  <h3 className="font-bold mb-4 text-lg text-white flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    Zoek & Filter
                  </h3>
                  
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                    <input
                      type="text"
                      placeholder="Zoek een stem..."
                      className="w-full pl-10 pr-4 py-3 bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3 text-sm text-purple-200">Stijl</h4>
                      <div className="space-y-2">
                        {['Warm & Vriendelijk', 'Helder', 'Autoriteit', 'Urban', 'Zakelijk'].map((tag) => (
                          <label key={tag} className="flex items-center gap-3 p-2.5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors">
                            <input type="checkbox" className="w-4 h-4 rounded bg-white/20 border-white/30 text-purple-400 focus:ring-purple-400" />
                            <span className="flex-1 text-white/90">{tag}</span>
                            <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
                              {Math.floor(Math.random() * 5) + 2}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/20">
                      <p className="text-sm text-purple-200 mb-3">Geselecteerde filters:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm flex items-center gap-2 shadow-lg">
                          Warm
                          <X className="w-3 h-3 cursor-pointer hover:opacity-70" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">
                      6 stemmen gevonden
                    </h2>
                    <select className="px-4 py-2 bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-400">
                      <option>Meest relevant</option>
                      <option>Alfabetisch</option>
                      <option>Nieuwste eerst</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
        </div>
      </div>

      {/* Enhanced Version 3: Dot Pattern with Shiny Text */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">ENHANCED VERSION 3: Dot Pattern & Shiny Effects</h3>
        
        <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 min-h-screen p-4 md:p-8 relative">
          <DotPattern />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 relative">
                <span className="relative inline-block">
                  <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 blur-xl opacity-70 animate-pulse" />
                  <span className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                    Vind jouw ideale stem
                  </span>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto relative">
                <span className="relative inline-block">
                  14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
                </span>
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Modern Sidebar */}
              <div className="lg:w-80">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 sticky top-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full blur-2xl" />
                  <h3 className="font-bold mb-4 text-lg text-gray-900 dark:text-white relative">
                    Zoek & Filter
                  </h3>
                  
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Zoek een stem..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3 text-sm text-gray-600 dark:text-gray-400">Stijl</h4>
                      <div className="space-y-2">
                        {['Warm & Vriendelijk', 'Helder', 'Autoriteit', 'Urban', 'Zakelijk'].map((tag, index) => (
                          <label key={tag} className="flex items-center gap-3 p-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-all group">
                            <input type="checkbox" className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500" />
                            <span className="flex-1 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{tag}</span>
                            <span className="text-xs text-gray-500 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 px-2 py-1 rounded-full">
                              {Math.floor(Math.random() * 5) + 2}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Geselecteerde filters:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow">
                          Warm
                          <X className="w-3 h-3 cursor-pointer hover:opacity-70" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-400/10 to-transparent rounded-full blur-3xl" />
                  <div className="flex justify-between items-center mb-6 relative">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      6 stemmen gevonden
                    </h2>
                    <select className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500">
                      <option>Meest relevant</option>
                      <option>Alfabetisch</option>
                      <option>Nieuwste eerst</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 relative">
                    {sampleVoices.map((voice, index) => (
                      <div 
                        key={voice.id} 
                        className="transform transition-all hover:scale-[1.02] hover:-translate-y-1"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
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
        </div>
      </div>

      {/* Enhanced Version 4: Animated Grid Pattern with Number Ticker */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">ENHANCED VERSION 4: Animated Grid & Dynamic Numbers</h3>
        
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-950 dark:to-black min-h-screen p-4 md:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] animate-[grid_20s_linear_infinite]" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4">
                <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                  Vind jouw ideale stem
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-white animate-[numberTick_2s_ease-out]">14</span>
                professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Neon Accent Sidebar */}
              <div className="lg:w-80">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-6 sticky top-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-transparent rounded-2xl" />
                  <h3 className="font-bold mb-4 text-lg text-white relative flex items-center gap-2">
                    <div className="w-8 h-[2px] bg-gradient-to-r from-orange-500 to-transparent" />
                    Zoek & Filter
                  </h3>
                  
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Zoek een stem..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3 text-sm text-gray-400">Stijl</h4>
                      <div className="space-y-2">
                        {['Warm & Vriendelijk', 'Helder', 'Autoriteit', 'Urban', 'Zakelijk'].map((tag) => (
                          <label key={tag} className="flex items-center gap-3 p-2.5 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-all group">
                            <input type="checkbox" className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500/50" />
                            <span className="flex-1 text-gray-300 group-hover:text-white transition-colors">{tag}</span>
                            <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded-full group-hover:bg-gray-700 transition-colors">
                              {Math.floor(Math.random() * 5) + 2}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-sm text-gray-400 mb-3">Geselecteerde filters:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-full text-sm flex items-center gap-2 hover:bg-orange-500/30 transition-colors">
                          Warm
                          <X className="w-3 h-3 cursor-pointer hover:text-orange-300" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                      <span className="text-3xl font-black text-orange-500 animate-[numberTick_2s_ease-out]">6</span>
                      stemmen gevonden
                    </h2>
                    <select className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500/50">
                      <option>Meest relevant</option>
                      <option>Alfabetisch</option>
                      <option>Nieuwste eerst</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sampleVoices.map((voice) => (
                      <div key={voice.id} className="group">
                        <div className="bg-gray-900/50 rounded-xl p-1 group-hover:bg-gray-900/70 transition-colors">
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
        </div>
      </div>

      {/* Enhanced Version 5: Ripple Background with Hyper Text */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">ENHANCED VERSION 5: Ripple Effects & Interactive Typography</h3>
        
        <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-950 dark:to-black min-h-screen p-4 md:p-8 relative overflow-hidden">
          {/* Ripple Effect Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-[800px] h-[800px] rounded-full border border-orange-200/20 dark:border-orange-500/10 animate-[ripple_4s_ease-out_infinite]" />
              <div className="w-[600px] h-[600px] rounded-full border border-orange-200/30 dark:border-orange-500/20 animate-[ripple_4s_ease-out_infinite_1s] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <div className="w-[400px] h-[400px] rounded-full border border-orange-200/40 dark:border-orange-500/30 animate-[ripple_4s_ease-out_infinite_2s] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 relative group cursor-default">
                <span className="relative inline-block transition-all duration-300 hover:scale-105">
                  <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 dark:from-orange-400 dark:via-amber-400 dark:to-orange-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
                    Vind jouw ideale stem
                  </span>
                  <span className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 opacity-30 blur-lg group-hover:opacity-40 transition-opacity" />
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Premium Sidebar */}
              <div className="lg:w-80">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-200 dark:border-orange-900/50 p-6 sticky top-4 relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl animate-pulse" />
                  <h3 className="font-bold mb-4 text-lg text-gray-900 dark:text-white relative flex items-center justify-between">
                    Zoek & Filter
                    <ChevronRight className="w-5 h-5 text-orange-500 animate-pulse" />
                  </h3>
                  
                  <div className="relative mb-6 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 group-focus-within:text-orange-600 transition-colors" />
                    <input
                      type="text"
                      placeholder="Zoek een stem..."
                      className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-800 border-2 border-orange-200 dark:border-orange-900/50 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3 text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">Stijl</h4>
                      <div className="space-y-2">
                        {['Warm & Vriendelijk', 'Helder', 'Autoriteit', 'Urban', 'Zakelijk'].map((tag) => (
                          <label key={tag} className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 dark:hover:from-gray-800 dark:hover:to-gray-800 rounded-lg cursor-pointer transition-all group">
                            <input type="checkbox" className="w-4 h-4 rounded-md text-orange-500 focus:ring-orange-500 focus:ring-offset-0" />
                            <span className="flex-1 text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{tag}</span>
                            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2.5 py-1 rounded-full">
                              {Math.floor(Math.random() * 5) + 2}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t-2 border-orange-200 dark:border-orange-900/50">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">Geselecteerde filters:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                          Warm
                          <X className="w-4 h-4 cursor-pointer hover:rotate-90 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-200 dark:border-orange-900/50 p-6 md:p-8 relative overflow-hidden">
                  <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-orange-400/10 to-amber-400/10 rounded-full blur-3xl" />
                  <div className="flex justify-between items-center mb-6 relative">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="text-3xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">6</span>
                      stemmen gevonden
                    </h2>
                    <select className="px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-800 border-2 border-orange-200 dark:border-orange-900/50 rounded-lg font-medium focus:ring-4 focus:ring-orange-500/20 focus:border-orange-400">
                      <option>Meest relevant</option>
                      <option>Alfabetisch</option>
                      <option>Nieuwste eerst</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 relative">
                    {sampleVoices.map((voice, index) => (
                      <div 
                        key={voice.id} 
                        className="transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:rotate-1"
                        style={{ 
                          animationDelay: `${index * 150}ms`,
                          animation: 'fadeInUp 0.6s ease-out forwards'
                        }}
                      >
                        <div className="bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-1 shadow-lg hover:shadow-2xl transition-shadow">
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
  
  @keyframes grid {
    0% { transform: translateX(0); }
    100% { transform: translateX(50px); }
  }
  
  @keyframes numberTick {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); opacity: 1; }
  }
  
  @keyframes ripple {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
`}</style>