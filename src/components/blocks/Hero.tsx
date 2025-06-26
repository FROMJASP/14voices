import Image from 'next/image'
import Link from 'next/link'
import type { Page } from '@/payload-types'

interface HeroProps {
  hero: NonNullable<Page['hero']>
}

export function Hero({ hero }: HeroProps) {
  if (!hero || hero.type === 'none') return null

  const bgClasses = {
    simple: 'bg-gray-100',
    gradient: 'bg-gradient-to-r from-blue-600 to-purple-600',
    image: 'relative',
    video: 'relative',
  }

  return (
    <section className={`hero hero--${hero.type} ${bgClasses[hero.type]} py-20 md:py-32`}>
      {hero.type === 'image' && hero.image && typeof hero.image === 'object' && (
        <div className="absolute inset-0 z-0">
          <Image
            src={hero.image.url || ''}
            alt={hero.image.alt || ''}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}
      
      {hero.type === 'video' && hero.videoUrl && (
        <div className="absolute inset-0 z-0">
          <iframe
            src={hero.videoUrl}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {hero.title && (
            <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${
              hero.type === 'simple' ? 'text-gray-900' : 'text-white'
            }`}>
              {hero.title}
            </h1>
          )}
          
          {hero.subtitle && (
            <p className={`text-lg md:text-xl mb-8 ${
              hero.type === 'simple' ? 'text-gray-600' : 'text-white/90'
            }`}>
              {hero.subtitle}
            </p>
          )}
          
          {hero.cta?.text && hero.cta.link && (
            <Link
              href={hero.cta.link}
              className={`inline-block px-8 py-3 rounded-lg font-semibold transition-colors ${
                hero.cta.style === 'primary'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : hero.cta.style === 'secondary'
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : 'border-2 border-white text-white hover:bg-white hover:text-gray-900'
              }`}
            >
              {hero.cta.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}