'use client';

import React from 'react';

export default function Icon() {
  // For the breadcrumb icon, we'll use a home icon
  // This is more intuitive and universally understood
  return (
    <div
      style={{
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--theme-text)',
        flexShrink: 0,
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <path
          d="M8 1.5L2 6.5V13.5C2 13.7761 2.22386 14 2.5 14H6V10H10V14H13.5C13.7761 14 14 13.7761 14 13.5V6.5L8 1.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
