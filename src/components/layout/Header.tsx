interface HeaderProps {
  config: any
}

export function Header({ config }: HeaderProps) {
  return (
    <header className={`header header--${config?.style || 'standard'}`}>
      <div className="container mx-auto px-4">
        {/* Header implementation will go here */}
        <div className="py-4">
          <p>Header - {config?.style}</p>
        </div>
      </div>
    </header>
  )
}