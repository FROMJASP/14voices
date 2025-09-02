'use client';

import React from 'react';
import { useAuth } from '@payloadcms/ui';
import { getInitials } from '@/lib/initials';

export default function AccountWrapper() {
  // Get user data from Payload's useAuth hook - call directly in component body
  let user = null;

  try {
    const auth = useAuth();
    user = auth.user;
  } catch {
    // Fallback if hook is not available
    console.debug('AccountWrapper: useAuth hook not available');
  }

  // Get the avatar URL from user data - check different possible structures
  const avatarUrl =
    user?.avatarURL || // Virtual field with resolved URL
    user?.avatar?.url || // Direct media relationship
    user?.image; // Fallback
  const displayName = user?.name || user?.email || 'User';

  // Override the default Payload account icon with custom styles
  React.useEffect(() => {
    const updateAccountIcon = () => {
      // Early exit if avatar already exists
      const existingCustomAvatar = document.querySelector('.custom-avatar-wrapper');
      if (existingCustomAvatar) {
        return;
      }

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
        const existingAvatar = accountLink.querySelector('.custom-avatar-wrapper');
        if (!existingAvatar) {
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

    // Watch for DOM changes, but with better control to prevent infinite loops
    let isUpdating = false;
    let observerTimeout: NodeJS.Timeout | null = null;

    const observer = new MutationObserver((mutations) => {
      // Skip if we're already updating
      if (isUpdating) return;

      // Check if any mutation is related to account elements
      const hasAccountChanges = mutations.some((mutation) => {
        // Check if the mutation affects account-related elements
        const target = mutation.target as HTMLElement;
        return (
          target.querySelector &&
          (target.querySelector('a[href*="/admin/account"]') ||
            target.querySelector('.custom-avatar-wrapper') ||
            mutation.addedNodes.length > 0)
        );
      });

      if (!hasAccountChanges) return;

      // Debounce updates to prevent rapid firing
      if (observerTimeout) {
        clearTimeout(observerTimeout);
      }

      observerTimeout = setTimeout(() => {
        isUpdating = true;
        updateAccountIcon();
        // Reset flag after DOM settles
        setTimeout(() => {
          isUpdating = false;
        }, 100);
      }, 100);
    });

    // Observe only the navigation area to reduce observer overhead
    const navElement = document.querySelector('nav');
    if (navElement) {
      observer.observe(navElement, {
        childList: true,
        subtree: true,
        attributes: false,
      });
    }

    return () => {
      timers.forEach(clearTimeout);
      if (observerTimeout) {
        clearTimeout(observerTimeout);
      }
      observer.disconnect();
    };
  }, [avatarUrl, displayName, user]);

  return null;
}
