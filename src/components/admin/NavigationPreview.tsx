'use client';

import { useState } from 'react';
import { useFormFields } from '@payloadcms/ui';
import { NavigationBarEnhanced } from '@/components/sections/NavigationBar/NavigationBarEnhanced';
import { AnnouncementBanner as AnnouncementBannerClient } from '@/components/sections/AnnouncementBanner';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

export const NavigationPreview: React.FC = () => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Get the form fields
  const fields = useFormFields(([fields]) => fields);

  // Extract navigation items from form data
  const mainMenu = fields?.mainMenu?.value || [];
  const banner = fields?.banner?.value || {};

  // Format navigation items for the preview
  const formattedNavItems = Array.isArray(mainMenu)
    ? mainMenu
        .map((item: unknown) => {
          const navItem = item as {
            label?: string;
            linkType?: string;
            linkPage?: { slug?: string };
            linkUrl?: string;
          };
          return {
            label: navItem.label || 'Link',
            href:
              navItem.linkType === 'page'
                ? `/${navItem.linkPage?.slug || ''}`
                : navItem.linkUrl || '#',
            type: (navItem.linkType as 'anchor' | 'custom' | 'page') || 'custom',
            isAnchor: navItem.linkType === 'anchor',
          };
        })
        .filter((item: { label: string }) => item.label)
    : [];

  // Device dimensions
  const deviceDimensions = {
    desktop: 'w-full max-w-7xl',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]',
  };

  const deviceScale = {
    desktop: 'scale-100',
    tablet: 'scale-90',
    mobile: 'scale-75',
  };

  return (
    <div className="space-y-6 p-6 bg-muted/10 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Live Navigation Preview</h3>

        {/* Device Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">Device:</span>
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={cn(
              'p-2 rounded transition-colors',
              device === 'desktop'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            )}
            aria-label="Desktop view"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDevice('tablet')}
            className={cn(
              'p-2 rounded transition-colors',
              device === 'tablet'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            )}
            aria-label="Tablet view"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={cn(
              'p-2 rounded transition-colors',
              device === 'mobile'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            )}
            aria-label="Mobile view"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Dark Mode Toggle */}
          <div className="ml-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Dark:</span>
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={cn(
                'relative w-10 h-5 rounded-full transition-colors',
                isDarkMode ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform',
                  isDarkMode && 'translate-x-5'
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div className="relative overflow-hidden rounded-lg border bg-background">
        <div className="flex justify-center overflow-x-auto">
          <div
            className={cn(
              'transition-all duration-300',
              deviceDimensions[device],
              deviceScale[device],
              isDarkMode && 'dark'
            )}
          >
            <div
              className={cn(
                'relative bg-background text-foreground',
                device !== 'desktop' && 'mx-auto'
              )}
            >
              {/* Banner Preview */}
              {banner?.enabled && (
                <AnnouncementBannerClient
                  enabled={true}
                  message={banner.message || 'Banner message'}
                  linkText={banner.linkText}
                  linkType={banner.linkType || 'none'}
                  linkUrl={banner.linkUrl}
                  linkPage={banner.linkPage}
                  dismissible={banner.dismissible}
                  style={banner.style || 'gradient'}
                />
              )}

              {/* Navigation Preview */}
              <NavigationBarEnhanced
                navItems={formattedNavItems}
                hasBanner={banner?.enabled || false}
              />

              {/* Content placeholder */}
              <div className="h-64 bg-muted/20 flex items-center justify-center">
                <p className="text-muted-foreground">Page content</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>This preview updates in real-time as you edit the navigation settings.</p>
        <p className="mt-1">Note: Some interactive features are disabled in preview mode.</p>
      </div>
    </div>
  );
};
