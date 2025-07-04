'use client';

import { AdminTours } from './AdminToursShepherd';
import VoiceoverRowClick from './VoiceoverRowClick';
import { DarkModeProvider } from '@/providers/DarkModeProvider';
import { ErrorBoundary } from './ErrorBoundary';
import './admin-overrides.css';

export default function AdminEnhancements() {
  return (
    <ErrorBoundary>
      <DarkModeProvider>
        <AdminTours />
        <VoiceoverRowClick />
      </DarkModeProvider>
    </ErrorBoundary>
  );
}
