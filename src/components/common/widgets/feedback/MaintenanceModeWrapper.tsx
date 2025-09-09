'use client';

import { useEffect, useState } from 'react';
import { MaintenanceMode } from './MaintenanceMode';

interface MaintenanceModeWrapperProps {
  children: React.ReactNode;
  forceMaintenanceMode?: boolean;
}

export function MaintenanceModeWrapper({
  children,
  forceMaintenanceMode = false,
}: MaintenanceModeWrapperProps) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceData, setMaintenanceData] = useState<{
    title?: string;
    message?: string;
    expectedDuration?: string;
    showContactInfo?: boolean;
    features?: {
      maintenanceTitle?: string;
      maintenanceMessage?: string;
      maintenanceContactLabel?: string;
      showContactEmail?: boolean;
    };
    contact?: {
      email?: string;
    };
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkMaintenanceMode() {
      if (forceMaintenanceMode) {
        setIsMaintenanceMode(true);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/site-settings', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            const maintenanceEnabled = data?.features?.maintenanceMode || false;

            setIsMaintenanceMode(maintenanceEnabled);
            setMaintenanceData(data);
          } else {
            console.error('Response is not JSON:', contentType);
          }
        } else {
          console.error('Site settings API returned error:', response.status);
        }
      } catch (error) {
        console.error('Failed to check maintenance mode:', error);
        // Log more details about the error
        if (error instanceof Error) {
          console.error('Error details:', error.message);
        }
        // Continue showing the site even if maintenance check fails
        // Set default state when API fails
        setIsMaintenanceMode(false);
        setMaintenanceData({});
      } finally {
        setIsLoading(false);
      }
    }

    checkMaintenanceMode();
  }, [forceMaintenanceMode]);

  // Show children while loading to prevent blank page
  // Maintenance mode check happens in the background
  if (isLoading) {
    return <>{children}</>;
  }

  if (isMaintenanceMode) {
    return (
      <MaintenanceMode
        title={maintenanceData?.features?.maintenanceTitle}
        message={maintenanceData?.features?.maintenanceMessage}
        contactLabel={maintenanceData?.features?.maintenanceContactLabel}
        contactEmail={maintenanceData?.contact?.email}
        showContactEmail={maintenanceData?.features?.showContactEmail}
      />
    );
  }

  return <>{children}</>;
}
