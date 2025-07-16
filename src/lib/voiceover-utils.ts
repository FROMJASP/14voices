export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

import { PayloadVoiceover } from '@/types/voiceover';

export const formatAvailabilityDate = (voiceover: Partial<PayloadVoiceover>): string => {
  if (!voiceover.availability?.isAvailable && voiceover.availability?.unavailableUntil) {
    const date = new Date(voiceover.availability.unavailableUntil);
    return `Beschikbaar vanaf ${date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
    })}`;
  }
  return 'Beschikbaar';
};

export const getStyleTagLabel = (tag: { tag: string; customTag?: string }): string => {
  if (tag.tag === 'custom' && tag.customTag) {
    return tag.customTag;
  }
  const tagMap: Record<string, string> = {
    autoriteit: 'Autoriteit',
    'jeugdig-fris': 'Jeugdig & Fris',
    kwaliteit: 'Kwaliteit',
    stoer: 'Stoer',
    'warm-donker': 'Warm & Donker',
    zakelijk: 'Zakelijk',
    eigentijds: 'Eigentijds',
    'gezellig-genieten': 'Gezellig & Genieten',
    helder: 'Helder',
    naturel: 'Naturel',
    urban: 'Urban',
    vernieuwend: 'Vernieuwend',
    'vriendelijk-vrolijk': 'Vriendelijk & Vrolijk',
  };
  return tagMap[tag.tag] || tag.tag;
};

export const getTagColor = (label: string): string => {
  const tagColors: Record<string, string> = {
    'Warm & Donker': 'from-orange-500 to-red-500',
    Zakelijk: 'from-blue-500 to-indigo-500',
    Stoer: 'from-red-500 to-pink-500',
    Vertrouwd: 'from-amber-500 to-orange-500',
    Autoriteit: 'from-purple-500 to-indigo-500',
    Gaming: 'from-green-500 to-emerald-500',
    Helder: 'from-cyan-500 to-blue-500',
    'E-learning': 'from-teal-500 to-green-500',
    Commercieel: 'from-pink-500 to-rose-500',
    Narratief: 'from-violet-500 to-purple-500',
    Intiem: 'from-rose-500 to-pink-500',
    Dynamisch: 'from-yellow-500 to-orange-500',
    Professioneel: 'from-slate-500 to-gray-500',
    'Jeugdig & Fris': 'from-lime-500 to-green-500',
    Kwaliteit: 'from-indigo-500 to-blue-500',
    Eigentijds: 'from-sky-500 to-blue-500',
    'Gezellig & Genieten': 'from-orange-500 to-amber-500',
    Naturel: 'from-emerald-500 to-teal-500',
    Urban: 'from-gray-600 to-gray-800',
    Vernieuwend: 'from-fuchsia-500 to-purple-500',
    'Vriendelijk & Vrolijk': 'from-yellow-400 to-orange-400',
  };
  return tagColors[label] || 'from-gray-500 to-gray-600';
};

export const getVoiceoverColor = (index: number): string => {
  const colors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-indigo-500 to-purple-500',
    'from-rose-500 to-pink-500',
    'from-red-500 to-orange-500',
    'from-violet-500 to-indigo-500',
    'from-amber-500 to-yellow-500',
    'from-teal-500 to-green-500',
    'from-orange-500 to-red-500',
    'from-cyan-500 to-blue-500',
    'from-pink-500 to-rose-500',
    'from-emerald-500 to-green-500',
    'from-yellow-500 to-amber-500',
  ];
  return colors[index % colors.length];
};

export const transformVoiceoverData = (voiceover: PayloadVoiceover, index: number) => {
  const styleTags = voiceover.styleTags?.map((tag) => getStyleTagLabel(tag)) || [];

  return {
    id: voiceover.id,
    name: voiceover.name,
    slug: voiceover.slug,
    tags: styleTags,
    color: getVoiceoverColor(index),
    beschikbaar: voiceover.availability?.isAvailable !== false,
    availabilityText: formatAvailabilityDate(voiceover),
    demos: [
      voiceover.fullDemoReel && {
        id: `${voiceover.id}-reel`,
        title: 'Demo Reel',
        url: typeof voiceover.fullDemoReel === 'object' ? voiceover.fullDemoReel.url : '',
        duration: '1:30',
      },
      voiceover.commercialsDemo && {
        id: `${voiceover.id}-commercials`,
        title: 'Commercials Demo',
        url: typeof voiceover.commercialsDemo === 'object' ? voiceover.commercialsDemo.url : '',
        duration: '0:45',
      },
      voiceover.narrativeDemo && {
        id: `${voiceover.id}-narrative`,
        title: 'Narratieve Demo',
        url: typeof voiceover.narrativeDemo === 'object' ? voiceover.narrativeDemo.url : '',
        duration: '2:00',
      },
    ].filter(Boolean),
    profilePhoto: typeof voiceover.profilePhoto === 'object' ? voiceover.profilePhoto.url : null,
    description: voiceover.description,
    cohort: typeof voiceover.cohort === 'object' ? voiceover.cohort : null,
  };
};

// Sort voiceovers with unavailable ones last
export const sortVoiceovers = <T extends { beschikbaar: boolean }>(voiceovers: T[]) => {
  return voiceovers.sort((a, b) => {
    if (a.beschikbaar && !b.beschikbaar) return -1;
    if (!a.beschikbaar && b.beschikbaar) return 1;
    return 0;
  });
};
