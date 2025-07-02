import { ReactNode } from 'react'

export interface HeadingProps {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: '1' | '2' | '3' | '4' | '5' | '6'
  className?: string
  color?: 'default' | 'white' | 'gray'
}

const sizeClasses = {
  '1': 'text-4xl md:text-6xl lg:text-7xl',
  '2': 'text-3xl md:text-4xl lg:text-5xl',
  '3': 'text-2xl md:text-3xl lg:text-4xl',
  '4': 'text-xl md:text-2xl lg:text-3xl',
  '5': 'text-lg md:text-xl lg:text-2xl',
  '6': 'text-base md:text-lg lg:text-xl',
}

const colorClasses = {
  default: 'text-gray-900',
  white: 'text-white',
  gray: 'text-gray-600',
}

export function Heading({ 
  children, 
  as: Tag = 'h2', 
  size = '2',
  className = '',
  color = 'default'
}: HeadingProps) {
  return (
    <Tag className={`font-bold ${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      {children}
    </Tag>
  )
}