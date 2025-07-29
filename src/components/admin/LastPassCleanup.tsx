'use client';

import { useEffect, useRef } from 'react';

export default function LastPassCleanup() {
  const removedNodesRef = useRef<WeakSet<Node>>(new WeakSet());
  const observerRef = useRef<MutationObserver | null>(null);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isActive = true;

    // Debounced cleanup function to batch removals
    const scheduleCleanup = () => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }

      cleanupTimeoutRef.current = setTimeout(() => {
        if (!isActive) return;

        const elementsToRemove = document.querySelectorAll('[data-lastpass-icon-root]');
        elementsToRemove.forEach((element) => {
          // Check if we've already processed this node
          if (removedNodesRef.current.has(element)) return;

          try {
            // Mark as processed before removal to prevent re-processing
            removedNodesRef.current.add(element);

            // Hide element immediately to prevent visual glitches
            if (element instanceof HTMLElement) {
              element.style.display = 'none';
              element.style.visibility = 'hidden';
            }

            // Schedule actual removal on next frame
            requestAnimationFrame(() => {
              if (!isActive) return;

              try {
                // Double-check the element still exists and has a parent
                if (element.parentNode && document.contains(element)) {
                  element.parentNode.removeChild(element);
                }
              } catch {
                // Silently ignore - element might have been removed by React
              }
            });
          } catch {
            // Silently ignore any errors
          }
        });
      }, 100); // Debounce for 100ms
    };

    // Create observer with error boundary
    try {
      observerRef.current = new MutationObserver((mutations) => {
        if (!isActive) return;

        let hasLastPassElements = false;

        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (const node of mutation.addedNodes) {
              if (
                node.nodeType === Node.ELEMENT_NODE &&
                (node as Element).hasAttribute?.('data-lastpass-icon-root')
              ) {
                hasLastPassElements = true;
                break;
              }
            }
          }
          if (hasLastPassElements) break;
        }

        if (hasLastPassElements) {
          scheduleCleanup();
        }
      });

      // Start observing with a more specific config
      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false, // Don't observe attribute changes
        characterData: false, // Don't observe text changes
      });

      // Initial cleanup
      scheduleCleanup();
    } catch (error) {
      console.warn('LastPass cleanup initialization error:', error);
    }

    // Cleanup function
    return () => {
      isActive = false;

      // Clear any pending timeouts
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }

      // Disconnect observer
      if (observerRef.current) {
        try {
          observerRef.current.disconnect();
        } catch {}
      }

      // Clear references
      removedNodesRef.current = new WeakSet();
    };
  }, []);

  return null;
}
