import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayloadHMR({ config })
    
    // Count voiceovers
    const voiceovers = await payload.count({
      collection: 'voiceovers',
    })
    
    // Get first few voiceovers
    const sampleVoiceovers = await payload.find({
      collection: 'voiceovers',
      limit: 3,
    })
    
    return NextResponse.json({
      success: true,
      totalVoiceovers: voiceovers.totalDocs,
      samples: sampleVoiceovers.docs.map(v => ({
        id: v.id,
        name: v.name,
        status: v.status,
      })),
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    })
  }
}