import Image from 'next/image'
import { Button, Container, Heading, Text } from '@/components/shared'
import type { Page } from '@/payload-types'
import type { HeroBannerData } from '@/types/blocks'

// Types are used internally, removing unused type warnings

interface UnifiedHeroProps {
  variant?: 'page' | 'banner'
  pageHero?: NonNullable<Page['hero']>
  bannerData?: HeroBannerData | null | undefined
}

export function UnifiedHero({ variant = 'page', pageHero, bannerData }: UnifiedHeroProps) {
  // Handle empty states
  if (variant === 'page' && (!pageHero || pageHero.type === 'none')) return null
  if (variant === 'banner' && !bannerData) return null

  // Map data based on variant
  const type = variant === 'page' ? pageHero?.type : bannerData?.backgroundType
  const title = variant === 'page' ? pageHero?.title : bannerData?.headline
  const subtitle = variant === 'page' ? pageHero?.subtitle : bannerData?.subheadline
  const image = variant === 'page' ? pageHero?.image : bannerData?.backgroundImage
  const videoUrl = variant === 'page' ? pageHero?.videoUrl : bannerData?.backgroundVideo
  const backgroundColor = bannerData?.backgroundColor
  
  // Map buttons based on variant
  const buttons = variant === 'page' 
    ? (pageHero?.cta ? [{ 
        text: pageHero.cta.text || '', 
        link: pageHero.cta.link || '', 
        style: pageHero.cta.style 
      }] : [])
    : (bannerData?.buttons || [])

  // Height classes for banner variant
  const heightClasses = {
    small: 'h-[50vh]',
    medium: 'h-[70vh]',
    large: 'h-[90vh]',
    full: 'h-screen',
  }

  // Background style mapping
  const bgClasses = {
    simple: 'bg-gray-100',
    color: '',
    gradient: 'bg-gradient-to-r from-blue-600 to-purple-600',
    image: 'relative',
    video: 'relative',
  }

  const isMediaBg = type === 'image' || type === 'video'
  const isDarkBg = type !== 'simple' && type !== 'color'

  return (
    <section 
      className={`
        ${variant === 'page' ? 'hero' : 'hero-banner'} 
        ${variant === 'page' ? `hero--${type}` : ''}
        ${bgClasses[type as keyof typeof bgClasses] || ''} 
        ${variant === 'page' ? 'py-20 md:py-32' : ''}
        ${variant === 'banner' ? `relative overflow-hidden ${heightClasses[bannerData?.height as keyof typeof heightClasses] || 'h-[70vh]'}` : ''}
      `}
      style={type === 'color' && backgroundColor ? { backgroundColor } : undefined}
    >
      {/* Image Background */}
      {type === 'image' && image && typeof image === 'object' && (
        <div className="absolute inset-0 z-0">
          <Image
            src={image.url || ''}
            alt={image.alt || ''}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      
      {/* Video Background */}
      {type === 'video' && videoUrl && (
        <div className="absolute inset-0 z-0">
          <iframe
            src={videoUrl}
            className={`absolute inset-0 w-full h-full ${variant === 'banner' ? 'object-cover' : ''}`}
            frameBorder="0"
            allow="autoplay; fullscreen"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Content */}
      <div className={`
        ${isMediaBg ? 'relative z-10' : ''} 
        ${variant === 'banner' ? 'h-full flex items-center justify-center' : ''}
      `}>
        <Container className="text-center">
          {title && (
            <Heading 
              as="h1" 
              className={`mb-4 md:mb-6 ${isDarkBg ? 'text-white' : 'text-gray-900'}`}
            >
              {title}
            </Heading>
          )}
          
          {subtitle && (
            <Text 
              className={`mb-8 text-lg ${variant === 'banner' ? 'max-w-3xl mx-auto' : ''} ${isDarkBg ? 'text-gray-200' : 'text-gray-600'}`}
            >
              {subtitle}
            </Text>
          )}
          
          {buttons.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  href={button.link}
                  variant={button.style as 'primary' | 'secondary' | 'outline' | undefined}
                  size={variant === 'banner' ? 'lg' : 'md'}
                  className={variant === 'banner' ? 'transform hover:scale-105 shadow-lg' : ''}
                >
                  {button.text}
                </Button>
              ))}
            </div>
          )}
        </Container>
      </div>
    </section>
  )
}