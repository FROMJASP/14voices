'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { BackgroundBeams } from './login/BackgroundBeams';
import { FloatingLabelInput } from './login/FloatingLabelInput';
import './login/login-animations.css';

export default function BeforeLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await fetch('/api/globals/site-settings', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (data?.favicon?.url) {
              setLogoUrl(data.favicon.url);
            }
          }
        }
      } catch {
        // Silently fail if settings can't be fetched
      }
    };

    fetchSiteSettings();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      // Custom validation
      if (!email) {
        setError('Please enter your email address');
        return;
      }

      if (!email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }

      if (!password) {
        setError('Please enter your password');
        return;
      }

      setIsLoading(true);

      try {
        // Use Payload v3's authentication endpoint
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email, 
            password,
            // Include any CSRF token if needed
          }),
          credentials: 'include',
        });

        const contentType = response.headers.get('content-type');
        let data: { errors?: Array<{ message: string }> } = {};

        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          setError('Server error. Please try again.');
          toast.error('Server error. Please try again.');
          return;
        }

        if (response.ok) {
          toast.success('Welcome back! Redirecting...');
          setTimeout(() => {
            window.location.href = '/admin';
          }, 1000);
        } else {
          setError(data.errors?.[0]?.message || 'Invalid email or password');
          toast.error('Login failed. Please check your credentials.');
        }
      } catch {
        setError('An error occurred. Please try again.');
        toast.error('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [email, password]
  );

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          /* Hide Payload's default login form */
          .login__brand { display: none !important; }
          .login__form { display: none !important; }
          .login > * { visibility: hidden !important; }
          
          /* Show our custom login */
          .custom-login-wrapper {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 9999 !important;
            visibility: visible !important;
          }

          /* Fix autofill styles */
          .floating-label-input:-webkit-autofill,
          .floating-label-input:-webkit-autofill:hover,
          .floating-label-input:-webkit-autofill:focus {
            -webkit-text-fill-color: #ffffff;
            -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.03) inset;
            transition: background-color 5000s ease-in-out 0s;
            animation: onAutoFillStart 0ms;
          }
          
          .floating-label-input:not(:-webkit-autofill) {
            animation: onAutoFillCancel 0ms;
          }
          
          @keyframes onAutoFillStart {
            from { opacity: 1; }
            to { opacity: 1; }
          }
          
          @keyframes onAutoFillCancel {
            from { opacity: 1; }
            to { opacity: 1; }
          }
          
          .floating-label-input:-webkit-autofill ~ .floating-label,
          .floating-label-input:autofill ~ .floating-label {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.875rem;
            font-weight: 400;
            transform: translateY(-1.25rem);
          }
        `,
        }}
      />
      <div
        className="custom-login-wrapper"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(ellipse at top left, #0a0a0a 0%, #000000 50%), radial-gradient(ellipse at bottom right, #111111 0%, #000000 50%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <BackgroundBeams />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: '28rem', position: 'relative', zIndex: 10 }}
        >
          <div className="login-glassmorphism">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: '2rem' }}
            >
              {logoUrl || '/favicon.svg' ? (
                <div style={{ marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoUrl || '/favicon.svg'}
                      alt="Fourteen Voices"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                      onError={(e) => {
                        // If both logoUrl and favicon.svg fail, show text fallback
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement?.parentElement;
                        if (parent) {
                          parent.style.display = 'none';
                          const textFallback = parent.nextElementSibling as HTMLHeadingElement;
                          if (!textFallback) {
                            const h1 = document.createElement('h1');
                            h1.className = 'split-text-logo';
                            h1.textContent = 'Fourteen Voices';
                            parent.parentElement?.appendChild(h1);
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <h1 className="split-text-logo">Fourteen Voices</h1>
              )}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="login-subtitle"
              >
                Admin Portal
              </motion.p>
            </motion.div>

            <form onSubmit={handleSubmit} noValidate>
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="error-message"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <FloatingLabelInput
                  id="email"
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={setEmail}
                  required
                  autoComplete="email"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <FloatingLabelInput
                  id="password"
                  type="password"
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  required
                  autoComplete="current-password"
                  showPasswordToggle
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                style={{
                  textAlign: 'right',
                  marginBottom: '1.5rem',
                  marginTop: '-0.5rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    // Use window.location for more reliable navigation
                    window.location.href = '/admin/forgot-password';
                  }}
                  style={{
                    fontSize: '1rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    font: 'inherit',
                    position: 'relative',
                    zIndex: 10,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)')}
                >
                  Forgot password?
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <button type="submit" disabled={isLoading} className="star-border-button">
                  {isLoading ? (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <span className="loading-spinner" />
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="login-footer"
            >
              © 2025 IAM Studios. All rights reserved.
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
