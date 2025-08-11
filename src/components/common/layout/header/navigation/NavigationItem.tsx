'use client';

import Link from 'next/link';
import type { MenuItem } from './Navigation.types';

interface NavigationItemProps {
  item: MenuItem;
}

export function NavigationItem({ item }: NavigationItemProps) {
  const hasDropdown = item.hasDropdown;

  // Clean, minimal button style matching the mockup exactly
  const getButtonStyle = () => {
    return {
      color: 'var(--text-primary)',
      fontWeight: '400',
      fontSize: '16px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: 'transparent !important',
      border: 'none !important',
      padding: '10px 18px',
      cursor: 'pointer',
      position: 'relative',
      transition: 'opacity 0.2s ease !important',
      transform: 'none !important',
      textDecoration: 'none',
    } as React.CSSProperties;
  };

  const ButtonContent = () => (
    <>
      {item.label}
      {hasDropdown && (
        <svg
          style={{
            width: '14px',
            height: '14px',
            opacity: '0.6',
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      )}
    </>
  );

  if (hasDropdown) {
    return (
      <div style={{ position: 'relative' }} className="group">
        <button
          style={getButtonStyle()}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.7';
            e.currentTarget.style.background = 'transparent !important';
            e.currentTarget.style.border = 'none !important';
            e.currentTarget.style.transform = 'none !important';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.background = 'transparent !important';
            e.currentTarget.style.border = 'none !important';
            e.currentTarget.style.transform = 'none !important';
          }}
        >
          <ButtonContent />
        </button>

        {/* Dropdown Menu - Empty for now as per mockup */}
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[200px] rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[1000] p-1"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div className="py-1">
            <div className="px-4 py-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Dropdown items will be configured later
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.url}
      style={getButtonStyle()}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.7';
        e.currentTarget.style.background = 'transparent !important';
        e.currentTarget.style.border = 'none !important';
        e.currentTarget.style.transform = 'none !important';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.background = 'transparent !important';
        e.currentTarget.style.border = 'none !important';
        e.currentTarget.style.transform = 'none !important';
      }}
      target={item.openInNewTab ? '_blank' : undefined}
      rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
    >
      <ButtonContent />
    </Link>
  );
}
