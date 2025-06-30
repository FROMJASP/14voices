import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@/payload.config'

export async function GET(request: Request) {
  try {
    const payload = await getPayloadHMR({ config })
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'nl'
    
    // Fetch voiceovers with status 'active' or 'more-voices'
    const voiceovers = await payload.find({
      collection: 'voiceovers',
      where: {
        status: {
          in: ['active', 'more-voices'],
        },
      },
      depth: 2, // Include related media
      locale,
    })

    return NextResponse.json({
      success: true,
      data: voiceovers.docs,
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