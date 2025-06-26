import Link from 'next/link'
import type { CTABlockData } from '@/types/blocks'

interface CTABlockProps {
  block: CTABlockData
}

export function CTABlock({ block }: CTABlockProps) {
  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-gray-100',
    primary: 'bg-blue-600',
    dark: 'bg-gray-900',
  }

  const textClasses = {
    white: 'text-gray-900',
    gray: 'text-gray-900',
    primary: 'text-white',
    dark: 'text-white',
  }

  return (
    <section className={`cta-block py-16 md:py-20 ${bgClasses[block.backgroundColor as keyof typeof bgClasses]}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {block.heading && (
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textClasses[block.backgroundColor as keyof typeof textClasses]}`}>
              {block.heading}
            </h2>
          )}
          
          {block.text && (
            <p className={`text-lg mb-8 ${
              block.backgroundColor === 'primary' || block.backgroundColor === 'dark' 
                ? 'text-white/90' 
                : 'text-gray-600'
            }`}>
              {block.text}
            </p>
          )}
          
          {block.buttons && block.buttons.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center">
              {block.buttons.map((button, index) => (
                <Link
                  key={index}
                  href={button.link}
                  className={`inline-block px-8 py-3 rounded-lg font-semibold transition-colors ${
                    button.style === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : button.style === 'secondary'
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'border-2 border-current hover:bg-white hover:text-gray-900'
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