'use client';

import VoiceoverRowClick from './VoiceoverRowClick';
import { ErrorBoundary } from './ErrorBoundary';
import { DateCellFormatter } from './DateCellFormatter';
import './admin-overrides.css';
import './styles/date-formatting.css';

export default function AdminEnhancements() {
  return (
    <ErrorBoundary>
      <VoiceoverRowClick />
      <DateCellFormatter />
    </ErrorBoundary>
  );
}
