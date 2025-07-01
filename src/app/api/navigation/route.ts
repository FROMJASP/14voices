import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import configPromise from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const result = await payload.find({
      collection: 'navigation',
      depth: 2,
      limit: 1,
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching navigation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch navigation' },
      { status: 500 }
    )
  }
}