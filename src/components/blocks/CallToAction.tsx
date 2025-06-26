import Link from 'next/link'
import type { CallToActionData } from '@/types/blocks'

interface CallToActionProps {
  data: CallToActionData | null | undefined
}

export function CallToAction({ data }: CallToActionProps) {
  if (!data) return null

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

  const styleClasses = {
    centered: 'text-center',
    left: 'text-left',
    split: 'md:flex md:items-center md:justify-between',
  }

  return (
    <section className={`cta-section py-16 md:py-20 ${bgClasses[data.backgroundColor as keyof typeof bgClasses]}`}>
      <div className="container mx-auto px-4">
        <div className={`max-w-4xl mx-auto ${styleClasses[data.style as keyof typeof styleClasses]}`}>
          <div className={data.style === 'split' ? 'md:flex-1' : ''}>
            {data.headline && (
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textClasses[data.backgroundColor as keyof typeof textClasses]}`}>
                {data.headline}
              </h2>
            )}
            
            {data.subheadline && (
              <p className={`text-lg mb-8 ${
                data.backgroundColor === 'primary' || data.backgroundColor === 'dark' 
                  ? 'text-white/90' 
                  : 'text-gray-600'
              }`}>
                {data.subheadline}
              </p>
            )}
          </div>
          
          {data.buttons && data.buttons.length > 0 && (
            <div className={`flex flex-wrap gap-4 ${
              data.style === 'centered' ? 'justify-center' : 
              data.style === 'split' ? 'md:ml-8' : ''
            }`}>
              {data.buttons.map((button, index) => {
                const isPrimaryBg = data.backgroundColor === 'primary' || data.backgroundColor === 'dark'
                
                return (
                  <Link
                    key={index}
                    href={button.link}
                    className={`inline-block px-8 py-3 rounded-lg font-semibold transition-all ${
                      button.style === 'primary'
                        ? isPrimaryBg 
                          ? 'bg-white text-blue-600 hover:bg-gray-100'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                        : button.style === 'secondary'
                        ? isPrimaryBg
                          ? 'bg-blue-700 text-white hover:bg-blue-800'
                          : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                        : isPrimaryBg
                        ? 'border-2 border-white text-white hover:bg-white hover:text-blue-600'
                        : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {button.text}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}