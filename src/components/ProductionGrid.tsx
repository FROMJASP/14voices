'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';
import { ShoppingCart, Play } from 'lucide-react';
import Link from 'next/link';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

interface ProductionType {
  name: string;
  price: number;
  description: string;
  videoUrl: string;
  color: string;
  accentColor: string;
}

const productionData: ProductionType[] = [
  {
    name: 'Videoproductie',
    price: 175,
    description:
      "Professionele voice-overs voor bedrijfsvideo's, explainers en interne communicatie.",
    videoUrl: '/videos/videoproductie.mp4',
    color: '#18f109',
    accentColor: '#14c007',
  },
  {
    name: 'E-learning',
    price: 200,
    description: "Heldere, educatieve voice-overs voor trainingen, cursussen en instructievideo's.",
    videoUrl: '/videos/e-learning.mp4',
    color: '#4b9eff',
    accentColor: '#3a8de8',
  },
  {
    name: 'Radiospots',
    price: 150,
    description: 'Pakkende radioreclames die je merk laten opvallen op radio en streaming.',
    videoUrl: '/videos/radiospot.mp4',
    color: '#ff6b6b',
    accentColor: '#e85d5d',
  },
  {
    name: 'TV Commercial',
    price: 200,
    description: 'Broadcast-kwaliteit voice-overs voor televisiereclames en landelijke campagnes.',
    videoUrl: '/videos/tv-commercial.mp4',
    color: '#a78bfa',
    accentColor: '#9775f5',
  },
  {
    name: 'Web Commercial',
    price: 175,
    description: 'Online video-advertenties voor social media, YouTube en display campagnes.',
    videoUrl: '/videos/web-commercial.mp4',
    color: '#f59e0b',
    accentColor: '#dc8a09',
  },
  {
    name: 'Voice Response',
    price: 150,
    description: "Professionele telefoonboodschappen voor keuzemenu's, voicemails en wachtrijen.",
    videoUrl: '/videos/voice-response.mp4',
    color: '#10b981',
    accentColor: '#0ea571',
  },
];

const productionSlugs = [
  'videoproductie',
  'e-learning',
  'radiospots',
  'tv-commercial',
  'web-commercial',
  'voice-response',
];

export function ProductionGrid() {
  return (
    <div className={`${plusJakarta.variable} ${instrumentSerif.variable} font-plus-jakarta`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productionData.map((production, index) => (
          <ProductCard
            key={production.name}
            production={production}
            index={index}
            slug={productionSlugs[index]}
          />
        ))}
      </div>
    </div>
  );
}

function ProductCard({
  production,
  index,
  slug,
}: {
  production: ProductionType;
  index: number;
  slug: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <Link href={`/order/${slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -8 }}
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative bg-white dark:bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
          {/* Video/Image Section */}
          <div className="relative aspect-video overflow-hidden bg-black">
            <video
              ref={videoRef}
              src={production.videoUrl}
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay on hover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: isHovered ? 1 : 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center"
              >
                <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
              </motion.div>
            </motion.div>

            {/* Price Badge */}
            <div
              className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold text-black"
              style={{ backgroundColor: production.color }}
            >
              vanaf €{production.price}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 font-instrument-serif">{production.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {production.description}
            </p>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                backgroundColor: production.color,
                color: 'black',
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              Configureer & Bestel
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
