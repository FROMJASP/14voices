import { NextResponse } from 'next/server'
import { getNavigationData, formatNavigation } from '@/lib/navigation'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const navigationData = await getNavigationData()
    const formattedNav = formatNavigation(navigationData)

    // Cache for 5 minutes
    return NextResponse.json(formattedNav, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Failed to fetch navigation:', error)
    
    // Return default navigation as fallback
    const defaultNav = {
      mainMenu: [
        { label: 'Home', href: '/', type: 'page' },
        { label: 'Stemmen', href: '/#stemmen', type: 'anchor', isAnchor: true },
        { label: 'Prijzen', href: '/#prijzen', type: 'anchor', isAnchor: true },
        { label: 'Blog', href: '/#blog', type: 'anchor', isAnchor: true },
        { label: 'Contact', href: '/#contact', type: 'anchor', isAnchor: true },
      ]
    }
    
    return NextResponse.json(defaultNav, { status: 200 })
  }
}