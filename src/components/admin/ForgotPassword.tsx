'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import { BackgroundBeams } from './login/BackgroundBeams'
import { SplitTextLogo } from './login/SplitTextLogo'
import { StarBorderButton } from './login/StarBorderButton'
import { FloatingLabelInput } from './login/FloatingLabelInput'

export default function ForgotPassword() {
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

  const handleBackToLogin = () => {
    router.push('/admin')
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Inherit all styles from login page */
          ${BeforeLoginStyles}
          
          /* Additional styles for forgot password */
          .back-button {
            position: absolute;
            top: 2rem;
            left: 2rem;
            z-index: 20;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0.375rem;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            font-size: 0.875rem;
            transition: all 0.2s ease;
          }

          .back-button:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.15);
            color: rgba(255, 255, 255, 0.9);
          }

          .success-message {
            background: rgba(34, 197, 94, 0.08);
            border: 1px solid rgba(34, 197, 94, 0.15);
            color: #22c55e;
            padding: 1rem;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .success-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(34, 197, 94, 0.1);
            border-radius: 50%;
          }
        `
      }} />
      <div className="custom-login-wrapper" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <BackgroundBeams />
        
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={handleBackToLogin}
          className="back-button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Login
        </motion.button>
        
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
            
            {!isSuccess ? (
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
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                    lineHeight: '1.5'
                  }}
                >
                  Enter your email address and we'll send you a link to reset your password.
                </motion.p>
                
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
                      'Send Reset Link'
                    )}
                  </StarBorderButton>
                </motion.div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="success-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <div className="success-message">
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#22c55e' }}>
                    Check your email
                  </h3>
                  <p style={{ margin: 0 }}>
                    We've sent a password reset link to {email}
                  </p>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <StarBorderButton
                    type="button"
                    onClick={handleBackToLogin}
                  >
                    Back to Login
                  </StarBorderButton>
                </motion.div>
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="login-footer"
            >
              © 2024 Fourteen Voices. All rights reserved.
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

// Import styles from BeforeLogin component
const BeforeLoginStyles = `
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

  /* Glassmorphism Login Container */
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

  /* Split Text Logo */
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

  /* Star Border Button */
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

  /* Floating Label Input */
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

  /* Error Messages */
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

  /* Additional UI Elements */
  .login-subtitle {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-footer {
    margin-top: 2rem;
    text-align: center;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.3);
  }

  /* Loading State */
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

  /* Fix autofill styles */
  .floating-label-input:-webkit-autofill,
  .floating-label-input:-webkit-autofill:hover,
  .floating-label-input:-webkit-autofill:focus {
    -webkit-text-fill-color: #ffffff;
    -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.03) inset;
    transition: background-color 5000s ease-in-out 0s;
  }

  /* Animation to detect autofill */
  @keyframes onAutoFillStart {
    from { /* Empty */ }
    to { /* Empty */ }
  }

  .floating-label-input:-webkit-autofill {
    animation-name: onAutoFillStart;
    animation-duration: 0.001s;
  }

  /* Ensure label stays up when autofilled */
  .floating-label-input:-webkit-autofill ~ .floating-label,
  .floating-label-input:autofill ~ .floating-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.75rem;
    font-weight: 400;
    transform: translateY(-1.5rem);
  }
`