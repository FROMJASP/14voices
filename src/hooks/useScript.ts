'use client';

import { useState, useEffect } from 'react';

interface Script {
  id: string;
  type: 'file' | 'text';
  content?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  booking: {
    id: string;
    title?: string;
    customer?: string;
    voiceover?: string;
  };
}

export function useScript(scriptId: string | null) {
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scriptId) {
      setScript(null);
      return;
    }

    const fetchScript = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/scripts/${scriptId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch script');
        }

        const data = await response.json();
        setScript(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchScript();
  }, [scriptId]);

  const downloadScript = async () => {
    if (!script || script.type !== 'file' || !script.fileUrl) return;

    try {
      // Log download action
      await fetch(`/api/scripts/${script.id}/download`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Trigger download
      const link = document.createElement('a');
      link.href = script.fileUrl;
      link.download = script.fileName || 'script';
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  return { script, loading, error, downloadScript };
}
