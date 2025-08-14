'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image, { ImageProps, StaticImageData } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError' | 'src'> {
  src: string | StaticImageData;
  // Custom props for optimization
  progressive?: boolean;
  blurhash?: string;
  thumbnail?: string;
  errorFallback?: React.ReactNode;
  loadingClassName?: string;
  errorClassName?: string;
  onLoadComplete?: () => void;
  onErrorOccurred?: () => void;
  // Performance options
  eagerLoading?: boolean;
  qualityThreshold?: number;
  webpSupport?: boolean;
}

interface ImageState {
  isLoading: boolean;
  hasError: boolean;
  isVisible: boolean;
  loadStartTime: number | null;
}

// Progressive image loading with multiple fallbacks
export function OptimizedImage({
  src,
  alt,
  className,
  progressive = true,
  blurhash,
  thumbnail,
  errorFallback,
  loadingClassName,
  errorClassName,
  onLoadComplete,
  onErrorOccurred,
  eagerLoading = false,
  qualityThreshold = 75,
  webpSupport = true,
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [state, setState] = useState<ImageState>({
    isLoading: true,
    hasError: false,
    isVisible: false,
    loadStartTime: null,
  });
  
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (eagerLoading || priority) {
      setState(prev => ({ ...prev, isVisible: true }));
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setState(prev => ({ 
            ...prev, 
            isVisible: true,
            loadStartTime: performance.now()
          }));
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters viewport
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [eagerLoading, priority]);

  // Handle successful image load
  const handleLoad = () => {
    setState(prev => ({ ...prev, isLoading: false }));
    
    // Performance monitoring
    if (state.loadStartTime) {
      const loadTime = performance.now() - state.loadStartTime;
      if (process.env.NODE_ENV === 'development' && loadTime > 2000) {
        console.warn(`Slow image load: ${src} took ${loadTime.toFixed(2)}ms`);
      }
    }
    
    onLoadComplete?.();
  };

  // Handle image load error
  const handleError = () => {
    setState(prev => ({ ...prev, hasError: true, isLoading: false }));
    onErrorOccurred?.();
  };

  // Generate optimized image URL with format detection
  const getOptimizedSrc = (originalSrc: string | StaticImageData): string | StaticImageData => {
    if (typeof originalSrc !== 'string') {
      return originalSrc;
    }
    
    // If it's already a Vercel Blob URL or external URL, return as-is
    if (originalSrc.includes('vercel-storage.com') || originalSrc.startsWith('http')) {
      return originalSrc;
    }
    
    // For relative URLs, they'll be handled by Next.js Image optimization
    return originalSrc;
  };

  // Render loading placeholder
  const renderLoadingPlaceholder = () => {
    if (blurhash) {
      return (
        <div className="absolute inset-0 bg-muted">
          <canvas
            className="w-full h-full object-cover opacity-50"
            // Blurhash implementation would go here
          />
        </div>
      );
    }
    
    if (thumbnail) {
      return (
        <Image
          src={thumbnail}
          alt=""
          fill
          className="object-cover filter blur-sm scale-105 opacity-50"
          quality={20}
          priority={priority}
        />
      );
    }
    
    return (
      <div className={cn(
        "absolute inset-0 bg-muted animate-pulse",
        loadingClassName
      )} />
    );
  };

  // Render error fallback
  const renderErrorFallback = () => {
    if (errorFallback) {
      return errorFallback;
    }
    
    return (
      <div className={cn(
        "absolute inset-0 bg-muted flex items-center justify-center",
        errorClassName
      )}>
        <div className="text-muted-foreground text-sm">
          <svg 
            className="w-8 h-8 mx-auto mb-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p>Afbeelding niet beschikbaar</p>
        </div>
      </div>
    );
  };

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden", className)}>
      {/* Loading placeholder */}
      {state.isLoading && !state.hasError && renderLoadingPlaceholder()}
      
      {/* Error fallback */}
      {state.hasError && renderErrorFallback()}
      
      {/* Main image - only render when visible */}
      {state.isVisible && !state.hasError && (
        <Image
          src={getOptimizedSrc(src)}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          quality={qualityThreshold}
          priority={priority}
          className={cn(
            "transition-opacity duration-300",
            state.isLoading ? "opacity-0" : "opacity-100"
          )}
          {...props}
        />
      )}
    </div>
  );
}

// Specialized components for different use cases
export function VoiceoverProfileImage({
  src,
  name,
  className,
  size = 'medium',
  ...props
}: {
  src?: string;
  name: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
} & Partial<OptimizedImageProps>) {

  const sizesMap = {
    small: '64px',
    medium: '128px',
    large: '192px'
  };

  const firstName = name.split(' ')[0];

  return (
    <OptimizedImage
      src={src || '/default-avatar.png'}
      alt={firstName}
      fill
      className={cn("object-cover", className)}
      sizes={sizesMap[size]}
      qualityThreshold={85}
      errorFallback={
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
          <span className="text-primary-foreground text-xl font-semibold">
            {firstName.charAt(0)}
          </span>
        </div>
      }
      {...props}
    />
  );
}

// Hero image component with progressive enhancement
export function HeroImage({
  src,
  alt,
  className,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
} & Partial<OptimizedImageProps>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={cn("object-cover", className)}
      priority={true}
      eagerLoading={true}
      qualityThreshold={90}
      sizes="100vw"
      webpSupport={true}
      progressive={true}
      {...props}
    />
  );
}

// Product/demo image with lazy loading
export function DemoImage({
  src,
  alt,
  className,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
} & Partial<OptimizedImageProps>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={cn("object-cover", className)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      qualityThreshold={80}
      progressive={true}
      {...props}
    />
  );
}