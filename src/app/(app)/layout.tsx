import { Bricolage_Grotesque, Geist_Mono, Instrument_Serif } from 'next/font/google';
import { MaintenanceModeWrapper } from '@/components/widgets/feedback';
import { ThemeProvider } from '@/components/providers';
import { CartProvider } from '@/contexts/CartContext';
import './globals.css';

const bricolageGrotesque = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <CartProvider>
            <MaintenanceModeWrapper>{children}</MaintenanceModeWrapper>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
