'use client'

import React from 'react'
import { startTour } from './AdminTours'

export default function AdminActions() {
  const handleTourClick = () => {
    // Get current path to determine which tour to show
    const path = window.location.pathname
    
    // Check for specific collection tours
    if (path.includes('/collections/voiceovers')) {
      startTour('voiceoverTour')
    } else if (path.includes('/collections/pages')) {
      startTour('pageTour')
    } else if (path.includes('/collections/forms')) {
      startTour('formTour')
    } else if (path.includes('/collections/bookings')) {
      startTour('bookingTour')
    } 
    // Check for Site Builder collections
    else if (path.includes('/collections/layouts') || 
             path.includes('/collections/blocks') || 
             path.includes('/collections/sections')) {
      startTour('siteBuilderTour')
    }
    // Check for email-related collections
    else if (path.includes('/collections/email-')) {
      startTour('emailTour')
    }
    // Default to general tour for dashboard or unknown pages
    else {
      startTour('firstTime')
    }
  }

  return (
    <button
      onClick={handleTourClick}
      className="payload-btn payload-btn--style-secondary payload-btn--size-small"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      <svg 
        style={{
          width: '1rem',
          height: '1rem',
        }}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      Rondleiding
    </button>
  )
}