'use client';

import { AdminTours } from './AdminToursShepherd';
import VoiceoverRowClick from './VoiceoverRowClick';
import { ErrorBoundary } from './ErrorBoundary';
import './admin-overrides.css';

export default function AdminEnhancements() {
  return (
    <ErrorBoundary>
      <AdminTours />
      <VoiceoverRowClick />
    </ErrorBoundary>
  );
}
