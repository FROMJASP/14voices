'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronRight, Zap, Star, Shield, ArrowRight, Headphones, Mic } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import gsap from 'gsap';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export default function AsymmetricSplitVariations() {
  const [selectedMockup, setSelectedMockup] = useState(1);

  const mockups = [
    { id: 1, name: 'Clean Minimal', description: 'Simplified background with subtle gradients' },
    { id: 2, name: 'GSAP Steps', description: 'Dynamic 3-step animation with emphasis' },
    { id: 3, name: 'Modern Gradient', description: 'Vibrant gradients with particle effects' },
    { id: 4, name: 'Dark Neon', description: 'Dark theme with glowing neon accents' },
    { id: 5, name: 'Geometric Flow', description: 'Animated geometric patterns' },
  ];

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta min-h-screen bg-gray-50 dark:bg-gray-950`}>
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Asymmetric Split Variations</h1>
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
        {selectedMockup === 1 && <CleanMinimal />}
        {selectedMockup === 2 && <GSAPSteps />}
        {selectedMockup === 3 && <ModernGradient />}
        {selectedMockup === 4 && <DarkNeon />}
        {selectedMockup === 5 && <GeometricFlow />}
      </div>
    </div>
  );
}

// Variation 1: Clean Minimal
function CleanMinimal() {
  return (
    <div className="relative min-h-screen p-8 lg:p-16">
      <motion.div 
        className="relative h-[90vh] bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 rounded-3xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Simplified Background */}
        <div className="absolute inset-0">
          {/* Subtle gradient orbs */}
          <motion.div
            className="absolute top-20 left-20 w-96 h-96 bg-[#18f109]/10 rounded-full filter blur-3xl"
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
            className="absolute bottom-20 right-40 w-80 h-80 bg-[#efd243]/10 rounded-full filter blur-3xl"
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

        {/* Content - Left Aligned */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-2xl ml-16 lg:ml-24">
            {/* Process Steps */}
            <motion.div 
              className="flex items-center gap-3 mb-8 flex-wrap"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 bg-[#18f109] text-black rounded-full flex items-center justify-center font-bold">1</span>
                <span className="text-gray-800 dark:text-gray-300 font-medium">Kies je stem</span>
              </div>
              <ChevronRight className="text-gray-400 dark:text-gray-600" />
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full flex items-center justify-center font-bold">2</span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Upload script</span>
              </div>
              <ChevronRight className="text-gray-400 dark:text-gray-600" />
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full flex items-center justify-center font-bold">3</span>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Ontvang audio</span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1 
              className="text-6xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="block">Jouw merk</span>
              <span className="block text-[#18f109]">verdient</span>
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
              <button className="px-8 py-4 bg-[#18f109] text-black rounded-2xl font-bold hover:bg-[#18f109]/90 transition-all transform hover:scale-105">
                Luister demo's
                <ArrowRight className="inline-block ml-2" />
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
        </div>
      </motion.div>
    </div>
  );
}

// Variation 2: GSAP Steps Animation
function GSAPSteps() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stepsRef.current) return;

    const ctx = gsap.context(() => {
      // Timeline for sequential animations
      const tl = gsap.timeline({ repeat: -1 });

      // Step 1 emphasis
      tl.to(step1Ref.current, {
        scale: 1.2,
        duration: 0.5,
        ease: "power2.out"
      })
      .to(step1Ref.current?.querySelector('.step-circle'), {
        backgroundColor: "#18f109",
        duration: 0.3,
      }, "<")
      .to(step1Ref.current?.querySelector('.step-text'), {
        color: "#18f109",
        fontWeight: "700",
        duration: 0.3,
      }, "<")
      .to(step1Ref.current, {
        scale: 1,
        duration: 0.5,
        ease: "power2.in"
      }, "+=0.5")

      // Arrow 1 animation
      .to(".arrow-1", {
        opacity: 1,
        scale: 1.2,
        duration: 0.3,
      })
      .to(".arrow-1", {
        opacity: 0.3,
        scale: 1,
        duration: 0.3,
      }, "+=0.2")

      // Step 2 emphasis
      .to(step2Ref.current, {
        scale: 1.2,
        duration: 0.5,
        ease: "power2.out"
      })
      .to(step2Ref.current?.querySelector('.step-circle'), {
        backgroundColor: "#18f109",
        duration: 0.3,
      }, "<")
      .to(step2Ref.current?.querySelector('.step-text'), {
        color: "#18f109",
        fontWeight: "700",
        duration: 0.3,
      }, "<")
      .to(step2Ref.current, {
        scale: 1,
        duration: 0.5,
        ease: "power2.in"
      }, "+=0.5")

      // Arrow 2 animation
      .to(".arrow-2", {
        opacity: 1,
        scale: 1.2,
        duration: 0.3,
      })
      .to(".arrow-2", {
        opacity: 0.3,
        scale: 1,
        duration: 0.3,
      }, "+=0.2")

      // Step 3 emphasis
      .to(step3Ref.current, {
        scale: 1.2,
        duration: 0.5,
        ease: "power2.out"
      })
      .to(step3Ref.current?.querySelector('.step-circle'), {
        backgroundColor: "#18f109",
        duration: 0.3,
      }, "<")
      .to(step3Ref.current?.querySelector('.step-text'), {
        color: "#18f109",
        fontWeight: "700",
        duration: 0.3,
      }, "<")
      .to(step3Ref.current, {
        scale: 1,
        duration: 0.5,
        ease: "power2.in"
      }, "+=0.5")

      // Reset all
      .to([step1Ref.current?.querySelector('.step-circle'), step2Ref.current?.querySelector('.step-circle'), step3Ref.current?.querySelector('.step-circle')], {
        backgroundColor: "#e5e7eb",
        duration: 0.5,
      }, "+=0.5")
      .to([step1Ref.current?.querySelector('.step-text'), step2Ref.current?.querySelector('.step-text'), step3Ref.current?.querySelector('.step-text')], {
        color: "#6b7280",
        fontWeight: "500",
        duration: 0.5,
      }, "<");

    }, stepsRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen p-8 lg:p-16">
      <motion.div 
        className="relative h-[90vh] bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black rounded-3xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#18f109]/5 to-transparent" />
          
          {/* GSAP animated circles */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#18f109]/20 rounded-full filter blur-3xl gsap-circle-1" />
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-[#efd243]/20 rounded-full filter blur-3xl gsap-circle-2" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-2xl ml-16 lg:ml-24">
            {/* GSAP Animated Steps */}
            <div ref={stepsRef} className="flex items-center gap-3 mb-8 flex-wrap">
              <div ref={step1Ref} className="flex items-center gap-2">
                <span className="step-circle w-12 h-12 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full flex items-center justify-center font-bold text-lg">1</span>
                <span className="step-text text-gray-600 dark:text-gray-400 font-medium text-lg">Kies je stem</span>
              </div>
              
              <ChevronRight className="arrow-1 text-gray-400 dark:text-gray-600 opacity-30" />

              <div ref={step2Ref} className="flex items-center gap-2">
                <span className="step-circle w-12 h-12 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full flex items-center justify-center font-bold text-lg">2</span>
                <span className="step-text text-gray-600 dark:text-gray-400 font-medium text-lg">Upload script</span>
              </div>

              <ChevronRight className="arrow-2 text-gray-400 dark:text-gray-600 opacity-30" />

              <div ref={step3Ref} className="flex items-center gap-2">
                <span className="step-circle w-12 h-12 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full flex items-center justify-center font-bold text-lg">3</span>
                <span className="step-text text-gray-600 dark:text-gray-400 font-medium text-lg">Ontvang audio</span>
              </div>
            </div>

            {/* Title */}
            <motion.h1 
              className="text-6xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="block">Jouw merk</span>
              <span className="block text-[#18f109]">verdient</span>
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
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button className="px-8 py-4 bg-[#18f109] text-black rounded-2xl font-bold hover:bg-[#18f109]/90 transition-all transform hover:scale-105">
                Luister demo's
                <Play className="inline-block ml-2 w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Variation 3: Modern Gradient
function ModernGradient() {
  return (
    <div className="relative min-h-screen p-8 lg:p-16">
      <motion.div 
        className="relative h-[90vh] bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 rounded-3xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Particle Background */}
        <div className="absolute inset-0">
          {/* Floating particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-2xl ml-16 lg:ml-24">
            {/* Steps with glass effect */}
            <motion.div 
              className="flex items-center gap-3 mb-8 flex-wrap bg-white/10 backdrop-blur-md rounded-2xl p-4 inline-flex"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 bg-white text-purple-900 rounded-full flex items-center justify-center font-bold">1</span>
                <span className="text-white font-medium">Kies je stem</span>
              </div>
              <ChevronRight className="text-white/60" />
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <span className="text-white/80 font-medium">Upload script</span>
              </div>
              <ChevronRight className="text-white/60" />
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <span className="text-white/80 font-medium">Ontvang audio</span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1 
              className="text-6xl lg:text-8xl font-bold text-white mb-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="block">Jouw merk</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">verdient</span>
              <span className="block text-4xl lg:text-6xl mt-2">een stem die raakt</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-xl text-white/90 mb-8 max-w-lg"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              Professionele voice-overs die jouw boodschap versterken. 
              Van radio commercials tot e-learning modules - binnen 48 uur perfect ingesproken.
            </motion.p>

            {/* CTA */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button className="px-8 py-4 bg-white text-purple-900 rounded-2xl font-bold hover:bg-white/90 transition-all transform hover:scale-105 shadow-2xl">
                Luister demo's
                <Headphones className="inline-block ml-2 w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Variation 4: Dark Neon
function DarkNeon() {
  return (
    <div className="relative min-h-screen p-8 lg:p-16">
      <motion.div 
        className="relative h-[90vh] bg-black rounded-3xl overflow-hidden border border-[#18f109]/20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Neon Grid Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(24, 241, 9, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(24, 241, 9, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
          
          {/* Neon glow effects */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#18f109]/20 rounded-full filter blur-[100px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#efd243]/20 rounded-full filter blur-[80px]"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-2xl ml-16 lg:ml-24">
            {/* Neon Steps */}
            <motion.div 
              className="flex items-center gap-3 mb-8 flex-wrap"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 bg-[#18f109] text-black rounded-full flex items-center justify-center font-bold shadow-[0_0_20px_rgba(24,241,9,0.5)]">1</span>
                <span className="text-[#18f109] font-medium">Kies je stem</span>
              </div>
              <ChevronRight className="text-[#18f109]/50" />
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 bg-gray-900 border border-gray-700 text-gray-400 rounded-full flex items-center justify-center font-bold">2</span>
                <span className="text-gray-400 font-medium">Upload script</span>
              </div>
              <ChevronRight className="text-gray-600" />
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 bg-gray-900 border border-gray-700 text-gray-400 rounded-full flex items-center justify-center font-bold">3</span>
                <span className="text-gray-400 font-medium">Ontvang audio</span>
              </div>
            </motion.div>

            {/* Title with neon effect */}
            <motion.h1 
              className="text-6xl lg:text-8xl font-bold text-white mb-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="block">Jouw merk</span>
              <span className="block text-[#18f109] drop-shadow-[0_0_30px_rgba(24,241,9,0.5)]">verdient</span>
              <span className="block text-4xl lg:text-6xl mt-2">een stem die raakt</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-lg"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              Professionele voice-overs die jouw boodschap versterken. 
              Van radio commercials tot e-learning modules - binnen 48 uur perfect ingesproken.
            </motion.p>

            {/* CTA with neon */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button className="px-8 py-4 bg-[#18f109] text-black rounded-2xl font-bold hover:bg-[#18f109]/90 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(24,241,9,0.5)]">
                Luister demo's
                <Mic className="inline-block ml-2 w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Variation 5: Geometric Flow
function GeometricFlow() {
  const geometricRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!geometricRef.current) return;

    const ctx = gsap.context(() => {
      // Animate geometric shapes
      gsap.to(".geo-shape-1", {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      });

      gsap.to(".geo-shape-2", {
        rotation: -360,
        duration: 30,
        repeat: -1,
        ease: "none"
      });

      gsap.to(".geo-shape-3", {
        y: [0, -50, 0],
        duration: 5,
        repeat: -1,
        ease: "power1.inOut"
      });

    }, geometricRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen p-8 lg:p-16">
      <motion.div 
        ref={geometricRef}
        className="relative h-[90vh] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Geometric Background */}
        <div className="absolute inset-0">
          {/* Rotating geometric shapes */}
          <div className="absolute top-20 right-20 w-64 h-64 geo-shape-1">
            <div className="w-full h-full border-4 border-white/20 rounded-3xl transform rotate-45" />
          </div>
          
          <div className="absolute bottom-20 left-20 w-48 h-48 geo-shape-2">
            <div className="w-full h-full border-4 border-[#18f109]/30 rounded-full" />
          </div>
          
          <div className="absolute top-1/2 right-1/3 w-32 h-32 geo-shape-3">
            <div className="w-full h-full bg-[#efd243]/20 transform rotate-45" />
          </div>

          {/* Animated lines */}
          <svg className="absolute inset-0 w-full h-full">
            <motion.line
              x1="0"
              y1="50%"
              x2="100%"
              y2="50%"
              stroke="rgba(24, 241, 9, 0.2)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.line
              x1="50%"
              y1="0"
              x2="50%"
              y2="100%"
              stroke="rgba(239, 210, 67, 0.2)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-2xl ml-16 lg:ml-24">
            {/* Geometric Steps */}
            <motion.div 
              className="flex items-center gap-3 mb-8 flex-wrap"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 bg-white text-purple-900 rounded-lg transform rotate-3 flex items-center justify-center font-bold">1</span>
                <span className="text-white font-medium">Kies je stem</span>
              </div>
              <ChevronRight className="text-white/60" />
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 bg-white/20 text-white rounded-lg transform -rotate-3 flex items-center justify-center font-bold">2</span>
                <span className="text-white/80 font-medium">Upload script</span>
              </div>
              <ChevronRight className="text-white/60" />
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 bg-white/20 text-white rounded-lg transform rotate-3 flex items-center justify-center font-bold">3</span>
                <span className="text-white/80 font-medium">Ontvang audio</span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1 
              className="text-6xl lg:text-8xl font-bold text-white mb-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="block">Jouw merk</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#18f109] to-[#efd243]">verdient</span>
              <span className="block text-4xl lg:text-6xl mt-2">een stem die raakt</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-xl text-white/90 mb-8 max-w-lg"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              Professionele voice-overs die jouw boodschap versterken. 
              Van radio commercials tot e-learning modules - binnen 48 uur perfect ingesproken.
            </motion.p>

            {/* CTA */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button className="px-8 py-4 bg-gradient-to-r from-[#18f109] to-[#efd243] text-black rounded-2xl font-bold hover:scale-105 transition-all transform">
                Luister demo's
                <ArrowRight className="inline-block ml-2 w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}