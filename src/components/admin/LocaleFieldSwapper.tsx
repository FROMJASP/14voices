'use client';

import { useEffect } from 'react';

export default function LocaleFieldSwapper() {
  useEffect(() => {
    const fixLocalizedFields = () => {
      // Get the current locale from localStorage
      const currentLocale = localStorage.getItem('payload-locale') || 'nl';

      // Force Payload to use the correct locale
      // This ensures data saves to the right locale
      if (window.location.pathname.includes('/admin/')) {
        // Check if URL has locale parameter
        const url = new URL(window.location.href);
        if (!url.searchParams.has('locale') || url.searchParams.get('locale') !== currentLocale) {
          url.searchParams.set('locale', currentLocale);
          window.history.replaceState({}, '', url);
        }
      }

      // Remove all "— English" suffixes since we're in Dutch mode
      if (currentLocale === 'nl') {
        const labels = document.querySelectorAll('.field-label');

        labels.forEach((label) => {
          const labelText = label.textContent || '';

          // Remove the "— English" suffix
          if (labelText.includes(' — English')) {
            label.textContent = labelText.replace(' — English', '');

            // Update field descriptions to Dutch
            const fieldContainer = label.closest('.field');
            if (fieldContainer) {
              const description = fieldContainer.querySelector('.field-description');
              if (description) {
                const descText = description.textContent || '';
                // Update known English descriptions to Dutch
                if (descText.includes('The name of')) {
                  description.textContent = 'De naam van de productiesoort';
                } else if (descText.includes('Short description')) {
                  description.textContent = 'Korte beschrijving van deze productiesoort';
                } else if (descText.includes('How long')) {
                  description.textContent =
                    'Hoe lang mogen de opnames gebruikt worden (gebruik "oneindig" voor onbeperkt)';
                }
              }

              // Also ensure the input field has the correct locale data attribute
              const input = fieldContainer.querySelector('input, textarea');
              if (input) {
                input.setAttribute('data-locale', currentLocale);
              }
            }
          }
        });

        // Add a notice at the top of the form to explain this
        const formHeader = document.querySelector('.collection-edit__header');
        if (formHeader && !document.querySelector('.locale-notice')) {
          const notice = document.createElement('div');
          notice.className = 'locale-notice';
          notice.style.cssText =
            'background: #3b82f6; color: white; padding: 12px 20px; margin-bottom: 20px; border-radius: 4px;';
          notice.innerHTML =
            '💡 Let op: Velden zonder taal-suffix zijn nu direct bewerkbaar en worden meteen opgeslagen.';
          formHeader.after(notice);
        }
      }
    };

    // Run immediately
    fixLocalizedFields();

    // Run after delays to catch late-rendered elements
    const timeouts = [
      setTimeout(fixLocalizedFields, 100),
      setTimeout(fixLocalizedFields, 500),
      setTimeout(fixLocalizedFields, 1000),
      setTimeout(fixLocalizedFields, 2000),
    ];

    // Run when DOM changes
    const observer = new MutationObserver(() => {
      fixLocalizedFields();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Listen for route changes
    const handleRouteChange = () => {
      setTimeout(fixLocalizedFields, 100);
    };

    window.addEventListener('popstate', handleRouteChange);

    // Clean up
    return () => {
      timeouts.forEach(clearTimeout);
      observer.disconnect();
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return null;
}
