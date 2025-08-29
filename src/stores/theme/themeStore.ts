import { createStore } from '../lib/createStore';

interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  applyTheme: () => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const resolveTheme = (theme: 'light' | 'dark' | 'system'): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

export const useThemeStore = createStore<ThemeState>(
  'theme',
  (set, get) => ({
    theme: 'system',
    resolvedTheme: 'light',

    setTheme: (theme) => {
      set((state) => {
        state.theme = theme;
        state.resolvedTheme = resolveTheme(theme);
      });
      get().applyTheme();
    },

    toggleTheme: () => {
      const { theme, setTheme } = get();
      const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
      setTheme(newTheme);
    },

    applyTheme: () => {
      const { resolvedTheme } = get();
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(resolvedTheme);
        root.style.colorScheme = resolvedTheme;
      }
    },
  }),
  {
    persist: {
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.resolvedTheme = resolveTheme(state.theme);
          state.applyTheme();
        }
      },
    },
  }
);

// Initialize theme on client
if (typeof window !== 'undefined') {
  useThemeStore.subscribe((state) => state.applyTheme());

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    const state = useThemeStore.getState();
    if (state.theme === 'system') {
      state.setTheme('system');
    }
  });

  // Apply initial theme
  useThemeStore.getState().applyTheme();
}
