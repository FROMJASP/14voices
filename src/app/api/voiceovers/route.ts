import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@/payload.config'
import type { PayloadVoiceover, TransformedVoiceover, VoiceoverDemo } from '@/types/voiceover'

export async function GET(request: Request) {
  try {
    const payload = await getPayloadHMR({ config })
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'nl'
    const slug = searchParams.get('where[slug][equals]')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)
    
    // Build where clause
    const whereClause: any = {}
    
    if (slug) {
      whereClause.slug = { equals: slug }
    } else {
      whereClause.status = { in: ['active', 'more-voices'] }
    }
    
    // Fetch voiceovers with pagination
    const voiceovers = await payload.find({
      collection: 'voiceovers',
      where: whereClause,
      depth: slug ? 2 : 1, // Full depth only for single voiceover
      locale,
      page,
      limit,
      sort: '-createdAt',
    })

    // Transform data to match frontend expectations
    const transformedData = voiceovers.docs.map((doc): TransformedVoiceover => {
      const voiceover = doc as unknown as PayloadVoiceover
      const demos: VoiceoverDemo[] = []
      
      // Add primary demo if it exists
      if (voiceover.primaryDemo && typeof voiceover.primaryDemo === 'object') {
        demos.push({
          id: voiceover.primaryDemo.id,
          title: 'Primary Demo',
          demoType: 'reel',
          audioFile: {
            url: voiceover.primaryDemo.url || '',
            filename: voiceover.primaryDemo.filename || ''
          },
          isPrimary: true,
          voiceover: {
            id: voiceover.id,
            name: voiceover.name,
            slug: voiceover.slug || voiceover.id
          }
        })
      }
      
      // Add additional demos
      if (voiceover.additionalDemos && Array.isArray(voiceover.additionalDemos)) {
        voiceover.additionalDemos.forEach((demoItem) => {
          if (demoItem.demo && typeof demoItem.demo === 'object') {
            demos.push({
              id: demoItem.demo.id,
              title: demoItem.title || 'Demo',
              demoType: 'commercials',
              audioFile: {
                url: demoItem.demo.url || '',
                filename: demoItem.demo.filename || ''
              },
              description: demoItem.description,
              isPrimary: false,
              voiceover: {
                id: voiceover.id,
                name: voiceover.name,
                slug: voiceover.slug || voiceover.id
              }
            })
          }
        })
      }
      
      return {
        id: voiceover.id,
        name: voiceover.name,
        slug: voiceover.slug || voiceover.id,
        bio: voiceover.description,
        profilePhoto: voiceover.profilePhoto && typeof voiceover.profilePhoto === 'object' ? {
          url: voiceover.profilePhoto.url || '',
          alt: voiceover.name
        } : undefined,
        demos,
        status: voiceover.status,
        group: voiceover.group && typeof voiceover.group === 'object' ? voiceover.group : undefined,
        styleTags: voiceover.styleTags
      }
    })

    const response = NextResponse.json({
      success: true,
      docs: transformedData,
      data: transformedData, // Keep for backward compatibility
      totalDocs: voiceovers.totalDocs,
      totalPages: voiceovers.totalPages,
      page: voiceovers.page,
      limit: voiceovers.limit,
      hasNextPage: voiceovers.hasNextPage,
      hasPrevPage: voiceovers.hasPrevPage,
    })

    // Add caching headers
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    response.headers.set('CDN-Cache-Control', 'max-age=3600')
    
    return response
  } catch (error) {
    // Log error to monitoring service in production
    if (error instanceof Error) {
      // TODO: Send to monitoring service
      // logError({ message: error.message, stack: error.stack })
    }
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch voiceovers' 
      },
      { status: 500 }
    )
  }
}