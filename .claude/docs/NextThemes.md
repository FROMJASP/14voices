# Next-Themes Documentation

Next-themes is a library for perfect dark mode in Next.js, supporting system preference and custom themes with no flashing.

## Installation

```bash
npm install next-themes
# or
yarn add next-themes
```

## Basic Setup

### App Router (app/layout.jsx)

```jsx
import { ThemeProvider } from 'next-themes'

export default function Layout({ children }) {
  return (
    <html suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

### Pages Router (pages/_app.js)

```jsx
import { ThemeProvider } from 'next-themes'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
```

## Using the Theme

### useTheme Hook

```jsx
import { useTheme } from 'next-themes'

const ThemeChanger = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div>
      The current theme is: {theme}
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  )
}
```

### Safe Theme Switch Component

To avoid hydration mismatch errors, wait for client-side mounting:

```jsx
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <select value={theme} onChange={e => setTheme(e.target.value)}>
      <option value="system">System</option>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  )
}

export default ThemeSwitch
```

### Alternative: Lazy Loading

```jsx
import dynamic from 'next/dynamic'

const ThemeSwitch = dynamic(() => import('./ThemeSwitch'), { ssr: false })
```

## ThemeProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `storageKey` | string | 'theme' | Key used to store theme in localStorage |
| `defaultTheme` | string | 'system' | Default theme name |
| `forcedTheme` | string | undefined | Forced theme for current page |
| `enableSystem` | boolean | true | Enable system preference detection |
| `enableColorScheme` | boolean | true | Update browser color scheme |
| `disableTransitionOnChange` | boolean | false | Disable CSS transitions on theme change |
| `themes` | string[] | ['light', 'dark'] | List of available themes |
| `attribute` | string | 'data-theme' | HTML attribute to modify |
| `value` | object | undefined | Custom attribute values |
| `nonce` | string | undefined | CSP nonce for injected script |
| `scriptProps` | object | undefined | Props for injected script |

## useTheme Hook Return Values

| Property | Type | Description |
|----------|------|-------------|
| `theme` | string | Active theme name |
| `setTheme` | function | Function to update theme |
| `forcedTheme` | string \| null | Forced page theme |
| `resolvedTheme` | string | Resolved theme when using 'system' |
| `systemTheme` | string \| null | System theme preference |
| `themes` | string[] | List of all themes |

## CSS Styling

### Default Data Attribute Styling

```css
:root {
  /* Your default theme */
  --background: white;
  --foreground: black;
}

[data-theme='dark'] {
  --background: black;
  --foreground: white;
}
```

### Without CSS Variables

```css
html,
body {
  color: #000;
  background: #fff;
}

[data-theme='dark'],
[data-theme='dark'] body {
  color: #fff;
  background: #000;
}
```

## TailwindCSS Integration

### Configure Tailwind

```js
// tailwind.config.js
module.exports = {
  darkMode: 'selector'
}
```

### Use Class Attribute

```jsx
<ThemeProvider attribute="class">
```

### Apply Dark Mode Classes

```jsx
<h1 className="text-black dark:text-white">
```

### Custom Selector (Tailwind v3.4.1+)

```js
// tailwind.config.js
module.exports = {
  darkMode: ['selector', '[data-mode="dark"]']
}
```

```jsx
<ThemeProvider attribute="data-mode">
```

## Advanced Usage

### Custom Themes

```jsx
<ThemeProvider themes={['pink', 'red', 'blue', 'light', 'dark']}>
```

### Force Theme on Specific Pages

```js
// pages/awesome-page.js
const Page = () => { /* ... */ }
Page.theme = 'dark'
export default Page
```

```jsx
// pages/_app.js
function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider forcedTheme={Component.theme || null}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
```

```jsx
// In components
const { forcedTheme } = useTheme()
const disabled = !!forcedTheme // Disable theme switching
```

### Custom Attribute Values

```jsx
<ThemeProvider value={{ pink: 'my-pink-theme' }}>
```

This changes the DOM attribute value while keeping the theme name:
- `theme` from useTheme: "pink"
- localStorage: "pink"
- DOM attribute: "my-pink-theme"

### Disable System Preference

```jsx
<ThemeProvider enableSystem={false}>
```

### Disable Transitions

```jsx
<ThemeProvider disableTransitionOnChange>
```

## Handling Images

### Theme-Based Images

```jsx
import Image from 'next/image'
import { useTheme } from 'next-themes'

function ThemedImage() {
  const { resolvedTheme } = useTheme()
  let src

  switch (resolvedTheme) {
    case 'light':
      src = '/light.png'
      break
    case 'dark':
      src = '/dark.png'
      break
    default:
      src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
      break
  }

  return <Image src={src} width={400} height={400} />
}
```

### CSS-Based Image Switching

```jsx
function ThemedImage() {
  return (
    <>
      <div data-hide-on-theme="dark">
        <Image src="light.png" width={400} height={400} />
      </div>
      <div data-hide-on-theme="light">
        <Image src="dark.png" width={400} height={400} />
      </div>
    </>
  )
}
```

```css
[data-theme='dark'] [data-hide-on-theme='dark'],
[data-theme='light'] [data-hide-on-theme='light'] {
  display: none;
}
```

## Integration with CSS-in-JS

### Styled Components

```jsx
// pages/_app.js
import { createGlobalStyle } from 'styled-components'
import { ThemeProvider } from 'next-themes'

const GlobalStyle = createGlobalStyle`
  :root {
    --fg: #000;
    --bg: #fff;
  }

  [data-theme="dark"] {
    --fg: #fff;
    --bg: #000;
  }
`

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
```

## Cloudflare Rocket Loader

Prevent interference with script injection:

```jsx
<ThemeProvider scriptProps={{ 'data-cfasync': 'false' }}>
```

## Common Patterns

### Conditional Styling

```jsx
const { resolvedTheme } = useTheme()

<div style={{ color: resolvedTheme === 'dark' ? 'white' : 'black' }}>
```

### Theme Toggle Button

```jsx
const { theme, setTheme } = useTheme()

<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  Toggle theme
</button>
```

### System Default with Override

```jsx
const { theme, setTheme, systemTheme } = useTheme()

// Show current theme (resolved)
const currentTheme = theme === 'system' ? systemTheme : theme

// Toggle between themes
const toggleTheme = () => {
  if (theme === 'system') {
    setTheme(systemTheme === 'dark' ? 'light' : 'dark')
  } else {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }
}
```