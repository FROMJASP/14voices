import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/utilities/payload'

interface ContentNode {
  type: string
  children?: Array<{ text?: string }>
}

function replaceVariables(content: string, variables: Record<string, string | number | boolean>): string {
  let result = content
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    result = result.replace(regex, String(value))
  })
  
  return result
}

export async function POST(req: NextRequest) {
  try {
    const { content, header, footer, testData } = await req.json()
    const payload = await getPayload()
    
    let html = '<html><body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">'
    html += '<div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px;">'
    
    // Add header if exists
    if (header) {
      const headerComponent = await payload.findByID({
        collection: 'email-components',
        id: header,
      })
      
      if (headerComponent) {
        const headerContent = headerComponent.content?.root?.children?.reduce((acc: string, node: ContentNode) => {
          if (node.type === 'paragraph') {
            const text = node.children?.map((child) => child.text || '').join('')
            return acc + `<p>${text}</p>`
          }
          return acc
        }, '') || ''
        
        html += replaceVariables(headerContent, testData)
        html += '<hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">'
      }
    }
    
    // Add main content
    const mainContent = content?.root?.children?.reduce((acc: string, node: ContentNode) => {
      if (node.type === 'paragraph') {
        const text = node.children?.map((child) => child.text || '').join('')
        return acc + `<p>${text}</p>`
      }
      return acc
    }, '') || ''
    
    html += replaceVariables(mainContent, testData)
    
    // Add footer if exists
    if (footer) {
      const footerComponent = await payload.findByID({
        collection: 'email-components',
        id: footer,
      })
      
      if (footerComponent) {
        html += '<hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">'
        
        const footerContent = footerComponent.content?.root?.children?.reduce((acc: string, node: ContentNode) => {
          if (node.type === 'paragraph') {
            const text = node.children?.map((child) => child.text || '').join('')
            return acc + `<p style="font-size: 12px; color: #666;">${text}</p>`
          }
          return acc
        }, '') || ''
        
        html += replaceVariables(footerContent, testData)
      }
    }
    
    html += '</div></body></html>'
    
    return NextResponse.json({ html })
  } catch (error) {
    console.error('Preview generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    )
  }
}