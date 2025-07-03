import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  name?: string;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

export function Avatar({ name, src, size = 'md', className, alt }: AvatarProps) {
  const initials = React.useMemo(() => {
    if (!name) return '?';

    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }, [name]);

  if (src) {
    return (
      <div className={cn('relative overflow-hidden rounded-full', sizeClasses[size], className)}>
        <Image src={src} alt={alt || name || 'Avatar'} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-medium text-white',
        sizeClasses[size],
        className
      )}
    >
      <span className="select-none">{initials}</span>
    </div>
  );
}

interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  className?: string;
}

export function AvatarGroup({ children, max = 3, className }: AvatarGroupProps) {
  const childrenArray = React.Children.toArray(children);
  const displayedChildren = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {displayedChildren.map((child, index) => (
        <div key={index} className="relative" style={{ zIndex: max - index }}>
          {child}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
