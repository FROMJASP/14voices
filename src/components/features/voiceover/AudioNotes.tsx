'use client';

import { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ReactMediaRecorder } from 'react-media-recorder';
import { Upload, Mic, Square, Play, Pause, X, FileAudio, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/Label';
import { motion, AnimatePresence } from 'framer-motion';
import { SimpleEditor } from '@/components/ui/kibo-ui/editor';

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
      <Label className="text-sm font-medium text-foreground">4. Instructies (optioneel)</Label>

      {/* Text input with TipTap editor */}
      <div>
        <SimpleEditor content={textValue} onChange={onTextChange} placeholder={placeholder} />
        <p className="text-xs text-muted-foreground mt-2">
          Je kunt hier instructies typen en/of een audiobestand uploaden met aanwijzingen
        </p>
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

        {/* Upload and record options */}
        {!currentAudioUrl && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* File upload */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-border/60 hover:bg-muted/30'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Upload audiobestand</p>
              <p className="text-xs text-muted-foreground mt-1">MP3, M4A, OGG (max. 3 min)</p>
            </div>

            {/* Audio recording */}
            <ReactMediaRecorder
              audio
              onStop={(blobUrl, blob) => {
                setRecordedAudioUrl(blobUrl);
                const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
                onAudioFileChange(file);
              }}
              render={({ status, startRecording, stopRecording }) => {
                const recordingActive = status === 'recording';
                if (recordingActive !== isRecording) {
                  setIsRecording(recordingActive);
                }

                return (
                  <button
                    onClick={() => {
                      if (status === 'recording') {
                        stopRecording();
                      } else {
                        startRecording();
                      }
                    }}
                    className={`border-2 rounded-lg p-6 transition-all ${
                      status === 'recording'
                        ? 'border-red-500 bg-red-500/5 animate-pulse'
                        : 'border-border hover:border-border/60 hover:bg-muted/30'
                    }`}
                  >
                    {status === 'recording' ? (
                      <>
                        <Square className="w-8 h-8 mx-auto mb-2 text-red-500" />
                        <p className="text-sm font-medium text-foreground">Stop opname</p>
                        <p className="text-xs text-red-500 mt-1">Opnemen...</p>
                      </>
                    ) : (
                      <>
                        <Mic className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">Neem op</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Spreek je instructies in
                        </p>
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
