'use client';

import { useField } from '@payloadcms/ui';

export function MaintenanceModePreview() {
  // Get the individual field values directly
  const { value: maintenanceMode } = useField({ path: 'features.maintenanceMode' }) || {};
  const { value: title } = useField({ path: 'features.maintenanceTitle' }) || {};
  const { value: message } = useField({ path: 'features.maintenanceMessage' }) || {};
  const { value: contactLabel } = useField({ path: 'features.maintenanceContactLabel' }) || {};
  const { value: showContactEmail } = useField({ path: 'features.showContactEmail' }) || {};
  const { value: contactEmail } = useField({ path: 'contact.email' }) || {};

  // Show preview whenever checkbox is checked (even before saving)
  if (!maintenanceMode) {
    return null; // Don't show anything when maintenance mode is off
  }

  return (
    <div className="field-type">
      <div className="field-label">
        <label>Preview</label>
      </div>
      <div className="field">
        <div
          style={{
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 'var(--style-radius-m)',
            overflow: 'hidden',
            background: 'var(--theme-elevation-0)',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--theme-elevation-150)',
              background: 'var(--theme-elevation-50)',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            Maintenance Mode Preview
          </div>
          <div
            style={{
              height: '500px',
              position: 'relative',
              overflow: 'hidden',
              background: '#000',
            }}
          >
            <iframe
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                      * { margin: 0; padding: 0; box-sizing: border-box; }
                      body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: #000;
                        color: #fff;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      }
                      .container {
                        max-width: 600px;
                        padding: 2rem;
                        text-align: center;
                      }
                      .icon-wrapper {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.1);
                        margin-bottom: 2rem;
                      }
                      h1 {
                        font-size: 2.5rem;
                        margin-bottom: 1rem;
                      }
                      .message {
                        font-size: 1.125rem;
                        color: rgba(255, 255, 255, 0.7);
                        max-width: 400px;
                        margin: 0 auto;
                      }
                      .contact {
                        margin-top: 3rem;
                        padding-top: 3rem;
                        border-top: 1px solid rgba(255, 255, 255, 0.1);
                      }
                      .contact p {
                        font-size: 0.875rem;
                        color: rgba(255, 255, 255, 0.5);
                        margin-bottom: 0.5rem;
                      }
                      .contact a {
                        color: #fff;
                        text-decoration: none;
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                      }
                      .contact a:hover {
                        text-decoration: underline;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="icon-wrapper">
                        <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </div>
                      <h1>${title || 'We zijn zo terug!'}</h1>
                      <div class="message">${message || 'We voeren momenteel gepland onderhoud uit. We zijn zo weer online.'}</div>
                      ${
                        showContactEmail !== false && contactEmail
                          ? `
                        <div class="contact">
                          <p>${contactLabel || 'Contact nodig?'}</p>
                          <a href="mailto:${contactEmail}">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            ${contactEmail}
                          </a>
                        </div>
                      `
                          : ''
                      }
                    </div>
                  </body>
                </html>
              `}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              title="Maintenance Mode Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
