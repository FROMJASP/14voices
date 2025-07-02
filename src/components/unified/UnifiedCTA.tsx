import { Button, Section, Container, Heading, Text } from '@/components/shared'
import type { CTABlockData, CallToActionData } from '@/types/blocks'

interface UnifiedCTAProps {
  variant?: 'block' | 'action'
  blockData?: CTABlockData
  actionData?: CallToActionData | null | undefined
}

export function UnifiedCTA({ variant = 'block', blockData, actionData }: UnifiedCTAProps) {
  // Handle empty states
  if (variant === 'block' && !blockData) return null
  if (variant === 'action' && !actionData) return null

  // Map data based on variant
  const heading = variant === 'block' ? blockData?.heading : actionData?.headline
  const text = variant === 'block' ? blockData?.text : actionData?.subheadline
  const buttons = variant === 'block' ? blockData?.buttons : actionData?.buttons
  const backgroundColor = variant === 'block' ? blockData?.backgroundColor : actionData?.backgroundColor
  const style = actionData?.style

  // Style classes for action variant
  const styleClasses = {
    centered: 'text-center',
    left: 'text-left',
    split: 'md:flex md:items-center md:justify-between',
  }

  const isDarkBg = backgroundColor === 'primary' || backgroundColor === 'dark'

  return (
    <Section 
      backgroundColor={backgroundColor}
      className={`
        ${variant === 'block' ? 'cta-block' : 'cta-section'}
      `}
    >
      <Container maxWidth={style === 'split' ? 'lg' : 'md'}>
        <div className={`
          ${style ? styleClasses[style as keyof typeof styleClasses] : 'text-center'}
        `}>
          <div className={style === 'split' ? 'md:flex-1' : ''}>
            {heading && (
              <Heading 
                as="h2" 
                size="2"
                color={isDarkBg ? 'white' : 'default'}
                className="mb-4"
              >
                {heading}
              </Heading>
            )}
            
            {text && (
              <Text 
                size="large"
                color={isDarkBg ? 'white-muted' : 'default'}
                className="mb-8"
              >
                {text}
              </Text>
            )}
          </div>
          
          {buttons && buttons.length > 0 && (
            <div className={`
              flex flex-wrap gap-4
              ${style === 'centered' || !style ? 'justify-center' : ''}
              ${style === 'split' ? 'md:ml-8' : ''}
            `}>
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  text={button.text}
                  link={button.link}
                  style={button.style}
                  isDarkBg={isDarkBg}
                  className={variant === 'action' ? 'transition-all' : ''}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}