import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'muted' | 'subtle';
}

const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size = 'md', variant = 'default', ...props }, ref) => {
    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    };

    const variantClasses = {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      subtle: 'text-gray-600',
    };

    return (
      <p
        className={cn('leading-relaxed', sizeClasses[size], variantClasses[variant], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Text.displayName = 'Text';

export { Text };
