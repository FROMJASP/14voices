'use client';

import VoiceoverRowClick from './VoiceoverRowClick';
import { ErrorBoundary } from './ErrorBoundary';
import './admin-overrides.css';

export default function AdminEnhancements() {
  return (
    <ErrorBoundary>
      <VoiceoverRowClick />
    </ErrorBoundary>
  );
}
