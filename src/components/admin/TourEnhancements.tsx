'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = '#3b82f6',
  colorTo = '#10b981',
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          '--size': size,
          '--duration': duration,
          '--anchor': anchor,
          '--border-width': borderWidth,
          '--color-from': colorFrom,
          '--color-to': colorTo,
          '--delay': `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        'absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]',
        className
      )}
    >
      <div
        className="absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]"
        style={{
          background: `
            padding-box linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
            border-box conic-gradient(
              from calc(var(--anchor) * 1deg),
              transparent,
              var(--color-from) calc(var(--anchor) * 0.1deg),
              var(--color-to) calc(var(--anchor) * 0.15deg),
              transparent calc(var(--anchor) * 0.25deg)
            )
          `,
          animation: `border-beam-spin var(--duration)s infinite linear var(--delay)`,
        }}
      />
    </div>
  );
}

// Enhanced tour element wrapper that adds visual effects
export function TourElementWrapper({
  element,
  children,
}: {
  element: HTMLElement | null;
  children?: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!element || !wrapperRef.current) return;

    // Position the wrapper to match the element
    const updatePosition = () => {
      const rect = element.getBoundingClientRect();
      if (wrapperRef.current) {
        wrapperRef.current.style.position = 'fixed';
        wrapperRef.current.style.top = `${rect.top}px`;
        wrapperRef.current.style.left = `${rect.left}px`;
        wrapperRef.current.style.width = `${rect.width}px`;
        wrapperRef.current.style.height = `${rect.height}px`;
        wrapperRef.current.style.zIndex = '9999';
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [element]);

  if (!element) return null;

  return (
    <div ref={wrapperRef} className="pointer-events-none">
      <BorderBeam size={300} duration={20} colorFrom="#3b82f6" colorTo="#8b5cf6" />
      {children}
    </div>
  );
}

// Add CSS animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes border-beam-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;
  document.head.appendChild(style);
}

// Pointer component for showing click targets
interface PointerProps {
  x: number;
  y: number;
  label?: string;
  animate?: boolean;
}

export function TourPointer({ x, y, label, animate = true }: PointerProps) {
  return (
    <div className="fixed pointer-events-none z-[10001]" style={{ left: x, top: y }}>
      <div className={cn('relative', animate && 'animate-bounce')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
          <path
            d="M12 2L4 7V20L12 24L20 20V7L12 2Z"
            fill="#3b82f6"
            stroke="#2563eb"
            strokeWidth="2"
          />
          <path d="M12 2L12 24" stroke="#60a5fa" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
        {label && (
          <div className="absolute left-8 top-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}

// Animated beam component for connecting elements
interface AnimatedBeamProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  duration?: number;
  delay?: number;
  strokeWidth?: number;
  strokeColor?: string;
}

export function AnimatedBeam({
  fromX,
  fromY,
  toX,
  toY,
  duration = 2,
  delay = 0,
  strokeWidth = 2,
  strokeColor = '#3b82f6',
}: AnimatedBeamProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();

    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    path.style.animation = `beam-draw ${duration}s ease-in-out ${delay}s forwards`;
  }, [duration, delay]);

  // Calculate control points for a nice curve
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  const controlX = midX;
  const controlY = midY - 50; // Curve upward

  const d = `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;

  return (
    <svg
      className="fixed inset-0 pointer-events-none z-[10000]"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0" />
          <stop offset="50%" stopColor={strokeColor} stopOpacity="1" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="url(#beam-gradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <style jsx>{`
        @keyframes beam-draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </svg>
  );
}

// Progress indicator with animation
export function TourProgress({ current, total }: { current: number; total: number }) {
  const percentage = (current / total) * 100;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[10002]">
      <div className="bg-white rounded-full shadow-lg px-4 py-2 flex items-center gap-3">
        <div className="relative w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700">
          {current} / {total}
        </span>
      </div>
    </div>
  );
}
