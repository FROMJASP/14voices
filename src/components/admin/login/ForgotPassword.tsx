'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import { BackgroundBeams } from './BackgroundBeams'
import { FloatingLabelInput } from './FloatingLabelInput'

export default function ForgotPassword() {
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
      background: 'radial-gradient(ellipse at top left, #0a0a0a 0%, #000000 50%), radial-gradient(ellipse at bottom right, #111111 0%, #000000 50%)',
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
            <h1 className="split-text-logo">Fourteen Voices</h1>
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
                    fontSize: '1rem',
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
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="star-border-button"
                  >
                    {isLoading ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <span className="loading-spinner" />
                        Sending...
                      </span>
                    ) : (
                      'Send Reset Email'
                    )}
                  </button>
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
                  onClick={() => {
                    // Use window.location for more reliable navigation
                    window.location.href = '/admin'
                  }}
                  style={{
                    fontSize: '1rem',
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
                    fontSize: '1rem',
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
                  <button
                    type="button"
                    onClick={() => {
                      // Use window.location for more reliable navigation
                      window.location.href = '/admin'
                    }}
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}