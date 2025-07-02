import { ReactNode } from 'react'

export interface TextProps {
  children: ReactNode
  className?: string
  size?: 'small' | 'base' | 'large' | 'xl'
  color?: 'default' | 'muted' | 'white' | 'white-muted'
}

const sizeClasses = {
  small: 'text-sm',
  base: 'text-base',
  large: 'text-lg',
  xl: 'text-lg md:text-xl lg:text-2xl',
}

const colorClasses = {
  default: 'text-gray-600',
  muted: 'text-gray-500',
  white: 'text-white',
  'white-muted': 'text-white/90',
}

export function Text({ 
  children, 
  className = '',
  size = 'base',
  color = 'default'
}: TextProps) {
  return (
    <p className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      {children}
    </p>
  )
}