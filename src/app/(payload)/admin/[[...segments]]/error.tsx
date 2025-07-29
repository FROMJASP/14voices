'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin panel error:', error);
  }, [error]);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Admin Panel Error</h1>
      <p>There was an error loading the admin panel.</p>

      <details style={{ marginTop: '1rem' }}>
        <summary>Error Details</summary>
        <pre
          style={{
            background: '#f5f5f5',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {error.message}
          {error.digest && `\nDigest: ${error.digest}`}
        </pre>
      </details>

      <button
        onClick={reset}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          background: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Try again
      </button>

      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
        <p>Common issues:</p>
        <ul>
          <li>Database connection not configured (POSTGRES_URL)</li>
          <li>Missing PAYLOAD_SECRET environment variable</li>
          <li>Email service not configured (RESEND_API_KEY)</li>
          <li>Vercel Blob storage not configured (BLOB_READ_WRITE_TOKEN)</li>
        </ul>
      </div>
    </div>
  );
}
