'use client';

import { UnifiedAudioPlayer } from './unified/UnifiedAudioPlayer';

interface AudioPlayerProps {
  src: string;
  title?: string;
  variant?: 'admin' | 'full' | 'minimal' | 'compact';
}

export function AudioPlayer({ src, title, variant = 'full' }: AudioPlayerProps) {
  return <UnifiedAudioPlayer src={src} title={title} variant={variant} />;
}
