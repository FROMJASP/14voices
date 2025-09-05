'use client';

import React from 'react';
import { useAuth } from '@payloadcms/ui';
import { getInitials } from '@/lib/initials';

export default function AccountWrapperSimple() {
  // Get user data from Payload's useAuth hook
  let user = null;

  try {
    const auth = useAuth();
    user = auth.user;
  } catch {
    console.debug('AccountWrapper: useAuth hook not available');
  }

  // Get the avatar URL from user data
  const avatarUrl = user?.avatarURL || user?.avatar?.url || user?.image;
  const displayName = user?.name || user?.email || 'User';

  React.useEffect(() => {
    const updateAccountIcon = () => {
      // Check if avatar already exists
      const existingCustomAvatar = document.querySelector('.custom-avatar-wrapper');
      if (existingCustomAvatar) {
        return;
      }

      // Find the account link
      const accountLink = document.querySelector('nav a[href*="/admin/account"]');

      if (accountLink) {
        // Check if we already added our avatar
        const existingAvatar = accountLink.querySelector('.custom-avatar-wrapper');
        if (!existingAvatar) {
          const iconContainer = accountLink.querySelector('span, div') || accountLink;

          // Create avatar element
          const avatarWrapper = document.createElement('div');
          avatarWrapper.className = 'custom-avatar-wrapper';

          if (avatarUrl) {
            const img = document.createElement('img');
            img.src = avatarUrl;
            img.alt = displayName;
            img.onerror = () => {
              // Fallback to initials if image fails
              while (avatarWrapper.firstChild) {
                avatarWrapper.removeChild(avatarWrapper.firstChild);
              }
              const initialsSpan = document.createElement('span');
              initialsSpan.className = 'initials';
              initialsSpan.textContent = getInitials(displayName);
              avatarWrapper.appendChild(initialsSpan);
            };
            avatarWrapper.appendChild(img);
          } else {
            const initials = document.createElement('span');
            initials.className = 'initials';
            initials.textContent = getInitials(displayName);
            avatarWrapper.appendChild(initials);
          }

          // Clear the container and add our avatar
          while (iconContainer.firstChild) {
            iconContainer.removeChild(iconContainer.firstChild);
          }
          iconContainer.appendChild(avatarWrapper);
        }
      }
    };

    // Run immediately and after delays
    updateAccountIcon();
    const timer = setTimeout(updateAccountIcon, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [avatarUrl, displayName]);

  return null;
}
