export function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        // Check for next-themes storage first
        const nextThemesStored = localStorage.getItem('theme');
        const zustandStored = localStorage.getItem('theme-storage');
        
        let resolvedTheme = 'system';
        
        if (nextThemesStored) {
          resolvedTheme = nextThemesStored;
        } else if (zustandStored) {
          const parsed = JSON.parse(zustandStored);
          const state = parsed.state;
          if (state && state.theme) {
            resolvedTheme = state.theme;
          }
        }
        
        // Resolve system theme if needed
        const finalTheme = resolvedTheme === 'system' 
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : resolvedTheme;
        
        // Apply theme to document
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(finalTheme);
        document.documentElement.setAttribute('data-theme', finalTheme);
        document.documentElement.style.colorScheme = finalTheme;
      } catch (e) {
        // Default to light if anything goes wrong
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add('light');
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.style.colorScheme = 'light';
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: themeScript }} suppressHydrationWarning />;
}
