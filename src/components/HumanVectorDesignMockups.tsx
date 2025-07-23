'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Sparkles, Users, Globe, ArrowRight, Zap } from 'lucide-react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

// Shared hero content component - matching current homepage design
const HeroContent = () => (
  <div className="text-center max-w-4xl mx-auto">
    {/* 3-step process */}
    <div className="flex items-center justify-center gap-8 mb-12">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#18f109] text-black flex items-center justify-center font-bold">1</div>
        <span className="text-gray-600">Boek je stem</span>
      </div>
      <ChevronRight className="text-gray-400" />
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold">2</div>
        <span className="text-gray-600">Upload script</span>
      </div>
      <ChevronRight className="text-gray-400" />
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold">3</div>
        <span className="text-gray-600">Ontvang audio</span>
      </div>
    </div>

    {/* Main headline */}
    <h1 className="text-6xl lg:text-7xl font-bold mb-6">
      <span className="text-gray-900">De </span>
      <span className="text-[#18f109] italic">ideale</span>
      <span className="text-gray-900"> stem</span>
    </h1>
    <p className="text-2xl text-gray-600 mb-8">voor jouw <span className="text-gray-800">commercial</span></p>
    
    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
      Nederlandse stemacteurs die jouw merk laten spreken. Perfect voor elke productie.
    </p>

    {/* CTA */}
    <button className="bg-[#18f109] text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#16d807] transition-colors">
      Bekijk stemmen
      <ArrowRight className="inline-block ml-2 w-5 h-5" />
    </button>

    {/* Stats */}
    <div className="flex items-center justify-center gap-12 mt-16">
      <div className="flex items-center gap-3">
        <Zap className="w-5 h-5 text-[#18f109]" />
        <span className="text-gray-700 font-medium">&lt;48u levering</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-yellow-500">★</span>
        <span className="text-gray-700 font-medium">9.1/10 beoordeld</span>
      </div>
      <div className="flex items-center gap-3">
        <Check className="w-5 h-5 text-orange-500" />
        <span className="text-gray-700 font-medium">100% garantie</span>
      </div>
    </div>
  </div>
);

// Version 1: Professional Voice Artist
const ProfessionalVoiceVersion = () => {
  return (
    <div className={`${montserrat.variable} font-montserrat min-h-screen bg-gray-50 flex items-center justify-center p-8`}>
      <div className="relative w-full max-w-7xl">
        {/* Left floating card */}
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-6 w-64"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#18f109] flex items-center justify-center">
              <Check className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">100% Garantie</h3>
              <p className="text-sm text-gray-600">Niet goed? Geld terug, geen vragen</p>
            </div>
          </div>
        </motion.div>

        {/* Right floating illustration */}
        <motion.div 
          className="absolute right-0 top-1/2 -translate-y-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <svg viewBox="0 0 300 400" className="w-[300px] h-[400px]">
            {/* Minimalist voice artist */}
            <g>
              {/* Simple geometric person */}
              <circle cx="150" cy="100" r="40" fill="#E5E7EB" />
              <rect x="120" y="140" width="60" height="80" rx="30" fill="#E5E7EB" />
              
              {/* Headphones - accent color */}
              <path d="M 100 100 Q 150 70 200 100" stroke="#18f109" strokeWidth="6" fill="none" strokeLinecap="round" />
              <rect x="95" y="95" width="12" height="20" rx="6" fill="#18f109" />
              <rect x="193" y="95" width="12" height="20" rx="6" fill="#18f109" />
              
              {/* Microphone */}
              <rect x="220" y="90" width="4" height="60" fill="#9CA3AF" />
              <circle cx="222" cy="90" r="15" fill="#6B7280" />
              
              {/* Sound waves */}
              <motion.circle
                cx="222"
                cy="90"
                r="25"
                fill="none"
                stroke="#18f109"
                strokeWidth="2"
                opacity="0"
                animate={{
                  r: [25, 35, 45],
                  opacity: [0.6, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </g>
          </svg>
        </motion.div>

        {/* Main content */}
        <HeroContent />
      </div>
    </div>
  );
};

// Version 2: Collaborative Team
const CollaborativeTeamVersion = () => {
  return (
    <div className={`${montserrat.variable} font-montserrat min-h-screen bg-gray-50 flex items-center justify-center p-8`}>
      <div className="relative w-full max-w-7xl">
        {/* Left floating card */}
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-6 w-64"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">100%</h3>
              <h3 className="font-bold text-gray-900">Nederlands</h3>
              <p className="text-sm text-gray-600">Native speakers, perfect accent</p>
            </div>
          </div>
        </motion.div>

        {/* Right floating illustration */}
        <motion.div 
          className="absolute right-0 top-1/2 -translate-y-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <svg viewBox="0 0 350 350" className="w-[350px] h-[350px]">
            {/* Team collaboration */}
            <g>
              {/* Central microphone */}
              <circle cx="175" cy="175" r="30" fill="#18f109" opacity="0.2" />
              <circle cx="175" cy="175" r="20" fill="#18f109" />
              <rect x="173" y="195" width="4" height="40" fill="#6B7280" />
              
              {/* Three people around microphone */}
              {/* Person 1 - top */}
              <g transform="translate(175, 80)">
                <circle cx="0" cy="0" r="25" fill="#E5E7EB" />
                <path d="M -20 0 Q 0 -15 20 0" stroke="#18f109" strokeWidth="3" fill="none" />
              </g>
              
              {/* Person 2 - bottom left */}
              <g transform="translate(100, 220)">
                <circle cx="0" cy="0" r="25" fill="#E5E7EB" />
                <path d="M -20 0 Q 0 -15 20 0" stroke="#18f109" strokeWidth="3" fill="none" />
              </g>
              
              {/* Person 3 - bottom right */}
              <g transform="translate(250, 220)">
                <circle cx="0" cy="0" r="25" fill="#E5E7EB" />
                <path d="M -20 0 Q 0 -15 20 0" stroke="#18f109" strokeWidth="3" fill="none" />
              </g>
              
              {/* Connection lines */}
              <line x1="175" y1="105" x2="175" y2="155" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="125" y1="205" x2="155" y2="185" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="225" y1="205" x2="195" y2="185" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="5,5" />
              
              {/* Sound waves */}
              <motion.circle
                cx="175"
                cy="175"
                r="50"
                fill="none"
                stroke="#18f109"
                strokeWidth="1"
                opacity="0"
                animate={{
                  r: [50, 70, 90],
                  opacity: [0.4, 0.2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
            </g>
          </svg>
        </motion.div>

        {/* Main content */}
        <HeroContent />
      </div>
    </div>
  );
};

// Version 3: Digital Audio Production
const DigitalProductionVersion = () => {
  return (
    <div className={`${montserrat.variable} font-montserrat min-h-screen bg-gray-50 flex items-center justify-center p-8`}>
      <div className="relative w-full max-w-7xl">
        {/* Left floating card */}
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-6 w-64"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Eigen Opleiding</h3>
              <p className="text-sm text-gray-600">4+ jaar training in-house</p>
            </div>
          </div>
        </motion.div>

        {/* Right floating illustration */}
        <motion.div 
          className="absolute right-0 top-1/2 -translate-y-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <svg viewBox="0 0 320 380" className="w-[320px] h-[380px]">
            {/* Digital audio interface */}
            <g>
              {/* Computer screen */}
              <rect x="60" y="80" width="200" height="140" rx="8" fill="#374151" />
              <rect x="70" y="90" width="180" height="120" fill="#1F2937" />
              
              {/* Waveform display */}
              <g transform="translate(160, 150)">
                {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((i) => (
                  <rect
                    key={i}
                    x={i * 15}
                    y={-Math.abs(i) * 8 - 10}
                    width="10"
                    height={Math.abs(i) * 16 + 20}
                    fill="#18f109"
                    opacity={0.8 - Math.abs(i) * 0.15}
                  />
                ))}
              </g>
              
              {/* Person silhouette */}
              <g transform="translate(160, 280)">
                <circle cx="0" cy="0" r="35" fill="#E5E7EB" />
                <rect x="-25" y="35" width="50" height="60" rx="25" fill="#E5E7EB" />
                
                {/* Headphones */}
                <path d="M -30 0 Q 0 -20 30 0" stroke="#18f109" strokeWidth="4" fill="none" strokeLinecap="round" />
                <rect x="-32" y="-5" width="8" height="15" rx="4" fill="#18f109" />
                <rect x="24" y="-5" width="8" height="15" rx="4" fill="#18f109" />
              </g>
              
              {/* Audio meters */}
              <g transform="translate(80, 100)">
                {[0, 1, 2].map((i) => (
                  <g key={i} transform={`translate(${i * 20}, 0)`}>
                    <rect x="0" y="0" width="15" height="100" fill="#374151" rx="2" />
                    <motion.rect
                      x="2"
                      y="20"
                      width="11"
                      height="60"
                      fill="#18f109"
                      animate={{
                        scaleY: [0.6, 0.9, 0.7, 1, 0.8],
                        y: [20, 10, 15, 5, 12],
                      }}
                      transition={{
                        duration: 2 + i * 0.3,
                        repeat: Infinity,
                      }}
                      style={{ transformOrigin: 'bottom' }}
                    />
                  </g>
                ))}
              </g>
            </g>
          </svg>
        </motion.div>

        {/* Main content */}
        <HeroContent />
      </div>
    </div>
  );
};

// Version 4: Global Reach
const GlobalReachVersion = () => {
  return (
    <div className={`${montserrat.variable} font-montserrat min-h-screen bg-gray-50 flex items-center justify-center p-8`}>
      <div className="relative w-full max-w-7xl">
        {/* Left floating card */}
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-6 w-64"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Globe className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Gratis Advies</h3>
              <p className="text-sm text-gray-600">Persoonlijke begeleiding bij elk project</p>
            </div>
          </div>
        </motion.div>

        {/* Right floating illustration */}
        <motion.div 
          className="absolute right-0 top-1/2 -translate-y-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <svg viewBox="0 0 380 320" className="w-[380px] h-[320px]">
            {/* Globe with voice connections */}
            <g transform="translate(190, 160)">
              {/* Globe outline */}
              <circle cx="0" cy="0" r="100" fill="none" stroke="#E5E7EB" strokeWidth="2" />
              <ellipse cx="0" cy="0" rx="100" ry="30" fill="none" stroke="#E5E7EB" strokeWidth="2" />
              <ellipse cx="0" cy="0" rx="30" ry="100" fill="none" stroke="#E5E7EB" strokeWidth="2" />
              
              {/* Voice nodes around globe */}
              {[
                { angle: 0, delay: 0 },
                { angle: 72, delay: 0.2 },
                { angle: 144, delay: 0.4 },
                { angle: 216, delay: 0.6 },
                { angle: 288, delay: 0.8 },
              ].map((node, i) => {
                const x = Math.cos((node.angle * Math.PI) / 180) * 130;
                const y = Math.sin((node.angle * Math.PI) / 180) * 130;
                return (
                  <g key={i}>
                    {/* Connection line */}
                    <line x1="0" y1="0" x2={x} y2={y} stroke="#CBD5E1" strokeWidth="1" strokeDasharray="5,5" />
                    
                    {/* Voice node */}
                    <g transform={`translate(${x}, ${y})`}>
                      <circle cx="0" cy="0" r="20" fill="white" stroke="#E5E7EB" strokeWidth="2" />
                      <circle cx="0" cy="0" r="15" fill="#F3F4F6" />
                      
                      {/* Animated pulse */}
                      <motion.circle
                        cx="0"
                        cy="0"
                        r="15"
                        fill="none"
                        stroke="#18f109"
                        strokeWidth="2"
                        opacity="0"
                        animate={{
                          r: [15, 25],
                          opacity: [0.6, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: node.delay,
                        }}
                      />
                    </g>
                  </g>
                );
              })}
              
              {/* Center microphone */}
              <circle cx="0" cy="0" r="25" fill="#18f109" />
              <circle cx="0" cy="0" r="20" fill="white" />
              <circle cx="0" cy="0" r="15" fill="#18f109" />
            </g>
          </svg>
        </motion.div>

        {/* Main content */}
        <HeroContent />
      </div>
    </div>
  );
};

// Version 5: Voice Journey Flow
const VoiceJourneyVersion = () => {
  return (
    <div className={`${montserrat.variable} font-montserrat min-h-screen bg-gray-50 flex items-center justify-center p-8`}>
      <div className="relative w-full max-w-7xl">
        {/* Left floating card */}
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-6 w-64"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#18f109] flex items-center justify-center">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Snelle Levering</h3>
              <p className="text-sm text-gray-600">Binnen 48 uur je voice-over</p>
            </div>
          </div>
        </motion.div>

        {/* Right floating illustration */}
        <motion.div 
          className="absolute right-0 top-1/2 -translate-y-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <svg viewBox="0 0 360 300" className="w-[360px] h-[300px]">
            {/* Voice journey visualization */}
            <g>
              {/* Path */}
              <path 
                d="M 50 150 Q 100 50 180 150 T 310 150" 
                fill="none" 
                stroke="#E5E7EB" 
                strokeWidth="2" 
                strokeDasharray="5,5"
              />
              
              {/* Stage 1: Upload */}
              <g transform="translate(50, 150)">
                <circle cx="0" cy="0" r="30" fill="white" stroke="#E5E7EB" strokeWidth="2" />
                <rect x="-10" y="-10" width="20" height="20" rx="2" fill="#E5E7EB" />
                <path d="M 0 -5 L 0 5 M -5 0 L 5 0" stroke="#6B7280" strokeWidth="2" />
              </g>
              
              {/* Stage 2: Voice Artist */}
              <g transform="translate(180, 150)">
                <circle cx="0" cy="0" r="35" fill="#18f109" opacity="0.2" />
                <circle cx="0" cy="0" r="30" fill="white" stroke="#18f109" strokeWidth="3" />
                <circle cx="0" cy="0" r="20" fill="#E5E7EB" />
                <path d="M -15 0 Q 0 -10 15 0" stroke="#18f109" strokeWidth="2" fill="none" />
              </g>
              
              {/* Stage 3: Download */}
              <g transform="translate(310, 150)">
                <circle cx="0" cy="0" r="30" fill="white" stroke="#E5E7EB" strokeWidth="2" />
                <path d="M 0 -10 L 0 5 M -7 0 L 7 0 L 0 7 L -7 0" stroke="#6B7280" strokeWidth="2" fill="none" />
              </g>
              
              {/* Animated particle flow */}
              <motion.circle
                cx="50"
                cy="150"
                r="5"
                fill="#18f109"
                animate={{
                  cx: [50, 180, 310],
                  cy: [150, 90, 150],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Sound waves from center */}
              <g transform="translate(180, 150)">
                {[0, 1, 2].map((i) => (
                  <motion.circle
                    key={i}
                    cx="0"
                    cy="0"
                    r="40"
                    fill="none"
                    stroke="#18f109"
                    strokeWidth="1"
                    opacity="0"
                    animate={{
                      r: [40, 60, 80],
                      opacity: [0.4, 0.2, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6,
                    }}
                  />
                ))}
              </g>
            </g>
          </svg>
        </motion.div>

        {/* Main content */}
        <HeroContent />
      </div>
    </div>
  );
};

export default function HumanVectorDesignMockups() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4">Human Vector Design Hero Mockups</h1>
        <p className="text-center text-gray-600 mb-12">
          Clean, modern hero section variations with subtle human vector illustrations
        </p>
        
        <div className="space-y-24">
          <div>
            <h2 className="text-2xl font-bold mb-4">Version 1: Professional Voice Artist</h2>
            <p className="text-gray-600 mb-6">
              Minimalist design with floating guarantee card and simple voice artist illustration
            </p>
            <ProfessionalVoiceVersion />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Version 2: Collaborative Team</h2>
            <p className="text-gray-600 mb-6">
              Shows team collaboration around a central microphone with connection lines
            </p>
            <CollaborativeTeamVersion />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Version 3: Digital Audio Production</h2>
            <p className="text-gray-600 mb-6">
              Features modern audio interface with waveforms and digital meters
            </p>
            <DigitalProductionVersion />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Version 4: Global Reach</h2>
            <p className="text-gray-600 mb-6">
              Illustrates worldwide voice connectivity with globe and network nodes
            </p>
            <GlobalReachVersion />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Version 5: Voice Journey Flow</h2>
            <p className="text-gray-600 mb-6">
              Visualizes the 3-step process as an animated journey from upload to delivery
            </p>
            <VoiceJourneyVersion />
          </div>
        </div>
      </div>
    </div>
  );
}