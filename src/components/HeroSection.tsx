'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, Star, Shield, ArrowRight, Headphones, Mic, Check, Info } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import gsap from 'gsap';
import RippleGrid from '@/components/magicui/RippleGrid';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export default function HeroSection() {
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
        backgroundColor: "#d1d5db",
        color: "#374151",
        duration: 0.5,
      });

    }, stepsRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta relative min-h-screen p-4 sm:p-8 lg:p-16`}>
      <motion.div 
        className="relative h-[90vh] bg-white dark:bg-background rounded-3xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Enhanced Background with Ripple Grid */}
        <div className="absolute inset-0">
          {/* WebGL Ripple Grid Effect - Subtle overlay */}
          <div className="absolute inset-0 opacity-30 dark:opacity-20">
            <RippleGrid 
              gridColor="#18f109"
              rippleIntensity={0.015}
              gridSize={20}
              gridThickness={2}
              fadeDistance={3.0}
              vignetteStrength={0.3}
              glowIntensity={0.02}
              opacity={0.03}
              mouseInteraction={false}
            />
          </div>
          
          {/* Grid Pattern Layer */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            <motion.div 
              className="absolute inset-0 bg-[linear-gradient(to_right,#18f10920_1px,transparent_1px),linear-gradient(to_bottom,#18f10920_1px,transparent_1px)] bg-[size:4rem_4rem]"
              animate={{
                x: [0, 64],
                y: [0, 64],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            {/* Dot Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#00000003_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:24px_24px]" />
          </div>
          
          {/* Gradient Orbs */}
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
          
          {/* Subtle Radial Gradient Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.02)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-6 sm:px-12 lg:px-16">
          <div className="max-w-2xl relative">
            {/* Animated Steps */}
            <div ref={stepsRef} className="absolute -top-20 left-0">
              <motion.div 
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="step-1 flex items-center gap-2">
                  <span className="step-circle w-10 h-10 bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded-full flex items-center justify-center font-bold">1</span>
                  <span className="text-gray-800 dark:text-white font-medium">Kies je stem</span>
                </div>
                
                <ChevronRight className="hidden sm:block text-gray-500 dark:text-gray-600" />
                
                <div className="step-2 flex items-center gap-2">
                  <span className="step-circle w-10 h-10 bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded-full flex items-center justify-center font-bold">2</span>
                  <span className="text-gray-700 dark:text-white/90 font-medium">Upload script</span>
                </div>
                
                <ChevronRight className="hidden sm:block text-gray-500 dark:text-gray-600" />
                
                <div className="step-3 flex items-center gap-2">
                  <span className="step-circle w-10 h-10 bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded-full flex items-center justify-center font-bold">3</span>
                  <span className="text-gray-700 dark:text-white/90 font-medium">Ontvang audio</span>
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

            {/* Title with underline animation */}
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
              className="text-lg sm:text-xl text-gray-700 dark:text-white mb-8 max-w-lg"
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
                  <p className="text-gray-700 dark:text-white/90 text-sm">Warm & Vriendelijk</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-white text-sm">Demo beschikbaar</span>
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
                  <p className="text-gray-700 dark:text-white/90 text-sm">Zakelijk & Autoriteit</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-white text-sm">Direct beschikbaar</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}