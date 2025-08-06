import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as = 'h2', size, children, ...props }, ref) => {
    // Auto-size based on heading level if size not provided
    const defaultSizes = {
      h1: '4xl',
      h2: '3xl',
      h3: '2xl',
      h4: 'xl',
      h5: 'lg',
      h6: 'md',
    };

    const actualSize = size || defaultSizes[as];

    const sizeClasses = {
      xs: 'text-xs font-semibold',
      sm: 'text-sm font-semibold',
      md: 'text-base font-semibold',
      lg: 'text-lg font-semibold',
      xl: 'text-xl font-bold',
      '2xl': 'text-2xl font-bold',
      '3xl': 'text-3xl lg:text-4xl font-bold',
      '4xl': 'text-4xl lg:text-5xl xl:text-6xl font-bold',
    };

    const Element = as;

    return (
      <Element
        className={cn(
          'tracking-tight text-foreground',
          sizeClasses[actualSize as keyof typeof sizeClasses],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Element>
    );
  }
);
Heading.displayName = 'Heading';

export { Heading };
