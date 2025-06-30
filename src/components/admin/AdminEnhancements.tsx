'use client'

import { AdminTours } from './AdminTours'
import VoiceoverRowClick from './VoiceoverRowClick'
import { DarkModeProvider } from '@/providers/DarkModeProvider'
import './admin-overrides.css'

export default function AdminEnhancements() {
  return (
    <DarkModeProvider>
      <AdminTours />
      <VoiceoverRowClick />
    </DarkModeProvider>
  )
}