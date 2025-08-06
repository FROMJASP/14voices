'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string;
}

export function Avatar({ src, alt = '', size = 'md', className, fallback }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const fallbackText = fallback || alt.charAt(0).toUpperCase() || '?';

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full bg-muted overflow-hidden',
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        <span className="text-sm font-medium text-muted-foreground">{fallbackText}</span>
      )}
    </div>
  );
}
