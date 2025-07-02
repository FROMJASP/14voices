'use client'

import { useEffect, useState } from 'react'
import { MaintenanceMode } from './MaintenanceMode'

interface MaintenanceModeWrapperProps {
  children: React.ReactNode
  forceMaintenanceMode?: boolean
}

export function MaintenanceModeWrapper({ children, forceMaintenanceMode = false }: MaintenanceModeWrapperProps) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [maintenanceData, setMaintenanceData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkMaintenanceMode() {
      if (forceMaintenanceMode) {
        setIsMaintenanceMode(true)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/site-settings', {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (response.ok) {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json()
            const maintenanceEnabled = data?.features?.maintenanceMode || false
            
            setIsMaintenanceMode(maintenanceEnabled)
            setMaintenanceData(data)
          } else {
            console.error('Response is not JSON:', contentType)
          }
        }
      } catch (error) {
        console.error('Failed to check maintenance mode:', error)
        // Log more details about the error
        if (error instanceof Error) {
          console.error('Error details:', error.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkMaintenanceMode()
  }, [forceMaintenanceMode])

  // Don't render anything on server during initial load
  // This prevents hydration mismatches
  if (isLoading) {
    return null
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
    )
  }

  return <>{children}</>
}