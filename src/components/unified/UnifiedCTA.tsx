import { Button, Section, Container, Heading, Text } from '@/components/shared';
import type { CTABlockData, CallToActionData } from '@/types/blocks';

interface UnifiedCTAProps {
  variant?: 'block' | 'action';
  blockData?: CTABlockData;
  actionData?: CallToActionData | null | undefined;
}

export function UnifiedCTA({ variant = 'block', blockData, actionData }: UnifiedCTAProps) {
  // Handle empty states
  if (variant === 'block' && !blockData) return null;
  if (variant === 'action' && !actionData) return null;

  // Map data based on variant
  const heading = variant === 'block' ? blockData?.heading : actionData?.headline;
  const text = variant === 'block' ? blockData?.text : actionData?.subheadline;
  const buttons = variant === 'block' ? blockData?.buttons : actionData?.buttons;
  const backgroundColor =
    variant === 'block' ? blockData?.backgroundColor : actionData?.backgroundColor;
  const style = actionData?.style;

  // Style classes for action variant
  const styleClasses = {
    centered: 'text-center',
    left: 'text-left',
    split: 'md:flex md:items-center md:justify-between',
  };

  const isDarkBg = backgroundColor === 'primary' || backgroundColor === 'dark';

  const bgClasses = {
    primary: 'bg-blue-600',
    dark: 'bg-gray-900',
    gray: 'bg-gray-100',
    white: 'bg-white',
  };

  return (
    <Section
      className={`
        ${variant === 'block' ? 'cta-block' : 'cta-section'}
        ${backgroundColor ? bgClasses[backgroundColor] : ''}
      `}
    >
      <Container>
        <div
          className={`
          ${style ? styleClasses[style as keyof typeof styleClasses] : 'text-center'}
        `}
        >
          <div className={style === 'split' ? 'md:flex-1' : ''}>
            {heading && (
              <Heading as="h2" className={`mb-4 ${isDarkBg ? 'text-white' : 'text-gray-900'}`}>
                {heading}
              </Heading>
            )}

            {text && (
              <Text className={`mb-8 text-lg ${isDarkBg ? 'text-gray-200' : 'text-gray-600'}`}>
                {text}
              </Text>
            )}
          </div>

          {buttons && buttons.length > 0 && (
            <div
              className={`
              flex flex-wrap gap-4
              ${style === 'centered' || !style ? 'justify-center' : ''}
              ${style === 'split' ? 'md:ml-8' : ''}
            `}
            >
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  href={button.link}
                  variant={button.style as 'primary' | 'secondary' | 'outline'}
                  className={variant === 'action' ? 'transition-all' : ''}
                >
                  {button.text}
                </Button>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
