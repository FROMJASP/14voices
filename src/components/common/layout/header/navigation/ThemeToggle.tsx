'use client';

import { useThemeStore } from '@/stores';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Check if browser supports View Transitions API
    if (!document.startViewTransition) {
      toggleTheme();
      return;
    }

    // Add transitioning class for performance optimizations
    document.body.classList.add('transitioning');

    // Get cursor position for dynamic animation origin
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;

    // Set CSS variables for animation origin
    document.documentElement.style.setProperty('--transition-origin-x', `${x}%`);
    document.documentElement.style.setProperty('--transition-origin-y', `${y}%`);

    // Use View Transitions API for smooth theme change
    const transition = document.startViewTransition(() => {
      toggleTheme();
    });

    // Clean up after transition
    transition.finished.finally(() => {
      document.body.classList.remove('transitioning');
      document.documentElement.style.removeProperty('--transition-origin-x');
      document.documentElement.style.removeProperty('--transition-origin-y');
    });
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-1.5 rounded-md text-foreground hover:bg-muted transition-all cursor-pointer flex items-center justify-center ${className}`}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}
