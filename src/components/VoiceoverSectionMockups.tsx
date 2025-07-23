'use client';

import React from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, Play } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

// Sample voiceover card component for mockups
const VoiceoverCardMock = ({ name = 'Gina' }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
    <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 relative">
      <div className="absolute top-3 right-3 w-2 h-2 bg-green-500 rounded-full" />
      <div className="absolute bottom-4 left-4 right-4">
        <button className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
          <Play className="w-5 h-5 text-gray-900 ml-1" />
        </button>
      </div>
    </div>
    <h3 className="font-semibold text-lg mb-2">{name}</h3>
    <div className="flex gap-2 flex-wrap">
      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Warm</span>
      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Vriendelijk</span>
    </div>
  </div>
);

export function VoiceoverSectionMockups() {
  return (
    <div className={`space-y-32 p-8 bg-gray-50 ${plusJakarta.variable} font-plus-jakarta`}>
      
      {/* Mockup 1: Contained Section with Background */}
      <div className="space-y-0">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 1: Contained Section with Distinct Background</h3>
        
        {/* Header Section */}
        <div className="bg-[#fcf9f5] pb-20">
          <div className="max-w-7xl mx-auto px-6 pt-20">
            <div className="text-center mb-14">
              <h2 className="text-7xl md:text-8xl font-black leading-[0.85] mb-8">
                <span className="block text-gray-900">Vind jouw</span>
                <span className="block text-gray-700 mt-2">ideale stem</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
                14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Zoek op naam of stijl..." className="w-full pl-14 pr-5 py-4 bg-gray-50 rounded-xl" />
                </div>
                <button className="px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold">
                  <SlidersHorizontal className="w-5 h-5 inline mr-2" />
                  Filters
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter Section (when open) */}
        <div className="bg-white border-y border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Filter op stijl</h3>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button className="px-5 py-3 bg-gray-900 text-white rounded-xl">Alle stemmen</button>
              <button className="px-5 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">Autoriteit</button>
              <button className="px-5 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">Helder</button>
            </div>
          </div>
        </div>
        
        {/* Voiceovers Section with Background */}
        <div className="bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-900">Onze Stemmen</h3>
              <p className="text-gray-600 mt-2">Klik op een stem om demo's te beluisteren</p>
            </div>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              <VoiceoverCardMock name="Gina" />
              <VoiceoverCardMock name="Sophie" />
              <VoiceoverCardMock name="Mark" />
              <VoiceoverCardMock name="Lisa" />
            </div>
          </div>
        </div>
      </div>

      {/* Mockup 2: Card-Based Layout */}
      <div className="space-y-0">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 2: Card-Based Sections</h3>
        
        <div className="bg-[#fcf9f5] py-20">
          <div className="max-w-7xl mx-auto px-6 space-y-8">
            {/* Header Card */}
            <div className="bg-white rounded-3xl p-12 shadow-lg">
              <div className="text-center">
                <h2 className="text-6xl md:text-7xl font-black leading-[0.85] mb-6">
                  Vind jouw ideale stem
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                  14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
                </p>
                <div className="max-w-2xl mx-auto flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Zoek op naam of stijl..." className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-xl" />
                  </div>
                  <button className="px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold">
                    Filters
                  </button>
                </div>
              </div>
            </div>
            
            {/* Filter Card (when open) */}
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <h3 className="text-xl font-bold mb-4">Filter op stijl</h3>
              <div className="flex gap-3 flex-wrap">
                <button className="px-5 py-3 bg-gray-900 text-white rounded-xl">Alle stemmen</button>
                <button className="px-5 py-3 bg-gray-50 rounded-xl hover:bg-gray-100">Autoriteit</button>
                <button className="px-5 py-3 bg-gray-50 rounded-xl hover:bg-gray-100">Helder</button>
              </div>
            </div>
            
            {/* Voiceovers Card */}
            <div className="bg-white rounded-3xl p-10 shadow-lg">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Beschikbare Stemmen</h3>
                  <p className="text-gray-600 mt-1">14 professionals tot je beschikking</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Toon</p>
                  <p className="text-lg font-semibold">4 van 14</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <VoiceoverCardMock name="Gina" />
                <VoiceoverCardMock name="Sophie" />
                <VoiceoverCardMock name="Mark" />
                <VoiceoverCardMock name="Lisa" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mockup 3: Sidebar Filter Design */}
      <div className="space-y-0">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 3: Sidebar Filter Layout</h3>
        
        <div className="bg-[#fcf9f5] min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-20">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-6xl md:text-7xl font-black leading-[0.85] mb-6">
                Vind jouw ideale stem
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
              </p>
            </div>
            
            {/* Main Content Area */}
            <div className="flex gap-8">
              {/* Sidebar */}
              <div className="w-80 bg-white rounded-2xl p-6 shadow-sm h-fit">
                <div className="mb-6">
                  <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Zoek..." className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg" />
                  </div>
                  <button className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    Geavanceerde Filters
                  </button>
                </div>
                
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Stijl Categorieën</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>Autoriteit (4)</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>Helder (6)</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>Warm (8)</span>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Voiceover Grid */}
              <div className="flex-1">
                <div className="bg-white rounded-2xl p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">14 Stemmen gevonden</h3>
                    <select className="px-4 py-2 border rounded-lg">
                      <option>Sorteer op naam</option>
                      <option>Meest populair</option>
                      <option>Nieuwste eerst</option>
                    </select>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <VoiceoverCardMock name="Gina" />
                    <VoiceoverCardMock name="Sophie" />
                    <VoiceoverCardMock name="Mark" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mockup 4: Tabbed Design */}
      <div className="space-y-0">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 4: Tabbed Categories</h3>
        
        <div className="bg-gradient-to-br from-[#fcf9f5] to-white min-h-screen py-20">
          <div className="max-w-7xl mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-6xl md:text-7xl font-black leading-[0.9] mb-6">
                Vind jouw ideale stem
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-xl mx-auto relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Zoek op naam of stijl..." 
                  className="w-full pl-14 pr-5 py-4 bg-white rounded-full shadow-md border border-gray-100" />
              </div>
            </div>
            
            {/* Tabbed Navigation */}
            <div className="bg-white rounded-t-3xl shadow-xl">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  <button className="px-8 py-5 font-semibold border-b-3 border-gray-900 text-gray-900 whitespace-nowrap">
                    Alle Stemmen (14)
                  </button>
                  <button className="px-8 py-5 font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap">
                    Autoriteit (4)
                  </button>
                  <button className="px-8 py-5 font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap">
                    Helder (6)
                  </button>
                  <button className="px-8 py-5 font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap">
                    Warm & Vriendelijk (8)
                  </button>
                  <button className="px-8 py-5 font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap">
                    Urban (3)
                  </button>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="p-10">
                <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  <VoiceoverCardMock name="Gina" />
                  <VoiceoverCardMock name="Sophie" />
                  <VoiceoverCardMock name="Mark" />
                  <VoiceoverCardMock name="Lisa" />
                  <VoiceoverCardMock name="Tom" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mockup 5: Magazine Style */}
      <div className="space-y-0">
        <h3 className="text-sm font-bold mb-4 text-gray-500">MOCKUP 5: Magazine Editorial Style</h3>
        
        <div className="bg-white">
          {/* Hero Section */}
          <div className="bg-[#fcf9f5] py-24">
            <div className="max-w-7xl mx-auto px-6">
              <div className="max-w-4xl">
                <h2 className="text-8xl md:text-9xl font-black leading-[0.8] mb-8">
                  Vind jouw<br />
                  <span className="text-gray-600">ideale</span><br />
                  stem
                </h2>
                <p className="text-2xl text-gray-700 max-w-2xl leading-relaxed">
                  14 professioneel getrainde voice-overs voor jouw commercial, documentaire en alles daartussenin.
                </p>
              </div>
            </div>
          </div>
          
          {/* Search & Filter Bar */}
          <div className="sticky top-0 z-10 bg-white border-y border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1 max-w-md relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Zoek..." className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg" />
                </div>
                <div className="flex gap-2">
                  <button className="px-6 py-3 bg-black text-white rounded-lg font-medium">Alle</button>
                  <button className="px-6 py-3 hover:bg-gray-100 rounded-lg font-medium">Autoriteit</button>
                  <button className="px-6 py-3 hover:bg-gray-100 rounded-lg font-medium">Helder</button>
                  <button className="px-6 py-3 hover:bg-gray-100 rounded-lg font-medium">Warm</button>
                  <button className="px-4 py-3 hover:bg-gray-100 rounded-lg">
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Featured Voices Section */}
          <div className="py-20">
            <div className="max-w-7xl mx-auto px-6">
              {/* Section Header */}
              <div className="flex items-end justify-between mb-12 pb-8 border-b-2 border-gray-900">
                <div>
                  <p className="text-sm uppercase tracking-wider text-gray-600 mb-2">Ontdek</p>
                  <h3 className="text-5xl font-black">Onze Stemmen</h3>
                </div>
                <div className="text-right">
                  <p className="text-6xl font-black text-gray-900">14</p>
                  <p className="text-sm uppercase tracking-wider text-gray-600">Professionals</p>
                </div>
              </div>
              
              {/* Editorial Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="col-span-2 row-span-2">
                  <div className="bg-gray-100 aspect-[3/4] rounded-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <h4 className="text-3xl font-bold mb-2">Gina</h4>
                      <p className="text-lg opacity-90">Warm • Vriendelijk • Professioneel</p>
                      <button className="mt-4 px-6 py-3 bg-white text-black rounded-lg font-semibold">
                        Beluister Demo's
                      </button>
                    </div>
                  </div>
                </div>
                <VoiceoverCardMock name="Sophie" />
                <VoiceoverCardMock name="Mark" />
                <VoiceoverCardMock name="Lisa" />
                <VoiceoverCardMock name="Tom" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}