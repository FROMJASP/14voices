import Link from 'next/link';
import { Instrument_Serif } from 'next/font/google';

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <Link href="/" className={`group flex-shrink-0 ${className}`}>
      <span className={`font-instrument-serif ${instrumentSerif.variable}`}>
        <span className="text-4xl text-primary font-normal">Fourteen</span>{' '}
        <span className="text-3xl text-foreground italic font-light">Voices</span>
      </span>
    </Link>
  );
}
