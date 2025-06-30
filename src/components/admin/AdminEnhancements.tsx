'use client'

import { AdminTours } from './AdminTours'
import VoiceoverRowClick from './VoiceoverRowClick'
import './admin-overrides.css'

export default function AdminEnhancements() {
  return (
    <>
      <AdminTours />
      <VoiceoverRowClick />
    </>
  )
}