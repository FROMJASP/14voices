'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface FloatingLabelInputProps {
  type: 'text' | 'email' | 'password'
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  autoComplete?: string
  id: string
  showPasswordToggle?: boolean
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  type: initialType,
  label,
  value,
  onChange,
  required,
  autoComplete,
  id,
  showPasswordToggle = false,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [hasValue, setHasValue] = useState(false)
  const [isAutofilled, setIsAutofilled] = useState(false)

  useEffect(() => {
    setHasValue(value.length > 0)
  }, [value])

  // Check for autofill on mount and periodically
  useEffect(() => {
    const checkAutofill = () => {
      if (inputRef.current) {
        try {
          // Check if the input matches the autofill pseudo-selector
          const isAutofilledNow = inputRef.current.matches(':-webkit-autofill') || 
                                   inputRef.current.matches(':autofill')
          setIsAutofilled(isAutofilledNow)
          
          // Also check if there's a value but no user interaction
          if (!hasValue && inputRef.current.value) {
            setHasValue(true)
            setIsAutofilled(true)
          }
        } catch {
          // Fallback for browsers that don't support :autofill selector
          if (!hasValue && inputRef.current.value) {
            setHasValue(true)
            setIsAutofilled(true)
          }
        }
      }
    }

    // Check immediately
    checkAutofill()

    // Check periodically for the first 2 seconds (for slow autofill)
    const intervals = [100, 200, 500, 1000, 2000]
    const timeouts = intervals.map(delay => 
      setTimeout(checkAutofill, delay)
    )

    // Also check on animation events which can indicate autofill
    const handleAnimationStart = (e: AnimationEvent) => {
      if (e.animationName === 'onAutoFillStart') {
        setIsAutofilled(true)
        setHasValue(true)
      }
    }

    const currentInput = inputRef.current
    currentInput?.addEventListener('animationstart', handleAnimationStart)

    return () => {
      timeouts.forEach(clearTimeout)
      currentInput?.removeEventListener('animationstart', handleAnimationStart)
    }
  }, [hasValue])

  const type = showPassword ? 'text' : initialType

  return (
    <div className="floating-label-container">
      <div className="floating-label-wrapper">
        <input
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          autoComplete={autoComplete}
          placeholder=" "
          className="floating-label-input"
          aria-label={label}
        />
        <motion.label
          htmlFor={id}
          className="floating-label"
          animate={{
            scale: isFocused || hasValue || isAutofilled ? 0.75 : 1,
            y: isFocused || hasValue || isAutofilled ? -24 : 0,
            x: isFocused || hasValue || isAutofilled ? -10 : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {label}
        </motion.label>
        {showPasswordToggle && initialType === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle"
            tabIndex={-1}
          >
            <AnimatePresence mode="wait">
              {showPassword ? (
                <motion.svg
                  key="eye-off"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="eye"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        )}
        <motion.div
          className="input-border-glow"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      </div>
    </div>
  )
}