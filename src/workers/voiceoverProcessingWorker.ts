// Web Worker for heavy voiceover data processing operations
// This prevents blocking the main thread during expensive computations

export interface VoiceoverData {
  id: string;
  name: string;
  tags?: string[];
  styleTags?: Array<{ tag: string; customTag?: string }>;
  demos: Array<{
    id: string;
    title: string;
    audioFile: { url: string };
    duration?: string;
  }>;
  profilePhoto?: { url: string };
  [key: string]: any;
}

export interface ProcessingTask {
  type: 'FILTER_VOICEOVERS' | 'SORT_VOICEOVERS' | 'SEARCH_VOICEOVERS' | 'COMPUTE_STATISTICS';
  data: any;
  id: string;
}

export interface FilterOptions {
  selectedStyles: string[];
  searchQuery?: string;
  availability?: 'all' | 'available' | 'unavailable';
  sortBy?: 'name' | 'rating' | 'recent';
  sortOrder?: 'asc' | 'desc';
}

// Utility functions for processing
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .trim();
};

const calculateRelevanceScore = (voice: VoiceoverData, query: string): number => {
  const normalizedQuery = normalizeString(query);
  let score = 0;

  // Name match (highest weight)
  if (normalizeString(voice.name).includes(normalizedQuery)) {
    score += 100;
  }

  // Tag matches
  voice.tags?.forEach(tag => {
    if (normalizeString(tag).includes(normalizedQuery)) {
      score += 50;
    }
  });

  // Style tag matches
  voice.styleTags?.forEach(({ tag, customTag }) => {
    const tagToCheck = customTag || tag;
    if (normalizeString(tagToCheck).includes(normalizedQuery)) {
      score += 30;
    }
  });

  return score;
};

const filterVoiceovers = (
  voiceovers: VoiceoverData[], 
  options: FilterOptions
): VoiceoverData[] => {
  let filtered = [...voiceovers];

  // Filter by selected styles
  if (!options.selectedStyles.includes('Alle stijlen') && options.selectedStyles.length > 0) {
    filtered = filtered.filter(voice => {
      const hasSelectedStyle = voice.styleTags?.some(({ tag, customTag }) =>
        options.selectedStyles.includes(customTag || tag)
      ) || false;
      return hasSelectedStyle;
    });
  }

  // Filter by search query
  if (options.searchQuery && options.searchQuery.trim().length > 0) {
    const query = options.searchQuery.trim();
    filtered = filtered
      .map(voice => ({
        ...voice,
        _relevanceScore: calculateRelevanceScore(voice, query)
      }))
      .filter(voice => voice._relevanceScore > 0)
      .sort((a, b) => (b._relevanceScore || 0) - (a._relevanceScore || 0));
  }

  // Filter by availability
  if (options.availability === 'available') {
    filtered = filtered.filter(voice => voice.beschikbaar !== false);
  } else if (options.availability === 'unavailable') {
    filtered = filtered.filter(voice => voice.beschikbaar === false);
  }

  return filtered;
};

const sortVoiceovers = (
  voiceovers: VoiceoverData[], 
  sortBy: string, 
  sortOrder: 'asc' | 'desc' = 'asc'
): VoiceoverData[] => {
  const sorted = [...voiceovers];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'rating':
        // Assuming rating is stored as a property
        comparison = (a.rating || 0) - (b.rating || 0);
        break;
      case 'recent':
        // Assuming updatedAt is available
        comparison = new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime();
        break;
      default:
        return 0;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return sorted;
};

const computeStatistics = (voiceovers: VoiceoverData[]) => {
  const stats = {
    totalVoiceovers: voiceovers.length,
    availableVoiceovers: 0,
    unavailableVoiceovers: 0,
    styleDistribution: {} as Record<string, number>,
    averageDemos: 0,
    totalDemos: 0,
  };

  voiceovers.forEach(voice => {
    // Count availability
    if (voice.beschikbaar !== false) {
      stats.availableVoiceovers++;
    } else {
      stats.unavailableVoiceovers++;
    }

    // Count style distribution
    voice.styleTags?.forEach(({ tag, customTag }) => {
      const styleTag = customTag || tag;
      stats.styleDistribution[styleTag] = (stats.styleDistribution[styleTag] || 0) + 1;
    });

    // Count demos
    const demoCount = voice.demos?.length || 0;
    stats.totalDemos += demoCount;
  });

  stats.averageDemos = stats.totalVoiceovers > 0 ? stats.totalDemos / stats.totalVoiceovers : 0;

  return stats;
};

// Message handling for the web worker
self.onmessage = function(e: MessageEvent<ProcessingTask>) {
  const { type, data, id } = e.data;

  try {
    let result: any;

    switch (type) {
      case 'FILTER_VOICEOVERS':
        result = filterVoiceovers(data.voiceovers, data.options);
        break;

      case 'SORT_VOICEOVERS':
        result = sortVoiceovers(data.voiceovers, data.sortBy, data.sortOrder);
        break;

      case 'SEARCH_VOICEOVERS':
        result = filterVoiceovers(data.voiceovers, { 
          selectedStyles: ['Alle stijlen'], 
          searchQuery: data.query 
        });
        break;

      case 'COMPUTE_STATISTICS':
        result = computeStatistics(data.voiceovers);
        break;

      default:
        throw new Error(`Unknown task type: ${type}`);
    }

    // Send result back to main thread
    self.postMessage({
      id,
      type: 'SUCCESS',
      result,
    });

  } catch (error) {
    // Send error back to main thread
    self.postMessage({
      id,
      type: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// Export type definitions for TypeScript support
export type WorkerMessage = {
  id: string;
  type: 'SUCCESS' | 'ERROR';
  result?: any;
  error?: string;
};