'use client';

import VoiceoverRowClickSimple from './VoiceoverRowClickSimple';
import { ErrorBoundary } from './ErrorBoundary';
import { DateCellFormatter } from './DateCellFormatter';
// import CollapsePageBlocks from './CollapsePageBlocks';
import './admin-overrides.css';
import './styles/date-formatting.css';

export default function AdminEnhancements() {
  return (
    <ErrorBoundary>
      <VoiceoverRowClickSimple />
      <DateCellFormatter />
      {/* <CollapsePageBlocks /> - Not needed, using initCollapsed: true in field config */}
    </ErrorBoundary>
  );
}
