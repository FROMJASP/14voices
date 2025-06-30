'use client'

import { motion } from 'framer-motion'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { BlurFade } from '@/components/magicui/blur-fade'
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated background gradients */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob dark:bg-purple-600 dark:opacity-30"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 dark:bg-yellow-600 dark:opacity-30"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 dark:bg-pink-600 dark:opacity-30"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <BlurFade delay={0.25} inView>
          <AnimatedGradientText className="inline-flex items-center justify-center px-6 py-2 mb-6">
            <span className="text-sm font-medium">
              🎙️ De stem die uw boodschap versterkt
            </span>
          </AnimatedGradientText>
        </BlurFade>

        <BlurFade delay={0.35} inView>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
              Professionele Voice-overs
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              voor elk project
            </span>
          </h1>
        </BlurFade>

        <BlurFade delay={0.45} inView>
          <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto">
            Van commercials tot bedrijfsfilms, wij hebben de perfecte stem voor uw productie
          </p>
        </BlurFade>

        <BlurFade delay={0.55} inView>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <ShimmerButton 
              className="shadow-2xl"
              background="linear-gradient(110deg,#9333ea,45%,#ec4899,55%,#9333ea)"
              borderRadius="0.625rem"
            >
              <span className="relative z-10 text-white font-semibold text-lg px-8 py-3 whitespace-nowrap">
                Ontdek onze stemmen
              </span>
            </ShimmerButton>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm font-semibold text-lg text-slate-900 dark:text-white hover:bg-white dark:hover:bg-slate-900 transition-all duration-200 shadow-lg"
            >
              Contact opnemen
            </motion.button>
          </div>
        </BlurFade>

        {/* Floating elements */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="absolute -top-10 -left-10 text-6xl opacity-20"
        >
          🎙️
        </motion.div>
        
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="absolute -bottom-10 -right-10 text-6xl opacity-20"
        >
          🎧
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-slate-400 dark:border-slate-600 flex justify-center">
          <div className="w-1 h-3 bg-slate-400 dark:bg-slate-600 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  )
}