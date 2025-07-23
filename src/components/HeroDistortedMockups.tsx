'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Zap, Shield, ArrowRight, Play, Headphones, Mic, Radio, Music, ChevronRight } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export default function HeroDistortedMockups() {
  const [selectedMockup, setSelectedMockup] = useState(1);

  const mockups = [
    { id: 1, name: 'Asymmetric Split', description: 'Bold left-aligned with floating elements' },
    { id: 2, name: 'Diagonal Flow', description: 'Dynamic diagonal layout with cascading content' },
    { id: 3, name: 'Grid Breakout', description: 'Broken grid with overlapping sections' },
    { id: 4, name: 'Liquid Morph', description: 'Fluid shapes with organic distortions' },
    { id: 5, name: 'Perspective Shift', description: '3D perspective with depth layers' },
  ];

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta min-h-screen bg-gray-50 dark:bg-gray-950`}>
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Hero Distorted Mockups</h1>
            <div className="flex gap-2">
              {mockups.map((mockup) => (
                <button
                  key={mockup.id}
                  onClick={() => setSelectedMockup(mockup.id)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    selectedMockup === mockup.id
                      ? 'bg-[#18f109] text-black font-semibold'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {mockup.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mockup Display */}
      <div className="p-6">
        {selectedMockup === 1 && <MockupAsymmetric />}
        {selectedMockup === 2 && <MockupDiagonal />}
        {selectedMockup === 3 && <MockupGrid />}
        {selectedMockup === 4 && <MockupLiquid />}
        {selectedMockup === 5 && <MockupPerspective />}
      </div>
    </div>
  );
}

// Mockup 1: Asymmetric Split
function MockupAsymmetric() {
  return (
    <div className="relative min-h-screen p-8 lg:p-16">
      {/* Distorted Background Container */}
      <motion.div 
        className="relative h-[90vh] bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black rounded-3xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Distorted Background Elements */}
        <div className="absolute inset-0">
          {/* Sound Wave Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20">
            <defs>
              <pattern id="sound-wave-1" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 Q20 30 40 50 T80 50 T120 50 T160 50 T200 50" stroke="#18f109" strokeWidth="1" fill="none" />
                <path d="M0 50 Q20 70 40 50 T80 50 T120 50 T160 50 T200 50" stroke="#efd243" strokeWidth="0.5" fill="none" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sound-wave-1)" />
          </svg>

          {/* Audio Frequency Bars */}
          <motion.div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 opacity-10 dark:opacity-20">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-gradient-to-t from-[#18f109] to-transparent"
                animate={{
                  height: [
                    `${20 + Math.random() * 60}%`,
                    `${20 + Math.random() * 60}%`,
                    `${20 + Math.random() * 60}%`,
                  ],
                }}
                transition={{
                  duration: 1 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

          {/* Morphing Audio Blobs */}
          <motion.div
            className="absolute top-20 left-20 w-[500px] h-[500px] bg-[#18f109]/20 dark:bg-[#18f109]/30 rounded-full filter blur-3xl mix-blend-multiply dark:mix-blend-screen"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
            }}
          />
          <motion.div
            className="absolute bottom-10 right-20 w-[400px] h-[400px] bg-[#efd243]/10 dark:bg-[#efd243]/20 rounded-full filter blur-3xl mix-blend-multiply dark:mix-blend-screen"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }}
          />

          {/* Floating Sound Particles */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-[#18f109] dark:bg-[#18f109] rounded-full opacity-40"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 100 - 50, 0],
                  y: [0, Math.random() * 100 - 50, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>
        </div>

        {/* Content - Left Aligned */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-2xl ml-16 lg:ml-24">
            {/* Process Steps - All 3 Steps */}
            <motion.div 
              className="flex items-center gap-3 mb-8 flex-wrap"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Step 1 */}
              <motion.div 
                className="flex items-center gap-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              >
                <motion.span 
                  className="w-10 h-10 bg-[#18f109] text-black rounded-xl flex items-center justify-center font-bold"
                  animate={{ rotate: [-3, 3, -3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  1
                </motion.span>
                <span className="text-gray-800 dark:text-gray-300 font-medium">Kies je stem</span>
              </motion.div>
              
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <ChevronRight className="text-gray-400 dark:text-gray-600" />
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                className="flex items-center gap-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
              >
                <motion.span 
                  className="w-10 h-10 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl flex items-center justify-center font-bold"
                  animate={{ rotate: [3, -3, 3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                >
                  2
                </motion.span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Upload script</span>
              </motion.div>

              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
              >
                <ChevronRight className="text-gray-400 dark:text-gray-600" />
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                className="flex items-center gap-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
              >
                <motion.span 
                  className="w-10 h-10 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl flex items-center justify-center font-bold"
                  animate={{ rotate: [-3, 3, -3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
                >
                  3
                </motion.span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Ontvang audio</span>
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1 
              className="text-6xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="block transform -rotate-1">Jouw merk</span>
              <span className="block text-[#18f109] transform rotate-1">verdient</span>
              <span className="block text-4xl lg:text-6xl mt-2">een stem die raakt</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              Professionele voice-overs die jouw boodschap versterken. 
              Van radio commercials tot e-learning modules - binnen 48 uur perfect ingesproken.
            </motion.p>

            {/* CTA */}
            <motion.div 
              className="flex items-center gap-4 flex-wrap"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button className="px-8 py-4 bg-[#18f109] text-black rounded-2xl font-bold hover:bg-[#18f109]/90 transition-all transform hover:scale-105 hover:rotate-1 shadow-lg hover:shadow-xl">
                Ontdek onze stemmen
                <ArrowRight className="inline-block ml-2" />
              </button>
              <button className="px-8 py-4 bg-gray-100 dark:bg-white/10 backdrop-blur text-gray-900 dark:text-white rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition-all border border-gray-200 dark:border-white/20">
                <Play className="inline-block mr-2 w-4 h-4" />
                Beluister voorbeelden
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="flex items-center gap-6 mt-12 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#18f109]" />
                <span className="text-gray-800 dark:text-white font-semibold">&lt;48u geleverd</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#efd243] fill-current" />
                <span className="text-gray-800 dark:text-white font-semibold">9.1/10 klantbeoordeling</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#ebaa3a]" />
                <span className="text-gray-800 dark:text-white font-semibold">100% tevredenheid</span>
              </div>
            </motion.div>
          </div>

          {/* Floating Voice Cards */}
          <motion.div 
            className="absolute right-20 top-1/2 -translate-y-1/2 hidden lg:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="relative">
              {/* Audio Waveform Animation */}
              <motion.div 
                className="absolute -top-20 left-1/2 -translate-x-1/2 flex items-center gap-1"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-[#18f109] rounded-full"
                    animate={{
                      height: [10, 20 + Math.random() * 20, 10],
                    }}
                    transition={{
                      duration: 0.5 + Math.random() * 0.5,
                      repeat: Infinity,
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-white/10 backdrop-blur-xl rounded-2xl p-6 w-64 transform rotate-3 shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#18f109] to-[#14c208] rounded-full" />
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-semibold">Sophie</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Warm & Vriendelijk</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Demo beschikbaar</span>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-white/10 backdrop-blur-xl rounded-2xl p-6 w-64 transform -rotate-2 mt-4 -ml-8 shadow-xl"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#efd243] to-[#d4b52d] rounded-full" />
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-semibold">Mark</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Zakelijk & Autoriteit</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Direct beschikbaar</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// Mockup 2: Diagonal Flow
function MockupDiagonal() {
  return (
    <div className="relative min-h-screen p-8 lg:p-16">
      <motion.div 
        className="relative h-[90vh] bg-gradient-to-tr from-black via-gray-900 to-gray-800 rounded-[2rem] overflow-hidden"
        initial={{ opacity: 0, rotate: -1 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8 }}
        style={{ transform: 'perspective(1000px) rotateY(-5deg)' }}
      >
        {/* Diagonal Background Pattern */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 20px,
                rgba(24, 241, 9, 0.1) 20px,
                rgba(24, 241, 9, 0.1) 21px
              )`,
            }}
            animate={{
              backgroundPosition: ['0px 0px', '28px 28px'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Distorted Shapes */}
          <motion.div
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#18f109]/40 to-transparent"
            style={{
              clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
              filter: 'blur(40px)',
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
            }}
          />
        </div>

        {/* Diagonal Content Layout */}
        <div className="relative z-10 h-full p-16">
          <div className="h-full flex items-center">
            <div className="grid grid-cols-12 gap-8 w-full transform -skew-y-3">
              {/* Main Content */}
              <motion.div 
                className="col-span-7"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="transform skew-y-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#18f109]/20 backdrop-blur rounded-full mb-6">
                    <Radio className="w-4 h-4 text-[#18f109]" />
                    <span className="text-[#18f109] font-medium">Live nu: 14 stemmen online</span>
                  </div>

                  <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    Jouw verhaal
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#18f109] to-[#efd243]">
                      verdient de
                    </span>
                    <span className="block">beste stem</span>
                  </h1>

                  <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                    Professionele voice-overs binnen 48 uur. Van commercials tot e-learning, wij hebben de perfecte stem.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <button className="px-8 py-4 bg-[#18f109] text-black rounded-2xl font-bold hover:scale-105 transition-transform">
                      Start direct
                    </button>
                    <button className="px-8 py-4 bg-white/10 backdrop-blur text-white rounded-2xl font-semibold border border-white/20 hover:bg-white/20 transition-all">
                      <Play className="inline-block mr-2 w-4 h-4" />
                      Beluister demo&apos;s
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Side Stats */}
              <motion.div 
                className="col-span-5"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="transform skew-y-3 space-y-6">
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 transform rotate-2">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Vandaag geleverd</h3>
                      <Zap className="w-5 h-5 text-[#18f109]" />
                    </div>
                    <div className="text-3xl font-bold text-[#18f109]">24</div>
                    <div className="text-gray-400">projecten</div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 transform -rotate-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Klantbeoordeling</h3>
                      <Star className="w-5 h-5 text-[#efd243] fill-current" />
                    </div>
                    <div className="text-3xl font-bold text-[#efd243]">9.1/10</div>
                    <div className="text-gray-400">gemiddeld</div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 transform rotate-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Stemmen online</h3>
                      <Mic className="w-5 h-5 text-[#ebaa3a]" />
                    </div>
                    <div className="text-3xl font-bold text-[#ebaa3a]">14</div>
                    <div className="text-gray-400">direct beschikbaar</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Mockup 3: Grid Breakout
function MockupGrid() {
  return (
    <div className="relative min-h-screen p-8 lg:p-16">
      <motion.div 
        className="relative h-[90vh] bg-black rounded-[3rem] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Broken Grid Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute border border-[#18f109]/30"
                style={{
                  left: `${(i % 5) * 20}%`,
                  top: `${Math.floor(i / 5) * 25}%`,
                  width: '20%',
                  height: '25%',
                }}
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, i % 2 === 0 ? 2 : -2, 0],
                }}
                transition={{
                  duration: 10 + i,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>

          {/* Glitch Effect Overlays */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#18f109]/20 via-transparent to-[#efd243]/20"
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>

        {/* Grid Content */}
        <div className="relative z-10 h-full p-12 lg:p-20">
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* Title Block */}
            <motion.div 
              className="col-span-8 row-span-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 h-full flex flex-col justify-center border border-white/20">
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  <span className="text-[#18f109]">14</span> stemmen
                  <br />
                  <span className="text-3xl lg:text-5xl">voor jouw project</span>
                </h1>
                <p className="text-gray-300 text-lg mt-4">
                  Direct beschikbaar. Professioneel opgenomen.
                </p>
              </div>
            </motion.div>

            {/* Stats Blocks */}
            <motion.div 
              className="col-span-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-[#18f109] rounded-3xl p-6 h-full flex flex-col justify-center text-black">
                <Zap className="w-8 h-8 mb-2" />
                <div className="text-3xl font-bold">&lt;48u</div>
                <div className="font-semibold">Snelle levering</div>
              </div>
            </motion.div>

            <motion.div 
              className="col-span-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-[#efd243] rounded-3xl p-6 h-full flex flex-col justify-center text-black">
                <Star className="w-8 h-8 mb-2" />
                <div className="text-3xl font-bold">9.1/10</div>
                <div className="font-semibold">Klantbeoordeling</div>
              </div>
            </motion.div>

            {/* CTA Block */}
            <motion.div 
              className="col-span-4 row-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-3xl p-8 h-full flex flex-col justify-center items-center border border-white/20">
                <Music className="w-16 h-16 text-white mb-4" />
                <h3 className="text-white text-xl font-bold mb-4">Start nu</h3>
                <button className="w-full px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-all">
                  Bekijk stemmen
                </button>
                <button className="w-full px-6 py-3 bg-transparent text-white rounded-xl font-semibold border border-white/30 hover:bg-white/10 transition-all mt-3">
                  Luister demo&apos;s
                </button>
              </div>
            </motion.div>

            {/* Voice Preview */}
            <motion.div 
              className="col-span-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#18f109] to-[#efd243] rounded-full" />
                    <div>
                      <h3 className="text-white font-semibold text-lg">Sophie - Warm & Vriendelijk</h3>
                      <p className="text-gray-400">Commercial demo • 0:30</p>
                    </div>
                  </div>
                  <button className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                    <Play className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Mockup 4: Liquid Morph
function MockupLiquid() {
  return (
    <div className="relative min-h-screen p-8 lg:p-16">
      <motion.div 
        className="relative h-[90vh] bg-gradient-to-br from-gray-900 to-black rounded-[4rem] overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Liquid Background */}
        <div className="absolute inset-0">
          {/* Morphing Liquid Shapes */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <filter id="liquid">
                <feTurbulence baseFrequency="0.02" numOctaves="3" result="turbulence" />
                <feColorMatrix in="turbulence" type="saturate" values="0.2" />
              </filter>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
              </filter>
            </defs>
            <g filter="url(#goo)">
              <motion.circle
                cx="30%"
                cy="30%"
                r="200"
                fill="#18f109"
                opacity="0.3"
                animate={{
                  cx: ['30%', '40%', '30%'],
                  cy: ['30%', '40%', '30%'],
                  r: [200, 250, 200],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.circle
                cx="70%"
                cy="60%"
                r="180"
                fill="#efd243"
                opacity="0.2"
                animate={{
                  cx: ['70%', '60%', '70%'],
                  cy: ['60%', '50%', '60%'],
                  r: [180, 220, 180],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.circle
                cx="50%"
                cy="80%"
                r="150"
                fill="#ebaa3a"
                opacity="0.2"
                animate={{
                  cx: ['50%', '55%', '50%'],
                  cy: ['80%', '75%', '80%'],
                  r: [150, 180, 150],
                }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </g>
          </svg>
        </div>

        {/* Organic Content Layout */}
        <div className="relative z-10 h-full flex items-center justify-center p-12 lg:p-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Floating Badge */}
            <motion.div 
              className="inline-block mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 flex items-center gap-3">
                <div className="w-2 h-2 bg-[#18f109] rounded-full animate-pulse" />
                <span className="text-white font-medium">14 professionele stemmen online</span>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className="text-6xl lg:text-8xl font-bold text-white mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="block mb-4">Geef je project</span>
              <span className="relative inline-block">
                <span className="relative z-10 text-black px-8 py-2">een stem</span>
                <motion.div 
                  className="absolute inset-0 bg-[#18f109] rounded-2xl"
                  animate={{
                    rotate: [-2, 2, -2],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Professionele voice-overs die jouw verhaal tot leven brengen. 
              Van commercials tot documentaires, binnen 48 uur geleverd.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button 
                className="px-8 py-4 bg-[#18f109] text-black rounded-full font-bold text-lg hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ontdek alle stemmen
              </motion.button>
              <motion.button 
                className="px-8 py-4 bg-white/10 backdrop-blur text-white rounded-full font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Headphones className="inline-block mr-2 w-5 h-5" />
                Beluister demo&apos;s
              </motion.button>
            </motion.div>

            {/* Feature Pills */}
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="px-6 py-3 bg-white/5 backdrop-blur rounded-full border border-white/10 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#18f109]" />
                <span className="text-white">&lt;48u levering</span>
              </div>
              <div className="px-6 py-3 bg-white/5 backdrop-blur rounded-full border border-white/10 flex items-center gap-2">
                <Star className="w-4 h-4 text-[#efd243]" />
                <span className="text-white">9.1/10 rating</span>
              </div>
              <div className="px-6 py-3 bg-white/5 backdrop-blur rounded-full border border-white/10 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#ebaa3a]" />
                <span className="text-white">100% garantie</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Mockup 5: Perspective Shift
function MockupPerspective() {
  return (
    <div className="relative min-h-screen p-8 lg:p-16">
      <motion.div 
        className="relative h-[90vh] rounded-[2rem] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          transformStyle: 'preserve-3d',
          perspective: '2000px',
        }}
      >
        {/* 3D Layered Background */}
        <div className="absolute inset-0">
          {/* Back Layer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#18f109]/10 to-transparent"
            style={{
              transform: 'translateZ(-200px) scale(1.5)',
            }}
            animate={{
              rotateY: [0, 5, 0],
              rotateX: [0, -5, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Mid Layer - Grid */}
          <motion.div
            className="absolute inset-0"
            style={{
              transform: 'translateZ(-100px) scale(1.2)',
              backgroundImage: `
                linear-gradient(rgba(24, 241, 9, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(24, 241, 9, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
            animate={{
              backgroundPosition: ['0px 0px', '50px 50px'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Front Layer - Particles */}
          <div className="absolute inset-0" style={{ transform: 'translateZ(0)' }}>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `translateZ(${Math.random() * 100}px)`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>
        </div>

        {/* 3D Content Layers */}
        <div className="relative z-10 h-full p-12 lg:p-20">
          <div className="h-full flex items-center">
            <div className="w-full">
              {/* Back Card */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl"
                style={{
                  transform: 'translate(-50%, -50%) translateZ(-50px) rotateY(10deg)',
                }}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 0.3, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-white/5 backdrop-blur rounded-3xl p-12 border border-white/10">
                  <h2 className="text-4xl font-bold text-white/50">Professioneel</h2>
                </div>
              </motion.div>

              {/* Middle Card */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl"
                style={{
                  transform: 'translate(-50%, -50%) translateZ(-25px) rotateY(5deg)',
                }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 0.5, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
                  <h2 className="text-5xl font-bold text-white/70">Betrouwbaar</h2>
                </div>
              </motion.div>

              {/* Front Card - Main Content */}
              <motion.div
                className="relative w-full max-w-2xl mx-auto"
                style={{
                  transform: 'translateZ(0)',
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-black/50 backdrop-blur-2xl rounded-3xl p-12 border border-white/30 shadow-2xl">
                  <div className="text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#18f109]/20 rounded-full mb-6">
                      <div className="w-2 h-2 bg-[#18f109] rounded-full animate-pulse" />
                      <span className="text-[#18f109] font-medium">Direct beschikbaar</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
                      14 stemmen
                      <span className="block text-3xl lg:text-5xl mt-2 text-gray-300">
                        voor elk verhaal
                      </span>
                    </h1>

                    {/* Description */}
                    <p className="text-xl text-gray-400 mb-8 max-w-lg mx-auto">
                      Van commercials tot documentaires. Professionele kwaliteit, binnen 48 uur.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <motion.button 
                        className="px-8 py-4 bg-[#18f109] text-black rounded-2xl font-bold hover:shadow-lg hover:shadow-[#18f109]/30 transition-all"
                        whileHover={{ scale: 1.05, translateZ: '10px' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Bekijk alle stemmen
                      </motion.button>
                      <motion.button 
                        className="px-8 py-4 bg-white/10 backdrop-blur text-white rounded-2xl font-semibold border border-white/20 hover:bg-white/20 transition-all"
                        whileHover={{ scale: 1.05, translateZ: '10px' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Demo&apos;s beluisteren
                      </motion.button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-8 mt-12">
                      <div className="text-center">
                        <Zap className="w-6 h-6 text-[#18f109] mx-auto mb-2" />
                        <div className="text-white font-semibold">&lt;48u</div>
                      </div>
                      <div className="text-center">
                        <Star className="w-6 h-6 text-[#efd243] mx-auto mb-2" />
                        <div className="text-white font-semibold">9.1/10</div>
                      </div>
                      <div className="text-center">
                        <Shield className="w-6 h-6 text-[#ebaa3a] mx-auto mb-2" />
                        <div className="text-white font-semibold">Garantie</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}