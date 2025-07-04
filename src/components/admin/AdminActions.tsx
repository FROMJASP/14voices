'use client';

import React from 'react';
import { startTour } from './AdminTours';
import { Map } from 'lucide-react';
import './admin-button.css';

export default function AdminActions() {
  const handleTourClick = () => {
    // Get current path to determine which tour to show
    const path = window.location.pathname;

    // Check for specific collection tours
    if (path.includes('/collections/voiceovers')) {
      startTour('voiceoverTour');
    } else if (path.includes('/collections/pages')) {
      startTour('pageTour');
    } else if (path.includes('/collections/forms')) {
      startTour('formTour');
    } else if (path.includes('/collections/bookings')) {
      startTour('bookingTour');
    }
    // Check for Site Builder collections
    else if (
      path.includes('/collections/layouts') ||
      path.includes('/collections/blocks') ||
      path.includes('/collections/sections')
    ) {
      startTour('siteBuilderTour');
    }
    // Check for email-related collections
    else if (path.includes('/collections/email-')) {
      startTour('emailTour');
    }
    // Default to general tour for dashboard or unknown pages
    else {
      startTour('firstTime');
    }
  };

  return (
    <button onClick={handleTourClick} className="tour-button">
      <span className="tour-button-shimmer" />
      <span className="tour-button-content">
        <Map className="tour-button-icon" />
        <span>Rondleiding</span>
      </span>
    </button>
  );
}
