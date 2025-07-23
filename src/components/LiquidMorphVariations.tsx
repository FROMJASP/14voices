'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Headphones } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export default function LiquidMorphVariations() {
  const [selectedVariation, setSelectedVariation] = useState(1);

  const variations = [
    { id: 1, name: 'Vintage Film', description: 'Film grain with liquid morph' },
    { id: 2, name: 'Retro Wave', description: 'Synthwave inspired distortion' },
    { id: 3, name: 'Analog Glitch', description: 'VHS-style interference' },
    { id: 4, name: 'Nostalgia Blur', description: 'Dreamy vintage atmosphere' },
    { id: 5, name: 'Classic Noise', description: 'Old TV static effect' },
  ];

  return (
    <div
      className={`${plusJakarta.variable} font-plus-jakarta min-h-screen bg-gray-50 dark:bg-gray-950`}
    >
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-xl font-bold">Liquid Morph Variations</h1>
            <div className="flex flex-wrap gap-2">
              {variations.map((variation) => (
                <button
                  key={variation.id}
                  onClick={() => setSelectedVariation(variation.id)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all ${
                    selectedVariation === variation.id
                      ? 'bg-[#18f109] text-black font-semibold'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {variation.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Variation Display */}
      <div className="p-4 sm:p-6">
        {selectedVariation === 1 && <VintageFilm />}
        {selectedVariation === 2 && <RetroWave />}
        {selectedVariation === 3 && <AnalogGlitch />}
        {selectedVariation === 4 && <NostalgiaBlur />}
        {selectedVariation === 5 && <ClassicNoise />}
      </div>
    </div>
  );
}

// Shared Animated Steps Component
function AnimatedSteps() {
  return (
    <motion.div
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-3 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Step 1 */}
      <motion.div
        className="flex items-center gap-3"
        animate={{
          scale: [1, 1.1, 1],
          filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'],
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 0 }}
      >
        <motion.span
          className="w-12 h-12 bg-[#18f109] text-black rounded-full flex items-center justify-center font-bold text-lg shadow-lg"
          animate={{
            rotate: [-5, 5, -5],
            boxShadow: [
              '0 10px 25px -5px rgba(24, 241, 9, 0.3)',
              '0 20px 35px -5px rgba(24, 241, 9, 0.5)',
              '0 10px 25px -5px rgba(24, 241, 9, 0.3)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          1
        </motion.span>
        <span className="text-white font-semibold text-sm sm:text-base">Kies je stem</span>
      </motion.div>

      <motion.div
        className="hidden sm:block"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        <ChevronRight className="text-gray-400" />
      </motion.div>

      {/* Step 2 */}
      <motion.div
        className="flex items-center gap-3"
        animate={{
          scale: [1, 1.1, 1],
          filter: ['brightness(0.7)', 'brightness(1.2)', 'brightness(0.7)'],
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      >
        <motion.span
          className="w-12 h-12 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg"
          animate={{
            rotate: [5, -5, 5],
            boxShadow: [
              '0 10px 25px -5px rgba(107, 114, 128, 0.3)',
              '0 20px 35px -5px rgba(107, 114, 128, 0.5)',
              '0 10px 25px -5px rgba(107, 114, 128, 0.3)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        >
          2
        </motion.span>
        <span className="text-gray-300 font-semibold text-sm sm:text-base">Upload script</span>
      </motion.div>

      <motion.div
        className="hidden sm:block"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
      >
        <ChevronRight className="text-gray-400" />
      </motion.div>

      {/* Step 3 */}
      <motion.div
        className="flex items-center gap-3"
        animate={{
          scale: [1, 1.1, 1],
          filter: ['brightness(0.7)', 'brightness(1.2)', 'brightness(0.7)'],
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 2 }}
      >
        <motion.span
          className="w-12 h-12 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg"
          animate={{
            rotate: [-5, 5, -5],
            boxShadow: [
              '0 10px 25px -5px rgba(107, 114, 128, 0.3)',
              '0 20px 35px -5px rgba(107, 114, 128, 0.5)',
              '0 10px 25px -5px rgba(107, 114, 128, 0.3)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 2 }}
        >
          3
        </motion.span>
        <span className="text-gray-300 font-semibold text-sm sm:text-base">Ontvang audio</span>
      </motion.div>
    </motion.div>
  );
}

// Variation 1: Vintage Film
function VintageFilm() {
  return (
    <div className="relative min-h-screen p-4 sm:p-8 lg:p-16">
      <motion.div
        className="relative h-[90vh] bg-gradient-to-br from-amber-900/90 via-gray-900 to-black rounded-[2rem] sm:rounded-[4rem] overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Vintage Film Background */}
        <div className="absolute inset-0">
          {/* Film Grain */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
              mixBlendMode: 'multiply',
            }}
          />

          {/* Film Scratches */}
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ['0% 0%', '0% 100%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 100px,
                rgba(255, 255, 255, 0.03) 100px,
                rgba(255, 255, 255, 0.03) 101px
              )`,
            }}
          />

          {/* Liquid Morph Shapes */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <filter id="vintage-morph">
                <feTurbulence baseFrequency="0.01" numOctaves="2" result="turbulence" />
                <feColorMatrix in="turbulence" type="saturate" values="0.1" />
              </filter>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
                  result="goo"
                />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
            <g filter="url(#goo)">
              <motion.circle
                cx="20%"
                cy="30%"
                r="150"
                fill="#18f109"
                opacity="0.3"
                animate={{
                  cx: ['20%', '30%', '20%'],
                  cy: ['30%', '40%', '30%'],
                  r: [150, 200, 150],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.circle
                cx="80%"
                cy="70%"
                r="120"
                fill="#efd243"
                opacity="0.2"
                animate={{
                  cx: ['80%', '70%', '80%'],
                  cy: ['70%', '60%', '70%'],
                  r: [120, 170, 120],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </g>
          </svg>

          {/* Vignette Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-50" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center p-6 sm:p-12 lg:p-20">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSteps />

            <motion.h1
              className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white mb-6 sm:mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="block mb-2 sm:mb-4">Geef je project</span>
              <span className="relative inline-block">
                <span className="relative z-10 text-black px-4 sm:px-8 py-1 sm:py-2">een stem</span>
                <motion.div
                  className="absolute inset-0 bg-[#18f109] rounded-xl sm:rounded-2xl"
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

            <motion.p
              className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Professionele voice-overs die jouw verhaal tot leven brengen. Van commercials tot
              documentaires, binnen 48 uur geleverd.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                className="px-6 sm:px-8 py-3 sm:py-4 bg-[#18f109] text-black rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Headphones className="inline-block mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Beluister demo&apos;s
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Variation 2: Retro Wave
function RetroWave() {
  return (
    <div className="relative min-h-screen p-4 sm:p-8 lg:p-16">
      <motion.div
        className="relative h-[90vh] bg-gradient-to-br from-purple-900 via-pink-900 to-black rounded-[2rem] sm:rounded-[4rem] overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Retro Wave Background */}
        <div className="absolute inset-0">
          {/* Synthwave Grid */}
          <div className="absolute inset-0">
            <div
              className="absolute bottom-0 left-0 right-0 h-2/3"
              style={{
                backgroundImage: `linear-gradient(rgba(255, 0, 255, 0.3) 2px, transparent 2px),
                                 linear-gradient(90deg, rgba(255, 0, 255, 0.3) 2px, transparent 2px)`,
                backgroundSize: '60px 60px',
                transform: 'perspective(500px) rotateX(60deg)',
                transformOrigin: 'center bottom',
              }}
            />
          </div>

          {/* Scanlines */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              backgroundPosition: ['0px 0px', '0px 10px'],
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                rgba(255, 255, 255, 0.1),
                rgba(255, 255, 255, 0.1) 1px,
                transparent 1px,
                transparent 2px
              )`,
            }}
          />

          {/* Liquid Morph with Neon Glow */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <filter id="neon-glow">
                <feGaussianBlur stdDeviation="10" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="liquid-neon">
                <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -15"
                  result="goo"
                />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
            <g filter="url(#liquid-neon)">
              <motion.circle
                cx="30%"
                cy="20%"
                r="180"
                fill="#ff00ff"
                opacity="0.4"
                filter="url(#neon-glow)"
                animate={{
                  cx: ['30%', '40%', '30%'],
                  cy: ['20%', '30%', '20%'],
                  r: [180, 220, 180],
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
                r="150"
                fill="#00ffff"
                opacity="0.3"
                filter="url(#neon-glow)"
                animate={{
                  cx: ['70%', '60%', '70%'],
                  cy: ['60%', '50%', '60%'],
                  r: [150, 190, 150],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </g>
          </svg>

          {/* Chrome Aberration Effect */}
          <div className="absolute inset-0 mix-blend-screen opacity-20">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500 via-transparent to-blue-500"
              animate={{
                x: [-2, 2, -2],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center p-6 sm:p-12 lg:p-20">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSteps />

            <motion.h1
              className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white mb-6 sm:mb-8 font-mono"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                textShadow: '0 0 20px rgba(255, 0, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.6)',
              }}
            >
              <span className="block mb-2 sm:mb-4">DIGITAL</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] via-[#18f109] to-[#00ffff]">
                VOICES
              </span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto px-4 font-mono"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Professionele voice-overs */}
              <br />
              {/* Binnen 48 uur geleverd */}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#ff00ff] to-[#00ffff] text-black rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-transform font-mono"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: '0 0 30px rgba(255, 0, 255, 0.5)',
                }}
              >
                <Headphones className="inline-block mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                BELUISTER_DEMO&apos;S
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Variation 3: Analog Glitch
function AnalogGlitch() {
  return (
    <div className="relative min-h-screen p-4 sm:p-8 lg:p-16">
      <motion.div
        className="relative h-[90vh] bg-black rounded-[2rem] sm:rounded-[4rem] overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* VHS Glitch Background */}
        <div className="absolute inset-0">
          {/* Static Noise */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='static'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23static)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px',
            }}
          />

          {/* RGB Shift Layers */}
          <motion.div
            className="absolute inset-0"
            animate={{
              x: [-2, 2, -2, 0],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatType: 'reverse',
              times: [0, 0.25, 0.75, 1],
            }}
          >
            <div
              className="absolute inset-0 bg-red-500/10 mix-blend-multiply"
              style={{ transform: 'translateX(-2px)' }}
            />
            <div className="absolute inset-0 bg-green-500/10 mix-blend-multiply" />
            <div
              className="absolute inset-0 bg-blue-500/10 mix-blend-multiply"
              style={{ transform: 'translateX(2px)' }}
            />
          </motion.div>

          {/* Horizontal Glitch Lines */}
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-full bg-white/20"
                style={{
                  height: '2px',
                  top: `${20 + i * 15}%`,
                }}
                animate={{
                  x: [0, 100, -100, 0],
                  scaleX: [1, 1.5, 0.5, 1],
                }}
                transition={{
                  duration: 0.05,
                  delay: i * 0.01,
                }}
              />
            ))}
          </motion.div>

          {/* Liquid Morph with Distortion */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <filter id="distortion">
                <feTurbulence baseFrequency="0.02" numOctaves="3" result="noise" seed="1" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" />
              </filter>
              <filter id="goo-glitch">
                <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
                  result="goo"
                />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
            <g filter="url(#goo-glitch)">
              <motion.rect
                x="15%"
                y="20%"
                width="200"
                height="200"
                fill="#18f109"
                opacity="0.4"
                filter="url(#distortion)"
                animate={{
                  x: ['15%', '25%', '15%'],
                  y: ['20%', '30%', '20%'],
                  rotate: [0, 90, 180, 270, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              <motion.rect
                x="60%"
                y="50%"
                width="150"
                height="150"
                fill="#efd243"
                opacity="0.3"
                filter="url(#distortion)"
                animate={{
                  x: ['60%', '50%', '60%'],
                  y: ['50%', '40%', '50%'],
                  rotate: [360, 270, 180, 90, 0],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </g>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center p-6 sm:p-12 lg:p-20">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSteps />

            <motion.h1
              className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white mb-6 sm:mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.span
                className="block mb-2 sm:mb-4"
                animate={{
                  x: [0, -2, 2, 0],
                  filter: [
                    'hue-rotate(0deg)',
                    'hue-rotate(10deg)',
                    'hue-rotate(-10deg)',
                    'hue-rotate(0deg)',
                  ],
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                ANALOG
              </motion.span>
              <motion.span
                className="block text-[#18f109]"
                animate={{
                  textShadow: [
                    '0 0 10px #18f109',
                    '0 0 20px #18f109, 0 0 30px #18f109',
                    '0 0 10px #18f109',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                VOICES
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.span
                animate={{
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 0.1,
                  repeat: Infinity,
                  repeatDelay: 4,
                }}
              >
                Professionele voice-overs met vintage karakter.
                <br />
                Direct uit de studio, binnen 48 uur.
              </motion.span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                className="px-6 sm:px-8 py-3 sm:py-4 bg-[#18f109] text-black rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(24, 241, 9, 0.5)',
                    '0 0 30px rgba(24, 241, 9, 0.7)',
                    '0 0 20px rgba(24, 241, 9, 0.5)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Headphones className="inline-block mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Beluister demo&apos;s
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Variation 4: Nostalgia Blur
function NostalgiaBlur() {
  return (
    <div className="relative min-h-screen p-4 sm:p-8 lg:p-16">
      <motion.div
        className="relative h-[90vh] bg-gradient-to-br from-sepia-900 via-amber-900 to-rose-900 rounded-[2rem] sm:rounded-[4rem] overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Dreamy Nostalgic Background */}
        <div className="absolute inset-0">
          {/* Soft Light Leaks */}
          <motion.div
            className="absolute top-0 right-0 w-[60%] h-[60%] bg-orange-300/20 rounded-full filter blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-pink-300/20 rounded-full filter blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Film Texture Overlay */}
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)`,
            }}
          />

          {/* Liquid Morph with Soft Edges */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <filter id="soft-goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -20"
                  result="goo"
                />
                <feBlend in="SourceGraphic" in2="goo" />
              </filter>
              <filter id="sepia">
                <feColorMatrix
                  type="matrix"
                  values="0.393 0.769 0.189 0 0 0.349 0.686 0.168 0 0 0.272 0.534 0.131 0 0 0 0 0 1 0"
                />
              </filter>
            </defs>
            <g filter="url(#soft-goo)">
              <motion.ellipse
                cx="25%"
                cy="30%"
                rx="200"
                ry="150"
                fill="#ffb366"
                opacity="0.3"
                filter="url(#sepia)"
                animate={{
                  cx: ['25%', '35%', '25%'],
                  cy: ['30%', '40%', '30%'],
                  rx: [200, 250, 200],
                  ry: [150, 200, 150],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.ellipse
                cx="75%"
                cy="60%"
                rx="180"
                ry="140"
                fill="#ff8fab"
                opacity="0.3"
                filter="url(#sepia)"
                animate={{
                  cx: ['75%', '65%', '75%'],
                  cy: ['60%', '50%', '60%'],
                  rx: [180, 220, 180],
                  ry: [140, 180, 140],
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </g>
          </svg>

          {/* Vintage Vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center p-6 sm:p-12 lg:p-20">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSteps />

            <motion.h1
              className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white mb-6 sm:mb-8"
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.3, duration: 1 }}
              style={{
                textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
              }}
            >
              <span className="block mb-2 sm:mb-4 font-serif italic">Tijdloze</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-rose-200">
                stemmen
              </span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-amber-100/80 mb-8 sm:mb-12 max-w-2xl mx-auto px-4 font-serif"
              initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Warme, authentieke voice-overs die je raken.
              <br />
              Met de kwaliteit van vroeger, vandaag geleverd.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.button
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-200 to-rose-200 text-amber-900 rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-transform shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: '0 20px 40px rgba(251, 191, 36, 0.3)',
                }}
              >
                <Headphones className="inline-block mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Beluister demo&apos;s
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Variation 5: Classic Noise
function ClassicNoise() {
  return (
    <div className="relative min-h-screen p-4 sm:p-8 lg:p-16">
      <motion.div
        className="relative h-[90vh] bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-[2rem] sm:rounded-[4rem] overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Classic TV Static Background */}
        <div className="absolute inset-0">
          {/* TV Static */}
          <motion.div
            className="absolute inset-0 opacity-40"
            animate={{
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 0.1,
              repeat: Infinity,
            }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='tvStatic'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' result='static' seed='2'%3E%3Canimate attributeName='seed' values='1;2;3;4;5;6;7;8;9;10;1' dur='0.1s' repeatCount='indefinite'/%3E%3C/feTurbulence%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23tvStatic)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: '256px 256px',
            }}
          />

          {/* CRT Lines */}
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ['0px 0px', '0px 4px'],
            }}
            transition={{
              duration: 0.05,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255, 255, 255, 0.03) 2px,
                rgba(255, 255, 255, 0.03) 4px
              )`,
            }}
          />

          {/* Liquid Morph with Interference */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <filter id="interference">
                <feTurbulence baseFrequency="0.05" numOctaves="1" result="turbulence">
                  <animate
                    attributeName="baseFrequency"
                    values="0.05;0.07;0.05"
                    dur="5s"
                    repeatCount="indefinite"
                  />
                </feTurbulence>
                <feColorMatrix in="turbulence" type="saturate" values="0" />
              </filter>
              <filter id="liquid-static">
                <feGaussianBlur in="SourceGraphic" stdDeviation="25" result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -15"
                  result="goo"
                />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
            <g filter="url(#liquid-static)">
              <motion.circle
                cx="35%"
                cy="35%"
                r="170"
                fill="#18f109"
                opacity="0.5"
                filter="url(#interference)"
                animate={{
                  cx: ['35%', '45%', '35%'],
                  cy: ['35%', '45%', '35%'],
                  r: [170, 210, 170],
                  opacity: [0.5, 0.3, 0.5],
                }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.circle
                cx="65%"
                cy="65%"
                r="140"
                fill="#efd243"
                opacity="0.4"
                filter="url(#interference)"
                animate={{
                  cx: ['65%', '55%', '65%'],
                  cy: ['65%', '55%', '65%'],
                  r: [140, 180, 140],
                  opacity: [0.4, 0.2, 0.4],
                }}
                transition={{
                  duration: 22,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </g>
          </svg>

          {/* Screen Flicker */}
          <motion.div
            className="absolute inset-0 bg-white mix-blend-overlay"
            animate={{
              opacity: [0, 0, 0, 0.1, 0, 0, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              times: [0, 0.3, 0.6, 0.65, 0.7, 0.9, 1],
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center p-6 sm:p-12 lg:p-20">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSteps />

            <motion.h1
              className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white mb-6 sm:mb-8 font-mono"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.span
                className="block mb-2 sm:mb-4"
                animate={{
                  opacity: [1, 0.9, 1],
                  x: [0, 1, -1, 0],
                }}
                transition={{
                  duration: 0.1,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                BROADCAST
              </motion.span>
              <motion.span
                className="block text-[#18f109]"
                animate={{
                  textShadow: [
                    '0 0 5px #18f109',
                    '0 0 10px #18f109, 0 0 15px #18f109',
                    '0 0 5px #18f109',
                  ],
                  opacity: [1, 0.95, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                QUALITY
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto px-4 font-mono"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.span
                animate={{
                  opacity: [1, 0.95, 1],
                }}
                transition={{
                  duration: 0.05,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                [SIGNAL LOCKED] Professionele voice-overs
                <br />
                [TRANSMISSION OK] Binnen 48 uur online
              </motion.span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                className="px-6 sm:px-8 py-3 sm:py-4 bg-[#18f109] text-black rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-transform font-mono uppercase"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    '0 0 15px rgba(24, 241, 9, 0.4)',
                    '0 0 25px rgba(24, 241, 9, 0.6)',
                    '0 0 15px rgba(24, 241, 9, 0.4)',
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                <Headphones className="inline-block mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                BELUISTER_DEMO&apos;S
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
