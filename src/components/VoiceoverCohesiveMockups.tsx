'use client';

import React, { useState } from 'react';
import { Search, Filter, X, Check, Play, Calendar } from 'lucide-react';
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

const allTags = ['Warm', 'Vriendelijk', 'Helder', 'Professioneel', 'Autoriteit', 'Zakelijk', 'Jong', 'Energiek', 'Urban', 'Modern', 'Betrouwbaar', 'Ervaren'];

export function VoiceoverCohesiveMockups() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={`space-y-24 p-4 md:p-8 bg-gray-50 ${plusJakarta.variable} font-plus-jakarta`}>
      
      {/* Mockup 1: Unified Container Design */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 1: Unified Container Design</h3>
        
        <div className="bg-[#fcf9f5] dark:bg-gray-900 min-h-screen p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4">
                Vind jouw ideale stem
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
              </p>
            </div>

            {/* Unified Content Container */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
              {/* Search & Filter Header */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Zoek een stem..."
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {['Warm', 'Helder', 'Autoriteit', 'Urban'].map((tag) => (
                      <button
                        key={tag}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          selectedTags.includes(tag)
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                            : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-white'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                    <button className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-900 dark:hover:border-white">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Voiceover Grid */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sampleVoices.map((voice) => (
                    <VoiceoverCard
                      key={voice.id}
                      voice={voice}
                      isSelected={false}
                      onSelect={() => {}}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mockup 2: Seamless Flow Design */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 2: Seamless Flow Design</h3>
        
        <div className="bg-gradient-to-b from-[#fcf9f5] to-white dark:from-gray-900 dark:to-gray-950 min-h-screen p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Integrated Header */}
            <div className="bg-white dark:bg-gray-800 rounded-t-3xl shadow-lg px-8 pt-12 pb-6">
              <h1 className="text-4xl md:text-5xl font-black text-center mb-3">
                Vind jouw ideale stem
              </h1>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                14 professioneel getrainde voice-overs
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative mb-6">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek op naam, stijl of project type..."
                  className="w-full pl-14 pr-5 py-4 bg-gray-50 dark:bg-gray-700 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                />
              </div>
              
              {/* Filter Pills */}
              <div className="flex justify-center gap-2 flex-wrap">
                <button className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full">
                  Alle stemmen
                </button>
                {['Warm & Vriendelijk', 'Helder', 'Autoriteit', 'Urban'].map((tag) => (
                  <button
                    key={tag}
                    className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Continuous Card Section */}
            <div className="bg-white dark:bg-gray-800 rounded-b-3xl shadow-lg px-8 pb-8">
              <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sampleVoices.map((voice) => (
                    <div key={voice.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-1">
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

      {/* Mockup 3: Sidebar Integration */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 3: Sidebar Integration</h3>
        
        <div className="bg-[#fcf9f5] dark:bg-gray-900 min-h-screen p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-black mb-2">Vind jouw ideale stem</h1>
              <p className="text-gray-600 dark:text-gray-400">14 professioneel getrainde voice-overs</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Integrated Sidebar */}
              <div className="lg:w-80">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-4">
                  <h3 className="font-semibold mb-4 text-lg">Zoek & Filter</h3>
                  
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Zoek een stem..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3 text-sm text-gray-600 dark:text-gray-400">Stijl</h4>
                      <div className="space-y-2">
                        {['Warm & Vriendelijk', 'Helder', 'Autoriteit', 'Urban', 'Zakelijk'].map((tag) => (
                          <label key={tag} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded" />
                            <span className="flex-1">{tag}</span>
                            <span className="text-xs text-gray-500">({Math.floor(Math.random() * 5) + 2})</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Geselecteerde filters:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-sm flex items-center gap-2">
                          Warm
                          <X className="w-3 h-3 cursor-pointer" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">8 stemmen gevonden</h2>
                    <select className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white">
                      <option>Meest relevant</option>
                      <option>Alfabetisch</option>
                      <option>Nieuwste eerst</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sampleVoices.slice(0, 6).map((voice) => (
                      <VoiceoverCard
                        key={voice.id}
                        voice={voice}
                        isSelected={false}
                        onSelect={() => {}}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mockup 4: Minimal Integrated Design */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 4: Minimal Integrated Design</h3>
        
        <div className="bg-white dark:bg-gray-950 min-h-screen">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {/* Compact Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Vind jouw ideale stem</h1>
              <p className="text-gray-600 dark:text-gray-400">14 professioneel getrainde voice-overs</p>
            </div>

            {/* Integrated Controls Bar */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Zoek..."
                    className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-800 rounded-lg border-0 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">Filter:</span>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium">
                      Alle
                    </button>
                    <button className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-sm">
                      Warm
                    </button>
                    <button className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-sm">
                      Helder
                    </button>
                    <button className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-sm">
                      Autoriteit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sampleVoices.map((voice) => (
                <VoiceoverCard
                  key={voice.id}
                  voice={voice}
                  isSelected={false}
                  onSelect={() => {}}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="px-6 py-3 bg-gray-100 dark:bg-gray-900 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                Toon meer stemmen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mockup 5: Card-Based Unified System */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 5: Card-Based Unified System</h3>
        
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Title Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 mb-6 text-center">
              <h1 className="text-4xl md:text-5xl font-black mb-3">Vind jouw ideale stem</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">14 professioneel getrainde voice-overs</p>
            </div>

            {/* Search & Filter Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Zoek op naam of stijl..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                  <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Quick filters:</span>
                  {['Warm', 'Helder', 'Autoriteit'].map((tag) => (
                    <button
                      key={tag}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 whitespace-nowrap text-sm"
                    >
                      {tag}
                    </button>
                  ))}
                  <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Beschikbare stemmen</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">8 resultaten</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h4M4 12h4m-4 6h4m4-12h12m-12 6h12m-12 6h12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sampleVoices.map((voice) => (
                  <VoiceoverCard
                    key={voice.id}
                    voice={voice}
                    isSelected={false}
                    onSelect={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}