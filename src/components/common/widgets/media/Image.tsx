/**
 * Optimized Image component with progressive loading, blur placeholder,
 * and responsive sizing for maximum performance
 */

'use client';

import React, { useState, useCallback, memo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
}

// Default blur placeholder
const DEFAULT_BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli5GzhvUkpiBdNTjKEsy5Z2o8N3DtMvhLi7jtRwVU9qKCDEAY+iAL8eAFzGZS1YbC0V2x8O2s0EayvqD3nP3SqNDDJWiBJQJnA==';

export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
  fill = false,
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  fallbackSrc,
  loading = 'lazy',
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate blur data URL if not provided and placeholder is blur
  const finalBlurDataURL = React.useMemo(() => {
    if (placeholder !== 'blur') return undefined;
    if (blurDataURL) return blurDataURL;

    // Use default blur data URL
    return DEFAULT_BLUR_DATA_URL;
  }, [blurDataURL, placeholder]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  }, [onError]);

  // If there's an error and a fallback, use the fallback
  const imageSrc = hasError && fallbackSrc ? fallbackSrc : src;

  // Base props for Next.js Image component
  const imageProps = {
    src: imageSrc,
    alt,
    className: cn(
      'transition-opacity duration-300',
      isLoading && 'opacity-0',
      !isLoading && 'opacity-100',
      className
    ),
    quality,
    priority,
    placeholder,
    blurDataURL: finalBlurDataURL,
    onLoad: handleLoad,
    onError: handleError,
    loading: priority ? 'eager' : loading,
    ...(sizes && { sizes }),
  };

  // Handle fill vs width/height
  if (fill) {
    return (
      <div className="relative overflow-hidden">
        <Image {...imageProps} alt={alt} fill style={{ objectFit: 'cover' }} />
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <Image {...imageProps} alt={alt} width={width} height={height} />
      {isLoading && width && height && (
        <div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
          style={{ width, height }}
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Specialized component for avatar images
export const OptimizedAvatar = memo(function OptimizedAvatar({
  src,
  alt,
  size = 64,
  className,
  fallbackSrc = '/placeholder-avatar.png',
}: {
  src?: string | null;
  alt: string;
  size?: number;
  className?: string;
  fallbackSrc?: string;
}) {
  return (
    <OptimizedImage
      src={src || fallbackSrc}
      alt={alt}
      width={size}
      height={size}
      className={cn('rounded-full object-cover', className)}
      sizes={`${size}px`}
      quality={90}
      placeholder="blur"
      fallbackSrc={fallbackSrc}
    />
  );
});

OptimizedAvatar.displayName = 'OptimizedAvatar';

// Specialized component for hero/banner images
export const OptimizedHeroImage = memo(function OptimizedHeroImage({
  src,
  alt,
  className,
  priority = true,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={className}
      priority={priority}
      sizes="100vw"
      quality={75}
      placeholder="blur"
    />
  );
});

OptimizedHeroImage.displayName = 'OptimizedHeroImage';
