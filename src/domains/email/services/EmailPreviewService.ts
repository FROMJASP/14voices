import { EmailRepository } from '../repositories/EmailRepository';
import { EmailPreviewParams } from '../types';

interface ContentNode {
  type: string;
  children?: Array<{ text?: string }>;
}

export class EmailPreviewService {
  constructor(private emailRepository: EmailRepository) {}

  async generatePreview(params: EmailPreviewParams): Promise<string> {
    const { templateId, data = {} } = params;

    // Get the template
    const template = await this.emailRepository.getEmailTemplate(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    let html = this.getHtmlWrapper();

    // Add header if exists
    if (template.header) {
      const headerHtml = await this.renderComponent(template.header, data);
      html += headerHtml;
      html += this.getHtmlDivider();
    }

    // Add main content
    const mainContent = this.extractContent(template.content);
    html += this.replaceVariables(mainContent, data);

    // Add footer if exists
    if (template.footer) {
      html += this.getHtmlDivider();
      const footerHtml = await this.renderComponent(template.footer, data);
      html += footerHtml;
    }

    html += this.getHtmlClosing();

    return html;
  }

  private async renderComponent(componentId: string, data: Record<string, any>): Promise<string> {
    const component = await this.emailRepository.payload.findByID({
      collection: 'email-components',
      id: componentId,
    });

    if (!component) {
      return '';
    }

    const content = this.extractContent(component.content);
    return this.replaceVariables(content, data);
  }

  private extractContent(content: any): string {
    if (!content?.root?.children) {
      return '';
    }

    return content.root.children.reduce((acc: string, node: ContentNode) => {
      if (node.type === 'paragraph') {
        const text = node.children?.map((child) => child.text || '').join('') || '';
        return acc + `<p>${text}</p>`;
      }
      return acc;
    }, '');
  }

  private replaceVariables(
    content: string,
    variables: Record<string, string | number | boolean>
  ): string {
    let result = content;

    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, String(value));
    });

    return result;
  }

  private getHtmlWrapper(): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px;">
    `;
  }

  private getHtmlDivider(): string {
    return '<hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">';
  }

  private getHtmlClosing(): string {
    return '</div></body></html>';
  }
}
