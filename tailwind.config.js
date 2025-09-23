/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/collections/**/*.{js,ts,jsx,tsx,mdx}',
    './src/fields/**/*.{js,ts,jsx,tsx,mdx}',
    './src/providers/**/*.{js,ts,jsx,tsx,mdx}',
    './src/domains/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        title: 'var(--title)',
        text: 'var(--text)',
        surface: 'var(--surface)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'brand-bg': '#fcf9f5',
        'brand-bg-dark': '#0a0a0a',
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          foreground: 'var(--primary-foreground)',
        },
        'accent-purple': 'var(--accent-purple)',
        'accent-blue': 'var(--accent-blue)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
        chart: {
          1: 'var(--chart-1)',
          2: 'var(--chart-2)',
          3: 'var(--chart-3)',
          4: 'var(--chart-4)',
          5: 'var(--chart-5)',
        },
      },
      fontFamily: {
        sans: ['var(--font-bricolage)', 'sans-serif'],
        serif: ['var(--font-instrument)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
        bricolage: ['var(--font-bricolage)', 'sans-serif'],
        instrument: ['var(--font-instrument)', 'serif'],
      },
      spacing: {
        'nav-height': 'var(--nav-height)',
        'top-bar-height': 'var(--top-bar-height)',
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
      boxShadow: {
        '2xs': 'var(--shadow-2xs)',
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
      },
      animation: {
        'shimmer-slide': 'shimmer-slide var(--speed) ease-in-out infinite alternate',
        'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
        gradient: 'gradient 8s ease infinite',
        blob: 'blob 7s infinite',
        ripple: 'ripple 4s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-in-from-top-2': 'slide-in-from-top-2 0.2s ease-out',
        'skeleton-pulse': 'skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // View transitions
        'reveal-light': 'reveal-light 0.6s var(--ease-out-expo)',
        'reveal-dark': 'reveal-dark 0.6s var(--ease-out-expo)',
        'fade-out': 'fade-out 0.4s var(--ease-in-out-expo) forwards',
        'reveal-wave': 'reveal-wave 0.6s ease-out',
        'reveal-diagonal': 'reveal-diagonal 0.6s ease-out',
      },
      keyframes: {
        'shimmer-slide': {
          to: {
            transform: 'translate(calc(100cqw - 100%), 0)',
          },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'spin-around': {
          '0%': { transform: 'translateZ(0) rotate(0)' },
          '15%, 35%': { transform: 'translateZ(0) rotate(90deg)' },
          '65%, 85%': { transform: 'translateZ(0) rotate(270deg)' },
          '100%': { transform: 'translateZ(0) rotate(360deg)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        ripple: {
          '0%, 100%': {
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 'var(--opacity)',
          },
          '50%': {
            transform: 'translate(-50%, -50%) scale(1.5)',
            opacity: '0',
          },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in-from-top-2': {
          from: { transform: 'translateY(-8px)' },
          to: { transform: 'translateY(0)' },
        },
        'skeleton-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'reveal-light': {
          '0%': {
            clipPath:
              'circle(0% at var(--transition-origin-x, 95%) var(--transition-origin-y, 5%))',
            transform: 'scale(1)',
            filter: 'blur(0px)',
          },
          '100%': {
            clipPath:
              'circle(150% at var(--transition-origin-x, 95%) var(--transition-origin-y, 5%))',
            transform: 'scale(1)',
            filter: 'blur(0px)',
          },
        },
        'reveal-dark': {
          '0%': {
            clipPath:
              'circle(0% at var(--transition-origin-x, 50%) var(--transition-origin-y, 50%))',
            transform: 'scale(1)',
            filter: 'blur(0px)',
          },
          '100%': {
            clipPath:
              'circle(150% at var(--transition-origin-x, 50%) var(--transition-origin-y, 50%))',
            transform: 'scale(1)',
            filter: 'blur(0px)',
          },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0.95' },
        },
        'reveal-wave': {
          '0%': {
            clipPath: 'ellipse(0% 0% at 50% 50%)',
            transform: 'scale(0.9)',
          },
          '100%': {
            clipPath: 'ellipse(120% 120% at 50% 50%)',
            transform: 'scale(1)',
          },
        },
        'reveal-diagonal': {
          '0%': { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' },
          '100%': { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' },
        },
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'ease-in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
        'ease-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
