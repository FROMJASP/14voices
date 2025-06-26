import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/utilities/payload'
import { headers } from 'next/headers'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const payload = await getPayload()
    const headersList = await headers()
    
    // Authenticate user
    const { user } = await payload.auth({ headers: headersList })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Fetch the script
    const script = await payload.findByID({
      collection: 'scripts',
      id,
      depth: 1,
    })
    
    if (!script) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }
    
    // Check access permissions
    const hasAccess = 
      user.role === 'admin' ||
      script.uploadedBy === user.id ||
      (script.sharedWithVoiceovers && script.booking?.voiceover === user.id)
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
    
    // Log access
    await payload.update({
      collection: 'scripts',
      id,
      data: {
        accessLog: [
          ...(script.accessLog || []),
          {
            accessedBy: user.id,
            accessedAt: new Date().toISOString(),
            action: 'viewed',
          },
        ],
      },
    })
    
    // Return script data
    if (script.type === 'text') {
      return NextResponse.json({
        id: script.id,
        type: 'text',
        content: script.textContent,
        fileName: script.fileName,
        booking: script.booking,
      })
    } else {
      // For file uploads, return the secure URL
      return NextResponse.json({
        id: script.id,
        type: 'file',
        fileUrl: script.fileUrl,
        fileName: script.fileName,
        fileSize: script.fileSize,
        booking: script.booking,
      })
    }
  } catch (error) {
    console.error('Error fetching script:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const payload = await getPayload()
    const headersList = await headers()
    
    const { user } = await payload.auth({ headers: headersList })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const script = await payload.findByID({
      collection: 'scripts',
      id,
    })
    
    if (!script) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }
    
    // Only admin or owner can delete
    if (user.role !== 'admin' && script.uploadedBy !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
    
    await payload.delete({
      collection: 'scripts',
      id,
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting script:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}