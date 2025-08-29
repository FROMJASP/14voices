import { Bricolage_Grotesque, Geist_Mono, Instrument_Serif } from 'next/font/google';
import { MaintenanceModeWrapper } from '@/components/common/widgets/feedback';
import { StoreHydration } from '@/components/common/StoreHydration';
import './globals.css';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body
        className={`${bricolageGrotesque.variable} ${instrumentSerif.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <StoreHydration>
          <MaintenanceModeWrapper>{children}</MaintenanceModeWrapper>
        </StoreHydration>
      </body>
    </html>
  );
}
