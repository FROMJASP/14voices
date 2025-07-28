import { Geist, Geist_Mono } from 'next/font/google';
import { MaintenanceModeWrapper } from '@/components/MaintenanceModeWrapper';
import { GlobalLayout } from '@/components/GlobalLayout';
import { ThemeProvider } from '@/components/ThemeProvider';
import { CartProvider } from '@/contexts/CartContext';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <CartProvider>
            <MaintenanceModeWrapper>
              <GlobalLayout>{children}</GlobalLayout>
            </MaintenanceModeWrapper>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
