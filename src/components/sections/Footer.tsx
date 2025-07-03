import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text';
import { cn } from '@/lib/utils';

interface FooterProps {
  navItems?: Array<{
    label: string;
    href: string;
    type: 'page' | 'anchor' | 'custom';
    isAnchor?: boolean;
  }>;
}

export function Footer({ navItems = [] }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const defaultNavItems = [
    { label: 'Voiceovers', href: '/#stemmen', type: 'anchor' as const, isAnchor: true },
    { label: 'Prijzen', href: '/#prijzen', type: 'anchor' as const, isAnchor: true },
    { label: 'Blog', href: '/#blog', type: 'anchor' as const, isAnchor: true },
    { label: 'Contact', href: '/#contact', type: 'anchor' as const, isAnchor: true },
  ];

  const items = navItems.length > 0 ? navItems : defaultNavItems;

  return (
    <footer className="relative w-full bg-background border-t">
      {/* Top Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/favicon.svg" alt="14voices" width={32} height={32} className="w-8 h-8" />
              <span className="font-bold text-xl">Fourteen Voices</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Professional Dutch voice-over services for all your audio needs.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact</h3>
            <div className="space-y-2">
              <a
                href="mailto:casting@14voices.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                casting@14voices.com
              </a>
              <a
                href="tel:020-2614825"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4" />
                020-2614825
              </a>
            </div>
            <div className="pt-2 space-y-1">
              <p className="text-xs text-muted-foreground">BTW NR. NL815307299B01</p>
              <p className="text-xs text-muted-foreground">KvK 28108452</p>
              <p className="text-xs text-muted-foreground italic">
                14voices is een geregistreerde merknaam van iam studios b.v.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="mt-8 pt-8 border-t flex justify-center gap-6">
          <a
            href="https://facebook.com/14voices"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com/14voices"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://twitter.com/14voices"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/company/14voices"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Bottom Section with Large Text */}
      <div className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-8">
            <AnimatedGradientText className="text-6xl md:text-8xl font-bold">
              <span
                className={cn(
                  `inline animate-gradient bg-gradient-to-r from-primary via-primary/80 to-primary bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
                )}
              >
                Fourteen Voices
              </span>
            </AnimatedGradientText>
            <p className="text-sm text-muted-foreground">
              © {currentYear} Fourteen Voices. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
