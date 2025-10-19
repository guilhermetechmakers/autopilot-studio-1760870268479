/**
 * Email Template Builder
 * 
 * Core utility for building branded HTML email templates
 * following the Autopilot Studio design system.
 */

import type { EmailConfig } from '@/types/email';

/**
 * Default email configuration
 */
const defaultConfig: EmailConfig = {
  provider: 'sendgrid',
  from: {
    email: 'noreply@autopilotstudio.com',
    name: 'Autopilot Studio',
  },
  replyTo: {
    email: 'support@autopilotstudio.com',
    name: 'Autopilot Studio Support',
  },
  baseUrl: 'https://autopilotstudio.com',
  logoUrl: 'https://autopilotstudio.com/logo.png',
  companyName: 'Autopilot Studio',
  companyAddress: '123 Innovation Drive, Tech City, TC 12345',
  socialLinks: {
    twitter: 'https://twitter.com/autopilotstudio',
    linkedin: 'https://linkedin.com/company/autopilotstudio',
    github: 'https://github.com/autopilotstudio',
  },
};

/**
 * Email template builder class
 */
export class EmailTemplateBuilder {
  private config: EmailConfig;

  constructor(config?: Partial<EmailConfig>) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Build complete HTML email
   */
  buildEmail(content: string, preheader?: string): string {
    return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>${this.config.companyName}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    ${this.getEmailStyles()}
  </style>
</head>
<body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; background-color: #23272F;">
  ${preheader ? this.buildPreheader(preheader) : ''}
  <div role="article" aria-roledescription="email" aria-label="${this.config.companyName}" lang="en">
    <table style="width: 100%; font-family: 'Inter', -apple-system, 'Segoe UI', sans-serif;" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="background-color: #23272F; padding: 24px;">
          <table class="sm-w-full" style="width: 600px;" cellpadding="0" cellspacing="0" role="presentation">
            ${this.buildHeader()}
            ${this.buildContent(content)}
            ${this.buildFooter()}
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Build preheader (preview text)
   */
  private buildPreheader(text: string): string {
    return `
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${text}
  </div>
  <div style="display: none; max-height: 0; overflow: hidden;">
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>
    `;
  }

  /**
   * Build email header
   */
  private buildHeader(): string {
    return `
    <tr>
      <td style="background-color: #2C313A; border-radius: 12px 12px 0 0; padding: 32px 40px;">
        <table style="width: 100%;" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td>
              ${
                this.config.logoUrl
                  ? `<img src="${this.config.logoUrl}" alt="${this.config.companyName}" style="max-width: 180px; height: auto; display: block;">`
                  : `<h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #FFFFFF;">${this.config.companyName}</h1>`
              }
            </td>
          </tr>
        </table>
      </td>
    </tr>
    `;
  }

  /**
   * Build email content area
   */
  private buildContent(content: string): string {
    return `
    <tr>
      <td style="background-color: #2C313A; padding: 40px;">
        ${content}
      </td>
    </tr>
    `;
  }

  /**
   * Build email footer
   */
  private buildFooter(): string {
    const socialLinks = this.buildSocialLinks();
    
    return `
    <tr>
      <td style="background-color: #2C313A; border-radius: 0 0 12px 12px; padding: 32px 40px; border-top: 1px solid #353A43;">
        <table style="width: 100%;" cellpadding="0" cellspacing="0" role="presentation">
          ${socialLinks ? `<tr><td style="padding-bottom: 24px;">${socialLinks}</td></tr>` : ''}
          <tr>
            <td style="font-size: 14px; line-height: 20px; color: #818899; text-align: center;">
              <p style="margin: 0 0 8px;">
                © ${new Date().getFullYear()} ${this.config.companyName}. All rights reserved.
              </p>
              ${this.config.companyAddress ? `<p style="margin: 0 0 16px;">${this.config.companyAddress}</p>` : ''}
              <p style="margin: 0;">
                <a href="${this.config.baseUrl}/privacy" style="color: #72D47A; text-decoration: none;">Privacy Policy</a>
                <span style="color: #353A43; margin: 0 8px;">|</span>
                <a href="${this.config.baseUrl}/terms" style="color: #72D47A; text-decoration: none;">Terms of Service</a>
                <span style="color: #353A43; margin: 0 8px;">|</span>
                <a href="${this.config.baseUrl}/unsubscribe" style="color: #72D47A; text-decoration: none;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    `;
  }

  /**
   * Build social links
   */
  private buildSocialLinks(): string {
    if (!this.config.socialLinks) return '';

    const links = [];
    
    if (this.config.socialLinks.twitter) {
      links.push(`<a href="${this.config.socialLinks.twitter}" style="color: #60B4F7; text-decoration: none; margin: 0 8px;">Twitter</a>`);
    }
    
    if (this.config.socialLinks.linkedin) {
      links.push(`<a href="${this.config.socialLinks.linkedin}" style="color: #60B4F7; text-decoration: none; margin: 0 8px;">LinkedIn</a>`);
    }
    
    if (this.config.socialLinks.github) {
      links.push(`<a href="${this.config.socialLinks.github}" style="color: #60B4F7; text-decoration: none; margin: 0 8px;">GitHub</a>`);
    }

    if (links.length === 0) return '';

    return `
      <table style="width: 100%;" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="text-align: center; font-size: 14px;">
            ${links.join('<span style="color: #353A43; margin: 0 4px;">|</span>')}
          </td>
        </tr>
      </table>
    `;
  }

  /**
   * Get email styles
   */
  private getEmailStyles(): string {
    return `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      body {
        margin: 0;
        padding: 0;
        width: 100%;
        word-break: break-word;
        -webkit-font-smoothing: antialiased;
        background-color: #23272F;
      }
      
      table {
        border-collapse: collapse;
        border-spacing: 0;
      }
      
      img {
        max-width: 100%;
        vertical-align: middle;
        border: 0;
      }
      
      a {
        color: #72D47A;
        text-decoration: none;
      }
      
      a:hover {
        text-decoration: underline;
      }
      
      h1, h2, h3, h4, h5, h6 {
        margin: 0 0 16px;
        font-weight: 700;
        line-height: 1.2;
        color: #FFFFFF;
      }
      
      h1 { font-size: 32px; }
      h2 { font-size: 24px; }
      h3 { font-size: 20px; }
      h4 { font-size: 18px; }
      
      p {
        margin: 0 0 16px;
        font-size: 16px;
        line-height: 24px;
        color: #B0B6C3;
      }
      
      .button {
        display: inline-block;
        padding: 12px 24px;
        font-size: 16px;
        font-weight: 600;
        text-align: center;
        text-decoration: none;
        border-radius: 8px;
        transition: all 0.2s;
      }
      
      .button-primary {
        background-color: #72D47A;
        color: #23272F;
      }
      
      .button-primary:hover {
        background-color: #5FC26A;
        text-decoration: none;
      }
      
      .button-secondary {
        background-color: #353A43;
        color: #FFFFFF;
      }
      
      .button-secondary:hover {
        background-color: #404650;
        text-decoration: none;
      }
      
      .card {
        background-color: #353A43;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 16px;
      }
      
      .divider {
        height: 1px;
        background-color: #353A43;
        margin: 24px 0;
      }
      
      .badge {
        display: inline-block;
        padding: 4px 12px;
        font-size: 14px;
        font-weight: 500;
        border-radius: 12px;
        color: #23272F;
      }
      
      .badge-success { background-color: #72D47A; }
      .badge-warning { background-color: #FFDF6E; }
      .badge-info { background-color: #60B4F7; }
      .badge-danger { background-color: #F47A7A; }
      
      @media only screen and (max-width: 600px) {
        .sm-w-full {
          width: 100% !important;
        }
        
        .sm-px-4 {
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
      }
    `;
  }

  /**
   * Helper: Build button
   */
  buildButton(text: string, url: string, variant: 'primary' | 'secondary' = 'primary'): string {
    return `
      <table cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="padding: 8px 0;">
            <a href="${url}" class="button button-${variant}" style="display: inline-block; padding: 12px 24px; font-size: 16px; font-weight: 600; text-align: center; text-decoration: none; border-radius: 8px; background-color: ${variant === 'primary' ? '#72D47A' : '#353A43'}; color: ${variant === 'primary' ? '#23272F' : '#FFFFFF'};">
              ${text}
            </a>
          </td>
        </tr>
      </table>
    `;
  }

  /**
   * Helper: Build card
   */
  buildCard(content: string): string {
    return `
      <div class="card" style="background-color: #353A43; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
        ${content}
      </div>
    `;
  }

  /**
   * Helper: Build divider
   */
  buildDivider(): string {
    return '<div class="divider" style="height: 1px; background-color: #353A43; margin: 24px 0;"></div>';
  }

  /**
   * Helper: Build badge
   */
  buildBadge(text: string, variant: 'success' | 'warning' | 'info' | 'danger' = 'info'): string {
    const colors = {
      success: '#72D47A',
      warning: '#FFDF6E',
      info: '#60B4F7',
      danger: '#F47A7A',
    };

    return `<span class="badge badge-${variant}" style="display: inline-block; padding: 4px 12px; font-size: 14px; font-weight: 500; border-radius: 12px; background-color: ${colors[variant]}; color: #23272F;">${text}</span>`;
  }

  /**
   * Helper: Build list
   */
  buildList(items: string[], ordered: boolean = false): string {
    const tag = ordered ? 'ol' : 'ul';
    const listItems = items.map(item => `<li style="margin-bottom: 8px; color: #B0B6C3;">${item}</li>`).join('');
    
    return `
      <${tag} style="margin: 0 0 16px; padding-left: 24px; color: #B0B6C3;">
        ${listItems}
      </${tag}>
    `;
  }

  /**
   * Helper: Build table
   */
  buildTable(headers: string[], rows: string[][]): string {
    const headerCells = headers.map(h => `<th style="padding: 12px; text-align: left; font-weight: 600; color: #FFFFFF; border-bottom: 2px solid #353A43;">${h}</th>`).join('');
    const bodyRows = rows.map(row => {
      const cells = row.map(cell => `<td style="padding: 12px; color: #B0B6C3; border-bottom: 1px solid #353A43;">${cell}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    return `
      <table style="width: 100%; margin-bottom: 16px;" cellpadding="0" cellspacing="0">
        <thead>
          <tr>${headerCells}</tr>
        </thead>
        <tbody>
          ${bodyRows}
        </tbody>
      </table>
    `;
  }
}

/**
 * Create default email template builder instance
 */
export const emailBuilder = new EmailTemplateBuilder();
