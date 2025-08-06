'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bricolage_Grotesque, Instrument_Serif } from 'next/font/google';
import Link from 'next/link';

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
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
  slug: string;
}

interface ProductionGridSimpleProps {
  onProductionClick?: (slug: string) => void;
}

// Productions with correct descriptions and singular Radiospot
const productionData: ProductionType[] = [
  {
    name: 'Videoproductie',
    price: 175,
    description:
      "Videoproducties zijn video's voor intern gebruik of online plaatsing, zonder advertentiebudget. Bij inzet als betaalde advertentie kies je voor 'Web Commercial'.",
    videoUrl: '/videos/videoproductie.mp4',
    color: '#18f109',
    accentColor: '#14c007',
    slug: 'videoproductie',
  },
  {
    name: 'E-learning',
    price: 200,
    description:
      "E-learning video's worden gebruikt voor training, onboarding of instructie, bedoeld voor intern of educatief gebruik — niet als promotie of advertentie.",
    videoUrl: '/videos/e-learning.mp4',
    color: '#4b9eff',
    accentColor: '#3a8de8',
    slug: 'e-learning',
  },
  {
    name: 'Radiospot',
    price: 150,
    description:
      'Radiospots worden uitgezonden via radio of streamingdiensten met als doel een product, dienst of merk te promoten.',
    videoUrl: '/videos/radiospot.mp4',
    color: '#ff6b6b',
    accentColor: '#e85d5d',
    slug: 'radiospot',
  },
  {
    name: 'TV Commercial',
    price: 250,
    description:
      'Betaalde videospots voor televisie, bedoeld om een merk, product of dienst landelijk of regionaal te promoten.',
    videoUrl: '/videos/tv-commercial.mp4',
    color: '#a78bfa',
    accentColor: '#9775f5',
    slug: 'tv-commercial',
  },
  {
    name: 'Web Commercial',
    price: 400,
    description:
      'Web Commercials zijn online videoadvertenties die worden verspreid via internet, sociale media of streamingdiensten, met inzet van advertentiebudget.',
    videoUrl: '/videos/web-commercial.mp4',
    color: '#f59e0b',
    accentColor: '#dc8a09',
    slug: 'web-commercial',
  },
  {
    name: 'Voice Response',
    price: 150,
    description: "Voice Response wordt gebruikt voor keuzemenu's (IVR), voicemails en wachtrijen.",
    videoUrl: '/videos/voice-response.mp4',
    color: '#10b981',
    accentColor: '#0ea571',
    slug: 'voice-response',
  },
];

export function ProductionGridSimple({ onProductionClick }: ProductionGridSimpleProps) {
  return (
    <div className={`${bricolageGrotesque.variable} ${instrumentSerif.variable} font-bricolage`}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {productionData.map((production, index) => (
          <ProductCard
            key={`${production.name}-${index}`}
            production={production}
            index={index}
            slug={production.slug}
            onProductionClick={onProductionClick}
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
  onProductionClick,
}: {
  production: ProductionType;
  index: number;
  slug: string;
  onProductionClick?: (slug: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isReversing, setIsReversing] = React.useState(false);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start playing the video
    video.play().catch(() => {});

    // Function to play video in reverse
    const reversePlay = () => {
      if (!video || !isReversing) return;

      if (video.currentTime <= 0.1) {
        // Reached the beginning, play forward again
        video.currentTime = 0;
        setIsReversing(false);
        video.play();
      } else {
        // Step backwards
        video.currentTime = Math.max(0, video.currentTime - 0.033); // ~30fps
        animationRef.current = requestAnimationFrame(reversePlay);
      }
    };

    // When video ends, start reverse playback
    const handleEnded = () => {
      setIsReversing(true);
      video.pause();
      reversePlay();
    };

    video.addEventListener('ended', handleEnded);

    // Start reverse animation if needed
    if (isReversing) {
      reversePlay();
    }

    return () => {
      video.removeEventListener('ended', handleEnded);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isReversing]);

  const handleClick = (e: React.MouseEvent) => {
    if (onProductionClick) {
      e.preventDefault();
      onProductionClick(slug);
    }
  };

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group cursor-pointer h-full"
      onClick={onProductionClick ? handleClick : undefined}
    >
      <div className="relative h-full flex flex-col">
        {/* Video/Image Section */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <video
            ref={videoRef}
            src={production.videoUrl}
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Hover Overlay with Description */}
          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex items-center justify-center">
            <p className="text-white text-sm text-center">{production.description}</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="pt-3 pb-1">
          <h3 className="text-sm font-medium text-foreground mb-1">{production.name}</h3>
          <p className="text-sm text-muted-foreground">
            <span className="text-xs">Vanaf</span>
            <span className="text-sm font-semibold text-foreground ml-1">€{production.price}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );

  return onProductionClick ? content : <Link href={`/order/${slug}`}>{content}</Link>;
}
