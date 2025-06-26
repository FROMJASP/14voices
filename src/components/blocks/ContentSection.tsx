import Image from 'next/image'
import { RichText } from '@/components/RichText'
import type { ContentSectionData } from '@/types/blocks'

interface ContentSectionProps {
  data: ContentSectionData | null | undefined
}

export function ContentSection({ data }: ContentSectionProps) {
  if (!data) return null

  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-blue-50',
  }

  if (data.layout === 'twoColumn' && data.media && typeof data.media === 'object') {
    return (
      <section className={`content-section py-16 md:py-20 ${bgClasses[data.backgroundColor as keyof typeof bgClasses]}`}>
        <div className="container mx-auto px-4">
          <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${
            data.mediaPosition === 'left' ? '' : 'md:[&>*:first-child]:order-2'
          }`}>
            <div className="relative aspect-video md:aspect-square rounded-lg overflow-hidden">
              <Image
                src={data.media.url}
                alt={data.media.alt || ''}
                fill
                className="object-cover"
              />
            </div>
            <div className="prose prose-lg max-w-none">
              <RichText content={data.content} />
            </div>
          </div>
        </div>
      </section>
    )
  }

  const alignmentClasses = {
    centered: 'mx-auto text-center',
    left: 'mr-auto',
    right: 'ml-auto',
  }

  return (
    <section className={`content-section py-16 md:py-20 ${bgClasses[data.backgroundColor as keyof typeof bgClasses]}`}>
      <div className="container mx-auto px-4">
        <div className={`prose prose-lg max-w-4xl ${alignmentClasses[data.layout as keyof typeof alignmentClasses]}`}>
          <RichText content={data.content} />
        </div>
      </div>
    </section>
  )
}