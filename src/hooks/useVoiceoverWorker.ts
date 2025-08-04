'use client';

import { useCallback, useRef, useEffect } from 'react';
import type { ProcessingTask, WorkerMessage, VoiceoverData, FilterOptions } from '@/workers/voiceoverProcessingWorker';

// Hook for managing web worker communication
export const useVoiceoverWorker = () => {
  const workerRef = useRef<Worker | null>(null);
  const taskCallbacksRef = useRef<Map<string, (result: any, error?: string) => void>>(new Map());

  // Initialize worker
  useEffect(() => {
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      try {
        workerRef.current = new Worker(
          new URL('@/workers/voiceoverProcessingWorker.ts', import.meta.url),
          { type: 'module' }
        );

        workerRef.current.onmessage = (e: MessageEvent<WorkerMessage>) => {
          const { id, type, result, error } = e.data;
          const callback = taskCallbacksRef.current.get(id);
          
          if (callback) {
            if (type === 'SUCCESS') {
              callback(result);
            } else {
              callback(null, error);
            }
            taskCallbacksRef.current.delete(id);
          }
        };

        workerRef.current.onerror = (error) => {
          console.error('Worker error:', error);
        };

      } catch {
        console.warn('Web Worker not supported, falling back to main thread processing');
      }
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // Generate unique task ID
  const generateTaskId = useCallback(() => {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Generic task executor
  const executeTask = useCallback(
    (task: Omit<ProcessingTask, 'id'>, callback: (result: any, error?: string) => void) => {
      const taskId = generateTaskId();
      const taskWithId: ProcessingTask = { ...task, id: taskId };

      // Store callback
      taskCallbacksRef.current.set(taskId, callback);

      if (workerRef.current) {
        // Use web worker
        workerRef.current.postMessage(taskWithId);
      } else {
        // Fallback to main thread (synchronous processing)
        try {
          // Import worker functions for fallback (this would need to be adapted)
          // For now, we'll handle this case with a simple error
          callback(null, 'Web Worker not available and fallback not implemented');
        } catch (error) {
          callback(null, error instanceof Error ? error.message : 'Unknown error');
        }
      }
    },
    [generateTaskId]
  );

  // Specific task methods
  const filterVoiceovers = useCallback(
    (voiceovers: VoiceoverData[], options: FilterOptions): Promise<VoiceoverData[]> => {
      return new Promise((resolve, reject) => {
        executeTask(
          {
            type: 'FILTER_VOICEOVERS',
            data: { voiceovers, options },
          },
          (result, error) => {
            if (error) {
              reject(new Error(error));
            } else {
              resolve(result);
            }
          }
        );
      });
    },
    [executeTask]
  );

  const sortVoiceovers = useCallback(
    (voiceovers: VoiceoverData[], sortBy: string, sortOrder: 'asc' | 'desc' = 'asc'): Promise<VoiceoverData[]> => {
      return new Promise((resolve, reject) => {
        executeTask(
          {
            type: 'SORT_VOICEOVERS',
            data: { voiceovers, sortBy, sortOrder },
          },
          (result, error) => {
            if (error) {
              reject(new Error(error));
            } else {
              resolve(result);
            }
          }
        );
      });
    },
    [executeTask]
  );

  const searchVoiceovers = useCallback(
    (voiceovers: VoiceoverData[], query: string): Promise<VoiceoverData[]> => {
      return new Promise((resolve, reject) => {
        executeTask(
          {
            type: 'SEARCH_VOICEOVERS',
            data: { voiceovers, query },
          },
          (result, error) => {
            if (error) {
              reject(new Error(error));
            } else {
              resolve(result);
            }
          }
        );
      });
    },
    [executeTask]
  );

  const computeStatistics = useCallback(
    (voiceovers: VoiceoverData[]): Promise<any> => {
      return new Promise((resolve, reject) => {
        executeTask(
          {
            type: 'COMPUTE_STATISTICS',
            data: { voiceovers },
          },
          (result, error) => {
            if (error) {
              reject(new Error(error));
            } else {
              resolve(result);
            }
          }
        );
      });
    },
    [executeTask]
  );

  return {
    filterVoiceovers,
    sortVoiceovers,
    searchVoiceovers,
    computeStatistics,
    isWorkerAvailable: !!workerRef.current,
  };
};