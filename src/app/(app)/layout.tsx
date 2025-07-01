import { Geist, Geist_Mono } from "next/font/google";
import { MaintenanceModeWrapper } from "@/components/MaintenanceModeWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export { generateMetadata } from "./metadata";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MaintenanceModeWrapper>
          {children}
        </MaintenanceModeWrapper>
      </body>
    </html>
  );
}
