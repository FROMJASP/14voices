'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { BackgroundBeams } from './login/BackgroundBeams'
import { SplitTextLogo } from './login/SplitTextLogo'
import { StarBorderButton } from './login/StarBorderButton'
import { FloatingLabelInput } from './login/FloatingLabelInput'

export default function BeforeLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Custom validation
    if (!email) {
      setError('Please enter your email address')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    if (!password) {
      setError('Please enter your password')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Welcome back! Redirecting...')
        setTimeout(() => {
          window.location.href = '/admin'
        }, 1000)
      } else {
        setError(data.errors?.[0]?.message || 'Invalid email or password')
        toast.error('Login failed. Please check your credentials.')
      }
    } catch {
      setError('An error occurred. Please try again.')
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [email, password])

  return (
    <>
      <style dangerouslySetInnerHTML={{
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

          .password-toggle {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.4);
            cursor: pointer;
            padding: 0.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s ease;
          }

          .password-toggle:hover {
            color: rgba(255, 255, 255, 0.6);
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
            font-size: 0.75rem;
            font-weight: 400;
            transform: translateY(-1.5rem);
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
                  marginTop: '-0.5rem'
                }}
              >
                <button
                  type="button"
                  onClick={() => router.push('/admin/forgot-password')}
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    font: 'inherit',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
                >
                  Forgot password?
                </button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <StarBorderButton
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span className="loading-spinner" />
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </StarBorderButton>
              </motion.div>
            </form>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="login-footer"
            >
              © 2024 IAM Studios. All rights reserved.
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  )
}