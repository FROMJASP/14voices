'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import SSGOI to avoid SSR issues
const Ssgoi = dynamic(() => import('@ssgoi/react').then((mod) => mod.Ssgoi), {
  ssr: false,
  loading: () => <div style={{ position: 'relative', minHeight: '100vh' }}>{null}</div>,
});

interface ViewTransitionsProviderProps {
  children: React.ReactNode;
}

export function ViewTransitionsProvider({ children }: ViewTransitionsProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ position: 'relative', minHeight: '100vh' }}>{children}</div>;
  }

  return (
    <Ssgoi config={{}}>
      <div style={{ position: 'relative', minHeight: '100vh' }}>{children}</div>
    </Ssgoi>
  );
}
