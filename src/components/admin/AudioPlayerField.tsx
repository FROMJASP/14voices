'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDocumentInfo } from '@payloadcms/ui';

export const AudioPlayerField: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get document info to access the saved data
  const { initialData } = useDocumentInfo();

  // For upload collections, the URL and filename are at the root level
  const audioUrl = initialData?.url || '';
  const filename = initialData?.filename || '';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };
    const handleEnded = () => setIsPlaying(false);
    const handleCanPlay = () => setIsLoaded(true);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);

    // Try to load metadata
    audio.load();

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioUrl]);

  const togglePlayPause = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsPlaying(false);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current || !duration || !isLoaded) return;

    // Get the click position relative to the progress bar
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const barWidth = rect.width;

    // Calculate percentage and clamp between 0 and 1
    const percentage = Math.max(0, Math.min(1, clickX / barWidth));
    const newTime = percentage * duration;

    // Set the new time
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);

    // Auto-play when clicking on progress bar
    if (!isPlaying && !isDragging) {
      // Clear any existing timeout
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }

      // Small delay to ensure currentTime is set before playing
      playTimeoutRef.current = setTimeout(async () => {
        try {
          await audioRef.current?.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Audio playback error:', error);
        }
        playTimeoutRef.current = null;
      }, 10);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleProgressClick(e);
    }
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };
      document.addEventListener('mouseup', handleGlobalMouseUp);
      return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isDragging]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    };
  }, []);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!audioUrl) {
    return (
      <div
        style={{
          padding: '16px',
          color: '#999',
          textAlign: 'center',
          border: '1px dashed #e0e0e0',
          borderRadius: '8px',
          backgroundColor: '#fafafa',
        }}
      >
        No audio file available
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <h4
        style={{
          margin: '0 0 12px 0',
          fontSize: '14px',
          fontWeight: '600',
          color: '#333',
        }}
      >
        Audio Preview{' '}
        {!isLoaded && <span style={{ color: '#999', fontWeight: 'normal' }}>(Loading...)</span>}
      </h4>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
        }}
      >
        <button
          type="button"
          onClick={togglePlayPause}
          disabled={!isLoaded}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: isLoaded ? (isHovered ? '#1ed760' : '#1db954') : '#ccc',
            transform: isHovered && isLoaded ? 'scale(1.05)' : 'scale(1)',
            color: 'white',
            cursor: isLoaded ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            transition: 'transform 0.1s, background-color 0.2s',
            flexShrink: 0,
            opacity: isLoaded ? 1 : 0.6,
          }}
          onMouseDown={(e) => e.preventDefault()}
          onMouseEnter={() => isLoaded && setIsHovered(true)}
          onMouseLeave={() => isLoaded && setIsHovered(false)}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <div
            ref={progressBarRef}
            style={{
              position: 'relative',
              height: '32px',
              cursor: isLoaded ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseDown={isLoaded ? handleMouseDown : undefined}
            onMouseMove={isLoaded ? handleMouseMove : undefined}
          >
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '4px',
                backgroundColor: '#e0e0e0',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: `${progressPercentage}%`,
                  backgroundColor: '#1db954',
                  transition: isDragging ? 'none' : 'width 0.1s',
                }}
              />
            </div>

            <div
              style={{
                position: 'absolute',
                left: `${progressPercentage}%`,
                width: '12px',
                height: '12px',
                backgroundColor: '#1db954',
                borderRadius: '50%',
                marginLeft: '-6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: isDragging ? 'none' : 'left 0.1s',
                cursor: 'grab',
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#666',
              userSelect: 'none',
            }}
          >
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {filename && (
        <div
          style={{
            fontSize: '12px',
            color: '#666',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {filename}
        </div>
      )}
    </div>
  );
};

export default AudioPlayerField;
