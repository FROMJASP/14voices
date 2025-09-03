'use client';

import { SsgoiTransition } from '@ssgoi/react';
import { TransitionLink } from '@/components/common/navigation';
import { AnimatedSection } from '@/components/common/transitions';

export default function TestTransitionsPage() {
  return (
    <SsgoiTransition id="/test-transitions">
      <div className="container mx-auto px-4 py-8">
        <AnimatedSection animation="fade" delay={0}>
          <h1 className="text-4xl font-bold mb-8">Test View Transitions</h1>
        </AnimatedSection>

        <AnimatedSection animation="slide" delay={100}>
          <p className="mb-6 text-lg">
            This page demonstrates the beautiful view transitions implemented using SSGOI.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="scale" delay={200}>
          <div className="grid gap-4 mb-8">
            <TransitionLink
              href="/"
              transition="fade"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Home (Fade Transition)
            </TransitionLink>

            <TransitionLink
              href="/prijzen"
              transition="slide"
              className="inline-block px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Go to Pricing (Slide Transition)
            </TransitionLink>

            <TransitionLink
              href="/test-transitions"
              transition="scale"
              className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
            >
              Refresh Page (Scale Transition)
            </TransitionLink>
          </div>
        </AnimatedSection>

        <AnimatedSection
          animation="custom"
          delay={300}
          customAnimation={{
            from: {
              opacity: '0',
              transform: 'translateX(-50px) rotate(-5deg)',
            },
            to: {
              opacity: '1',
              transform: 'translateX(0) rotate(0deg)',
            },
          }}
        >
          <div className="p-6 bg-muted rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Custom Animation</h2>
            <p>This section uses a custom animation that combines translation and rotation.</p>
          </div>
        </AnimatedSection>
      </div>
    </SsgoiTransition>
  );
}
