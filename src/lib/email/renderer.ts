import { Resend } from 'resend'
import { Payload } from 'payload'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailVariable {
  key: string
  value: any
}

interface RenderTemplateOptions {
  templateKey: string
  variables?: Record<string, any>
  recipient: {
    email: string
    name?: string
  }
  payload: Payload
}

function replaceVariables(content: string, variables: Record<string, any>): string {
  let result = content
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    result = result.replace(regex, String(value))
  })
  
  return result
}

async function renderRichText(richTextData: any, variables: Record<string, any>): Promise<string> {
  // TODO: Implement proper rich text to HTML conversion
  // For now, assuming richTextData has an HTML representation
  const html = richTextData?.root?.children?.reduce((acc: string, node: any) => {
    if (node.type === 'paragraph') {
      const text = node.children?.map((child: any) => child.text || '').join('')
      return acc + `<p>${text}</p>`
    }
    return acc
  }, '') || ''
  
  return replaceVariables(html, variables)
}

export async function renderEmailTemplate(options: RenderTemplateOptions): Promise<{
  subject: string
  html: string
  text: string
  fromName?: string
  fromEmail?: string
  replyTo?: string
}> {
  const { templateKey, variables = {}, recipient, payload } = options
  
  const template = await payload.findOne({
    collection: 'email-templates',
    where: {
      key: {
        equals: templateKey,
      },
      active: {
        equals: true,
      },
    },
    depth: 2,
  })
  
  if (!template) {
    throw new Error(`Email template with key "${templateKey}" not found`)
  }
  
  const allVariables = {
    ...variables,
    recipientEmail: recipient.email,
    recipientName: recipient.name || '',
  }
  
  let html = await renderRichText(template.content, allVariables)
  
  if (template.header) {
    const headerHtml = await renderRichText(template.header.content, allVariables)
    html = headerHtml + html
  }
  
  if (template.footer) {
    const footerHtml = await renderRichText(template.footer.content, allVariables)
    html = html + footerHtml
  }
  
  const subject = replaceVariables(template.subject, allVariables)
  const text = replaceVariables(template.plainTextContent || '', allVariables)
  
  return {
    subject,
    html,
    text,
    fromName: template.fromName,
    fromEmail: template.fromEmail,
    replyTo: template.replyTo,
  }
}

export async function sendEmail(options: RenderTemplateOptions & {
  scheduleAt?: Date
  tags?: string[]
}): Promise<string> {
  const { recipient, scheduleAt, tags = [], payload } = options
  
  const rendered = await renderEmailTemplate(options)
  
  const emailData = {
    from: rendered.fromEmail 
      ? `${rendered.fromName || '14voices'} <${rendered.fromEmail}>`
      : undefined,
    to: recipient.email,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    replyTo: rendered.replyTo,
    tags,
    scheduledAt: scheduleAt?.toISOString(),
  }
  
  const result = await resend.emails.send(emailData)
  
  if (result.error) {
    throw new Error(result.error.message)
  }
  
  await payload.create({
    collection: 'email-logs',
    data: {
      recipient: recipient.id || recipient.email,
      recipientEmail: recipient.email,
      template: options.templateKey,
      subject: rendered.subject,
      status: 'sent',
      sentAt: new Date(),
      resendId: result.data?.id,
    },
  })
  
  return result.data?.id || ''
}