'use client';

import React, { FormEvent, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Bricolage_Grotesque } from 'next/font/google';

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
});

const pathArr = [
  // F
  'M10 20L10 90L25 90L25 60L50 60L50 45L25 45L25 35L55 35L55 20L10 20Z',
  // o
  'M70 55C70 41.745 80.745 31 94 31C107.255 31 118 41.745 118 55C118 68.255 107.255 79 94 79C80.745 79 70 68.255 70 55ZM85 55C85 60.523 89.477 65 95 65C100.523 65 105 60.523 105 55C105 49.477 100.523 45 95 45C89.477 45 85 49.477 85 55Z',
  // u
  'M135 35L135 60C135 67.18 140.82 73 148 73C155.18 73 161 67.18 161 60L161 35L176 35L176 60C176 75.464 163.464 88 148 88C132.536 88 120 75.464 120 60L120 35L135 35Z',
  // r
  'M195 35L195 90L210 90L210 55C212 40 217 35 224 35C228 35 231 36 234 38L240 28C236 31 231 33 225 33C217 33 211 38 210 45L210 35L195 35Z',
  // t
  'M250 15L250 35L265 35L265 75C265 80 267 85 275 85L275 85L275 35L290 35L290 20L250 20L250 15Z',
  // e
  'M305 55C305 41.745 315.745 31 329 31C342.255 31 353 41.745 353 55L353 60L320 60C322 66 326 70 331 70C335 70 338 68 340 66L348 76C343 81 337 83 329 83C315.745 83 305 72.255 305 59ZM320 50L338 50C337 45 333 41 329 41C325 41 321 45 320 50Z',
  // e
  'M365 55C365 41.745 375.745 31 389 31C402.255 31 413 41.745 413 55L413 60L380 60C382 66 386 70 391 70C395 70 398 68 400 66L408 76C403 81 397 83 389 83C375.745 83 365 72.255 365 59ZM380 50L398 50C397 45 393 41 389 41C385 41 381 45 380 50Z',
  // n
  'M425 35L425 90L440 90L440 50L450 90L465 90L465 35L450 35L450 75L440 35L425 35Z',
  // (space)
  // V
  'M480 25L498 90L512 90L530 25L515 25L505 65L495 25L480 25Z',
  // o
  'M540 55C540 41.745 550.745 31 564 31C577.255 31 588 41.745 588 55C588 68.255 577.255 79 564 79C550.745 79 540 68.255 540 55ZM555 55C555 60.523 559.477 65 565 65C570.523 65 575 60.523 575 55C575 49.477 570.523 45 565 45C559.477 45 555 49.477 555 55Z',
  // i
  'M605 25C609.418 25 613 21.418 613 17C613 12.582 609.418 9 605 9C600.582 9 597 12.582 597 17C597 21.418 600.582 25 605 25ZM598 35L598 90L613 90L613 35L598 35Z',
  // c
  'M630 55C630 41.745 640.745 31 654 31C661.284 31 667.86 33.858 672.678 38.678L662.322 49.322C660.608 47.608 658.404 47 656 47C650.477 47 646 51.477 646 57C646 62.523 650.477 67 656 67C658.404 67 660.608 66.392 662.322 64.678L672.678 75.322C667.86 80.142 661.284 83 654 83C640.745 83 630 72.255 630 59Z',
  // e
  'M690 55C690 41.745 700.745 31 714 31C727.255 31 738 41.745 738 55L738 60L705 60C707 66 711 70 716 70C720 70 723 68 725 66L733 76C728 81 722 83 714 83C700.745 83 690 72.255 690 59ZM705 50L723 50C722 45 718 41 714 41C710 41 706 45 705 50Z',
  // s
  'M745 45C745 36.716 751.716 30 760 30C768 30 774 33 777 38L764 44C763 42 761 40 758 40C755 40 752 42 752 45C752 48 754 50 758 52L765 57C772 62 777 67 777 75C777 83.284 770.284 90 762 90C753 90 746 86 743 80L756 74C757 78 759 80 763 80C767 80 770 78 770 75C770 71 768 69 764 66L756 60C749 55 745 50 745 45Z',
];

interface FooterProps {
  sitemapLinks?: Array<{ label: string; href: string }>;
  socialLinks?: Array<{ label: string; href: string }>;
  copyrightText?: string;
  newsletterEnabled?: boolean;
}

export function Footer({
  sitemapLinks = [
    { label: 'Home', href: '/' },
    { label: 'Over ons', href: '/about' },
    { label: 'Voiceovers', href: '/voiceovers' },
    { label: 'Prijzen', href: '/prijzen' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  socialLinks = [
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Twitter', href: 'https://twitter.com' },
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
  ],
  copyrightText = '© 2025 Fourteen Voices. All Rights Reserved.',
  newsletterEnabled = true,
}: FooterProps) {
  const container = useRef<HTMLDivElement>(null);
  const [openPopup, setOpenPopUp] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-100px',
  });

  const variants = {
    visible: (i: number) => ({
      translateY: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 15,
        delay: i * 0.04,
      },
    }),
    hidden: {
      translateY: 100,
      opacity: 0,
    },
  };

  const handleNewsLetterData = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);
    const clientEmail = formData.get('newsletter_email')!;

    // TODO: Implement newsletter subscription
    console.log('Newsletter subscription:', clientEmail);

    setOpenPopUp(true);
    target.reset();
    if (setOpenPopUp) {
      setTimeout(() => {
        setOpenPopUp(false);
      }, 2000);
    }
  };

  return (
    <div
      className={`relative h-full sm:pt-14 pt-8 bg-[#fcf9f5] dark:bg-background text-foreground ${bricolageGrotesque.variable}`}
      ref={container}
    >
      <div className="sm:container px-4 mx-auto">
        <div className="md:flex justify-between w-full">
          {/* Newsletter Section */}
          {newsletterEnabled && (
            <div className="flex-1 max-w-lg">
              <h1 className="font-bricolage md:text-4xl text-2xl font-semibold text-title">
                Laten we samen iets moois maken
              </h1>
              <div className="pt-2 pb-6">
                <p className="font-bricolage md:text-2xl text-xl py-4 text-normal">
                  Schrijf je in voor onze nieuwsbrief*
                </p>
                <div className="relative bg-black dark:bg-white flex justify-between items-center border-2 overflow-hidden border-black dark:border-white rounded-full text-white dark:text-black hover:bg-foreground/90 dark:hover:bg-background/90 transition-colors md:text-2xl">
                  <form
                    onSubmit={(e) => handleNewsLetterData(e)}
                    className="relative z-2 flex w-full h-full"
                  >
                    <input
                      type="email"
                      name="newsletter_email"
                      className="font-bricolage flex-1 border-none bg-transparent py-3 px-6 placeholder-gray-400 dark:placeholder-gray-500 text-white dark:text-black focus:outline-none"
                      placeholder="Jouw email *"
                      required
                    />
                    <button
                      type="submit"
                      className="px-6 cursor-pointer bg-white dark:bg-black text-black dark:text-white hover:bg-muted dark:hover:bg-muted transition-colors flex items-center justify-center"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Links Section */}
          <div className="flex gap-10">
            <ul>
              <li className="font-bricolage text-2xl pb-2 font-semibold text-title">SITEMAP</li>
              {sitemapLinks.map((link, index) => (
                <li
                  key={index}
                  className="font-bricolage text-xl font-medium text-normal hover:text-primary transition-colors"
                >
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
            <ul>
              <li className="font-bricolage text-2xl pb-2 font-semibold text-title">SOCIAL</li>
              {socialLinks.map((link, index) => (
                <li key={index} className="font-bricolage text-xl font-medium text-normal">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Logo Animation Section */}
        <div
          className="border-y-2 md:py-4 border-muted dark:border-border overflow-hidden"
          ref={ref}
        >
          <motion.svg
            width="100%"
            height="100"
            viewBox="0 0 820 100"
            fill="none"
            className="sm:h-fit h-14 md:px-8 px-2 footer-logo w-full"
            xmlns="http://www.w3.org/2000/svg"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            preserveAspectRatio="xMidYMid meet"
          >
            {pathArr.map((path, index) => (
              <motion.path
                key={index}
                custom={index}
                variants={variants}
                d={path}
                fill="currentColor"
                className="text-primary hover:text-primary-hover transition-colors duration-200 cursor-pointer"
                whileHover={{
                  y: -5,
                  transition: { type: 'spring', stiffness: 400, damping: 25 },
                }}
              />
            ))}
          </motion.svg>
        </div>

        {/* Copyright Section */}
        <div className="flex md:flex-row flex-col-reverse gap-3 justify-between py-2">
          <span className="font-bricolage font-medium text-normal">{copyrightText}</span>
          <Link
            href="/privacy-policy"
            className="font-bricolage font-semibold text-title hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>

      {/* Simple Toast Notification */}
      {openPopup && (
        <div className="fixed bottom-4 right-4 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg shadow-lg z-50">
          <p className="font-bricolage">Bedankt voor je aanmelding!</p>
        </div>
      )}
    </div>
  );
}
