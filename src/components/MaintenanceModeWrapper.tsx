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
        const response = await fetch('/api/site-settings')
        if (response.ok) {
          const data = await response.json()
          const maintenanceEnabled = data?.features?.maintenanceMode || false
          
          setIsMaintenanceMode(maintenanceEnabled)
          setMaintenanceData(data)
        }
      } catch (error) {
        console.error('Failed to check maintenance mode:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkMaintenanceMode()
  }, [forceMaintenanceMode])

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