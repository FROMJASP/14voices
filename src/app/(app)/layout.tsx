import { Bricolage_Grotesque, Geist_Mono, Instrument_Serif } from 'next/font/google';
import { MaintenanceModeWrapper } from '@/components/common/widgets/feedback';
import { StoreHydration } from '@/components/common/StoreHydration';
import { ThemeProvider } from '@/components/common/layout/ThemeProvider';
import { ThemeScript } from './theme-script';
import { ViewTransitionsProvider } from '@/components/common/transitions/ViewTransitionsProvider';
import { headers } from 'next/headers';
import { NonceProvider } from '@/components/common/NonceProvider';
import './global.css';

const bricolageGrotesque = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'], // Added all weights from mockup
  display: 'swap',
  preload: true, // Add preload for critical font
  fallback: ['system-ui', 'arial'], // Add fallback fonts
});

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export { generateMetadata } from './metadata';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') || undefined;

  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <ThemeScript nonce={nonce} />
        {/* Resource hints for better performance */}
        <link rel="preconnect" href="https://minio.14voices.com" />
        <link rel="dns-prefetch" href="https://minio.14voices.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* PWA meta tags */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${bricolageGrotesque.variable} ${instrumentSerif.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <NonceProvider nonce={nonce}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
            storageKey="theme"
          >
            <ViewTransitionsProvider>
              <StoreHydration>
                <MaintenanceModeWrapper>{children}</MaintenanceModeWrapper>
              </StoreHydration>
            </ViewTransitionsProvider>
          </ThemeProvider>
        </NonceProvider>
      </body>
    </html>
  );
}
