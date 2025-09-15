'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Download,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { VoiceoverDemo } from '@/types/voiceover';
import { cn } from '@/lib/utils';

// UI components
import { Button } from '@/components/common/ui';
import { Slider } from '@/components/ui/Slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

interface ProfessionalAudioPlayerProps {
  demos: VoiceoverDemo[];
  artistName: string;
  onDownload?: (audioUrl: string, title: string) => void;
  className?: string;
}

export function ProfessionalAudioPlayer({
  demos,
  artistName,
  onDownload,
  className = '',
}: ProfessionalAudioPlayerProps) {
  // State management
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastVolumeRef = useRef(1);

  const currentDemo = demos[currentDemoIndex];

  // Animation frame for smooth progress updates
  const whilePlaying = useCallback(() => {
    if (audioRef.current && !isDragging) {
      setCurrentTime(audioRef.current.currentTime);
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  }, [isDragging]);

  // Reset when demo changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [currentDemoIndex]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentDemo) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      animationRef.current = requestAnimationFrame(whilePlaying);
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Auto-advance to next demo if available
      if (currentDemoIndex < demos.length - 1) {
        setTimeout(() => {
          setCurrentDemoIndex((prev) => prev + 1);
        }, 500);
      }
    };

    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    // Set initial volume
    audio.volume = volume;
    audio.muted = isMuted;

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [whilePlaying, currentDemo, currentDemoIndex, demos.length, volume, isMuted, isDragging]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't interfere if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekBackward();
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekForward();
          break;
        case 'ArrowUp':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowDown':
          e.preventDefault();
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Control functions
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
  };

  const handleProgressChange = (values: number[]) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const newTime = (values[0] / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressStart = () => {
    setIsDragging(true);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleProgressEnd = () => {
    setIsDragging(false);
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0] / 100;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      audioRef.current.muted = newVolume === 0;
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      const newVolume = lastVolumeRef.current;
      setVolume(newVolume);
      setIsMuted(false);
      audio.volume = newVolume;
      audio.muted = false;
    } else {
      lastVolumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
      audio.volume = 0;
      audio.muted = true;
    }
  };

  const goToPrevious = () => {
    if (currentDemoIndex > 0) {
      setCurrentDemoIndex((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentDemoIndex < demos.length - 1) {
      setCurrentDemoIndex((prev) => prev + 1);
    }
  };

  const seekBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  };

  const seekForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(duration, audio.currentTime + 10);
  };

  const selectDemo = (index: number) => {
    setCurrentDemoIndex(index);
  };

  const handleDownload = () => {
    if (onDownload && currentDemo) {
      onDownload(currentDemo.audioFile.url, currentDemo.title);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!demos.length) {
    return (
      <div className={cn('text-center py-6', className)}>
        <p className="text-sm text-muted-foreground">No demos available</p>
      </div>
    );
  }

  return (
    <div className={cn('font-sans bg-background', className)}>
      <audio
        ref={audioRef}
        src={currentDemo.audioFile.url}
        preload="metadata"
        key={currentDemo.id}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-border rounded-lg bg-background shadow-lg overflow-hidden"
      >
        {/* Header with Demo Info */}
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {currentDemo.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {artistName} • Demo {currentDemoIndex + 1} of {demos.length}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              {onDownload && (
                <Button variant="outline" size="sm" onClick={handleDownload} className="h-8 px-3">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Player Controls */}
        <div className="px-6 py-6">
          {/* Progress Bar */}
          <div className="space-y-2 mb-6">
            <div className="relative">
              <Slider
                value={[progress]}
                onValueChange={handleProgressChange}
                onPointerDown={handleProgressStart}
                onPointerUp={handleProgressEnd}
                max={100}
                step={0.1}
                className={cn(
                  'w-full',
                  '[&_[role=slider]]:h-4 [&_[role=slider]]:w-4',
                  '[&_[role=slider]]:border-2 [&_[role=slider]]:border-background',
                  '[&>span:first-child]:h-2 [&>span:first-child]:bg-muted',
                  '[&_[data-orientation=horizontal]]:h-2'
                )}
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            {/* Navigation Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                disabled={currentDemoIndex === 0}
                className="h-10 w-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={seekBackward}
                className="h-10 w-10"
                title="Seek backward 10s"
              >
                <SkipBack className="w-4 h-4" />
              </Button>

              {/* Main Play/Pause Button */}
              <Button
                variant="primary"
                size="icon"
                onClick={togglePlayPause}
                disabled={isLoading}
                className="h-12 w-12 rounded-full"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={seekForward}
                className="h-10 w-10"
                title="Seek forward 10s"
              >
                <SkipForward className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                disabled={currentDemoIndex === demos.length - 1}
                className="h-10 w-10"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Volume Controls */}
            <div className="flex items-center gap-2 min-w-0 w-32">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="h-8 w-8 flex-shrink-0"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className={cn(
                  'flex-1',
                  '[&_[role=slider]]:h-3 [&_[role=slider]]:w-3',
                  '[&>span:first-child]:h-1.5 [&>span:first-child]:bg-muted',
                  '[&_[data-orientation=horizontal]]:h-1.5'
                )}
              />
            </div>
          </div>
        </div>

        {/* Demo Selector */}
        {demos.length > 1 && (
          <div className="px-6 py-4 border-t border-border bg-muted/10">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Select Demo:</label>

              {/* Mobile: Dropdown */}
              <div className="block sm:hidden">
                <Select
                  value={currentDemoIndex.toString()}
                  onValueChange={(value) => selectDemo(parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {demos.map((demo, index) => (
                      <SelectItem key={demo.id} value={index.toString()}>
                        {demo.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Desktop: Tabs */}
              <div className="hidden sm:block">
                <Tabs
                  value={currentDemoIndex.toString()}
                  onValueChange={(value) => selectDemo(parseInt(value))}
                >
                  <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {demos.map((demo, index) => (
                      <TabsTrigger key={demo.id} value={index.toString()} className="truncate">
                        {demo.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Info */}
        <div className="px-6 py-3 border-t border-border bg-muted/5">
          <p className="text-xs text-muted-foreground text-center">
            Keyboard shortcuts: Space (play/pause) • ←/→ (seek 10s) • ↑/↓ (prev/next demo)
          </p>
        </div>
      </motion.div>
    </div>
  );
}
