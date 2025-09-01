'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
    const day = date.getDate();
    const month = dutchMonths[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${month}, ${year} - ${hours}:${minutes}`;
  } else {
    const day = date.getDate();
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${month}, ${year} - ${hours}:${minutes}`;
  }
}

interface DatePortalProps {
  container: Element;
  date: Date;
  isNL: boolean;
}

const DatePortal: React.FC<DatePortalProps> = ({ container, date, isNL }) => {
  const formatted = formatDateForDisplay(date, isNL);

  return createPortal(<span className="date-formatted">{formatted}</span>, container);
};

export const DateCellFormatter: React.FC = () => {
  const { i18n } = useTranslation();
  const [dateContainers, setDateContainers] = useState<Array<{ container: Element; date: Date }>>(
    []
  );

  useEffect(() => {
    const findAndFormatDates = () => {
      const containers: Array<{ container: Element; date: Date }> = [];

      // Find all table cells that might contain dates
      const cells = document.querySelectorAll('td');

      cells.forEach((cell) => {
        // Skip if already formatted
        if (cell.querySelector('.date-formatted')) {
          return;
        }

        // Check if this cell contains a time element or looks like a date
        const timeElement = cell.querySelector('time[datetime]');
        let dateValue: string | null = null;

        if (timeElement) {
          dateValue = timeElement.getAttribute('datetime');
        } else {
          // Check if the cell text looks like a date
          const text = cell.textContent?.trim() || '';
          if (text.match(/\d{4}-\d{2}-\d{2}|AM|PM|\d{1,2}\/\d{1,2}\/\d{4}/)) {
            dateValue = text;
          }
        }

        if (dateValue) {
          const date = new Date(dateValue);
          if (!isNaN(date.getTime())) {
            // Clear the cell content
            cell.textContent = '';
            containers.push({ container: cell, date });
          }
        }
      });

      setDateContainers(containers);
    };

    // Initial format
    const initialTimeout = setTimeout(findAndFormatDates, 100);

    // Set up observer
    const observer = new MutationObserver(() => {
      setTimeout(findAndFormatDates, 50);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Also run on various intervals to catch different render timings
    const intervals = [
      setTimeout(findAndFormatDates, 250),
      setTimeout(findAndFormatDates, 500),
      setTimeout(findAndFormatDates, 1000),
      setTimeout(findAndFormatDates, 2000),
    ];

    return () => {
      clearTimeout(initialTimeout);
      intervals.forEach(clearTimeout);
      observer.disconnect();
    };
  }, [i18n.language]);

  return (
    <>
      {dateContainers.map((item, index) => (
        <DatePortal
          key={`${index}-${item.date.getTime()}`}
          container={item.container}
          date={item.date}
          isNL={i18n.language === 'nl'}
        />
      ))}
    </>
  );
};
