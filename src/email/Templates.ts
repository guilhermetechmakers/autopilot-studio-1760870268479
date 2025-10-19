/**
 * Email Templates
 * 
 * Branded transactional email templates for verification, invoices,
 * standups, and summaries following Autopilot Studio design system.
 */

import { emailBuilder, EmailTemplateBuilder } from './EmailTemplateBuilder';
import type {
  VerificationEmailData,
  PasswordResetEmailData,
  WelcomeEmailData,
  InvoiceEmailData,
  InvoiceReminderEmailData,
  StandupSummaryEmailData,
  ProjectSummaryEmailData,
  MilestoneCompleteEmailData,
  TaskAssignedEmailData,
  ProposalSentEmailData,
  ContractSignedEmailData,
  HandoverReadyEmailData,
  NotificationEmailData,
} from '@/types/email';

/**
 * Email Templates Class
 */
export class EmailTemplates {
  private builder: EmailTemplateBuilder;

  constructor(builder?: EmailTemplateBuilder) {
    this.builder = builder || emailBuilder;
  }

  /**
   * Email Verification Template
   */
  verification(data: VerificationEmailData): { subject: string; html: string; text: string } {
    const content = `
      <h1>Verify Your Email Address</h1>
      <p>Hi ${data.userName},</p>
      <p>Thanks for signing up with Autopilot Studio! To complete your registration and start automating your development workflow, please verify your email address.</p>
      
      ${this.builder.buildButton('Verify Email Address', data.verificationLink)}
      
      <p style="margin-top: 24px;">This verification link will expire in ${data.expiresIn}.</p>
      
      ${this.builder.buildDivider()}
      
      <p style="font-size: 14px; color: #818899;">
        If you didn't create an account with Autopilot Studio, you can safely ignore this email.
      </p>
      
      <p style="font-size: 14px; color: #818899;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="${data.verificationLink}" style="color: #60B4F7; word-break: break-all;">${data.verificationLink}</a>
      </p>
      
      <p style="font-size: 14px; color: #818899;">
        Need help? Contact us at <a href="mailto:${data.supportEmail}" style="color: #72D47A;">${data.supportEmail}</a>
      </p>
    `;

    return {
      subject: 'Verify Your Email Address - Autopilot Studio',
      html: this.builder.buildEmail(content, 'Complete your registration by verifying your email address'),
      text: this.generatePlainText('Verify Your Email Address', data.userName, [
        'Thanks for signing up with Autopilot Studio!',
        `To complete your registration, please verify your email address by visiting: ${data.verificationLink}`,
        `This link will expire in ${data.expiresIn}.`,
        "If you didn't create an account, you can safely ignore this email.",
        `Need help? Contact us at ${data.supportEmail}`,
      ]),
    };
  }

  /**
   * Password Reset Template
   */
  passwordReset(data: PasswordResetEmailData): { subject: string; html: string; text: string } {
    const content = `
      <h1>Reset Your Password</h1>
      <p>Hi ${data.userName},</p>
      <p>We received a request to reset your password for your Autopilot Studio account. Click the button below to create a new password.</p>
      
      ${this.builder.buildButton('Reset Password', data.resetLink)}
      
      <p style="margin-top: 24px;">This password reset link will expire in ${data.expiresIn}.</p>
      
      ${data.ipAddress ? this.builder.buildCard(`<p style="margin: 0; font-size: 14px; color: #B0B6C3;"><strong>Security Notice:</strong> This request was made from IP address ${data.ipAddress}</p>`) : ''}
      
      ${this.builder.buildDivider()}
      
      <p style="font-size: 14px; color: #818899;">
        If you didn't request a password reset, please ignore this email or contact our support team if you have concerns about your account security.
      </p>
      
      <p style="font-size: 14px; color: #818899;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="${data.resetLink}" style="color: #60B4F7; word-break: break-all;">${data.resetLink}</a>
      </p>
      
      <p style="font-size: 14px; color: #818899;">
        Need help? Contact us at <a href="mailto:${data.supportEmail}" style="color: #72D47A;">${data.supportEmail}</a>
      </p>
    `;

    return {
      subject: 'Reset Your Password - Autopilot Studio',
      html: this.builder.buildEmail(content, 'Reset your password to regain access to your account'),
      text: this.generatePlainText('Reset Your Password', data.userName, [
        'We received a request to reset your password.',
        `To reset your password, visit: ${data.resetLink}`,
        `This link will expire in ${data.expiresIn}.`,
        data.ipAddress ? `Security Notice: This request was made from IP address ${data.ipAddress}` : '',
        "If you didn't request this, please ignore this email.",
        `Need help? Contact us at ${data.supportEmail}`,
      ].filter(Boolean)),
    };
  }

  /**
   * Welcome Email Template
   */
  welcome(data: WelcomeEmailData): { subject: string; html: string; text: string } {
    const content = `
      <h1>Welcome to Autopilot Studio! 🎉</h1>
      <p>Hi ${data.userName},</p>
      <p>Your email has been verified and your account is ready to go! We're excited to help you automate your entire development workflow—from lead intake to project handover.</p>
      
      <h3 style="margin-top: 32px;">Get Started in Minutes</h3>
      ${this.builder.buildList([
        '<strong>Explore Your Dashboard:</strong> See your projects, proposals, and team activity at a glance',
        '<strong>Set Up Integrations:</strong> Connect GitHub, GitLab, Vercel, and your calendar',
        '<strong>Create Your First Project:</strong> Use our AI-assisted intake wizard to capture requirements',
        '<strong>Invite Your Team:</strong> Collaborate with team members and clients',
      ])}
      
      ${this.builder.buildButton('Go to Dashboard', data.dashboardLink)}
      
      ${this.builder.buildDivider()}
      
      <h3>Resources to Help You Succeed</h3>
      <p>Check out our <a href="${data.gettingStartedLink}" style="color: #72D47A;">Getting Started Guide</a> for tips on making the most of Autopilot Studio.</p>
      
      <p style="margin-top: 24px;">
        Have questions? Our support team is here to help at <a href="mailto:${data.supportEmail}" style="color: #72D47A;">${data.supportEmail}</a>
      </p>
    `;

    return {
      subject: 'Welcome to Autopilot Studio! 🎉',
      html: this.builder.buildEmail(content, 'Your account is ready! Start automating your development workflow today'),
      text: this.generatePlainText('Welcome to Autopilot Studio!', data.userName, [
        'Your email has been verified and your account is ready!',
        'Get started by:',
        '- Exploring your dashboard',
        '- Setting up integrations',
        '- Creating your first project',
        '- Inviting your team',
        `Visit your dashboard: ${data.dashboardLink}`,
        `Getting started guide: ${data.gettingStartedLink}`,
        `Need help? Contact us at ${data.supportEmail}`,
      ]),
    };
  }

  /**
   * Invoice Template
   */
  invoice(data: InvoiceEmailData): { subject: string; html: string; text: string } {
    const itemsTable = this.builder.buildTable(
      ['Description', 'Qty', 'Unit Price', 'Total'],
      data.items.map(item => [
        item.description,
        item.quantity.toString(),
        item.unitPrice,
        item.total,
      ])
    );

    const content = `
      <h1>Invoice ${data.invoiceNumber}</h1>
      <p>Hi ${data.clientName},</p>
      <p>Thank you for your business! Please find your invoice details below.</p>
      
      ${this.builder.buildCard(`
        <table style="width: 100%;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom: 8px;">
              <strong style="color: #FFFFFF;">Invoice Number:</strong>
              <span style="color: #B0B6C3;">${data.invoiceNumber}</span>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 8px;">
              <strong style="color: #FFFFFF;">Due Date:</strong>
              <span style="color: #B0B6C3;">${data.dueDate}</span>
            </td>
          </tr>
          <tr>
            <td>
              <strong style="color: #FFFFFF;">Amount Due:</strong>
              <span style="color: #72D47A; font-size: 24px; font-weight: 700;">${data.currency}${data.amount}</span>
            </td>
          </tr>
        </table>
      `)}
      
      <h3 style="margin-top: 32px;">Invoice Details</h3>
      ${itemsTable}
      
      <table style="width: 100%; margin-top: 16px;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align: right; padding: 8px 12px;">
            <strong style="color: #FFFFFF;">Subtotal:</strong>
          </td>
          <td style="text-align: right; padding: 8px 12px; color: #B0B6C3;">
            ${data.currency}${data.subtotal}
          </td>
        </tr>
        ${data.tax ? `
        <tr>
          <td style="text-align: right; padding: 8px 12px;">
            <strong style="color: #FFFFFF;">Tax:</strong>
          </td>
          <td style="text-align: right; padding: 8px 12px; color: #B0B6C3;">
            ${data.currency}${data.tax}
          </td>
        </tr>
        ` : ''}
        <tr>
          <td style="text-align: right; padding: 12px; border-top: 2px solid #353A43;">
            <strong style="color: #FFFFFF; font-size: 18px;">Total:</strong>
          </td>
          <td style="text-align: right; padding: 12px; border-top: 2px solid #353A43;">
            <strong style="color: #72D47A; font-size: 18px;">${data.currency}${data.total}</strong>
          </td>
        </tr>
      </table>
      
      ${data.notes ? `
        ${this.builder.buildDivider()}
        <h4>Notes</h4>
        <p>${data.notes}</p>
      ` : ''}
      
      ${this.builder.buildButton('View Invoice', data.invoiceLink)}
      ${data.paymentLink ? this.builder.buildButton('Pay Now', data.paymentLink, 'secondary') : ''}
      
      <p style="margin-top: 24px; font-size: 14px; color: #818899;">
        Questions about this invoice? Reply to this email or contact us at your convenience.
      </p>
    `;

    return {
      subject: `Invoice ${data.invoiceNumber} from ${data.companyName}`,
      html: this.builder.buildEmail(content, `Invoice ${data.invoiceNumber} - ${data.currency}${data.amount} due ${data.dueDate}`),
      text: this.generatePlainText(`Invoice ${data.invoiceNumber}`, data.clientName, [
        `Invoice Number: ${data.invoiceNumber}`,
        `Due Date: ${data.dueDate}`,
        `Amount Due: ${data.currency}${data.amount}`,
        '',
        'Items:',
        ...data.items.map(item => `- ${item.description}: ${item.quantity} x ${item.unitPrice} = ${item.total}`),
        '',
        `Subtotal: ${data.currency}${data.subtotal}`,
        data.tax ? `Tax: ${data.currency}${data.tax}` : '',
        `Total: ${data.currency}${data.total}`,
        '',
        data.notes ? `Notes: ${data.notes}` : '',
        `View invoice: ${data.invoiceLink}`,
        data.paymentLink ? `Pay now: ${data.paymentLink}` : '',
      ].filter(Boolean)),
    };
  }

  /**
   * Invoice Reminder Template
   */
  invoiceReminder(data: InvoiceReminderEmailData): { subject: string; html: string; text: string } {
    const isOverdue = data.daysOverdue && data.daysOverdue > 0;
    
    const content = `
      <h1>${isOverdue ? 'Payment Overdue' : 'Payment Reminder'}</h1>
      <p>Hi ${data.clientName},</p>
      <p>${isOverdue 
        ? `This is a friendly reminder that invoice ${data.invoiceNumber} is now ${data.daysOverdue} days overdue.`
        : `This is a friendly reminder that invoice ${data.invoiceNumber} is due on ${data.dueDate}.`
      }</p>
      
      ${this.builder.buildCard(`
        <table style="width: 100%;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom: 8px;">
              <strong style="color: #FFFFFF;">Invoice Number:</strong>
              <span style="color: #B0B6C3;">${data.invoiceNumber}</span>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 8px;">
              <strong style="color: #FFFFFF;">${isOverdue ? 'Was Due:' : 'Due Date:'}</strong>
              <span style="color: ${isOverdue ? '#F47A7A' : '#B0B6C3'};">${data.dueDate}</span>
            </td>
          </tr>
          ${isOverdue ? `
          <tr>
            <td style="padding-bottom: 8px;">
              ${this.builder.buildBadge(`${data.daysOverdue} days overdue`, 'danger')}
            </td>
          </tr>
          ` : ''}
          <tr>
            <td>
              <strong style="color: #FFFFFF;">Amount Due:</strong>
              <span style="color: #72D47A; font-size: 24px; font-weight: 700;">${data.currency}${data.amount}</span>
            </td>
          </tr>
        </table>
      `)}
      
      ${this.builder.buildButton('View Invoice', data.invoiceLink)}
      ${data.paymentLink ? this.builder.buildButton('Pay Now', data.paymentLink, 'secondary') : ''}
      
      <p style="margin-top: 24px;">
        If you've already made this payment, please disregard this reminder. If you have any questions or concerns, please don't hesitate to reach out.
      </p>
      
      <p style="font-size: 14px; color: #818899;">
        Thank you for your business!
      </p>
    `;

    return {
      subject: `${isOverdue ? 'Overdue' : 'Reminder'}: Invoice ${data.invoiceNumber} - ${data.currency}${data.amount}`,
      html: this.builder.buildEmail(content, `${isOverdue ? 'Payment overdue' : 'Payment reminder'} for invoice ${data.invoiceNumber}`),
      text: this.generatePlainText(`${isOverdue ? 'Payment Overdue' : 'Payment Reminder'}`, data.clientName, [
        `Invoice Number: ${data.invoiceNumber}`,
        `${isOverdue ? 'Was Due' : 'Due Date'}: ${data.dueDate}`,
        isOverdue ? `Days Overdue: ${data.daysOverdue}` : '',
        `Amount Due: ${data.currency}${data.amount}`,
        '',
        `View invoice: ${data.invoiceLink}`,
        data.paymentLink ? `Pay now: ${data.paymentLink}` : '',
        '',
        "If you've already paid, please disregard this reminder.",
      ].filter(Boolean)),
    };
  }

  /**
   * Standup Summary Template
   */
  standupSummary(data: StandupSummaryEmailData): { subject: string; html: string; text: string } {
    const teamUpdates = data.teamMembers.map(member => `
      ${this.builder.buildCard(`
        <h4 style="margin: 0 0 12px; color: #FFFFFF;">${member.name}</h4>
        
        ${member.completed.length > 0 ? `
          <p style="margin: 8px 0 4px;"><strong style="color: #72D47A;">✓ Completed:</strong></p>
          ${this.builder.buildList(member.completed)}
        ` : ''}
        
        ${member.inProgress.length > 0 ? `
          <p style="margin: 8px 0 4px;"><strong style="color: #60B4F7;">→ In Progress:</strong></p>
          ${this.builder.buildList(member.inProgress)}
        ` : ''}
        
        ${member.blockers.length > 0 ? `
          <p style="margin: 8px 0 4px;"><strong style="color: #F47A7A;">⚠ Blockers:</strong></p>
          ${this.builder.buildList(member.blockers)}
        ` : ''}
      `)}
    `).join('');

    const content = `
      <h1>Daily Standup Summary</h1>
      <p><strong>${data.projectName}</strong> • ${data.date}</p>
      
      ${this.builder.buildCard(`
        <table style="width: 100%;" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <strong style="color: #FFFFFF;">Overall Progress:</strong>
            </td>
            <td style="text-align: right;">
              <strong style="color: #72D47A; font-size: 20px;">${data.overallProgress}%</strong>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top: 12px;">
              <div style="width: 100%; height: 8px; background-color: #353A43; border-radius: 4px; overflow: hidden;">
                <div style="width: ${data.overallProgress}%; height: 100%; background-color: #72D47A;"></div>
              </div>
            </td>
          </tr>
          ${data.upcomingMilestone ? `
          <tr>
            <td colspan="2" style="padding-top: 12px;">
              <p style="margin: 0; font-size: 14px; color: #B0B6C3;">
                <strong>Next Milestone:</strong> ${data.upcomingMilestone}
              </p>
            </td>
          </tr>
          ` : ''}
        </table>
      `)}
      
      <h3 style="margin-top: 32px;">Team Updates</h3>
      ${teamUpdates}
      
      ${this.builder.buildButton('View Full Dashboard', data.dashboardLink)}
    `;

    return {
      subject: `Standup Summary: ${data.projectName} - ${data.date}`,
      html: this.builder.buildEmail(content, `Daily standup summary for ${data.projectName}`),
      text: this.generatePlainText(`Standup Summary - ${data.date}`, data.projectName, [
        `Overall Progress: ${data.overallProgress}%`,
        data.upcomingMilestone ? `Next Milestone: ${data.upcomingMilestone}` : '',
        '',
        'Team Updates:',
        ...data.teamMembers.flatMap(member => [
          '',
          `${member.name}:`,
          member.completed.length > 0 ? `Completed: ${member.completed.join(', ')}` : '',
          member.inProgress.length > 0 ? `In Progress: ${member.inProgress.join(', ')}` : '',
          member.blockers.length > 0 ? `Blockers: ${member.blockers.join(', ')}` : '',
        ].filter(Boolean)),
        '',
        `View dashboard: ${data.dashboardLink}`,
      ].filter(Boolean)),
    };
  }

  /**
   * Project Summary Template
   */
  projectSummary(data: ProjectSummaryEmailData): { subject: string; html: string; text: string } {
    const milestonesTable = this.builder.buildTable(
      ['Milestone', 'Status', 'Due Date'],
      data.milestones.map(m => [
        m.name,
        this.builder.buildBadge(
          m.status === 'completed' ? 'Completed' : m.status === 'in-progress' ? 'In Progress' : 'Pending',
          m.status === 'completed' ? 'success' : m.status === 'in-progress' ? 'info' : 'warning'
        ),
        m.dueDate || 'TBD',
      ])
    );

    const content = `
      <h1>Project Summary</h1>
      <p><strong>${data.projectName}</strong> • ${data.period}</p>
      
      ${this.builder.buildCard(`
        <table style="width: 100%;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom: 16px;">
              <strong style="color: #FFFFFF; font-size: 18px;">Progress: ${data.progress}%</strong>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 12px;">
              <div style="width: 100%; height: 12px; background-color: #353A43; border-radius: 6px; overflow: hidden;">
                <div style="width: ${data.progress}%; height: 100%; background-color: #72D47A;"></div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <p style="margin: 0; color: #B0B6C3;">
                ${data.completedTasks} of ${data.totalTasks} tasks completed • ${data.commits} commits
              </p>
            </td>
          </tr>
        </table>
      `)}
      
      <h3 style="margin-top: 32px;">Milestones</h3>
      ${milestonesTable}
      
      ${data.upcomingDeadlines.length > 0 ? `
        <h3 style="margin-top: 32px;">Upcoming Deadlines</h3>
        ${this.builder.buildList(data.upcomingDeadlines.map(d => `<strong>${d.title}</strong> - ${d.date}`))}
      ` : ''}
      
      ${data.teamActivity.length > 0 ? `
        <h3 style="margin-top: 32px;">Team Activity</h3>
        ${this.builder.buildList(data.teamActivity.map(a => `<strong>${a.member}:</strong> ${a.contributions} contributions`))}
      ` : ''}
      
      ${this.builder.buildButton('View Full Report', data.dashboardLink)}
    `;

    return {
      subject: `Project Summary: ${data.projectName} - ${data.period}`,
      html: this.builder.buildEmail(content, `${data.projectName} summary for ${data.period}`),
      text: this.generatePlainText(`Project Summary - ${data.period}`, data.projectName, [
        `Progress: ${data.progress}%`,
        `Tasks: ${data.completedTasks} of ${data.totalTasks} completed`,
        `Commits: ${data.commits}`,
        '',
        'Milestones:',
        ...data.milestones.map(m => `- ${m.name}: ${m.status}${m.dueDate ? ` (Due: ${m.dueDate})` : ''}`),
        '',
        data.upcomingDeadlines.length > 0 ? 'Upcoming Deadlines:' : '',
        ...data.upcomingDeadlines.map(d => `- ${d.title}: ${d.date}`),
        '',
        data.teamActivity.length > 0 ? 'Team Activity:' : '',
        ...data.teamActivity.map(a => `- ${a.member}: ${a.contributions} contributions`),
        '',
        `View full report: ${data.dashboardLink}`,
      ].filter(Boolean)),
    };
  }

  /**
   * Milestone Complete Template
   */
  milestoneComplete(data: MilestoneCompleteEmailData): { subject: string; html: string; text: string } {
    const content = `
      <h1>🎉 Milestone Completed!</h1>
      <p><strong>${data.milestoneName}</strong> has been completed for ${data.projectName}.</p>
      
      ${this.builder.buildCard(`
        <table style="width: 100%;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom: 8px;">
              <strong style="color: #FFFFFF;">Completed:</strong>
              <span style="color: #B0B6C3;">${data.completedDate}</span>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 8px;">
              <strong style="color: #FFFFFF;">Completed By:</strong>
              <span style="color: #B0B6C3;">${data.completedBy}</span>
            </td>
          </tr>
          ${data.nextMilestone ? `
          <tr>
            <td>
              <strong style="color: #FFFFFF;">Next Milestone:</strong>
              <span style="color: #60B4F7;">${data.nextMilestone}</span>
            </td>
          </tr>
          ` : ''}
        </table>
      `)}
      
      ${data.deliverables.length > 0 ? `
        <h3 style="margin-top: 32px;">Deliverables</h3>
        ${this.builder.buildList(data.deliverables)}
      ` : ''}
      
      ${this.builder.buildButton('View Project', data.dashboardLink)}
      
      <p style="margin-top: 24px; color: #B0B6C3;">
        Great work, team! Let's keep the momentum going.
      </p>
    `;

    return {
      subject: `Milestone Completed: ${data.milestoneName} - ${data.projectName}`,
      html: this.builder.buildEmail(content, `${data.milestoneName} has been completed!`),
      text: this.generatePlainText('Milestone Completed!', data.milestoneName, [
        `Project: ${data.projectName}`,
        `Completed: ${data.completedDate}`,
        `Completed By: ${data.completedBy}`,
        data.nextMilestone ? `Next Milestone: ${data.nextMilestone}` : '',
        '',
        data.deliverables.length > 0 ? 'Deliverables:' : '',
        ...data.deliverables.map(d => `- ${d}`),
        '',
        `View project: ${data.dashboardLink}`,
      ].filter(Boolean)),
    };
  }

  /**
   * Task Assigned Template
   */
  taskAssigned(data: TaskAssignedEmailData): { subject: string; html: string; text: string } {
    const priorityColors = {
      low: 'info',
      medium: 'warning',
      high: 'danger',
    } as const;

    const content = `
      <h1>New Task Assigned</h1>
      <p>Hi ${data.assignedTo},</p>
      <p>${data.assignedBy} has assigned you a new task in ${data.projectName}.</p>
      
      ${this.builder.buildCard(`
        <h3 style="margin: 0 0 16px; color: #FFFFFF;">${data.taskTitle}</h3>
        <p style="margin: 0 0 12px; color: #B0B6C3;">${data.description}</p>
        <table style="width: 100%;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-top: 12px;">
              <strong style="color: #FFFFFF;">Priority:</strong>
              ${this.builder.buildBadge(data.priority.charAt(0).toUpperCase() + data.priority.slice(1), priorityColors[data.priority])}
            </td>
          </tr>
          ${data.dueDate ? `
          <tr>
            <td style="padding-top: 8px;">
              <strong style="color: #FFFFFF;">Due Date:</strong>
              <span style="color: #B0B6C3;">${data.dueDate}</span>
            </td>
          </tr>
          ` : ''}
        </table>
      `)}
      
      ${this.builder.buildButton('View Task', data.taskLink)}
    `;

    return {
      subject: `New Task: ${data.taskTitle} - ${data.projectName}`,
      html: this.builder.buildEmail(content, `You've been assigned a new task in ${data.projectName}`),
      text: this.generatePlainText('New Task Assigned', data.assignedTo, [
        `${data.assignedBy} has assigned you a new task.`,
        '',
        `Task: ${data.taskTitle}`,
        `Project: ${data.projectName}`,
        `Priority: ${data.priority}`,
        data.dueDate ? `Due Date: ${data.dueDate}` : '',
        '',
        `Description: ${data.description}`,
        '',
        `View task: ${data.taskLink}`,
      ].filter(Boolean)),
    };
  }

  /**
   * Proposal Sent Template
   */
  proposalSent(data: ProposalSentEmailData): { subject: string; html: string; text: string } {
    const content = `
      <h1>Proposal for ${data.proposalTitle}</h1>
      <p>Hi ${data.clientName},</p>
      <p>Thank you for your interest in working with ${data.companyName}! ${data.senderName} has prepared a proposal for your project.</p>
      
      ${this.builder.buildCard(`
        <table style="width: 100%;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom: 8px;">
              <strong style="color: #FFFFFF;">Project:</strong>
              <span style="color: #B0B6C3;">${data.proposalTitle}</span>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 8px;">
              <strong style="color: #FFFFFF;">Total Investment:</strong>
              <span style="color: #72D47A; font-size: 20px; font-weight: 700;">${data.currency}${data.totalAmount}</span>
            </td>
          </tr>
          <tr>
            <td>
              <strong style="color: #FFFFFF;">Valid Until:</strong>
              <span style="color: #B0B6C3;">${data.validUntil}</span>
            </td>
          </tr>
        </table>
      `)}
      
      ${this.builder.buildButton('Review Proposal', data.proposalLink)}
      
      <p style="margin-top: 24px;">
        We're excited about the opportunity to work with you! If you have any questions or would like to discuss the proposal, please don't hesitate to reach out.
      </p>
    `;

    return {
      subject: `Proposal: ${data.proposalTitle} from ${data.companyName}`,
      html: this.builder.buildEmail(content, `Review your proposal for ${data.proposalTitle}`),
      text: this.generatePlainText(`Proposal for ${data.proposalTitle}`, data.clientName, [
        `${data.senderName} from ${data.companyName} has prepared a proposal for your project.`,
        '',
        `Project: ${data.proposalTitle}`,
        `Total Investment: ${data.currency}${data.totalAmount}`,
        `Valid Until: ${data.validUntil}`,
        '',
        `Review proposal: ${data.proposalLink}`,
      ]),
    };
  }

  /**
   * Contract Signed Template
   */
  contractSigned(data: ContractSignedEmailData): { subject: string; html: string; text: string } {
    const content = `
      <h1>🎉 Contract Signed!</h1>
      <p>Hi ${data.clientName},</p>
      <p>Great news! The contract for ${data.projectName} has been signed and we're ready to get started.</p>
      
      ${this.builder.buildCard(`
        <table style="width: 100%;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom: 8px;">
              <strong style="color: #FFFFFF;">Project:</strong>
              <span style="color: #B0B6C3;">${data.projectName}</span>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 8px;">
              <strong style="color: #FFFFFF;">Signed:</strong>
              <span style="color: #B0B6C3;">${data.signedDate}</span>
            </td>
          </tr>
          ${data.startDate ? `
          <tr>
            <td>
              <strong style="color: #FFFFFF;">Start Date:</strong>
              <span style="color: #72D47A;">${data.startDate}</span>
            </td>
          </tr>
          ` : ''}
        </table>
      `)}
      
      ${data.nextSteps.length > 0 ? `
        <h3 style="margin-top: 32px;">Next Steps</h3>
        ${this.builder.buildList(data.nextSteps, true)}
      ` : ''}
      
      ${this.builder.buildButton('View Contract', data.contractLink)}
      
      <p style="margin-top: 24px;">
        We're excited to work with you on this project! You'll receive updates throughout the development process.
      </p>
    `;

    return {
      subject: `Contract Signed: ${data.projectName} - ${data.companyName}`,
      html: this.builder.buildEmail(content, `Your contract for ${data.projectName} has been signed`),
      text: this.generatePlainText('Contract Signed!', data.clientName, [
        `The contract for ${data.projectName} has been signed.`,
        '',
        `Signed: ${data.signedDate}`,
        data.startDate ? `Start Date: ${data.startDate}` : '',
        '',
        data.nextSteps.length > 0 ? 'Next Steps:' : '',
        ...data.nextSteps.map((step, i) => `${i + 1}. ${step}`),
        '',
        `View contract: ${data.contractLink}`,
      ].filter(Boolean)),
    };
  }

  /**
   * Handover Ready Template
   */
  handoverReady(data: HandoverReadyEmailData): { subject: string; html: string; text: string } {
    const content = `
      <h1>🚀 Project Handover Ready</h1>
      <p>Hi ${data.clientName},</p>
      <p>Congratulations! ${data.projectName} is complete and your handover package is ready.</p>
      
      ${this.builder.buildCard(`
        <table style="width: 100%;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom: 8px;">
              <strong style="color: #FFFFFF;">Project:</strong>
              <span style="color: #B0B6C3;">${data.projectName}</span>
            </td>
          </tr>
          <tr>
            <td>
              <strong style="color: #FFFFFF;">Handover Date:</strong>
              <span style="color: #B0B6C3;">${data.handoverDate}</span>
            </td>
          </tr>
        </table>
      `)}
      
      <h3 style="margin-top: 32px;">What's Included</h3>
      ${this.builder.buildList(data.deliverables)}
      
      ${data.videoTutorials && data.videoTutorials.length > 0 ? `
        <h3 style="margin-top: 24px;">Video Tutorials</h3>
        <p>We've prepared video tutorials to help you get started:</p>
        ${this.builder.buildList(data.videoTutorials.map(url => `<a href="${url}" style="color: #72D47A;">Watch Tutorial</a>`))}
      ` : ''}
      
      ${this.builder.buildButton('Access Handover Package', data.documentationLink)}
      
      ${this.builder.buildDivider()}
      
      <h3>Ongoing Support</h3>
      <p>We're here to help! If you have any questions or need assistance, please contact us at <a href="mailto:${data.supportEmail}" style="color: #72D47A;">${data.supportEmail}</a></p>
      
      <p style="margin-top: 24px;">
        Thank you for choosing ${data.companyName}. We hope you enjoy your new project!
      </p>
    `;

    return {
      subject: `Handover Ready: ${data.projectName} - ${data.companyName}`,
      html: this.builder.buildEmail(content, `Your ${data.projectName} handover package is ready`),
      text: this.generatePlainText('Project Handover Ready', data.clientName, [
        `${data.projectName} is complete and your handover package is ready!`,
        '',
        `Handover Date: ${data.handoverDate}`,
        '',
        "What's Included:",
        ...data.deliverables.map(d => `- ${d}`),
        '',
        data.videoTutorials && data.videoTutorials.length > 0 ? 'Video Tutorials:' : '',
        ...(data.videoTutorials || []).map(url => `- ${url}`),
        '',
        `Access handover package: ${data.documentationLink}`,
        '',
        `Need help? Contact us at ${data.supportEmail}`,
      ].filter(Boolean)),
    };
  }

  /**
   * Generic Notification Template
   */
  notification(data: NotificationEmailData): { subject: string; html: string; text: string } {
    const content = `
      <h1>${data.title}</h1>
      <p>Hi ${data.userName},</p>
      <p>${data.message}</p>
      
      ${data.actionText && data.actionLink ? this.builder.buildButton(data.actionText, data.actionLink) : ''}
    `;

    return {
      subject: data.title,
      html: this.builder.buildEmail(content, data.message),
      text: this.generatePlainText(data.title, data.userName, [
        data.message,
        '',
        data.actionText && data.actionLink ? `${data.actionText}: ${data.actionLink}` : '',
      ].filter(Boolean)),
    };
  }

  /**
   * Generate plain text version of email
   */
  private generatePlainText(title: string, greeting: string, lines: string[]): string {
    return `
${title}

Hi ${greeting},

${lines.join('\n')}

---
© ${new Date().getFullYear()} Autopilot Studio. All rights reserved.

Privacy Policy: https://autopilotstudio.com/privacy
Terms of Service: https://autopilotstudio.com/terms
Unsubscribe: https://autopilotstudio.com/unsubscribe
    `.trim();
  }
}

/**
 * Default email templates instance
 */
export const emailTemplates = new EmailTemplates();
