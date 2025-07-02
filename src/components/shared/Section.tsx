import { ReactNode } from 'react'

export interface SectionProps {
  children: ReactNode
  className?: string
  backgroundColor?: 'white' | 'gray' | 'primary' | 'dark'
  spacing?: 'small' | 'medium' | 'large'
}

const bgClasses = {
  white: 'bg-white',
  gray: 'bg-gray-100',
  primary: 'bg-blue-600',
  dark: 'bg-gray-900',
}

const spacingClasses = {
  small: 'py-12 md:py-16',
  medium: 'py-16 md:py-20',
  large: 'py-20 md:py-32',
}

export function Section({ 
  children, 
  className = '', 
  backgroundColor = 'white',
  spacing = 'medium'
}: SectionProps) {
  return (
    <section className={`${bgClasses[backgroundColor]} ${spacingClasses[spacing]} ${className}`}>
      {children}
    </section>
  )
}