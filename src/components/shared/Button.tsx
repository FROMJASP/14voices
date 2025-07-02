import Link from 'next/link'

export interface ButtonProps {
  text: string
  link: string
  style?: 'primary' | 'secondary' | 'outline'
  className?: string
  isDarkBg?: boolean
  size?: 'small' | 'medium' | 'large'
}

const sizeClasses = {
  small: 'px-6 py-2 text-sm',
  medium: 'px-8 py-3',
  large: 'px-8 py-4 text-lg',
}

export function Button({ 
  text, 
  link, 
  style = 'primary', 
  className = '', 
  isDarkBg = false,
  size = 'medium' 
}: ButtonProps) {
  const baseClasses = 'inline-block rounded-lg font-semibold transition-all'
  
  const styleClasses = {
    primary: isDarkBg
      ? 'bg-white text-blue-600 hover:bg-gray-100'
      : 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: isDarkBg
      ? 'bg-blue-700 text-white hover:bg-blue-800'
      : 'bg-white text-gray-900 hover:bg-gray-100',
    outline: isDarkBg
      ? 'border-2 border-white text-white hover:bg-white hover:text-gray-900'
      : 'border-2 border-current hover:bg-white hover:text-gray-900',
  }

  return (
    <Link
      href={link}
      className={`${baseClasses} ${sizeClasses[size]} ${styleClasses[style]} ${className}`}
    >
      {text}
    </Link>
  )
}