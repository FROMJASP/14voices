'use client';

import { TransitionLink as Link } from '@/components/common/navigation';
import { useRouter } from 'next/navigation';
import type { MenuItem } from './Navigation.types';

interface NavigationItemProps {
  item: MenuItem;
}

export function NavigationItem({ item }: NavigationItemProps) {
  const hasDropdown = item.hasDropdown;
  const router = useRouter();

  // Clean, minimal button style matching the mockup exactly
  const getButtonStyle = () => {
    return {
      color: 'var(--text-primary)',
      fontWeight: '400',
      fontSize: '16px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: 'transparent',
      border: 'none',
      padding: '8px 12px',
      cursor: 'pointer',
      position: 'relative',
      transition: 'color 0.2s ease',
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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Check if it's a hash link on the current page
    if (item.url.startsWith('/#')) {
      e.preventDefault();
      const elementId = item.url.substring(2);
      const element = document.getElementById(elementId);

      if (element) {
        // Calculate offset for fixed header
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      } else {
        // If element not found, navigate to homepage with hash
        router.push(item.url);
      }
    }
  };

  if (hasDropdown) {
    return (
      <div style={{ position: 'relative' }} className="group">
        <button style={getButtonStyle()}>
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
      target={item.openInNewTab ? '_blank' : undefined}
      rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
    >
      <ButtonContent />
    </Link>
  );
}
