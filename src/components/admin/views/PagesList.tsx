'use client';

import React from 'react';
import { useTranslation } from '@payloadcms/ui';

const dutchMonths = [
  'januari',
  'februari',
  'maart',
  'april',
  'mei',
  'juni',
  'juli',
  'augustus',
  'september',
  'oktober',
  'november',
  'december',
];

function formatDateForDisplay(date: Date, isNL: boolean): string {
  if (isNL) {
    // Dutch format: "14 augustus, 2025 - 14:57"
    const day = date.getDate();
    const month = dutchMonths[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${month}, ${year} - ${hours}:${minutes}`;
  } else {
    // English format: "14 August, 2025 - 14:57" (24-hour format)
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const formatted = date.toLocaleDateString('en-US', options);
    // Transform "August 14, 2025 at 14:57" to "14 August, 2025 - 14:57"
    const parts = formatted.match(/(\w+)\s+(\d+),\s+(\d+)\s+at\s+(\d+:\d+)/);

    if (parts) {
      const [_, month, day, year, time] = parts;
      return `${day} ${month}, ${year} - ${time}`;
    }

    return formatted.replace(' at ', ' - ');
  }
}

export const PagesList: React.FC = () => {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    // Format dates and hide elements
    const updateUI = () => {
      // Hide columns button
      const columnsButton = document.querySelector(
        '[aria-label*="column"], [aria-label*="Column"], [aria-label*="Kolommen"]'
      );
      if (columnsButton) {
        const buttonParent = columnsButton.closest('button');
        if (buttonParent) {
          buttonParent.style.display = 'none';
        }
      }

      // Hide filters button
      const filtersButton = document.querySelector(
        '[aria-label*="filter"], [aria-label*="Filter"]'
      );
      if (filtersButton) {
        const buttonParent = filtersButton.closest('button');
        if (buttonParent) {
          buttonParent.style.display = 'none';
        }
      }

      // Update search placeholder
      const searchInput = document.querySelector(
        'input[type="search"], input[placeholder*="Search"], input[placeholder*="Zoeken"]'
      ) as HTMLInputElement;
      if (searchInput) {
        searchInput.placeholder = i18n.language === 'nl' ? "Zoek pagina's..." : 'Search pages...';
      }

      // Format date cells - try multiple selectors to catch all date cells
      const dateCells = document.querySelectorAll(
        'td[data-col="updatedAt"], td[data-col="createdAt"], td[data-col="publishedDate"], ' +
          'td:has(time), ' + // Any cell containing a time element
          '.cell-updatedAt, .cell-createdAt, .cell-publishedDate' // Class-based selectors
      );

      dateCells.forEach((cell) => {
        // Look for time element or date text patterns
        const timeElement = cell.querySelector('time');
        let dateText = '';
        let dateValue = '';

        if (timeElement) {
          dateValue = timeElement.dateTime || timeElement.getAttribute('datetime') || '';
          dateText = timeElement.textContent || '';
        } else {
          // Try to find date text directly in the cell
          dateText = cell.textContent || '';
        }

        // Check if this looks like a date (contains AM/PM or date pattern)
        if (
          dateText &&
          (dateText.includes('AM') ||
            dateText.includes('PM') ||
            dateText.match(/\d{1,2}\/\d{1,2}\/\d{4}/) ||
            dateText.match(/\d{4}-\d{2}-\d{2}/))
        ) {
          let date: Date;

          if (dateValue) {
            date = new Date(dateValue);
          } else {
            // Try to parse the text content
            date = new Date(dateText);
          }

          if (!isNaN(date.getTime())) {
            const formattedDate = formatDateForDisplay(date, i18n.language === 'nl');

            if (timeElement) {
              timeElement.textContent = formattedDate;
            } else {
              // Replace the entire cell content
              cell.textContent = formattedDate;
            }
          }
        }
      });

      // Also check table headers to identify date columns by header text
      const headers = document.querySelectorAll('th');
      const dateColumnIndices: number[] = [];

      headers.forEach((header, index) => {
        const headerText = header.textContent?.toLowerCase() || '';
        if (
          headerText.includes('aangepast') ||
          headerText.includes('updated') ||
          headerText.includes('created') ||
          headerText.includes('aangemaakt') ||
          headerText.includes('published') ||
          headerText.includes('gepubliceerd')
        ) {
          dateColumnIndices.push(index);
        }
      });

      // Format cells in identified date columns
      if (dateColumnIndices.length > 0) {
        const rows = document.querySelectorAll('tbody tr');
        rows.forEach((row) => {
          const cells = row.querySelectorAll('td');
          dateColumnIndices.forEach((colIndex) => {
            if (cells[colIndex]) {
              const cell = cells[colIndex];
              const cellText = cell.textContent || '';

              if (
                cellText &&
                (cellText.includes('AM') || cellText.includes('PM') || cellText.match(/\d/))
              ) {
                const date = new Date(cellText);
                if (!isNaN(date.getTime())) {
                  const formattedDate = formatDateForDisplay(date, i18n.language === 'nl');
                  cell.textContent = formattedDate;
                }
              }
            }
          });
        });
      }
    };

    // Run immediately
    updateUI();

    // Run multiple times with different delays to catch various render timings
    const timeouts = [
      setTimeout(updateUI, 100),
      setTimeout(updateUI, 250),
      setTimeout(updateUI, 500),
      setTimeout(updateUI, 1000),
    ];

    // Also run on any DOM changes with debouncing
    let debounceTimer: NodeJS.Timeout;
    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updateUI, 50);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['data-col', 'class'],
    });

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, [i18n.language]);

  return null;
};

PagesList.displayName = 'PagesList';
