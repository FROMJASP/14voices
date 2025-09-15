// Main grid system components
export { MobileFirstVoiceoverGrid } from './MobileFirstVoiceoverGrid';
export { OptimizedVoiceoverGrid } from './OptimizedVoiceoverGrid';

// Detail page component
export { VoiceoverDetailClient } from './VoiceoverDetailClient';

// Audio player components
export { SmartAudioPlayer } from './SmartAudioPlayer';
export { ProfessionalAudioPlayer } from './ProfessionalAudioPlayer';
export { SimpleDemoPlayer } from './SimpleDemoPlayer';
export { CompactDemoPlayer } from './CompactDemoPlayer';
export { VoiceoverPlayerCard } from './VoiceoverPlayerCard';

// Extra options component
export { ExtraOptions } from './ExtraOptions';
export type { ProductionType, ExtraOption } from './ExtraOptions';
export { EXTRA_OPTIONS_CONFIG } from './ExtraOptions';

// Script editor and audio notes
export { ScriptEditor } from './ScriptEditor';
export { SimpleScriptEditor } from './SimpleScriptEditor';
// AudioNotes is only imported dynamically to avoid SSR issues with Web Audio API

// Types - keep only what might be needed
export type { TransformedVoiceover } from '@/types/voiceover';
