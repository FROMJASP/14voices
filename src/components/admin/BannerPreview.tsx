'use client';

import React from 'react';
import { useFormFields } from '@payloadcms/ui';
import { AnnouncementBanner } from '../sections/AnnouncementBanner/AnnouncementBanner';

export const BannerPreview: React.FC = () => {
  // Get the form fields
  const fields = useFormFields(([fields]) => fields);

  // Extract banner data from form fields
  const banner =
    (fields?.bannerSettings?.value as {
      enabled?: boolean;
      message?: string;
      linkText?: string;
      linkType?: string;
      linkUrl?: string;
      linkPage?: unknown;
      dismissible?: boolean;
      style?: 'gradient' | 'solid' | 'subtle';
    }) || {};

  if (!banner?.enabled) {
    return (
      <div className="p-8 text-center text-muted-foreground bg-muted/10 rounded-lg">
        <p>Banner is disabled. Enable it to see the preview.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        <p>Live Preview - Use **text** to make text orange and italic</p>
      </div>
      <div className="border rounded-lg overflow-hidden bg-background">
        <AnnouncementBanner
          enabled={true}
          message={
            banner.message ||
            '🚀 **14 Nieuwe Stemmen**. Beluister hier wat ze voor jou kunnen betekenen!'
          }
          linkText={banner.linkText}
          linkUrl={banner.linkUrl}
          dismissible={banner.dismissible}
          style={banner.style || 'subtle'}
        />
      </div>
    </div>
  );
};
