'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Headphones, ArrowRight } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export default function GSAPHeroVariations() {
  const [selectedVariation, setSelectedVariation] = useState(1);

  const variations = [
    { id: 1, name: 'Cinema Noir', description: 'Film noir with grain' },
    { id: 2, name: 'Digital Static', description: 'TV interference aesthetic' },
    { id: 3, name: 'Analog Dreams', description: 'VHS tracking lines' },
    { id: 4, name: 'Broadcast Live', description: 'Studio transmission' },
    { id: 5, name: 'Vintage Reel', description: 'Film projector effect' },
  ];

  return (
    <div className={`${plusJakarta.variable} font-plus-jakarta min-h-screen bg-gray-950`}>
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-xl font-bold text-white">GSAP Hero Variations</h1>
            <div className="flex flex-wrap gap-2">
              {variations.map((variation) => (
                <button
                  key={variation.id}
                  onClick={() => setSelectedVariation(variation.id)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all ${
                    selectedVariation === variation.id
                      ? 'bg-[#18f109] text-black font-semibold'
                      : 'bg-white/10 text-white hover:bg-white/20'
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
      <div className="pt-20">
        {selectedVariation === 1 && <CinemaNoir />}
        {selectedVariation === 2 && <DigitalStatic />}
        {selectedVariation === 3 && <AnalogDreams />}
        {selectedVariation === 4 && <BroadcastLive />}
        {selectedVariation === 5 && <VintageReel />}
      </div>
    </div>
  );
}

// Variation 1: Cinema Noir
function CinemaNoir() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Film grain animation
      gsap.to(noiseRef.current, {
        opacity: gsap.utils.random(0.3, 0.5),
        duration: 0.1,
        repeat: -1,
        ease: 'none',
      });

      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out' }
      );

      // Steps sequential highlight
      const steps = stepsRef.current?.querySelectorAll('.step-item');
      if (steps) {
        const tl = gsap.timeline({ repeat: -1 });

        steps.forEach((step) => {
          tl.to(step, {
            backgroundColor: '#18f109',
            color: '#000',
            duration: 1,
            ease: 'power2.inOut',
          }).to(
            step,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              duration: 0.3,
              ease: 'power2.inOut',
            },
            '+=0.5'
          );
        });
      }

      // Parallax effect on mouse move
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 20;
        const y = (clientY / innerHeight - 0.5) * 20;

        gsap.to('.parallax-layer', {
          x: x,
          y: y,
          duration: 1,
          ease: 'power2.out',
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-black">
      {/* Film Noise Overlay */}
      <div
        ref={noiseRef}
        className="absolute inset-0 z-10 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='filmGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23filmGrain)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* Background Layers */}
      <div className="absolute inset-0">
        <div className="parallax-layer absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="parallax-layer absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full filter blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#18f109]/20 rounded-full filter blur-3xl" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-30 min-h-screen flex items-center justify-center px-6 sm:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto w-full">
          {/* Steps */}
          <div
            ref={stepsRef}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12"
          >
            <div className="step-item flex items-center gap-3 px-6 py-3 bg-white/10 rounded-full backdrop-blur-sm transition-all duration-300">
              <span className="text-2xl font-bold">1</span>
              <span className="font-medium">Kies je stem</span>
            </div>
            <div className="step-item flex items-center gap-3 px-6 py-3 bg-white/10 rounded-full backdrop-blur-sm transition-all duration-300">
              <span className="text-2xl font-bold">2</span>
              <span className="font-medium">Upload script</span>
            </div>
            <div className="step-item flex items-center gap-3 px-6 py-3 bg-white/10 rounded-full backdrop-blur-sm transition-all duration-300">
              <span className="text-2xl font-bold">3</span>
              <span className="font-medium">Ontvang audio</span>
            </div>
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight"
          >
            De stem die
            <br />
            <span className="text-[#18f109]">jouw verhaal</span>
            <br />
            vertelt
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-300 mb-12 max-w-2xl">
            Professionele voice-overs met de kracht van cinema. Binnen 48 uur geleverd, met de
            kwaliteit die je verwacht.
          </p>

          {/* CTA */}
          <button className="group px-8 py-4 bg-[#18f109] text-black rounded-full font-bold text-lg hover:scale-105 transition-transform inline-flex items-center gap-3">
            <Headphones className="w-5 h-5" />
            Beluister demo&apos;s
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Variation 2: Digital Static
function DigitalStatic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Digital glitch effect
      const glitchTl = gsap.timeline({ repeat: -1, repeatDelay: 5 });

      glitchTl
        .to(glitchRef.current, {
          opacity: 1,
          duration: 0.1,
          ease: 'none',
        })
        .to(glitchRef.current, {
          opacity: 0,
          duration: 0.1,
          ease: 'none',
        })
        .to(contentRef.current, {
          x: gsap.utils.random(-5, 5),
          duration: 0.05,
          ease: 'none',
        })
        .to(contentRef.current, {
          x: 0,
          duration: 0.05,
          ease: 'none',
        });

      // RGB shift animation
      gsap.to('.rgb-shift', {
        x: gsap.utils.random(-2, 2),
        duration: 0.1,
        repeat: -1,
        ease: 'none',
        stagger: 0.05,
      });

      // Content reveal
      gsap.fromTo(
        '.reveal-text',
        {
          clipPath: 'inset(0 100% 0 0)',
          opacity: 0,
        },
        {
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          duration: 1.5,
          stagger: 0.2,
          ease: 'power3.out',
        }
      );

      // Steps animation
      const stepsTl = gsap.timeline({ repeat: -1 });
      const steps = document.querySelectorAll('.digital-step');

      steps.forEach((step) => {
        stepsTl
          .to(step, {
            backgroundColor: '#18f109',
            color: '#000',
            boxShadow: '0 0 30px rgba(24, 241, 9, 0.8)',
            duration: 0.8,
            ease: 'power2.inOut',
          })
          .to(
            step,
            {
              backgroundColor: 'transparent',
              color: '#fff',
              boxShadow: 'none',
              duration: 0.3,
            },
            '+=0.5'
          );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-black">
      {/* Static Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.03),
            rgba(255, 255, 255, 0.03) 1px,
            transparent 1px,
            transparent 2px
          )`,
        }}
      />

      {/* Digital Glitch Overlay */}
      <div ref={glitchRef} className="absolute inset-0 opacity-0 pointer-events-none">
        <div className="absolute inset-0 bg-red-500/10 rgb-shift" />
        <div
          className="absolute inset-0 bg-green-500/10 rgb-shift"
          style={{ transform: 'translateX(2px)' }}
        />
        <div
          className="absolute inset-0 bg-blue-500/10 rgb-shift"
          style={{ transform: 'translateX(-2px)' }}
        />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 min-h-screen flex items-center justify-center px-6 sm:px-12 lg:px-20"
      >
        <div className="max-w-5xl mx-auto w-full">
          {/* Steps */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
            <div className="digital-step px-6 py-3 border border-gray-700 rounded-lg transition-all duration-300">
              <span className="text-xl font-mono">01.</span> Kies je stem
            </div>
            <div className="digital-step px-6 py-3 border border-gray-700 rounded-lg transition-all duration-300">
              <span className="text-xl font-mono">02.</span> Upload script
            </div>
            <div className="digital-step px-6 py-3 border border-gray-700 rounded-lg transition-all duration-300">
              <span className="text-xl font-mono">03.</span> Ontvang audio
            </div>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-tight font-mono">
              <div className="reveal-text">DIGITAL</div>
              <div className="reveal-text text-[#18f109]">VOICES</div>
              <div className="reveal-text">ONLINE</div>
            </h1>
          </div>

          {/* Description */}
          <p className="reveal-text text-xl text-gray-300 mb-12 max-w-2xl font-mono">
            &gt; Professional voice-over services
            <br />
            &gt; Delivered within 48 hours
            <br />
            &gt; Studio quality guaranteed
          </p>

          {/* CTA */}
          <button className="reveal-text group px-8 py-4 bg-[#18f109] text-black rounded-none font-bold text-lg hover:scale-105 transition-transform inline-flex items-center gap-3 font-mono">
            <Headphones className="w-5 h-5" />
            BELUISTER_DEMO&apos;S
            <span className="group-hover:translate-x-1 transition-transform">&gt;&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Variation 3: Analog Dreams
function AnalogDreams() {
  const containerRef = useRef<HTMLDivElement>(null);
  const vhsRef = useRef<HTMLDivElement>(null);
  const trackingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // VHS tracking lines
      gsap.to(trackingRef.current, {
        y: '100%',
        duration: 8,
        repeat: -1,
        ease: 'none',
      });

      // VHS distortion
      const distortTl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
      distortTl
        .to(vhsRef.current, {
          scaleX: 1.02,
          skewY: 0.5,
          duration: 0.1,
          ease: 'none',
        })
        .to(vhsRef.current, {
          scaleX: 1,
          skewY: 0,
          duration: 0.1,
          ease: 'none',
        });

      // Smooth content animations
      gsap.fromTo(
        '.analog-content',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          stagger: 0.2,
          ease: 'power3.out',
        }
      );

      // Steps pulse
      const steps = document.querySelectorAll('.analog-step');
      const stepsTl = gsap.timeline({ repeat: -1 });

      steps.forEach((step) => {
        stepsTl
          .to(step, {
            backgroundColor: '#18f109',
            color: '#000',
            scale: 1.05,
            duration: 1,
            ease: 'power2.inOut',
          })
          .to(
            step,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              scale: 1,
              duration: 0.5,
            },
            '+=0.3'
          );
      });

      // Floating elements
      gsap.to('.float-element', {
        y: gsap.utils.random(-20, 20),
        x: gsap.utils.random(-10, 10),
        duration: gsap.utils.random(4, 6),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          amount: 2,
          from: 'random',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"
    >
      {/* VHS Effect Container */}
      <div ref={vhsRef} className="absolute inset-0">
        {/* Tracking Lines */}
        <div ref={trackingRef} className="absolute inset-x-0 -top-full h-full pointer-events-none">
          <div className="h-20 bg-white/5" />
          <div className="h-2 bg-white/10" />
          <div className="h-40 bg-transparent" />
          <div className="h-10 bg-white/5" />
        </div>

        {/* Noise Pattern */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='vhsNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23vhsNoise)' opacity='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px',
            mixBlendMode: 'screen',
          }}
        />
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0">
        <div className="float-element absolute top-20 left-10 w-64 h-64 bg-[#18f109]/10 rounded-full filter blur-3xl" />
        <div className="float-element absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl" />
        <div className="float-element absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full filter blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 sm:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto w-full">
          {/* Steps */}
          <div className="analog-content flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
            <div className="analog-step px-8 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 transition-all duration-300">
              <span className="text-2xl font-bold">1</span> Kies je stem
            </div>
            <div className="analog-step px-8 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 transition-all duration-300">
              <span className="text-2xl font-bold">2</span> Upload script
            </div>
            <div className="analog-step px-8 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 transition-all duration-300">
              <span className="text-2xl font-bold">3</span> Ontvang audio
            </div>
          </div>

          {/* Title */}
          <h1 className="analog-content text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            Analoge warmte
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#18f109] to-[#efd243]">
              digitale precisie
            </span>
          </h1>

          {/* Description */}
          <p className="analog-content text-xl text-gray-300 mb-12 max-w-2xl">
            De nostalgische kracht van voice-overs met moderne kwaliteit. Jouw boodschap, perfect
            ingesproken binnen 48 uur.
          </p>

          {/* CTA */}
          <button className="analog-content group px-8 py-4 bg-gradient-to-r from-[#18f109] to-[#14c208] text-black rounded-full font-bold text-lg hover:scale-105 transition-all inline-flex items-center gap-3 shadow-2xl shadow-[#18f109]/30">
            <Headphones className="w-5 h-5" />
            Beluister demo&apos;s
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Variation 4: Broadcast Live
function BroadcastLive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const onAirRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ON AIR pulsing
      gsap.to(onAirRef.current, {
        opacity: gsap.utils.random(0.7, 1),
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Waveform animation
      const bars = waveformRef.current?.querySelectorAll('.waveform-bar');
      if (bars) {
        bars.forEach((bar) => {
          gsap.to(bar, {
            scaleY: gsap.utils.random(0.3, 1),
            duration: gsap.utils.random(0.3, 0.6),
            repeat: -1,
            yoyo: true,
            ease: 'none',
          });
        });
      }

      // Professional fade ins
      gsap.fromTo(
        '.broadcast-element',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );

      // Steps highlight sequence
      const stepsTl = gsap.timeline({ repeat: -1 });
      const steps = document.querySelectorAll('.broadcast-step');

      steps.forEach((step) => {
        stepsTl
          .to(step, {
            backgroundColor: '#18f109',
            color: '#000',
            borderColor: '#18f109',
            duration: 1.2,
            ease: 'power2.inOut',
          })
          .to(
            step,
            {
              backgroundColor: 'transparent',
              color: '#fff',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              duration: 0.5,
            },
            '+=0.5'
          );
      });

      // Background animation
      gsap.to('.bg-gradient', {
        backgroundPosition: '100% 100%',
        duration: 20,
        repeat: -1,
        ease: 'none',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-black">
      {/* Animated Background */}
      <div
        className="absolute inset-0 bg-gradient opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(45deg, #18f109 0%, transparent 25%, transparent 75%, #18f109 100%)',
          backgroundSize: '400% 400%',
        }}
      />

      {/* Studio Grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* ON AIR Indicator */}
      <div
        ref={onAirRef}
        className="absolute top-8 right-8 flex items-center gap-3 px-6 py-3 bg-red-600 rounded-lg"
      >
        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
        <span className="text-white font-bold tracking-wider">ON AIR</span>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 sm:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto w-full">
          {/* Waveform Display */}
          <div
            ref={waveformRef}
            className="broadcast-element flex items-center justify-center gap-1 h-20 mb-12"
          >
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="waveform-bar w-1 bg-[#18f109] rounded-full"
                style={{ height: '20%' }}
              />
            ))}
          </div>

          {/* Steps */}
          <div className="broadcast-element flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12">
            <div className="broadcast-step px-8 py-4 border-2 border-white/30 rounded-xl transition-all duration-300">
              <span className="text-2xl font-bold mr-3">1</span>
              <span className="font-medium">Kies je stem</span>
            </div>
            <div className="broadcast-step px-8 py-4 border-2 border-white/30 rounded-xl transition-all duration-300">
              <span className="text-2xl font-bold mr-3">2</span>
              <span className="font-medium">Upload script</span>
            </div>
            <div className="broadcast-step px-8 py-4 border-2 border-white/30 rounded-xl transition-all duration-300">
              <span className="text-2xl font-bold mr-3">3</span>
              <span className="font-medium">Ontvang audio</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="broadcast-element text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            Live vanuit
            <br />
            <span className="text-[#18f109]">de studio</span>
          </h1>

          {/* Description */}
          <p className="broadcast-element text-xl text-gray-300 mb-12 max-w-2xl">
            Broadcast-kwaliteit voice-overs, rechtstreeks uit onze professionele studio. 14 stemmen
            staan voor je klaar.
          </p>

          {/* CTA */}
          <button className="broadcast-element group px-10 py-5 bg-[#18f109] text-black rounded-xl font-bold text-lg hover:scale-105 transition-all inline-flex items-center gap-4 shadow-2xl shadow-[#18f109]/20">
            <Headphones className="w-6 h-6" />
            Beluister demo&apos;s
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Variation 5: Vintage Reel
function VintageReel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reel1Ref = useRef<HTMLDivElement>(null);
  const reel2Ref = useRef<HTMLDivElement>(null);
  const filmStripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Film reel rotation
      gsap.to(reel1Ref.current, {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: 'none',
      });

      gsap.to(reel2Ref.current, {
        rotation: -360,
        duration: 10,
        repeat: -1,
        ease: 'none',
      });

      // Film strip movement
      gsap.to(filmStripRef.current, {
        x: '-50%',
        duration: 20,
        repeat: -1,
        ease: 'none',
      });

      // Content animations
      gsap.fromTo(
        '.vintage-content',
        {
          opacity: 0,
          scale: 0.9,
          filter: 'blur(10px)',
        },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          stagger: 0.2,
          ease: 'power3.out',
        }
      );

      // Steps animation
      const stepsTl = gsap.timeline({ repeat: -1 });
      const steps = document.querySelectorAll('.vintage-step');

      steps.forEach((step) => {
        stepsTl
          .to(step, {
            backgroundColor: '#18f109',
            color: '#000',
            scale: 1.1,
            boxShadow: '0 20px 40px rgba(24, 241, 9, 0.4)',
            duration: 1,
            ease: 'back.out(1.7)',
          })
          .to(
            step,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              scale: 1,
              boxShadow: 'none',
              duration: 0.5,
            },
            '+=0.5'
          );
      });

      // Film flicker effect
      gsap.to('.film-flicker', {
        opacity: gsap.utils.random(0.8, 1),
        duration: 0.1,
        repeat: -1,
        ease: 'none',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sepia-900 via-black to-amber-900/20"
    >
      {/* Film Flicker Overlay */}
      <div className="film-flicker absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Film Grain */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='vintageGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0.3 0.3 0.3 0 0 0.3 0.3 0.3 0 0 0.3 0.3 0.3 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23vintageGrain)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Film Reels */}
      <div className="absolute top-10 left-10 w-32 h-32 opacity-20">
        <div
          ref={reel1Ref}
          className="w-full h-full border-8 border-white/20 rounded-full relative"
        >
          <div className="absolute inset-4 border-4 border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
      <div className="absolute bottom-10 right-10 w-40 h-40 opacity-20">
        <div
          ref={reel2Ref}
          className="w-full h-full border-8 border-white/20 rounded-full relative"
        >
          <div className="absolute inset-4 border-4 border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Film Strip */}
      <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden opacity-10">
        <div ref={filmStripRef} className="flex h-full" style={{ width: '200%' }}>
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-16 h-full border-x border-white/20 bg-white/5 mx-2" />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 sm:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto w-full text-center">
          {/* Steps */}
          <div className="vintage-content flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <div className="vintage-step px-8 py-4 bg-white/5 backdrop-blur-md rounded-full border border-white/20 transition-all duration-300">
              <span className="text-2xl font-bold">I</span> • Kies je stem
            </div>
            <div className="vintage-step px-8 py-4 bg-white/5 backdrop-blur-md rounded-full border border-white/20 transition-all duration-300">
              <span className="text-2xl font-bold">II</span> • Upload script
            </div>
            <div className="vintage-step px-8 py-4 bg-white/5 backdrop-blur-md rounded-full border border-white/20 transition-all duration-300">
              <span className="text-2xl font-bold">III</span> • Ontvang audio
            </div>
          </div>

          {/* Title */}
          <h1 className="vintage-content text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            Tijdloze
            <br />
            <span className="text-[#18f109] font-serif italic">stemmen</span>
            <br />
            voor elk verhaal
          </h1>

          {/* Description */}
          <p className="vintage-content text-xl text-amber-100/80 mb-12 max-w-2xl mx-auto">
            Met de warmte van vroeger en de technologie van nu. Professionele voice-overs binnen 48
            uur.
          </p>

          {/* CTA */}
          <button className="vintage-content group px-10 py-5 bg-gradient-to-r from-[#18f109] to-[#14c208] text-black rounded-full font-bold text-lg hover:scale-105 transition-all inline-flex items-center gap-4 shadow-2xl shadow-black/50 mx-auto">
            <Headphones className="w-6 h-6" />
            Beluister demo&apos;s
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
