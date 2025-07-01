import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { LayoutWrapper } from '@/components/LayoutWrapper'
import { notFound } from 'next/navigation'
import type { Layout } from '@/payload-types'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function LayoutPreviewPage({ params }: PageProps) {
  const { id } = await params
  const payload = await getPayload({ config: configPromise })
  
  try {
    const layout = await payload.findByID({
      collection: 'layouts',
      id: id,
      depth: 2,
    }) as Layout

    if (!layout) {
      notFound()
    }

    // Sample content for preview
    const sampleContent = (
      <div className="prose prose-lg max-w-none">
        <h1>Layout Preview: {layout.name}</h1>
        <p className="lead">
          This is a preview of the &quot;{layout.name}&quot; layout. The header and footer shown here reflect your current configuration.
        </p>
        
        <h2>Sample Content Section</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        
        <h3>Features of this Layout</h3>
        <ul>
          <li>Layout Type: {layout.type}</li>
          <li>Container Width: {layout.containerWidth || 'standard'}</li>
          <li>Header Style: {(() => {
            if (layout.header && typeof layout.header === 'object' && 'style' in layout.header) {
              return String(layout.header.style || 'default');
            }
            return 'default';
          })()}</li>
          <li>Footer Style: {(() => {
            if (layout.footer && typeof layout.footer === 'object' && 'style' in layout.footer) {
              return String(layout.footer.style || 'default');
            }
            return 'default';
          })()}</li>
          <li>Sidebar: {(() => {
            if (layout.sidebar && typeof layout.sidebar === 'object' && 'enabled' in layout.sidebar && layout.sidebar.enabled) {
              return `Enabled (${layout.sidebar.position || 'right'})`;
            }
            return 'Disabled';
          })()}</li>
        </ul>
        
        <h3>Content Area</h3>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        
        <blockquote>
          &quot;This preview helps you visualize how your content will appear with the current layout settings.&quot;
        </blockquote>
        
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
          totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </p>
      </div>
    )

    return <LayoutWrapper layout={layout}>{sampleContent}</LayoutWrapper>
  } catch (error) {
    console.error('Error loading layout preview:', error)
    notFound()
  }
}