'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Play, Mic, Radio, Waves, Sparkles } from 'lucide-react';

// Perlin noise generator with enhanced mathematical patterns
const createPerlinNoise = (frequency: number = 0.02, octaves: number = 4) => {
  return `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='${octaves}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E`;
};

const variations = [
  {
    id: 'cyber-dreams',
    title: {
      line1: 'Cyber dromen',
      line2: 'analoge ziel',
    },
    subtitle: 'Waar digitale stemmen menselijke emoties ontmoeten',
    description:
      'Transform your story into a symphony of synthetic warmth. Every voice crafted with precision, delivered with soul.',
    cta: 'Start je reis',
    gradient: {
      light: 'from-cyan-400/20 via-blue-400/20 to-purple-400/20',
      dark: 'from-cyan-900/20 via-black to-purple-900/20',
    },
    accent: {
      light: 'from-cyan-400 to-blue-400',
      dark: 'from-cyan-500 to-blue-500',
    },
    noise: { frequency: 0.015, octaves: 3 },
    icon: Radio,
  },
  {
    id: 'retro-pulse',
    title: {
      line1: 'Retro pulse',
      line2: 'future voice',
    },
    subtitle: 'Nostalgische klanken voor moderne verhalen',
    description:
      'Blend vintage aesthetics with cutting-edge audio. Your message deserves the perfect voice, delivered in record time.',
    cta: 'Pulse forward',
    gradient: {
      light: 'from-pink-400/20 via-rose-400/20 to-orange-400/20',
      dark: 'from-pink-900/20 via-black to-orange-900/20',
    },
    accent: {
      light: 'from-pink-400 to-orange-400',
      dark: 'from-pink-500 to-orange-500',
    },
    noise: { frequency: 0.025, octaves: 5 },
    icon: Waves,
  },
  {
    id: 'minimal-echo',
    title: {
      line1: 'Minimale echo',
      line2: 'maximale impact',
    },
    subtitle: 'Less is more in the world of voice',
    description:
      'Strip away the noise, amplify the message. Clean, crisp, and compelling voice-overs that resonate.',
    cta: 'Echo your vision',
    gradient: {
      light: 'from-gray-200/20 via-gray-100/20 to-gray-200/20',
      dark: 'from-gray-800/20 via-black to-gray-900/20',
    },
    accent: {
      light: 'from-gray-600 to-gray-800',
      dark: 'from-gray-300 to-gray-100',
    },
    noise: { frequency: 0.01, octaves: 2 },
    icon: Mic,
  },
  {
    id: 'neon-waves',
    title: {
      line1: 'Neon golven',
      line2: 'sonic dreams',
    },
    subtitle: 'Illuminate your audio landscape',
    description:
      'Vibrant voices that paint neon across the digital canvas. Every project becomes an audiovisual masterpiece.',
    cta: 'Ride the wave',
    gradient: {
      light: 'from-green-400/20 via-emerald-400/20 to-teal-400/20',
      dark: 'from-green-900/20 via-black to-teal-900/20',
    },
    accent: {
      light: 'from-green-400 to-teal-400',
      dark: 'from-green-500 to-teal-500',
    },
    noise: { frequency: 0.03, octaves: 6 },
    icon: Sparkles,
  },
  {
    id: 'glitch-harmony',
    title: {
      line1: 'Glitch harmony',
      line2: 'perfect chaos',
    },
    subtitle: 'Breaking conventions, creating connections',
    description:
      'Embrace the beautiful imperfections. Where glitches become features and chaos creates character.',
    cta: 'Harmonize now',
    gradient: {
      light: 'from-red-400/20 via-purple-400/20 to-indigo-400/20',
      dark: 'from-red-900/20 via-black to-indigo-900/20',
    },
    accent: {
      light: 'from-red-400 to-purple-400',
      dark: 'from-red-500 to-purple-500',
    },
    noise: { frequency: 0.04, octaves: 8 },
    icon: Play,
  },
];

export function AnalogDreamsGSAPVariations() {
  const [currentVariation, setCurrentVariation] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const containerRef = useRef<HTMLDivElement>(null);
  const vhsRef = useRef<HTMLDivElement>(null);
  const trackingRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLCanvasElement>(null);

  const variation = variations[currentVariation];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced VHS tracking lines with variable speed
      gsap.to(trackingRef.current, {
        y: '100%',
        duration: 6 + currentVariation * 2,
        repeat: -1,
        ease: 'none',
      });

      // Dynamic VHS distortion based on variation
      const distortTl = gsap.timeline({ repeat: -1, repeatDelay: 2 + currentVariation });
      distortTl
        .to(vhsRef.current, {
          scaleX: 1.01 + currentVariation * 0.01,
          skewY: 0.3 + currentVariation * 0.2,
          duration: 0.1,
          ease: 'none',
        })
        .to(vhsRef.current, {
          scaleX: 1,
          skewY: 0,
          duration: 0.1,
          ease: 'none',
        });

      // Enhanced noise animation
      gsap.to(noiseRef.current, {
        opacity: gsap.utils.random(0.3, 0.6),
        duration: 0.1,
        repeat: -1,
        repeatRefresh: true,
        ease: 'none',
      });

      // Smooth content animations with variation-specific timing
      gsap.fromTo(
        '.analog-content',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15 + currentVariation * 0.05,
          ease: 'power3.out',
        }
      );

      // Enhanced steps pulse with color variations
      const steps = document.querySelectorAll('.analog-step');
      const stepsTl = gsap.timeline({ repeat: -1 });

      steps.forEach((step) => {
        stepsTl
          .to(step, {
            scale: 1.08,
            duration: 0.8,
            ease: 'power2.inOut',
          })
          .to(
            step,
            {
              scale: 1,
              duration: 0.5,
            },
            '+=0.2'
          );
      });

      // Floating elements with physics-based motion
      gsap.to('.float-element', {
        y: () => gsap.utils.random(-30, 30),
        x: () => gsap.utils.random(-20, 20),
        rotation: () => gsap.utils.random(-5, 5),
        duration: () => gsap.utils.random(3, 5),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          amount: 1.5,
          from: 'random',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [currentVariation, theme]);

  // Animated grain effect
  useEffect(() => {
    if (!grainRef.current) return;
    const ctx = grainRef.current.getContext('2d')!;

    const animateGrain = () => {
      ctx.clearRect(0, 0, 200, 200);

      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * 200;
        const y = Math.random() * 200;
        const alpha = Math.random() * 0.3;
        ctx.fillStyle =
          theme === 'dark' ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha})`;
        ctx.fillRect(x, y, 1, 1);
      }

      requestAnimationFrame(animateGrain);
    };

    animateGrain();
  }, [theme]);

  const Icon = variation.icon;

  return (
    <div
      ref={containerRef}
      className={`relative min-h-screen overflow-hidden transition-colors duration-700 ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'
      }`}
    >
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={`fixed top-8 right-8 z-50 px-4 py-2 rounded-full font-medium transition-all ${
          theme === 'dark'
            ? 'bg-white text-black hover:bg-gray-200'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* Variation Selector */}
      <div className="fixed top-8 left-8 z-50 flex gap-2">
        {variations.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentVariation(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentVariation
                ? 'bg-gradient-to-r ' +
                  (theme === 'dark' ? variation.accent.dark : variation.accent.light) +
                  ' scale-150'
                : theme === 'dark'
                  ? 'bg-gray-600'
                  : 'bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br transition-all duration-700 ${
          theme === 'dark' ? variation.gradient.dark : variation.gradient.light
        }`}
      />

      {/* VHS Effect Container */}
      <div ref={vhsRef} className="absolute inset-0">
        {/* Enhanced Tracking Lines */}
        <div ref={trackingRef} className="absolute inset-x-0 -top-full h-full pointer-events-none">
          <div className={`h-20 ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`} />
          <div className={`h-2 ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`} />
          <div className="h-40 bg-transparent" />
          <div className={`h-10 ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`} />
          <div className={`h-1 ${theme === 'dark' ? 'bg-white/20' : 'bg-black/20'}`} />
        </div>

        {/* Enhanced Perlin Noise */}
        <div
          ref={noiseRef}
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("${createPerlinNoise(variation.noise.frequency, variation.noise.octaves)}")`,
            backgroundSize: '200px 200px',
            mixBlendMode: theme === 'dark' ? 'screen' : 'multiply',
          }}
        />

        {/* Animated Grain Texture */}
        <canvas
          ref={grainRef}
          width={200}
          height={200}
          className="absolute inset-0 w-full h-full opacity-30"
          style={{ mixBlendMode: theme === 'dark' ? 'screen' : 'multiply' }}
        />
      </div>

      {/* Enhanced Floating Background Elements */}
      <div className="absolute inset-0">
        <div
          className={`float-element absolute top-20 left-10 w-64 h-64 rounded-full filter blur-3xl bg-gradient-to-r ${
            theme === 'dark' ? variation.accent.dark : variation.accent.light
          } opacity-20`}
        />
        <div
          className={`float-element absolute bottom-20 right-20 w-96 h-96 rounded-full filter blur-3xl bg-gradient-to-r ${
            theme === 'dark' ? variation.accent.dark : variation.accent.light
          } opacity-15`}
        />
        <div
          className={`float-element absolute top-1/2 left-1/2 w-80 h-80 rounded-full filter blur-3xl bg-gradient-to-r ${
            theme === 'dark' ? variation.accent.dark : variation.accent.light
          } opacity-25`}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 sm:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto w-full">
          {/* Enhanced Steps */}
          <div className="analog-content flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
            <div
              className={`analog-step px-8 py-4 backdrop-blur-md rounded-2xl border transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 hover:bg-white/10'
                  : 'bg-black/5 border-black/10 hover:bg-black/10'
              }`}
            >
              <span className="text-2xl font-bold">1</span> Kies je stem
            </div>
            <div
              className={`analog-step px-8 py-4 backdrop-blur-md rounded-2xl border transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 hover:bg-white/10'
                  : 'bg-black/5 border-black/10 hover:bg-black/10'
              }`}
            >
              <span className="text-2xl font-bold">2</span> Upload script
            </div>
            <div
              className={`analog-step px-8 py-4 backdrop-blur-md rounded-2xl border transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 hover:bg-white/10'
                  : 'bg-black/5 border-black/10 hover:bg-black/10'
              }`}
            >
              <span className="text-2xl font-bold">3</span> Ontvang audio
            </div>
          </div>

          {/* Enhanced Title */}
          <h1 className="analog-content text-5xl sm:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            {variation.title.line1}
            <br />
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${
                theme === 'dark' ? variation.accent.dark : variation.accent.light
              }`}
            >
              {variation.title.line2}
            </span>
          </h1>

          {/* Subtitle */}
          <h2
            className={`analog-content text-2xl mb-6 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {variation.subtitle}
          </h2>

          {/* Enhanced Description */}
          <p
            className={`analog-content text-xl mb-12 max-w-2xl ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {variation.description}
          </p>

          {/* Enhanced CTA Button */}
          <button
            className={`analog-content group px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-all inline-flex items-center gap-4 shadow-2xl bg-gradient-to-r ${
              theme === 'dark' ? variation.accent.dark : variation.accent.light
            } ${theme === 'dark' ? 'text-white shadow-white/10' : 'text-white shadow-black/20'}`}
          >
            <Icon className="w-6 h-6" />
            {variation.cta}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
