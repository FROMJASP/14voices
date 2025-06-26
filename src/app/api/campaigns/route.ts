import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/utilities/payload'
import type { Where } from 'payload'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    const where: Where = {}
    if (status) {
      where.status = { equals: status }
    }

    const campaigns = await payload.find({
      collection: 'email-campaigns',
      where,
      limit,
      page,
      depth: 2,
      sort: '-createdAt',
    })

    return NextResponse.json({
      campaigns: campaigns.docs,
      totalDocs: campaigns.totalDocs,
      totalPages: campaigns.totalPages,
      page: campaigns.page,
      limit: campaigns.limit,
    })
  } catch (error) {
    console.error('Failed to fetch campaigns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload()
    const data = await req.json()

    const campaign = await payload.create({
      collection: 'email-campaigns',
      data,
    })

    return NextResponse.json({ campaign })
  } catch (error) {
    console.error('Failed to create campaign:', error)
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
}