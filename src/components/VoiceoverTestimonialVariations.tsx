'use client';

import React, { useState } from 'react';
import { Search, Star, Zap, Menu, X, Check, Filter, ChevronDown, Mic, Music, Sparkles, Play, Headphones, Globe, Clock, Shield, Award, Users, TrendingUp, ArrowRight, ExternalLink, Quote, MessageCircle, ThumbsUp } from 'lucide-react';
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

// Extended style tags
const allStyles = [
  'Warm', 'Vriendelijk', 'Helder', 'Professioneel', 'Autoriteit', 'Zakelijk', 
  'Jong', 'Energiek', 'Urban', 'Modern', 'Betrouwbaar', 'Ervaren',
  'Speels', 'Serieus', 'Natuurlijk', 'Karaktervol', 'Diep', 'Licht'
];

// Sample testimonials
const testimonials = [
  {
    text: "14voices heeft onze commercial naar een hoger niveau getild. De perfecte stem, snelle levering en uitstekende kwaliteit. Een aanrader!",
    author: "Jan de Vries",
    role: "Marketing Director, TechCo",
    rating: 5
  },
  {
    text: "Professioneel, snel en altijd de juiste toon. We werken al jaren met plezier samen met 14voices voor al onze voice-over projecten.",
    author: "Sarah Bakker",
    role: "Creative Director, Studio X",
    rating: 5
  },
  {
    text: "De variëteit aan stemmen is geweldig. Voor elk project vinden we de perfecte match. De kwaliteit is consistent hoog.",
    author: "Michael Jansen",
    role: "Producer, MediaWorks",
    rating: 5
  }
];

export function VoiceoverTestimonialVariations() {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllStyles, setShowAllStyles] = useState(false);

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  return (
    <div className={`space-y-24 bg-gray-50 dark:bg-gray-900 ${plusJakarta.variable} font-plus-jakarta`}>
      
      {/* Version 1: Original Enhanced with Multi-Select */}
      <div className="bg-white dark:bg-gray-950">
        {/* Hero with Testimonial */}
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Main Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#18f109]/10 rounded-full mb-6">
                <Award className="w-4 h-4 text-[#18f109]" />
                <span className="text-sm font-medium text-[#18f109]">Marktleider in voice-overs</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                De stem die jouw merk versterkt
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Werk samen met Nederland's beste stemacteurs. Direct beschikbaar, professioneel en betaalbaar.
              </p>
              
              {/* Search */}
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek stemmen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18f109]"
                />
              </div>

              {/* Multi-Select Style Tags */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Filter op stijl (meerdere selecties mogelijk)
                  </h3>
                  <button 
                    onClick={() => setShowAllStyles(!showAllStyles)}
                    className="text-sm text-[#18f109] hover:underline"
                  >
                    {showAllStyles ? 'Minder' : 'Meer'} stijlen
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(showAllStyles ? allStyles : allStyles.slice(0, 8)).map((style) => (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        selectedStyles.includes(style)
                          ? 'bg-[#18f109] text-black'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {style}
                      {selectedStyles.includes(style) && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
                {selectedStyles.length > 0 && (
                  <button 
                    onClick={() => setSelectedStyles([])}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mt-2"
                  >
                    Wis selectie ({selectedStyles.length})
                  </button>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-white dark:border-gray-950" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">500+</span> tevreden klanten
                </p>
              </div>
            </div>

            {/* Right: Testimonial Card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#fcf9f5] to-[#fafafa] dark:from-gray-900 dark:to-gray-800 p-8 rounded-2xl">
                <div className="flex items-start gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-[#efd243] text-[#efd243]" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  "{testimonials[0].text}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{testimonials[0].author}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonials[0].role}</p>
                    </div>
                  </div>
                  <a 
                    href="https://www.feedbackcompany.com/nl-nl/reviews/fourteen-voices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-[#18f109] hover:underline"
                  >
                    Meer reviews <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              
              {/* Floating Stats - Fixed positioning */}
              <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8 text-[#18f109]" />
                  <div>
                    <p className="text-2xl font-bold">24u</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Gemiddelde levertijd</p>
                  </div>
                </div>
              </div>
              
              {/* Review Score - Below testimonial */}
              <div className="absolute -bottom-6 left-8 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
                <Star className="w-5 h-5 fill-[#efd243] text-[#efd243]" />
                <span className="font-bold text-lg">4.9/5</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">op Feedback Company</span>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Grid */}
        <div className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Populaire stemmen</h2>
              <p className="text-gray-600 dark:text-gray-400">Direct beschikbaar voor jouw project</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* Version 2: Side-by-Side Testimonials */}
      <div className="bg-[#fcf9f5] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full mb-6">
              <MessageCircle className="w-4 h-4 text-[#18f109]" />
              <span className="text-sm font-medium">Wat onze klanten zeggen</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              De stem die jouw verhaal vertelt
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Met 250+ professionele stemmen vind je altijd de perfecte match voor jouw project
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center">
              <p className="text-3xl font-bold text-[#18f109] mb-1">24u</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Snelle levering</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center">
              <p className="text-3xl font-bold text-[#efd243] mb-1">4.9/5</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Klantbeoordeling</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center">
              <p className="text-3xl font-bold text-[#ebaa3a] mb-1">250+</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Voice-overs</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center">
              <p className="text-3xl font-bold text-[#18f109] mb-1">98%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tevredenheid</p>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl">
                <Quote className="w-8 h-8 text-[#18f109] mb-4 opacity-50" />
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {testimonial.text}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#efd243] text-[#efd243]" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl">
            <div className="grid lg:grid-cols-3 gap-6 items-end">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Zoek de perfecte stem
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Zoek op naam, stijl of project type..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18f109]"
                  />
                </div>
              </div>
              <div>
                <a 
                  href="https://www.feedbackcompany.com/nl-nl/reviews/fourteen-voices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#18f109] text-black rounded-xl font-semibold hover:bg-[#18f109]/90 transition-colors"
                >
                  Bekijk alle reviews <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Style Tags */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Filter op stijl (selecteer meerdere):
              </p>
              <div className="flex flex-wrap gap-2">
                {allStyles.map((style) => (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      selectedStyles.includes(style)
                        ? 'bg-[#18f109] text-black font-medium'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Voice Grid */}
        <div className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* Version 3: Floating Testimonial Cards */}
      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          {/* Hero Section */}
          <div className="relative mb-16">
            {/* Floating Testimonial Cards */}
            <div className="hidden lg:block absolute -left-12 top-0 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg max-w-xs transform -rotate-3">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-[#efd243] text-[#efd243]" />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                "Perfecte stem voor onze commercial!"
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">- Lisa M.</p>
            </div>

            <div className="hidden lg:block absolute -right-12 top-24 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg max-w-xs transform rotate-3">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-[#efd243] text-[#efd243]" />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                "Snelle levering, top kwaliteit!"
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">- Peter V.</p>
            </div>

            {/* Main Content */}
            <div className="text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#18f109]/10 backdrop-blur-sm rounded-full mb-6">
                <ThumbsUp className="w-4 h-4 text-[#18f109]" />
                <span className="text-sm font-medium">500+ tevreden klanten</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                Jouw stem,<br />ons vakmanschap
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
                Ontdek waarom honderden bedrijven kiezen voor onze voice-over diensten
              </p>

              {/* Quick Stats */}
              <div className="flex items-center justify-center gap-8 mb-12">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#18f109]" />
                  <span className="font-semibold">24u levering</span>
                </div>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#efd243]" />
                  <span className="font-semibold">4.9/5 rating</span>
                </div>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#ebaa3a]" />
                  <span className="font-semibold">100% garantie</span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Zoek stemmen..."
                    className="w-full pl-14 pr-6 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-lg focus:outline-none focus:ring-4 focus:ring-[#18f109]/20"
                  />
                </div>
              </div>

              {/* Style Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {allStyles.map((style) => (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedStyles.includes(style)
                        ? 'bg-[#18f109] text-black shadow-lg scale-105'
                        : 'bg-white dark:bg-gray-800 hover:shadow-md'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Review Link */}
          <div className="text-center mb-16">
            <a 
              href="https://www.feedbackcompany.com/nl-nl/reviews/fourteen-voices/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#18f109] hover:underline font-medium"
            >
              Lees meer reviews op Feedback Company <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Voice Grid */}
        <div className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* Version 4: Review-Focused Layout */}
      <div className="bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          {/* Top Bar */}
          <div className="bg-[#fcf9f5] dark:bg-gray-900 p-4 rounded-2xl mb-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-[#efd243] text-[#efd243]" />
                  <span className="text-xl font-bold">4.9/5</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">op Feedback Company</span>
                </div>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 hidden lg:block" />
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#18f109]" />
                  <span className="text-sm">500+ reviews</span>
                </div>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 hidden lg:block" />
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#18f109]" />
                  <span className="text-sm font-medium">24u levering</span>
                </div>
              </div>
              <a 
                href="https://www.feedbackcompany.com/nl-nl/reviews/fourteen-voices/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm font-medium hover:shadow-md transition-all"
              >
                Alle reviews bekijken <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Main Hero */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                De stem die jouw merk versterkt
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Kies uit 250+ professionele stemacteurs. Bekroond door onze klanten met een 4.9/5 score.
              </p>

              {/* Review Highlight */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl mb-8">
                <div className="flex items-start gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#efd243] text-[#efd243]" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic mb-3">
                  "Uitstekende service! Snelle levering en de stem was precies wat we zochten voor onze campagne."
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  - Recent review op Feedback Company
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-[#18f109] text-black rounded-xl font-semibold hover:bg-[#18f109]/90 transition-colors">
                  Start een project
                </button>
                <button className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  Luister voorbeelden
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl">
              <h3 className="text-xl font-semibold mb-6">Vind jouw perfecte stem</h3>
              
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Zoek op naam of project..."
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18f109]"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Populaire stijlen:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {allStyles.slice(0, 12).map((style) => (
                    <button
                      key={style}
                      onClick={() => toggleStyle(style)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedStyles.includes(style)
                          ? 'bg-[#18f109] text-black'
                          : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
                {selectedStyles.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    {selectedStyles.length} stijl(en) geselecteerd
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Voice Grid */}
        <div className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* Version 5: Testimonial Carousel */}
      <div className="bg-gradient-to-br from-[#fcf9f5] via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          {/* Hero Content */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-6">
              <Award className="w-4 h-4 text-[#18f109]" />
              <span className="text-sm font-medium">Nr. 1 in Nederland</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              De stem die jouw merk versterkt
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Vertrouwd door 500+ bedrijven. Beoordeeld met 4.9/5 sterren.
            </p>
          </div>

          {/* Testimonial Carousel */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl mb-12 max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <Quote className="w-12 h-12 text-[#18f109] mb-6 opacity-50" />
                <blockquote className="text-2xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "De kwaliteit en snelheid van 14voices is ongeëvenaard. Perfect voor onze deadlines!"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Anna Vermeer</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Creative Director, BrandStudio</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#fcf9f5] dark:bg-gray-700 p-6 rounded-xl text-center">
                  <Zap className="w-8 h-8 text-[#18f109] mx-auto mb-3" />
                  <p className="text-2xl font-bold mb-1">24u</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Levering</p>
                </div>
                <div className="bg-[#fcf9f5] dark:bg-gray-700 p-6 rounded-xl text-center">
                  <Star className="w-8 h-8 text-[#efd243] mx-auto mb-3" />
                  <p className="text-2xl font-bold mb-1">4.9/5</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                </div>
                <div className="bg-[#fcf9f5] dark:bg-gray-700 p-6 rounded-xl text-center">
                  <Globe className="w-8 h-8 text-[#ebaa3a] mx-auto mb-3" />
                  <p className="text-2xl font-bold mb-1">15+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Talen</p>
                </div>
                <div className="bg-[#fcf9f5] dark:bg-gray-700 p-6 rounded-xl text-center">
                  <Users className="w-8 h-8 text-[#18f109] mx-auto mb-3" />
                  <p className="text-2xl font-bold mb-1">250+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Stemmen</p>
                </div>
              </div>
            </div>
            
            {/* Carousel Dots */}
            <div className="flex justify-center gap-2 mt-8">
              <button className="w-8 h-2 bg-[#18f109] rounded-full" />
              <button className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <button className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
          </div>

          {/* Search and Multi-Select Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek de perfecte stem voor jouw project..."
                  className="w-full pl-14 pr-6 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-lg focus:outline-none focus:ring-4 focus:ring-[#18f109]/20"
                />
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Filter op meerdere stijlen tegelijk:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {allStyles.map((style) => (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedStyles.includes(style)
                        ? 'bg-[#18f109] text-black shadow-md'
                        : 'bg-white dark:bg-gray-800 hover:shadow-sm border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
              
              <div className="mt-6">
                <a 
                  href="https://www.feedbackcompany.com/nl-nl/reviews/fourteen-voices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#18f109] hover:underline font-medium"
                >
                  Bekijk al onze 500+ reviews <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Grid */}
        <div className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
  );
}