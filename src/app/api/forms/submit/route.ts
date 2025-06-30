import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const body = await req.json()
    
    const { formId, data } = body
    
    if (!formId || !data) {
      return NextResponse.json(
        { message: 'Form ID and data are required' },
        { status: 400 }
      )
    }
    
    // Verify the form exists
    const form = await payload.findByID({
      collection: 'forms',
      id: formId,
    })
    
    if (!form) {
      return NextResponse.json(
        { message: 'Form not found' },
        { status: 404 }
      )
    }
    
    // Create form submission
    const submission = await payload.create({
      collection: 'formSubmissions',
      data: {
        form: formId,
        data,
        submittedAt: new Date().toISOString(),
        status: 'pending',
      },
    })
    
    // Check if form has redirect settings
    const redirectUrl = form.settings && typeof form.settings === 'object' && 'redirectUrl' in form.settings 
      ? (form.settings as { redirectUrl?: string }).redirectUrl 
      : undefined
    
    return NextResponse.json({
      success: true,
      submission: submission.id,
      redirectUrl,
    })
  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json(
      { message: 'Failed to submit form' },
      { status: 500 }
    )
  }
}