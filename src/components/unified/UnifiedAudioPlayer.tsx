'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface UnifiedAudioPlayerProps {
  // Core props
  src?: string;
  value?: string | { url?: string; filename?: string };

  // Display props
  title?: string;
  artist?: string;
  demoType?: string;
  duration?: string;

  // Style variants
  variant?: 'full' | 'compact' | 'minimal' | 'admin';
  className?: string;

  // Control props
  showVolume?: boolean;
  showSeek?: boolean;
  showDuration?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
}

export function UnifiedAudioPlayer({
  src,
  value,
  title,
  artist,
  demoType,
  duration,
  variant = 'full',
  className = '',
  showVolume = true,
  showSeek = true,
  showDuration = true,
  preload = 'metadata',
}: UnifiedAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle different audio source formats
  const audioUrl = src || (value && typeof value === 'object' && value.url) || '';
  const fileName = (value && typeof value === 'object' && value.filename) || title || 'Audio';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setTrackDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const vol = Number(e.target.value);
    audio.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // No audio available
  if (!audioUrl) {
    return (
      <div className={`text-gray-500 ${className}`}>
        {variant === 'admin' ? (
          <div style={{ color: '#999' }}>
            {value && typeof value === 'string' ? `Audio ID: ${value}` : 'No audio selected'}
          </div>
        ) : (
          <span>No audio available</span>
        )}
      </div>
    );
  }

  // Admin variant - simple style
  if (variant === 'admin') {
    return (
      <div
        style={{
          padding: '10px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{fileName}</div>
        <audio
          ref={audioRef}
          controls
          style={{ width: '100%', maxWidth: '400px' }}
          preload={preload}
          onEnded={() => setIsPlaying(false)}
        >
          <source src={audioUrl} />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  // Minimal variant - just play button and title
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          preload={preload}
        />
        <button
          onClick={togglePlayPause}
          className="p-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <span className="text-sm">{fileName}</span>
      </div>
    );
  }

  // Compact variant - demo player style
  if (variant === 'compact') {
    return (
      <div className={`p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors ${className}`}>
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          preload={preload}
        />

        <div className="flex items-center gap-3">
          <button
            onClick={togglePlayPause}
            className="p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors flex-shrink-0"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">{title || fileName}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              {demoType && <span className="capitalize">{demoType}</span>}
              {demoType && duration && <span>•</span>}
              {duration && <span>{duration}</span>}
            </div>
          </div>
        </div>

        {/* Seeker/Progress bar */}
        <div className="mt-2">
          <input
            type="range"
            min={0}
            max={trackDuration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            style={{
              background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(currentTime / (trackDuration || 1)) * 100}%, #e5e7eb ${(currentTime / (trackDuration || 1)) * 100}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(trackDuration)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Full variant - default with all controls
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} preload={preload} />

      {(title || artist) && (
        <div className="mb-3">
          {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
          {artist && <p className="text-sm text-gray-600">{artist}</p>}
        </div>
      )}

      <div className="flex items-center gap-4 mb-3">
        <button
          onClick={togglePlayPause}
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        {showSeek && (
          <div className="flex-1">
            <input
              type="range"
              min={0}
              max={trackDuration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            {showDuration && (
              <div className="flex justify-between mt-1 text-xs text-gray-600">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(trackDuration)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {showVolume && (
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      )}
    </div>
  );
}
