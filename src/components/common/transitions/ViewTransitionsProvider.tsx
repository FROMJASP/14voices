'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import SSGOI to avoid SSR issues
const Ssgoi = dynamic(() => import('@ssgoi/react').then((mod) => mod.Ssgoi), {
  ssr: false,
  loading: () => null, // Don't show anything while loading
});

interface ViewTransitionsProviderProps {
  children: React.ReactNode;
}

export function ViewTransitionsProvider({ children }: ViewTransitionsProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Always render children immediately to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <Ssgoi config={{}}>
      {children}
    </Ssgoi>
  );
}
