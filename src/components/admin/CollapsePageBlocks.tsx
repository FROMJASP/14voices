'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function CollapsePageBlocks() {
  const pathname = usePathname();

  useEffect(() => {
    // Only run on pages edit pages
    if (!pathname?.includes('/admin/collections/pages/')) return;

    const collapseBlocks = () => {
      // Wait a bit for blocks to render
      setTimeout(() => {
        // Find all blocks in the layout field
        const layoutField = document.querySelector('[data-field-name="layout"]');
        if (!layoutField) return;

        // Find all collapsible blocks that are open
        const openBlocks = layoutField.querySelectorAll('.collapsible--is-open');

        openBlocks.forEach((block) => {
          // Find the toggle button and click it to collapse
          const toggleButton = block.querySelector('.collapsible__toggle');
          if (toggleButton instanceof HTMLElement) {
            toggleButton.click();
          }
        });

        // Also handle new blocks that get added
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node instanceof HTMLElement) {
                // Check if a new block was added
                if (
                  node.classList?.contains('blocks-field__row') ||
                  node.querySelector?.('.blocks-field__row')
                ) {
                  setTimeout(() => {
                    const newOpenBlocks = node.querySelectorAll('.collapsible--is-open');
                    newOpenBlocks.forEach((block) => {
                      const toggleButton = block.querySelector('.collapsible__toggle');
                      if (toggleButton instanceof HTMLElement) {
                        toggleButton.click();
                      }
                    });
                  }, 100);
                }
              }
            });
          });
        });

        // Start observing
        if (layoutField) {
          observer.observe(layoutField, {
            childList: true,
            subtree: true,
          });
        }

        // Cleanup
        return () => {
          observer.disconnect();
        };
      }, 500); // Give time for initial render
    };

    // Run on initial load
    collapseBlocks();

    // Also run when navigating between pages
    const handleRouteChange = () => {
      if (pathname?.includes('/admin/collections/pages/')) {
        collapseBlocks();
      }
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [pathname]);

  return null;
}
