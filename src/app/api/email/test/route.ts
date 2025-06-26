import { NextRequest, NextResponse } from 'next/server'
import { getServerSideUser } from '@/utilities/payload'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const user = await getServerSideUser()
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { content, subject, header, footer, testData } = await req.json()
    
    // Use the same preview generation logic
    const previewResponse = await fetch(new URL('/api/email/preview', req.url).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, subject, header, footer, testData }),
    })
    
    const { html } = await previewResponse.json()
    
    // Send test email to the admin user
    if (!user.email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 })
    }
    
    const result = await resend.emails.send({
      from: `Test Email <noreply@14voices.com>`,
      to: user.email,
      subject: `[TEST] ${subject || 'Email Preview'}`,
      html,
      text: 'This is a test email from the email template editor.',
      tags: [{ name: 'test', value: 'test' }, { name: 'preview', value: 'preview' }],
    })
    
    if (result.error) {
      throw new Error(result.error.message)
    }
    
    return NextResponse.json({ success: true, id: result.data?.id })
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    )
  }
}