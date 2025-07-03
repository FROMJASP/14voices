'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from 'lucide-react';

interface FooterProps {
  config?: {
    style?: string;
    backgroundColor?: string;
    textColor?: string;
    showNewsletterSignup?: boolean;
    newsletterTitle?: string;
    newsletterDescription?: string;
    copyrightText?: string;
    showSocialLinks?: boolean;
    showContactInfo?: boolean;
    showBusinessHours?: boolean;
    showQuickLinks?: boolean;
    quickLinks?: Array<{ label: string; url: string }>;
    customContent?: unknown;
    showLogo?: boolean;
    description?: string;
    legalLinks?: Array<{ label: string; url: string; page?: { slug: string } }>;
    contactDisplay?: {
      showEmail?: boolean;
      showPhone?: boolean;
      showAddress?: boolean;
      showHours?: boolean;
    };
    navigationColumns?: Array<{
      title: string;
      links?: Array<{
        label: string;
        url: string;
        page?: { slug: string };
        openInNewTab?: boolean;
      }>;
    }>;
    contact?: {
      email?: string;
      phone?: string;
    };
    newsletter?: {
      enabled?: boolean;
      title?: string;
      description?: string;
      placeholder?: string;
      buttonText?: string;
    };
    borderTop?: boolean;
    borderColor?: string;
    padding?: string;
    showBackToTop?: boolean;
  };
}

export function Footer({ config }: FooterProps) {
  const [siteSettings, setSiteSettings] = useState<{
    companyName?: string;
    tagline?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
    businessHours?: Array<{ day: string; hours: string }>;
    socialMedia?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
      youtube?: string;
    };
  } | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    async function fetchSiteSettings() {
      try {
        const response = await fetch('/api/site-settings', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            setSiteSettings(data);
          } else {
            console.error('Response is not JSON:', contentType);
          }
        }
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
        // Log more details about the error
        if (error instanceof Error) {
          console.error('Error details:', error.message);
        }
      }
    }

    fetchSiteSettings();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!config || config.style === 'hidden') {
    return null;
  }

  const footerStyle = config.style || 'multi-column';

  // Replace placeholders in copyright text
  const currentYear = new Date().getFullYear();
  const copyrightText = (config.copyrightText || '© {year} {siteName}. All rights reserved.')
    .replace('{year}', currentYear.toString())
    .replace('{siteName}', siteSettings?.companyName || '14voices');

  // Social media icons mapping
  const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
  };

  // Get active social links
  const socialLinks = siteSettings?.socialMedia
    ? Object.entries(siteSettings.socialMedia)
        .filter(([, url]) => url)
        .map(([platform, url]) => ({ platform, url }))
    : [];

  // Render different footer styles
  const renderFooter = () => {
    switch (footerStyle) {
      case 'minimal':
        return (
          <div className="py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                {config.showLogo && (
                  <Link href="/" className="font-bold text-xl">
                    {siteSettings?.companyName || '14voices'}
                  </Link>
                )}
                <span className="text-sm text-muted-foreground">{copyrightText}</span>
              </div>
              {config.legalLinks && config.legalLinks.length > 0 && (
                <div className="flex items-center gap-4">
                  {config.legalLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.page?.slug ? `/${link.page.slug}` : '#'}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'centered':
        return (
          <div className="py-12 text-center">
            {config.showLogo && (
              <Link href="/" className="inline-block mb-6">
                <span className="font-bold text-2xl">
                  {siteSettings?.companyName || '14voices'}
                </span>
              </Link>
            )}
            {config.description && (
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">{config.description}</p>
            )}
            {socialLinks.length > 0 && config.showSocialLinks && (
              <div className="flex justify-center gap-4 mb-8">
                {socialLinks.map(({ platform, url }) => {
                  const Icon = socialIcons[platform];
                  return Icon ? (
                    <a
                      key={platform}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ) : null;
                })}
              </div>
            )}
            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-muted-foreground">{copyrightText}</p>
            </div>
          </div>
        );

      case 'split':
        return (
          <div className="py-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                {config.showLogo && (
                  <Link href="/" className="inline-block mb-4">
                    <span className="font-bold text-2xl">
                      {siteSettings?.companyName || '14voices'}
                    </span>
                  </Link>
                )}
                {config.description && (
                  <p className="text-muted-foreground mb-6">{config.description}</p>
                )}
                {config.showContactInfo &&
                  (siteSettings?.contactEmail || siteSettings?.contactPhone) && (
                    <div className="space-y-3">
                      {config.contactDisplay?.showEmail && siteSettings.contactEmail && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <a
                            href={`mailto:${siteSettings.contactEmail}`}
                            className="text-sm hover:underline"
                          >
                            {siteSettings.contactEmail}
                          </a>
                        </div>
                      )}
                      {config.contactDisplay?.showPhone && siteSettings.contactPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <a
                            href={`tel:${siteSettings.contactPhone}`}
                            className="text-sm hover:underline"
                          >
                            {siteSettings.contactPhone}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
              </div>
              <div>
                {config.navigationColumns && config.navigationColumns.length > 0 && (
                  <div className="grid grid-cols-2 gap-8">
                    {config.navigationColumns.slice(0, 2).map((column, index) => (
                      <div key={index}>
                        <h3 className="font-semibold mb-4">{column.title}</h3>
                        <ul className="space-y-2">
                          {column.links?.map((link, linkIndex) => (
                            <li key={linkIndex}>
                              <Link
                                href={link.page?.slug ? `/${link.page.slug}` : link.url || '#'}
                                target={link.openInNewTab ? '_blank' : undefined}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="border-t pt-6 mt-12">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">{copyrightText}</p>
                {config.legalLinks && config.legalLinks.length > 0 && (
                  <div className="flex items-center gap-4">
                    {config.legalLinks.map((link, index) => (
                      <Link
                        key={index}
                        href={link.page?.slug ? `/${link.page.slug}` : '#'}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'multi-column':
      default:
        return (
          <div className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
              {/* Brand Section */}
              <div className="lg:col-span-4">
                {config.showLogo && (
                  <Link href="/" className="inline-block mb-4">
                    <span className="font-bold text-2xl">
                      {siteSettings?.companyName || '14voices'}
                    </span>
                  </Link>
                )}
                {config.description && (
                  <p className="text-muted-foreground mb-6">{config.description}</p>
                )}
                {socialLinks.length > 0 && config.showSocialLinks && (
                  <div className="flex gap-3">
                    {socialLinks.map(({ platform, url }) => {
                      const Icon = socialIcons[platform];
                      return Icon ? (
                        <a
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {/* Navigation Columns */}
              {config.navigationColumns && config.navigationColumns.length > 0 && (
                <>
                  {config.navigationColumns.map((column, index) => (
                    <div key={index} className="lg:col-span-2">
                      <h3 className="font-semibold mb-4">{column.title}</h3>
                      <ul className="space-y-2">
                        {column.links?.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <Link
                              href={link.page?.slug ? `/${link.page.slug}` : link.url || '#'}
                              target={link.openInNewTab ? '_blank' : undefined}
                              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </>
              )}

              {/* Contact Info */}
              {config.showContactInfo &&
                (siteSettings?.contactEmail || siteSettings?.contactPhone) && (
                  <div className="lg:col-span-3">
                    <h3 className="font-semibold mb-4">Contact Us</h3>
                    <div className="space-y-3">
                      {config.contactDisplay?.showEmail && siteSettings.contactEmail && (
                        <div className="flex items-start gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <a
                            href={`mailto:${siteSettings.contactEmail}`}
                            className="text-sm hover:underline"
                          >
                            {siteSettings.contactEmail}
                          </a>
                        </div>
                      )}
                      {config.contactDisplay?.showPhone && siteSettings.contactPhone && (
                        <div className="flex items-start gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <a
                            href={`tel:${siteSettings.contactPhone}`}
                            className="text-sm hover:underline"
                          >
                            {siteSettings.contactPhone}
                          </a>
                        </div>
                      )}
                      {config.contactDisplay?.showAddress && siteSettings.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div className="text-sm">
                            {siteSettings.address.street && (
                              <div>{siteSettings.address.street}</div>
                            )}
                            {(siteSettings.address.city ||
                              siteSettings.address.state ||
                              siteSettings.address.postalCode) && (
                              <div>
                                {siteSettings.address.city}
                                {siteSettings.address.city && siteSettings.address.state && ', '}
                                {siteSettings.address.state} {siteSettings.address.postalCode}
                              </div>
                            )}
                            {siteSettings.address.country && (
                              <div>{siteSettings.address.country}</div>
                            )}
                          </div>
                        </div>
                      )}
                      {config.contactDisplay?.showHours && siteSettings.businessHours && (
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div className="text-sm">
                            {siteSettings.businessHours?.map((item, index) => (
                              <div key={index}>
                                <span className="font-medium">{item.day}:</span> {item.hours}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Newsletter */}
              {config.newsletter?.enabled && (
                <div className="lg:col-span-3">
                  <h3 className="font-semibold mb-4">{config.newsletter.title}</h3>
                  {config.newsletter.description && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {config.newsletter.description}
                    </p>
                  )}
                  <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="email"
                      placeholder={config.newsletter.placeholder}
                      className="w-full px-4 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      {config.newsletter.buttonText}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Bottom Bar */}
            <div className="border-t pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">{copyrightText}</p>
                {config.legalLinks && config.legalLinks.length > 0 && (
                  <div className="flex items-center gap-4">
                    {config.legalLinks.map((link, index) => (
                      <Link
                        key={index}
                        href={link.page?.slug ? `/${link.page.slug}` : '#'}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  // Apply custom styling if provided
  const customStyles = {
    backgroundColor: config.backgroundColor,
    color: config.textColor,
    borderTopWidth: config.borderTop ? '1px' : '0',
    borderTopColor: config.borderColor,
  };

  const paddingClasses: Record<string, string> = {
    small: 'py-6',
    medium: 'py-12',
    large: 'py-16',
  };

  const paddingClass = paddingClasses[config.padding as string] || paddingClasses.medium;

  return (
    <>
      <footer className={`footer footer--${footerStyle} ${paddingClass}`} style={customStyles}>
        <div className="container mx-auto px-4">{renderFooter()}</div>
      </footer>

      {/* Back to Top Button */}
      {config.showBackToTop && showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 z-50"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
}
