'use client';

import Link from 'next/link';
import type { InfoNavbarProps } from './InfoNavbar.types';
import {
  Glimpse,
  GlimpseContent,
  GlimpseTrigger,
  GlimpseTitle,
  GlimpseDescription,
} from '@/components/ui/kibo-ui/glimpse';

export function InfoNavbar({ data, className = '' }: InfoNavbarProps) {
  if (!data.enabled) {
    return null;
  }

  const formatWhatsAppUrl = (number: string) => {
    // Remove spaces and special characters, keep only numbers and +
    const cleanNumber = number.replace(/[^\d+]/g, '');
    return `https://wa.me/${cleanNumber.replace('+', '')}`;
  };

  const renderWhatsAppLink = () => {
    const hasTooltip = data.whatsappTooltip?.enabled;
    const tooltipImage = data.whatsappTooltip?.image;

    const whatsAppContent = (
      <Link
        href={formatWhatsAppUrl(data.whatsappNumber!)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 transition-colors duration-200 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="flex-shrink-0"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        <span className="whitespace-nowrap text-xs lg:text-[13px]">{data.whatsappNumber}</span>
      </Link>
    );

    if (!hasTooltip) {
      return whatsAppContent;
    }

    return (
      <Glimpse>
        <GlimpseTrigger asChild>{whatsAppContent}</GlimpseTrigger>
        <GlimpseContent className="w-96 max-w-[90vw]">
          <div className="flex gap-4">
            {tooltipImage && typeof tooltipImage === 'object' && tooltipImage.url && (
              <img
                src={tooltipImage.url}
                alt={tooltipImage.alt || data.whatsappTooltip?.title || 'WhatsApp'}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="flex-shrink-0 text-green-600"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <GlimpseTitle>
                  {data.whatsappTooltip?.title || 'Stuur ons een WhatsApp'}
                </GlimpseTitle>
              </div>
              <GlimpseDescription>
                {data.whatsappTooltip?.message ||
                  'We zijn vaak in de studio aan het werk. Stuur ons eerst een WhatsApp-bericht, dan kunnen we je zo snel mogelijk terugbellen.'}
              </GlimpseDescription>
            </div>
          </div>
        </GlimpseContent>
      </Glimpse>
    );
  };

  return (
    <div
      className={`bg-white dark:bg-background h-8 flex items-center font-sans text-[13px] font-normal leading-[21px] relative z-[40] ${className}`}
    >
      <div className="container mx-auto px-3 lg:px-6">
        <div className="flex items-center justify-center w-full">
          {/* Contact Info - Always visible */}
          <div className="flex items-center gap-5 lg:gap-10">
            {data.whatsappNumber && renderWhatsAppLink()}

            {data.email && (
              <Link
                href={`mailto:${data.email}`}
                className="flex items-center gap-2 transition-colors duration-200 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-10 5L2 7"></path>
                </svg>
                <span className="text-xs lg:text-[13px]">{data.email}</span>
              </Link>
            )}
            {data.quickLinks &&
              data.quickLinks.length > 0 &&
              data.quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  target={link.openInNewTab ? '_blank' : undefined}
                  rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                  className="transition-colors duration-200 no-underline text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {link.label}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
