import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Section = forwardRef<HTMLElement, SectionProps>(({ className, ...props }, ref) => {
  return <section className={cn('py-16 lg:py-24', className)} ref={ref} {...props} />;
});
Section.displayName = 'Section';

export { Section };
