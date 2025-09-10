'use client';

import React, { useEffect, useState } from 'react';
import type { DefaultCellComponentProps } from 'payload';

export const OrderCell: React.FC<DefaultCellComponentProps> = ({ cellData, rowData }) => {
  const [displayOrder, setDisplayOrder] = useState<number>(1);

  useEffect(() => {
    // Get all FAQ items from the table to calculate position
    const calculatePosition = () => {
      // Find all rows in the current table
      const allRows = document.querySelectorAll('tbody tr');
      let position = 1;

      // Find the position of the current row
      allRows.forEach((row, index) => {
        // Check if this row contains our data
        const cells = row.querySelectorAll('td');
        const hasOurId = Array.from(cells).some((cell) => cell.textContent?.includes(rowData.id));

        if (hasOurId) {
          position = index + 1;
        }
      });

      setDisplayOrder(position);
    };

    // Calculate position after a short delay to ensure DOM is ready
    const timer = setTimeout(calculatePosition, 50);

    return () => clearTimeout(timer);
  }, [rowData.id, cellData]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
      }}
    >
      <span>{displayOrder}</span>
    </div>
  );
};
