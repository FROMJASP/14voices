'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { BackgroundBeams } from './BackgroundBeams'
import { SplitTextLogo } from './SplitTextLogo'
import { StarBorderButton } from './StarBorderButton'
import { FloatingLabelInput } from './FloatingLabelInput'

export default function ForgotPassword() {
  // Add the CSS styles
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      .split-text-logo {
        font-size: 2.5rem;
        font-weight: 700;
        color: #ffffff;
        text-align: center;
        margin-bottom: 0.5rem;
        position: relative;
        z-index: 1;
        letter-spacing: -0.02em;
        line-height: 1.2;
        display: block;
        overflow: visible;
      }

      .login-glassmorphism {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 
          0 8px 32px 0 rgba(0, 0, 0, 0.3),
          inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        padding: 3rem;
        position: relative;
        overflow: hidden;
      }

      .login-subtitle {
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.5);
        text-align: center;
        margin-bottom: 2rem;
      }

      .error-message {
        background: rgba(239, 68, 68, 0.08);
        border: 1px solid rgba(239, 68, 68, 0.15);
        color: #ef4444;
        padding: 0.75rem 1rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        margin-bottom: 1.5rem;
        animation: slide-in-top 0.3s ease-out;
      }

      @keyframes slide-in-top {
        from {
          transform: translateY(-10px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .loading-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Floating Label Input Styles */
      .floating-label-container {
        margin-bottom: 1.5rem;
      }

      .floating-label-wrapper {
        position: relative;
      }

      .floating-label-input {
        width: 100%;
        padding: 1rem;
        padding-top: 1.5rem;
        font-size: 1rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 0.375rem;
        color: #ffffff;
        outline: none;
        transition: all 0.2s ease;
      }

      .floating-label-input:focus {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.2);
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.05);
      }

      .floating-label {
        position: absolute;
        left: 1rem;
        top: 1.25rem;
        font-size: 0.875rem;
        color: rgba(255, 255, 255, 0.5);
        pointer-events: none;
        transform-origin: left center;
        transition: all 0.2s ease;
      }

      .floating-label-input:focus ~ .floating-label,
      .floating-label-input:not(:placeholder-shown) ~ .floating-label {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.75rem;
        font-weight: 400;
        transform: translateY(-1.5rem);
      }

      /* Star Border Button Styles */
      .star-border-button {
        position: relative;
        width: 100%;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: #000000;
        background: #ffffff;
        cursor: pointer;
        overflow: hidden;
        transition: all 0.2s ease;
      }

      .star-border-button:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
      }

      .star-border-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .star-border-container {
        position: absolute;
        inset: -2px;
        pointer-events: none;
      }

      .star-border-svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }

      .star-particle {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
      }

      .star-border-content {
        position: relative;
        z-index: 1;
      }

      /* Background Beams */
      .background-beams-container {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
      }

      .background-beams-svg {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 0;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!email) {
      setError('Please enter your email address')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        toast.success('Password reset email sent!')
      } else {
        setError(data.errors?.[0]?.message || 'Unable to send reset email. Please try again.')
        toast.error('Failed to send reset email')
      }
    } catch {
      setError('An error occurred. Please try again.')
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [email])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000000',
      position: 'relative',
      overflow: 'hidden'
    }}>
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
            <SplitTextLogo text="Fourteen Voices" className="split-text-logo" />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="login-subtitle"
            >
              Reset Your Password
            </motion.p>
          </motion.div>
          
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <>
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                  }}
                >
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </motion.p>

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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <StarBorderButton
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <span className="loading-spinner" />
                        Sending...
                      </span>
                    ) : (
                      'Send Reset Email'
                    )}
                  </StarBorderButton>
                </motion.div>

              </motion.form>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ 
                  textAlign: 'center', 
                  marginTop: '1.5rem',
                  position: 'relative',
                  zIndex: 10
                }}
              >
                <button
                  type="button"
                  onClick={() => router.push('/admin')}
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    display: 'inline-block',
                    position: 'relative',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    font: 'inherit'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                >
                  Back to login
                </button>
              </motion.div>
              </>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  style={{
                    width: '64px',
                    height: '64px',
                    margin: '0 auto 1.5rem',
                    borderRadius: '50%',
                    background: 'rgba(34, 197, 94, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgb(34, 197, 94)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#ffffff',
                    marginBottom: '0.5rem'
                  }}
                >
                  Check your email
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '2rem'
                  }}
                >
                  We&apos;ve sent a password reset link to<br />
                  <strong>{email}</strong>
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    position: 'relative',
                    zIndex: 10
                  }}
                >
                  <Link 
                    href="/admin"
                    style={{
                      fontSize: '0.875rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      display: 'inline-block',
                      position: 'relative',
                      pointerEvents: 'auto',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                  >
                    Back to login
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}