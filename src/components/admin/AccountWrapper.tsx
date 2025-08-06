'use client';

import React from 'react';
import { useAuth } from '@payloadcms/ui';
import { getInitials } from '@/lib/initials';

export default function AccountWrapper() {
  const { user } = useAuth();

  // Get the avatar URL from user data
  const avatarUrl = user?.image || user?.avatar?.url || user?.avatarURL;
  const displayName = user?.name || user?.email || 'User';

  // Override the default Payload account icon with custom styles
  React.useEffect(() => {
    const updateAccountIcon = () => {
      // Try multiple selectors to find the account link
      const selectors = [
        'nav a[href*="/admin/account"]',
        'a[href*="/admin/account"]',
        '[class*="account"]',
        'button[class*="account"]',
        'nav ul li:last-child a', // Often the account is the last nav item
        'nav ul li:last-child button',
      ];

      let accountLink = null;
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (
          element &&
          (element.getAttribute('href')?.includes('/account') ||
            element.querySelector('svg[class*="account"]') ||
            element.parentElement?.querySelector('a[href*="/account"]'))
        ) {
          accountLink = element;
          break;
        }
      }

      if (accountLink) {
        // Create style element if it doesn't exist
        let styleEl = document.getElementById('custom-account-styles');
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'custom-account-styles';
          styleEl.textContent = `
            .custom-avatar-wrapper {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              overflow: hidden;
              border: 2px solid var(--theme-elevation-150);
              cursor: pointer;
              transition: border-color 0.2s ease;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: var(--theme-elevation-100);
              flex-shrink: 0;
            }
            .custom-avatar-wrapper:hover {
              border-color: var(--theme-success-500);
            }
            .custom-avatar-wrapper img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .custom-avatar-wrapper .initials {
              font-size: 14px;
              font-weight: 600;
              color: var(--theme-text);
              user-select: none;
            }
          `;
          document.head.appendChild(styleEl);
        }

        // Check if we already added our avatar
        if (!accountLink.querySelector('.custom-avatar-wrapper')) {
          // Look for any child elements that might contain the icon
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
              // Remove existing content and add initials safely
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

          // Clear the container safely and add our avatar
          while (iconContainer.firstChild) {
            iconContainer.removeChild(iconContainer.firstChild);
          }
          iconContainer.appendChild(avatarWrapper);
        }
      }
    };

    // Run immediately
    updateAccountIcon();

    // Also run after a short delay to catch late-rendered elements
    const timeouts = [100, 500, 1000];
    const timers = timeouts.map((delay) => setTimeout(updateAccountIcon, delay));

    // Watch for DOM changes
    const observer = new MutationObserver(() => {
      updateAccountIcon();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      timers.forEach(clearTimeout);
      observer.disconnect();
    };
  }, [avatarUrl, displayName, user]);

  return null;
}
