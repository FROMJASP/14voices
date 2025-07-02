import React from 'react'
import Link from 'next/link'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ 
  href, 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-lg'
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
  
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

interface SectionProps {
  className?: string
  children: React.ReactNode
}

export function Section({ className = '', children }: SectionProps) {
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      {children}
    </section>
  )
}

interface ContainerProps {
  className?: string
  children: React.ReactNode
}

export function Container({ className = '', children }: ContainerProps) {
  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

interface HeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  className?: string
  children: React.ReactNode
}

export function Heading({ as: Component = 'h2', className = '', children }: HeadingProps) {
  const sizeClasses = {
    h1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
    h2: 'text-3xl md:text-4xl lg:text-5xl font-bold',
    h3: 'text-2xl md:text-3xl lg:text-4xl font-semibold',
    h4: 'text-xl md:text-2xl lg:text-3xl font-semibold',
    h5: 'text-lg md:text-xl lg:text-2xl font-medium',
    h6: 'text-base md:text-lg lg:text-xl font-medium'
  }
  
  return (
    <Component className={`${sizeClasses[Component]} ${className}`}>
      {children}
    </Component>
  )
}

interface TextProps {
  className?: string
  children: React.ReactNode
}

export function Text({ className = '', children }: TextProps) {
  return (
    <p className={`text-base md:text-lg text-gray-600 ${className}`}>
      {children}
    </p>
  )
}