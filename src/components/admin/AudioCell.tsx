'use client';

import React, { useState, useRef, useEffect } from 'react';

interface AudioCellData {
  url?: string;
  filename?: string;
}

export const AudioCell: React.FC<{ rowData: AudioCellData }> = ({ rowData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [rowData?.url]);

  if (!rowData?.url) {
    return <span style={{ color: '#999', fontSize: '12px' }}>No audio</span>;
  }

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        minWidth: '280px',
        padding: '4px 0',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={togglePlay}
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: isPlaying ? '#1db954' : '#666',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          transition: 'all 0.2s',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1db954';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isPlaying ? '#1db954' : '#666';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      <audio ref={audioRef} src={rowData.url} preload="none" />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
          }}
        >
          <span
            style={{
              color: '#333',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            {rowData.filename || 'Audio file'}
          </span>
          <span
            style={{
              color: '#666',
              fontSize: '11px',
              flexShrink: 0,
            }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div
          style={{
            position: 'relative',
            height: '4px',
            backgroundColor: '#e0e0e0',
            borderRadius: '2px',
            cursor: 'pointer',
            marginTop: '2px',
          }}
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = x / rect.width;
            const newTime = percentage * duration;

            if (audioRef.current) {
              audioRef.current.currentTime = newTime;
              setCurrentTime(newTime);

              // Auto-play when clicking on progress bar
              if (!isPlaying) {
                audioRef.current.play();
                setIsPlaying(true);
              }
            }
          }}
        >
          <div
            style={{
              position: 'absolute',
              height: '100%',
              width: `${progressPercentage}%`,
              backgroundColor: '#1db954',
              transition: 'width 0.1s',
              borderRadius: '2px',
            }}
          />

          {/* Playhead */}
          <div
            style={{
              position: 'absolute',
              left: `${progressPercentage}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '10px',
              height: '10px',
              backgroundColor: '#fff',
              border: '2px solid #1db954',
              borderRadius: '50%',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              transition: 'left 0.1s',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioCell;
