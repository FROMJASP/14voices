'use client';

import React, { useState } from 'react';
import { useField } from '@payloadcms/ui';
import { Button } from '@payloadcms/ui';

export const EmailPreview: React.FC = () => {
  const { value: content } = useField({ path: 'content' });
  const { value: subject } = useField({ path: 'subject' });
  const { value: header } = useField({ path: 'header' });
  const { value: footer } = useField({ path: 'footer' });
  const { value: testData } = useField({ path: 'testData' });

  const [preview, setPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generatePreview = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/email/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          subject,
          header,
          footer,
          testData: testData && typeof testData === 'string' ? JSON.parse(testData) : {},
        }),
      });

      const data = await response.json();
      setPreview(data.html);
      setShowPreview(true);
    } catch (error) {
      console.error('Failed to generate preview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          subject,
          header,
          footer,
          testData: testData && typeof testData === 'string' ? JSON.parse(testData) : {},
        }),
      });

      if (response.ok) {
        alert('Test email sent successfully!');
      } else {
        alert('Failed to send test email');
      }
    } catch (error) {
      console.error('Failed to send test email:', error);
      alert('Failed to send test email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="field-type">
      <div className="field-label">Email Preview</div>
      <div className="field-description">Preview how your email will look with test data</div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <Button onClick={generatePreview} disabled={isLoading} size="small">
          {isLoading ? 'Generating...' : 'Preview Email'}
        </Button>

        <Button onClick={sendTestEmail} disabled={isLoading} size="small" buttonStyle="secondary">
          {isLoading ? 'Sending...' : 'Send Test Email'}
        </Button>
      </div>

      {showPreview && (
        <div style={{ marginTop: '20px' }}>
          <div
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              padding: '20px',
              backgroundColor: '#f5f5f5',
              marginBottom: '10px',
            }}
          >
            <strong>Subject:</strong> {(subject as string) || 'No subject'}
          </div>

          <div
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              backgroundColor: 'white',
              height: '500px',
              overflow: 'auto',
            }}
          >
            <iframe
              srcDoc={preview}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Email Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailPreview;
