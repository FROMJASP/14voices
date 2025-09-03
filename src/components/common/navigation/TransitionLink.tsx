'use client';

import Link from 'next/link';
import React from 'react';

interface TransitionLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  transition?: 'fade' | 'slide' | 'scale';
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  children,
  transition: _transitionType = 'fade', // Prefixed with _ since it's not used yet
  ...props
}) => {
  // For now, we'll use Next.js Link directly
  // SSGOI will handle transitions automatically when navigating between pages
  return <Link {...props}>{children}</Link>;
};
