'use client';

import React, { useEffect } from 'react';

export const MediaThumbnailFix: React.FC = () => {
  useEffect(() => {
    // Wait for DOM to be ready
    const fixThumbnails = () => {
      // Find all media thumbnail containers in the admin panel
      const thumbnailContainers = document.querySelectorAll('.collection-list__cell-thumbnail');

      thumbnailContainers.forEach((container) => {
        const img = container.querySelector('img');
        if (img) {
          const currentSrc = img.src;

          // Check if the image src is using the wrong pattern
          if (currentSrc.includes('/api/media/file/')) {
            // Extract filename from the current src
            const filenameMatch = currentSrc.match(/\/api\/media\/file\/(.+)/);
            if (filenameMatch && filenameMatch[1]) {
              const filename = filenameMatch[1];

              // Construct the correct S3 URL
              const correctUrl = `https://storage.iam-studios.com/fourteenvoices-media/media/${filename}`;

              console.log('[MediaThumbnailFix] Fixing thumbnail:', {
                old: currentSrc,
                new: correctUrl,
              });

              // Update the image src
              img.src = correctUrl;

              // Add error handling
              img.onerror = () => {
                console.error('[MediaThumbnailFix] Failed to load:', correctUrl);
                // Try without the thumbnail suffix if it fails
                const baseFilename = filename.replace(
                  /-thumbnail\.(jpg|jpeg|png|gif|webp)$/i,
                  '.$1'
                );
                const fallbackUrl = `https://storage.iam-studios.com/fourteenvoices-media/media/${baseFilename}`;
                img.src = fallbackUrl;
              };
            }
          }
        }
      });
    };

    // Run immediately
    fixThumbnails();

    // Set up a MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver((mutations) => {
      const hasNewThumbnails = mutations.some((mutation) =>
        Array.from(mutation.addedNodes).some(
          (node: any) =>
            node.nodeType === 1 &&
            (node.classList?.contains('collection-list__cell-thumbnail') ||
              node.querySelector?.('.collection-list__cell-thumbnail'))
        )
      );

      if (hasNewThumbnails) {
        setTimeout(fixThumbnails, 100); // Small delay to ensure DOM is ready
      }
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
};

export default MediaThumbnailFix;
