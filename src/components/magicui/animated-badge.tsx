"use client"

import { cn } from "@/lib/utils"
import { motion } from "motion/react"

interface AnimatedBadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
  animate?: boolean
}

export function AnimatedBadge({ 
  children, 
  className,
  variant = 'default',
  animate = true
}: AnimatedBadgeProps) {
  const variants = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-input bg-background",
    destructive: "bg-destructive text-destructive-foreground",
  }

  const Component = animate ? motion.div : 'div'
  const animateProps = animate ? {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 }
  } : {}

  return (
    <Component
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...animateProps}
    >
      {children}
    </Component>
  )
}