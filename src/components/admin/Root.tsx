'use client'

import React from 'react'
import { DynamicFavicon } from './DynamicFavicon'

const Root: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <DynamicFavicon />
      {children}
    </>
  )
}

export default Root