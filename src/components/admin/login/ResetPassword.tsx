'use client'

import React, { useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import { BackgroundBeams } from './BackgroundBeams'
import { FloatingLabelInput } from './FloatingLabelInput'

export default function ResetPassword() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!password) {
      setError('Please enter a new password')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!token) {
      setError('Invalid or missing reset token')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          password 
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Password reset successful! Redirecting to login...')
        setTimeout(() => {
          window.location.href = '/admin'
        }, 2000)
      } else {
        setError(data.errors?.[0]?.message || 'Unable to reset password. The link may have expired.')
        toast.error('Failed to reset password')
      }
    } catch {
      setError('An error occurred. Please try again.')
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [password, confirmPassword, token])

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
              Create New Password
            </motion.p>
          </motion.div>
          
          <form onSubmit={handleSubmit} noValidate>
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
              Enter your new password below.
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
                id="password"
                type="password"
                label="New Password"
                value={password}
                onChange={setPassword}
                required
                autoComplete="new-password"
                showPasswordToggle
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <FloatingLabelInput
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                required
                autoComplete="new-password"
                showPasswordToggle
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{ marginTop: '1.5rem' }}
            >
              <button
                type="submit"
                disabled={isLoading}
                className="star-border-button"
              >
                {isLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span className="loading-spinner" />
                    Resetting...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ 
                textAlign: 'center', 
                marginTop: '1.5rem'
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
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  font: 'inherit',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                Back to login
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}