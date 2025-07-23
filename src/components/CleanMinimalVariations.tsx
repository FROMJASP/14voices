'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronRight, Zap, Star, Shield, ArrowRight, Headphones, Mic, Check, Info } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import gsap from 'gsap';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export default function CleanMinimalVariations() {
  const [selectedMockup, setSelectedMockup] = useState(1);

  const mockups = [
    { id: 1, name: 'Soft Gradient', description: 'Subtle gradients with smooth animations' },
    { id: 2, name: 'Pure White', description: 'Ultra-clean white space design' },
    { id: 3, name: 'Light Shadows', description: 'Depth through soft shadows' },
    { id: 4, name: 'Accent Colors', description: 'Strategic color highlights' },
    { id: 5, name: 'Geometric Minimal', description: 'Clean geometric shapes' },
  ];

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta min-h-screen bg-gray-50 dark:bg-gray-950`}>
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Clean Minimal Variations</h1>
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
      <div className="p-4 sm:p-6 lg:p-6">
        {selectedMockup === 1 && <SoftGradient />}
        {selectedMockup === 2 && <PureWhite />}
        {selectedMockup === 3 && <LightShadows />}
        {selectedMockup === 4 && <AccentColors />}
        {selectedMockup === 5 && <GeometricMinimal />}
      </div>
    </div>
  );
}

// Shared Voice Cards Component for larger screens
function VoiceCards() {
  return (
    <>
      <motion.div 
        className="absolute right-20 top-1/2 -translate-y-1/2 hidden xl:block"
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
    </>
  );
}

// Shared Animated Steps Component
function AnimatedSteps() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stepsRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

      // Step animations
      tl.to(".step-1", {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(".step-1 .step-circle", {
        backgroundColor: "#18f109",
        color: "#000",
        duration: 0.3,
      }, "<")
      .to(".step-1", {
        scale: 1,
        duration: 0.3,
      }, "+=0.5")
      
      .to(".step-2", {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(".step-2 .step-circle", {
        backgroundColor: "#18f109",
        color: "#000",
        duration: 0.3,
      }, "<")
      .to(".step-2", {
        scale: 1,
        duration: 0.3,
      }, "+=0.5")
      
      .to(".step-3", {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(".step-3 .step-circle", {
        backgroundColor: "#18f109",
        color: "#000",
        duration: 0.3,
      }, "<")
      .to(".step-3", {
        scale: 1,
        duration: 0.3,
      }, "+=0.5")
      
      // Show checkmark
      .to(checkRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      })
      .to(checkRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        delay: 1
      })
      
      // Reset all steps
      .to(".step-circle", {
        backgroundColor: "#e5e7eb",
        color: "#6b7280",
        duration: 0.5,
      });

    }, stepsRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={stepsRef} className="relative mb-8">
      <motion.div 
        className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="step-1 flex items-center gap-2">
          <span className="step-circle w-10 h-10 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center font-bold">1</span>
          <span className="text-gray-800 dark:text-gray-300 font-medium">Kies je stem</span>
        </div>
        
        <ChevronRight className="hidden sm:block text-gray-400 dark:text-gray-600" />
        
        <div className="step-2 flex items-center gap-2">
          <span className="step-circle w-10 h-10 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center font-bold">2</span>
          <span className="text-gray-600 dark:text-gray-400 font-medium">Upload script</span>
        </div>
        
        <ChevronRight className="hidden sm:block text-gray-400 dark:text-gray-600" />
        
        <div className="step-3 flex items-center gap-2">
          <span className="step-circle w-10 h-10 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center font-bold">3</span>
          <span className="text-gray-600 dark:text-gray-400 font-medium">Ontvang audio</span>
        </div>
      </motion.div>
      
      {/* Checkmark - positioned to the right of all steps */}
      <div 
        ref={checkRef}
        className="absolute right-0 sm:right-[-60px] top-0 w-12 h-12 bg-[#18f109] rounded-full flex items-center justify-center opacity-0 scale-0 shadow-lg"
      >
        <Check className="w-6 h-6 text-black" strokeWidth={3} />
      </div>
    </div>
  );
}

// Variation 1: Soft Gradient
function SoftGradient() {
  return (
    <div className="relative min-h-screen p-4 sm:p-8 lg:p-16">
      <motion.div 
        className="relative h-[90vh] bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 rounded-3xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Simplified Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-96 h-96 bg-[#18f109]/5 rounded-full filter blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-40 w-80 h-80 bg-[#efd243]/5 rounded-full filter blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-6 sm:px-12 lg:px-16">
          <div className="max-w-2xl">
            <AnimatedSteps />

            {/* Title */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-8xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="block">Jouw merk</span>
              <span className="block relative">
                <span className="text-[#18f109]">verdient</span>
                <motion.div 
                  className="absolute bottom-0 left-0 h-1 bg-[#18f109]"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-6xl mt-2">een stem die raakt</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              Professionele voice-overs die jouw boodschap versterken. 
              Van radio commercials tot e-learning modules - binnen 48 uur perfect ingesproken.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-[#18f109] text-black rounded-2xl font-bold hover:bg-[#18f109]/90 transition-all transform hover:scale-105">
                Ontdek onze stemmen
                <ArrowRight className="inline-block ml-2" />
              </button>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-100 dark:bg-white/10 backdrop-blur text-gray-900 dark:text-white rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition-all border border-gray-200 dark:border-white/20">
                <Info className="inline-block mr-2 w-4 h-4" />
                Hoe het werkt
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="flex flex-wrap items-center gap-4 sm:gap-6 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#18f109]" />
                <span className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base">&lt;48u geleverd</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#efd243] fill-current" />
                <span className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base">9.1/10 klantbeoordeling</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#ebaa3a]" />
                <span className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base">100% tevredenheid</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Voice Cards for larger screens */}
        <VoiceCards />
      </motion.div>
    </div>
  );
}

// Variation 2: Pure White
function PureWhite() {
  return (
    <div className="relative min-h-screen p-4 sm:p-8 lg:p-16">
      <motion.div 
        className="relative h-[90vh] bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Minimal Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-50/50 dark:from-gray-800/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-6 sm:px-12 lg:px-16">
          <div className="max-w-2xl">
            <AnimatedSteps />

            {/* Title */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-8xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="block">Jouw merk</span>
              <span className="block text-[#18f109]">verdient</span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-6xl mt-2">een stem die raakt</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Professionele voice-overs die jouw boodschap versterken. 
              Van radio commercials tot e-learning modules - binnen 48 uur perfect ingesproken.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-[#18f109] text-black rounded-2xl font-bold hover:bg-[#18f109]/90 transition-all">
                Ontdek onze stemmen
                <ArrowRight className="inline-block ml-2" />
              </button>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                <Info className="inline-block mr-2 w-4 h-4" />
                Hoe het werkt
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="flex flex-wrap items-center gap-4 sm:gap-6 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#18f109]" />
                <span className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base">&lt;48u geleverd</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#efd243] fill-current" />
                <span className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base">9.1/10 klantbeoordeling</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#ebaa3a]" />
                <span className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base">100% tevredenheid</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Voice Cards for larger screens */}
        <VoiceCards />
      </motion.div>
    </div>
  );
}

// Variation 3: Light Shadows
function LightShadows() {
  return (
    <div className="relative min-h-screen p-4 sm:p-8 lg:p-16 bg-gray-50 dark:bg-gray-950">
      <motion.div 
        className="relative h-[90vh] bg-white dark:bg-gray-900 rounded-3xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          boxShadow: '0 20px 70px -10px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Shadow Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-40 left-1/4 w-64 h-64 bg-[#18f109]/10 rounded-full"
            style={{
              boxShadow: '0 10px 40px rgba(24, 241, 9, 0.1)',
              filter: 'blur(40px)'
            }}
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-40 right-1/4 w-48 h-48 bg-[#efd243]/10 rounded-full"
            style={{
              boxShadow: '0 10px 40px rgba(239, 210, 67, 0.1)',
              filter: 'blur(40px)'
            }}
            animate={{
              y: [0, 20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-6 sm:px-12 lg:px-16">
          <div className="max-w-2xl">
            <AnimatedSteps />

            {/* Title */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-8xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="block">Jouw merk</span>
              <span className="block text-[#18f109] drop-shadow-lg">verdient</span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-6xl mt-2">een stem die raakt</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Professionele voice-overs die jouw boodschap versterken. 
              Van radio commercials tot e-learning modules - binnen 48 uur perfect ingesproken.
            </motion.p>

            {/* CTAs with shadows */}
            <motion.div 
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button 
                className="px-6 sm:px-8 py-3 sm:py-4 bg-[#18f109] text-black rounded-2xl font-bold hover:bg-[#18f109]/90 transition-all transform hover:scale-105"
                style={{ boxShadow: '0 10px 30px -5px rgba(24, 241, 9, 0.3)' }}
              >
                Ontdek onze stemmen
                <ArrowRight className="inline-block ml-2" />
              </button>
              <button 
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                style={{ boxShadow: '0 5px 20px -5px rgba(0, 0, 0, 0.1)' }}
              >
                <Info className="inline-block mr-2 w-4 h-4" />
                Hoe het werkt
              </button>
            </motion.div>

            {/* Stats with subtle shadows */}
            <motion.div 
              className="flex flex-wrap items-center gap-4 sm:gap-6 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Zap className="w-5 h-5 text-[#18f109]" />
                <span className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base">&lt;48u geleverd</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Star className="w-5 h-5 text-[#efd243] fill-current" />
                <span className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base">9.1/10 klantbeoordeling</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Shield className="w-5 h-5 text-[#ebaa3a]" />
                <span className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base">100% tevredenheid</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Voice Cards for larger screens */}
        <VoiceCards />
      </motion.div>
    </div>
  );
}

// Variation 4: Accent Colors
function AccentColors() {
  return (
    <div className="relative min-h-screen p-4 sm:p-8 lg:p-16">
      <motion.div 
        className="relative h-[90vh] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800"
        initial={{ opacity: 0, rotate: -0.5 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Accent Color Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#18f109] to-[#efd243]" />
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#18f109] via-[#efd243] to-[#ebaa3a]" />
          
          <motion.div
            className="absolute top-20 right-20 w-4 h-4 bg-[#18f109] rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-40 left-40 w-6 h-6 bg-[#efd243] rounded-full"
            animate={{
              scale: [1, 2, 1],
              opacity: [1, 0.3, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-6 sm:px-12 lg:px-16">
          <div className="max-w-2xl">
            <AnimatedSteps />

            {/* Title with accent underline */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-8xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="block">Jouw merk</span>
              <span className="block relative">
                <span className="text-[#18f109]">verdient</span>
                <motion.div 
                  className="absolute bottom-0 left-0 h-1 bg-[#18f109]"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-6xl mt-2">een stem die raakt</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              Professionele voice-overs die jouw boodschap versterken. 
              Van radio commercials tot e-learning modules - binnen 48 uur perfect ingesproken.
            </motion.p>

            {/* CTAs with accent borders */}
            <motion.div 
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-[#18f109] text-black rounded-2xl font-bold hover:bg-[#18f109]/90 transition-all relative overflow-hidden group">
                <span className="relative z-10">
                  Ontdek onze stemmen
                  <ArrowRight className="inline-block ml-2" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#18f109] to-[#efd243] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-gray-900 dark:text-white rounded-2xl font-semibold border-2 border-[#18f109]/30 hover:border-[#18f109] transition-all">
                <Info className="inline-block mr-2 w-4 h-4" />
                Hoe het werkt
              </button>
            </motion.div>

            {/* Stats with accent colors */}
            <motion.div 
              className="flex flex-wrap items-center gap-4 sm:gap-6 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2 border-l-4 border-[#18f109] pl-3">
                <Zap className="w-5 h-5 text-[#18f109]" />
                <span className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base">&lt;48u geleverd</span>
              </div>
              <div className="flex items-center gap-2 border-l-4 border-[#efd243] pl-3">
                <Star className="w-5 h-5 text-[#efd243] fill-current" />
                <span className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base">9.1/10 klantbeoordeling</span>
              </div>
              <div className="flex items-center gap-2 border-l-4 border-[#ebaa3a] pl-3">
                <Shield className="w-5 h-5 text-[#ebaa3a]" />
                <span className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base">100% tevredenheid</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Voice Cards for larger screens */}
        <VoiceCards />
      </motion.div>
    </div>
  );
}

// Variation 5: Geometric Minimal
function GeometricMinimal() {
  return (
    <div className="relative min-h-screen p-4 sm:p-8 lg:p-16">
      <motion.div 
        className="relative h-[90vh] bg-white dark:bg-gray-900 rounded-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Geometric Background */}
        <div className="absolute inset-0">
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-5 dark:opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, #18f109 1px, transparent 1px),
                linear-gradient(to bottom, #18f109 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
          
          {/* Geometric shapes */}
          <motion.div
            className="absolute top-20 right-1/4 w-32 h-32 border-2 border-[#18f109]/20 transform rotate-45"
            animate={{
              rotate: [45, 90, 45],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/4 w-24 h-24 bg-[#efd243]/10"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="absolute top-1/2 right-10 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[50px] border-b-[#18f109]/10" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-6 sm:px-12 lg:px-16">
          <div className="max-w-2xl">
            <AnimatedSteps />

            {/* Title with geometric accent */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-8xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="block relative">
                Jouw merk
                <div className="absolute -left-4 top-0 w-2 h-full bg-[#18f109]" />
              </span>
              <span className="block text-[#18f109]">verdient</span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-6xl mt-2">een stem die raakt</span>
            </motion.h1>

            {/* Description with geometric container */}
            <motion.div
              className="relative mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-lg relative z-10">
                Professionele voice-overs die jouw boodschap versterken. 
                Van radio commercials tot e-learning modules - binnen 48 uur perfect ingesproken.
              </p>
              <div className="absolute -top-2 -left-2 w-20 h-20 border border-[#18f109]/20" />
            </motion.div>

            {/* CTAs with geometric style */}
            <motion.div 
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-[#18f109] text-black font-bold hover:bg-[#18f109]/90 transition-all relative">
                <span className="relative z-10">
                  Ontdek onze stemmen
                  <ArrowRight className="inline-block ml-2" />
                </span>
              </button>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-gray-900 dark:text-white font-semibold border border-gray-300 dark:border-gray-700 hover:border-[#18f109] dark:hover:border-[#18f109] transition-all">
                <Info className="inline-block mr-2 w-4 h-4" />
                Hoe het werkt
              </button>
            </motion.div>

            {/* Stats with geometric elements */}
            <motion.div 
              className="flex flex-wrap items-center gap-4 sm:gap-6 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2 relative">
                <div className="absolute -left-2 -top-2 w-4 h-4 border border-[#18f109]/30" />
                <Zap className="w-5 h-5 text-[#18f109]" />
                <span className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base">&lt;48u geleverd</span>
              </div>
              <div className="flex items-center gap-2 relative">
                <div className="absolute -left-2 -top-2 w-4 h-4 bg-[#efd243]/10" />
                <Star className="w-5 h-5 text-[#efd243] fill-current" />
                <span className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base">9.1/10 klantbeoordeling</span>
              </div>
              <div className="flex items-center gap-2 relative">
                <div className="absolute -left-2 -top-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-[#ebaa3a]/20" />
                <Shield className="w-5 h-5 text-[#ebaa3a]" />
                <span className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base">100% tevredenheid</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Voice Cards for larger screens */}
        <VoiceCards />
      </motion.div>
    </div>
  );
}