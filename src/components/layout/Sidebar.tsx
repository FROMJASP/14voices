interface SidebarProps {
  config: any
}

export function Sidebar({ config }: SidebarProps) {
  const widthClasses = {
    narrow: 'w-[250px]',
    medium: 'w-[300px]',
    wide: 'w-[350px]',
  }

  return (
    <aside className={`sidebar ${widthClasses[config?.width as keyof typeof widthClasses] || 'w-[300px]'} ${config?.sticky ? 'sticky top-4' : ''}`}>
      {/* Sidebar widgets will go here */}
      <div className="space-y-6">
        {config?.widgets?.map((widget: any, index: number) => (
          <div key={index} className="bg-gray-100 p-4 rounded">
            <p>Widget: {widget.type}</p>
          </div>
        ))}
      </div>
    </aside>
  )
}