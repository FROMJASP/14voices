'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Mic, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurFade } from '@/components/ui/magic/blur-fade';
import { makeMediaUrlRelative } from '@/lib/media-utils';
// Temporary type definition until payload-types.ts is regenerated
interface Voiceover {
  id: string;
  name: string;
  description?: string;
  profilePhoto?:
    | {
        url: string;
        alt?: string;
      }
    | string;
  status?: string;
  styleTags?: Array<{
    tag: string;
    customTag?: string;
  }>;
  availability?: {
    isAvailable?: boolean;
  };
}

interface VoiceoverWithDemo extends Voiceover {
  demos?: Array<{
    id: string;
    title: string;
    audioFile: {
      url: string;
    };
    duration?: string;
    isPrimary?: boolean;
  }>;
}

export function VoiceoverShowcase() {
  const [voiceovers, setVoiceovers] = useState<VoiceoverWithDemo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Available style tags
  const styleTags = [
    { label: 'Alle stijlen', value: 'all' },
    { label: 'Autoriteit', value: 'autoriteit' },
    { label: 'Jeugdig & Fris', value: 'jeugdig-fris' },
    { label: 'Kwaliteit', value: 'kwaliteit' },
    { label: 'Stoer', value: 'stoer' },
    { label: 'Warm & Donker', value: 'warm-donker' },
    { label: 'Zakelijk', value: 'zakelijk' },
  ];

  useEffect(() => {
    fetchVoiceovers();
  }, []);

  const fetchVoiceovers = async () => {
    try {
      const response = await fetch('/api/voiceovers?depth=2&where[status][equals]=active');
      const data = await response.json();
      setVoiceovers(data.docs || []);
    } catch (error) {
      console.error('Error fetching voiceovers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = (voiceoverId: string, audioUrl: string) => {
    if (playingId === voiceoverId) {
      currentAudio?.pause();
      setPlayingId(null);
      setCurrentAudio(null);
    } else {
      if (currentAudio) {
        currentAudio.pause();
      }
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => {
        setPlayingId(null);
        setCurrentAudio(null);
      };
      setCurrentAudio(audio);
      setPlayingId(voiceoverId);
    }
  };

  const filteredVoiceovers = voiceovers.filter((voiceover) => {
    if (selectedTag === 'all') return true;
    return voiceover.styleTags?.some(
      (tag) => tag.tag === selectedTag || tag.customTag === selectedTag
    );
  });

  const getStyleTagLabel = (voiceover: VoiceoverWithDemo) => {
    const tags = voiceover.styleTags
      ?.map((tag) =>
        tag.tag === 'custom' ? tag.customTag : styleTags.find((t) => t.value === tag.tag)?.label
      )
      .filter(Boolean)
      .slice(0, 3);
    return tags?.join(' • ') || '';
  };

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 animate-pulse">
                <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-lg mb-4"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto">
        <BlurFade delay={0.25} inView>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Onze Professionele Stemmen
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Ontdek de perfecte stem voor uw project
            </p>
          </div>
        </BlurFade>

        {/* Filter tabs */}
        <BlurFade delay={0.35} inView>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {styleTags.map((tag) => (
              <motion.button
                key={tag.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTag(tag.value)}
                className={cn(
                  'px-6 py-2 rounded-full font-medium transition-all duration-200',
                  selectedTag === tag.value
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                )}
              >
                {tag.label}
              </motion.button>
            ))}
          </div>
        </BlurFade>

        {/* Voiceover grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTag}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredVoiceovers.map((voiceover, index) => {
              const primaryDemo = voiceover.demos?.find((d) => d.isPrimary) || voiceover.demos?.[0];
              const isPlaying = playingId === voiceover.id;
              const isAvailable = voiceover.availability?.isAvailable !== false;

              return (
                <BlurFade key={voiceover.id} delay={0.1 * index} inView>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* Profile photo */}
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                      {voiceover.profilePhoto &&
                      typeof voiceover.profilePhoto === 'object' &&
                      'url' in voiceover.profilePhoto ? (
                        <Image
                          src={makeMediaUrlRelative(voiceover.profilePhoto.url)}
                          alt={voiceover.profilePhoto.alt || voiceover.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Mic className="w-24 h-24 text-slate-300 dark:text-slate-700" />
                        </div>
                      )}

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Play button overlay */}
                      {primaryDemo && (
                        <button
                          onClick={() =>
                            handlePlayPause(
                              voiceover.id,
                              makeMediaUrlRelative(primaryDemo.audioFile.url)
                            )
                          }
                          className="absolute bottom-4 right-4 w-14 h-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transform translate-y-20 group-hover:translate-y-0 transition-transform duration-300"
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6 text-purple-600" />
                          ) : (
                            <Play className="w-6 h-6 text-purple-600 ml-1" />
                          )}
                        </button>
                      )}

                      {/* Availability badge */}
                      <div
                        className={cn(
                          'absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1',
                          isAvailable ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
                        )}
                      >
                        {isAvailable ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Beschikbaar
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            Niet beschikbaar
                          </>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {voiceover.name}
                      </h3>

                      {/* Style tags */}
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-3">
                        {getStyleTagLabel(voiceover)}
                      </p>

                      {/* Bio */}
                      {voiceover.description && (
                        <p className="text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                          {voiceover.description}
                        </p>
                      )}

                      {/* Demo info */}
                      {primaryDemo && (
                        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-500">
                          <div className="flex items-center gap-1">
                            <Mic className="w-4 h-4" />
                            <span>{primaryDemo.title}</span>
                          </div>
                          {primaryDemo.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{primaryDemo.duration}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </BlurFade>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filteredVoiceovers.length === 0 && (
          <BlurFade delay={0.25} inView>
            <div className="text-center py-20">
              <p className="text-xl text-slate-500 dark:text-slate-400">
                Geen stemmen gevonden voor deze stijl
              </p>
            </div>
          </BlurFade>
        )}
      </div>
    </section>
  );
}
