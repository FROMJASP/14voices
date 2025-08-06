'use client';

import { useTheme } from 'next-themes';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    // Check if browser supports View Transitions API
    if (!document.startViewTransition) {
      setTheme(newTheme);
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
      setTheme(newTheme);
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
      className={`p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-white/90 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-muted transition-all cursor-pointer ${className}`}
      aria-label="Toggle theme"
    >
      <span className="text-base">{theme === 'dark' ? '☀️' : '🌙'}</span>
    </button>
  );
}
