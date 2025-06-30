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
    
    // Build where clause
    const whereClause: any = {}
    
    if (slug) {
      whereClause.slug = { equals: slug }
    } else {
      whereClause.status = { in: ['active', 'more-voices'] }
    }
    
    // Fetch voiceovers
    const voiceovers = await payload.find({
      collection: 'voiceovers',
      where: whereClause,
      depth: 2, // Include related media and group
      locale,
    })

    // Transform data to match frontend expectations
    const transformedData = voiceovers.docs.map((voiceover: PayloadVoiceover): TransformedVoiceover => {
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
        voiceover.additionalDemos.forEach((demoItem: any) => {
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

    return NextResponse.json({
      success: true,
      docs: transformedData,
      data: transformedData, // Keep for backward compatibility
      totalDocs: voiceovers.totalDocs,
    })
  } catch (error) {
    console.error('Error fetching voiceovers:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch voiceovers' 
      },
      { status: 500 }
    )
  }
}