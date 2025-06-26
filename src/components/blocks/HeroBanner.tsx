import Image from 'next/image'
import Link from 'next/link'
import type { HeroBannerData } from '@/types/blocks'

interface HeroBannerProps {
  data: HeroBannerData | null | undefined
}

export function HeroBanner({ data }: HeroBannerProps) {
  if (!data) return null

  const heightClasses = {
    small: 'h-[50vh]',
    medium: 'h-[70vh]',
    large: 'h-[90vh]',
    full: 'h-screen',
  }

  return (
    <section className={`hero-banner relative overflow-hidden ${heightClasses[data.height as keyof typeof heightClasses] || 'h-[70vh]'}`}>
      {/* Background */}
      {data.backgroundType === 'color' && (
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: data.backgroundColor || '#f3f4f6' }}
        />
      )}
      
      {data.backgroundType === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
      )}
      
      {data.backgroundType === 'image' && data.backgroundImage && typeof data.backgroundImage === 'object' && (
        <>
          <Image
            src={data.backgroundImage.url}
            alt={data.backgroundImage.alt || ''}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}
      
      {data.backgroundType === 'video' && data.backgroundVideo && (
        <>
          <iframe
            src={data.backgroundVideo}
            className="absolute inset-0 w-full h-full object-cover"
            frameBorder="0"
            allow="autoplay; fullscreen"
          />
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          {data.headline && (
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 ${
              data.backgroundType === 'color' ? 'text-gray-900' : 'text-white'
            }`}>
              {data.headline}
            </h1>
          )}
          
          {data.subheadline && (
            <p className={`text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto ${
              data.backgroundType === 'color' ? 'text-gray-600' : 'text-white/90'
            }`}>
              {data.subheadline}
            </p>
          )}
          
          {data.buttons && data.buttons.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center">
              {data.buttons.map((button, index) => (
                <Link
                  key={index}
                  href={button.link}
                  className={`inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 ${
                    button.style === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                      : button.style === 'secondary'
                      ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg'
                      : 'border-2 border-white text-white hover:bg-white hover:text-gray-900'
                  }`}
                >
                  {button.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}