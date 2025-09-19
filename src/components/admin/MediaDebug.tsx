'use client';

import React, { useEffect, useState } from 'react';

export const MediaDebug: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch('/api/media?limit=5&depth=1');
        const data = await response.json();
        setMediaItems(data.docs);
        console.log('[MediaDebug] Fetched media:', data.docs);
      } catch (err) {
        console.error('[MediaDebug] Error fetching media:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  if (loading) return <div>Loading media debug info...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', marginBottom: '20px' }}>
      <h3>Media Debug Information</h3>
      <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
        <p>S3_PUBLIC_URL: {process.env.NEXT_PUBLIC_S3_PUBLIC_URL || 'Not set in NEXT_PUBLIC'}</p>
        <p>Total Items: {mediaItems.length}</p>
      </div>

      {mediaItems.map((item, index) => (
        <div
          key={item.id}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            marginTop: '10px',
            background: 'white',
          }}
        >
          <h4>
            Item {index + 1}: {item.filename}
          </h4>
          <div style={{ display: 'grid', gap: '10px', fontSize: '12px' }}>
            <div>
              <strong>Main URL:</strong> {item.url || 'Not set'}
            </div>
            <div>
              <strong>Thumbnail URL:</strong> {item.thumbnailURL || 'Not set'}
            </div>
            <div>
              <strong>Sizes:</strong>
              {item.sizes ? (
                <ul>
                  {Object.entries(item.sizes).map(([name, size]: [string, any]) => (
                    <li key={name}>
                      {name}: {size.filename} ({size.width}x{size.height}) - {size.url || 'No URL'}
                    </li>
                  ))}
                </ul>
              ) : (
                'No sizes generated'
              )}
            </div>
            <div>
              <strong>Test Images:</strong>
              <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                {item.thumbnailURL && (
                  <div>
                    <img
                      src={item.thumbnailURL}
                      alt="Thumbnail"
                      style={{
                        width: '100px',
                        height: '75px',
                        objectFit: 'cover',
                        border: '1px solid #ddd',
                      }}
                      onError={(e) => {
                        console.error('[MediaDebug] Thumbnail failed to load:', item.thumbnailURL);
                        (e.target as HTMLImageElement).style.background = '#ff0000';
                      }}
                      onLoad={() => {
                        console.log(
                          '[MediaDebug] Thumbnail loaded successfully:',
                          item.thumbnailURL
                        );
                      }}
                    />
                    <div style={{ fontSize: '10px' }}>Thumbnail</div>
                  </div>
                )}
                {item.url && (
                  <div>
                    <img
                      src={item.url}
                      alt="Main"
                      style={{
                        width: '100px',
                        height: '75px',
                        objectFit: 'cover',
                        border: '1px solid #ddd',
                      }}
                      onError={(e) => {
                        console.error('[MediaDebug] Main image failed to load:', item.url);
                        (e.target as HTMLImageElement).style.background = '#ff0000';
                      }}
                      onLoad={() => {
                        console.log('[MediaDebug] Main image loaded successfully:', item.url);
                      }}
                    />
                    <div style={{ fontSize: '10px' }}>Main</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaDebug;
