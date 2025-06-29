'use client'

import React from 'react'
import { motion } from 'motion/react'

interface StarBorderButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export const StarBorderButton: React.FC<StarBorderButtonProps> = ({
  children,
  onClick,
  disabled,
  type = 'button',
  className,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`star-border-button ${className || ''}`}
      style={{ position: 'relative' }}
    >
      <div className="star-border-container">
        <svg
          className="star-border-svg"
          viewBox="0 0 200 60"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="star-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <motion.rect
            x="1"
            y="1"
            width="198"
            height="58"
            rx="8"
            fill="none"
            stroke="url(#star-gradient)"
            strokeWidth="2"
            strokeDasharray="4 4"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -8 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </svg>
        {!disabled && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="star-particle"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: [0, (i - 1) * 30],
                  y: [0, -20 + i * 10],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: 'easeOut',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <path
                    d="M6 0L7.34 4.66L12 6L7.34 7.34L6 12L4.66 7.34L0 6L4.66 4.66L6 0Z"
                    fill="#ffffff"
                    opacity="0.7"
                  />
                </svg>
              </motion.div>
            ))}
          </>
        )}
      </div>
      <span className="star-border-content">{children}</span>
    </button>
  )
}