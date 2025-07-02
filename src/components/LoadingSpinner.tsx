interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  fullScreen?: boolean
}

export function LoadingSpinner({ 
  size = 'medium', 
  text = 'Laden...', 
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-8 w-8 border-2',
    medium: 'h-12 w-12 border-4',
    large: 'h-16 w-16 border-4'
  }

  const spinner = (
    <div className="text-center">
      <div className={`inline-block animate-spin rounded-full border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}></div>
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {spinner}
      </div>
    )
  }

  return spinner
}