'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function VoiceoverRowClickSimple() {
  const router = useRouter();

  const handleRowClick = useCallback(
    (e: Event) => {
      const target = e.target as HTMLElement;
      const row = target.closest('.collection-list__list-item[data-collection="voiceovers"]');
      if (!row) return;

      // Don't navigate if clicking on interactive elements
      const isInteractive =
        target.tagName === 'INPUT' ||
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('[role="button"]');

      if (isInteractive) {
        return;
      }

      // Get the row ID
      const rowId =
        row.getAttribute('data-id') ||
        row.querySelector('input[type="checkbox"]')?.getAttribute('value') ||
        row
          .querySelector('[href*="/admin/collections/voiceovers/"]')
          ?.getAttribute('href')
          ?.split('/')
          .pop();

      if (rowId && rowId !== 'create') {
        // Add visual feedback
        row.classList.add('navigating');

        // Navigate
        setTimeout(() => {
          router.push(`/admin/collections/voiceovers/${rowId}`);
        }, 100);
      }
    },
    [router]
  );

  useEffect(() => {
    const setupListener = () => {
      const tableContainer = document.querySelector('.collection-list');

      if (!tableContainer) {
        const retryTimeout = setTimeout(setupListener, 500);
        return () => clearTimeout(retryTimeout);
      }

      // Add event listener (styles are now in CSS)
      tableContainer.addEventListener('click', handleRowClick, {
        passive: true,
      });

      return () => {
        tableContainer.removeEventListener('click', handleRowClick);
      };
    };

    const cleanup = setupListener();
    return cleanup;
  }, [handleRowClick]);

  return null;
}
