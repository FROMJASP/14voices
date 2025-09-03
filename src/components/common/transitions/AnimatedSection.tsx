'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade' | 'slide' | 'scale' | 'custom';
  delay?: number;
  duration?: number;
  customAnimation?: {
    from: React.CSSProperties;
    to: React.CSSProperties;
  };
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animation = 'fade',
  delay = 0,
  duration = 500,
  customAnimation,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    if (isAnimating) {
      // Apply initial state
      if (animation === 'fade') {
        element.style.opacity = '0';
      } else if (animation === 'slide') {
        element.style.transform = 'translateY(20px)';
        element.style.opacity = '0';
      } else if (animation === 'scale') {
        element.style.transform = 'scale(0.9)';
        element.style.opacity = '0';
      } else if (animation === 'custom' && customAnimation) {
        Object.assign(element.style, customAnimation.from);
      }

      // Animate to final state
      setTimeout(() => {
        element.style.transition = `all ${duration}ms ease-out`;

        if (animation === 'fade') {
          element.style.opacity = '1';
        } else if (animation === 'slide') {
          element.style.transform = 'translateY(0)';
          element.style.opacity = '1';
        } else if (animation === 'scale') {
          element.style.transform = 'scale(1)';
          element.style.opacity = '1';
        } else if (animation === 'custom' && customAnimation) {
          Object.assign(element.style, customAnimation.to);
        }
      }, delay);

      // Mark as not animating after animation completes
      setTimeout(
        () => {
          setIsAnimating(false);
        },
        delay + duration + 100
      );
    }
  }, [isAnimating, animation, delay, duration, customAnimation]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
