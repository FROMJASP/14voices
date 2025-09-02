'use client';

interface StoreHydrationProps {
  children: React.ReactNode;
}

export function StoreHydration({ children }: StoreHydrationProps) {
  // Theme is now handled by next-themes provider
  return <>{children}</>;
}
