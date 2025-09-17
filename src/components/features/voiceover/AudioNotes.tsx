'use client';

import { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ReactMediaRecorder } from 'react-media-recorder';
import { Upload, Mic, Square, Play, Pause, X, FileAudio, AlertCircle } from 'lucide-react';
// Label import removed - not used
import { motion, AnimatePresence } from 'framer-motion';
// Removed SimpleEditor import - using native textarea instead

interface AudioNotesProps {
  textValue: string;
  onTextChange: (value: string) => void;
  audioFile: File | null;
  onAudioFileChange: (file: File | null) => void;
  placeholder?: string;
}

export function AudioNotes({
  textValue,
  onTextChange,
  audioFile,
  onAudioFileChange,
  placeholder = 'Wil je bijvoorbeeld dat het rustig wordt ingesproken of zijn er woorden die op een bepaalde manier uitgesproken moeten worden?',
}: AudioNotesProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // File upload configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/mp4': ['.m4a'],
      'audio/ogg': ['.ogg'],
      'audio/wav': ['.wav'],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB max
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Check audio duration
        const audioUrl = URL.createObjectURL(file);
        const audio = new Audio(audioUrl);

        audio.addEventListener('loadedmetadata', () => {
          if (audio.duration > 180) {
            // 3 minutes = 180 seconds
            alert('Het audiobestand mag maximaal 3 minuten lang zijn.');
            URL.revokeObjectURL(audioUrl);
          } else {
            onAudioFileChange(file);
            setRecordedAudioUrl(null); // Clear any recorded audio
            setAudioDuration(audio.duration);
          }
        });
      }
    },
  });

  // Handle play/pause
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Clean up audio URL on unmount
  useEffect(() => {
    return () => {
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
    };
  }, [recordedAudioUrl]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentAudioUrl = audioFile ? URL.createObjectURL(audioFile) : recordedAudioUrl;

  return (
    <div className="space-y-4">
      {/* Text input with native textarea */}
      <div className="relative">
        <textarea
          value={textValue}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[120px] w-full rounded-md bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all resize-none"
          style={{
            userSelect: 'text',
            WebkitUserSelect: 'text',
            MozUserSelect: 'text',
            msUserSelect: 'text',
          }}
        />
      </div>

      {/* Audio section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileAudio className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Audio referentie (optioneel)</span>
        </div>

        {/* Current audio display */}
        {currentAudioUrl && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-muted/30 rounded-lg p-4 flex items-center gap-3"
          >
            <button
              onClick={handlePlayPause}
              className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-primary" />
              ) : (
                <Play className="w-5 h-5 text-primary ml-0.5" />
              )}
            </button>

            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {audioFile ? audioFile.name : 'Opgenomen audio'}
              </p>
              <p className="text-xs text-muted-foreground">Duur: {formatDuration(audioDuration)}</p>
            </div>

            <button
              onClick={() => {
                onAudioFileChange(null);
                setRecordedAudioUrl(null);
                setIsPlaying(false);
              }}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <audio
              ref={audioRef}
              src={currentAudioUrl}
              onEnded={() => setIsPlaying(false)}
              onLoadedMetadata={(e) => {
                setAudioDuration(e.currentTarget.duration);
              }}
            />
          </motion.div>
        )}

        {/* Compact Upload and Record Options */}
        {!currentAudioUrl && (
          <div className="flex items-center gap-3">
            {/* File upload button */}
            <div
              {...getRootProps()}
              className={`flex-1 flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-border/60 hover:bg-muted/30'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-4 h-4 text-muted-foreground" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Upload audiobestand</p>
                <p className="text-xs text-muted-foreground">MP3, M4A, OGG (max. 3 min)</p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">of</div>

            {/* Audio recording button */}
            <ReactMediaRecorder
              audio
              mediaRecorderOptions={{
                mimeType: 'audio/webm;codecs=opus',
              }}
              onStop={async (blobUrl, blob) => {
                setRecordedAudioUrl(blobUrl);
                // Convert to a more compatible format
                const file = new File([blob], 'recording.webm', {
                  type: blob.type || 'audio/webm',
                });
                onAudioFileChange(file);
              }}
              render={({ status, startRecording, stopRecording, error }) => {
                const recordingActive = status === 'recording';
                if (recordingActive !== isRecording) {
                  setIsRecording(recordingActive);
                }

                // Check for MediaRecorder support
                if (error || (typeof window !== 'undefined' && !window.MediaRecorder)) {
                  return (
                    <div className="flex-1 border border-dashed border-border rounded-lg px-4 py-3 opacity-50">
                      <div className="flex items-center gap-3">
                        <Mic className="w-4 h-4 text-muted-foreground" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-muted-foreground">
                            Opnemen niet beschikbaar
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Browser ondersteunt geen audio opname
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    type="button"
                    onClick={async () => {
                      if (status === 'recording') {
                        stopRecording();
                      } else {
                        try {
                          // Request microphone permission explicitly
                          await navigator.mediaDevices.getUserMedia({ audio: true });
                          startRecording();
                        } catch (err) {
                          console.error('Microphone access denied:', err);
                          alert(
                            'Microfoon toegang is vereist om audio op te nemen. Controleer je browser instellingen.'
                          );
                        }
                      }
                    }}
                    className={`flex-1 flex items-center gap-3 border rounded-lg px-4 py-3 transition-all ${
                      status === 'recording'
                        ? 'border-red-500 bg-red-500/5 animate-pulse'
                        : 'border-border hover:border-border/60 hover:bg-muted/30'
                    }`}
                  >
                    {status === 'recording' ? (
                      <>
                        <Square className="w-4 h-4 text-red-500 animate-pulse" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">Stop opname</p>
                          <p className="text-xs text-red-500">Opnemen...</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 text-muted-foreground" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">Neem op</p>
                          <p className="text-xs text-muted-foreground">Spreek je instructies in</p>
                        </div>
                      </>
                    )}
                  </button>
                );
              }}
            />
          </div>
        )}

        {/* Max duration warning */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400"
            >
              <AlertCircle className="w-3 h-3" />
              <span>Maximale opnameduur: 3 minuten</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
