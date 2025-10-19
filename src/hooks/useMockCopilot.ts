import { useState } from 'react';
import type { CopilotContext, CopilotAction } from '@/types/copilot';

// Mock data for development
export const mockContext: CopilotContext = {
  projectId: 'project-1',
  repoFiles: [
    {
      path: 'src/components/ProductCard.tsx',
      content: `import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ProductCard({ product }) {
  return (
    <Card>
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      <Button>Add to Cart</Button>
    </Card>
  );
}`,
      language: 'typescript',
      lastModified: '2025-10-15T10:30:00Z',
    },
    {
      path: 'src/api/products.ts',
      content: `export async function getProducts() {
  const response = await fetch('/api/products');
  return response.json();
}

export async function createProduct(data) {
  const response = await fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}`,
      language: 'typescript',
      lastModified: '2025-10-14T15:20:00Z',
    },
  ],
  proposals: [
    {
      id: 'prop-1',
      title: 'E-commerce Platform Development',
      scope: 'Build a full-featured e-commerce platform with product catalog, shopping cart, checkout, and payment integration. Include admin dashboard for inventory management.',
      budget: 85000,
      timeline: '16 weeks',
    },
    {
      id: 'prop-2',
      title: 'Payment Gateway Integration',
      scope: 'Integrate Stripe payment gateway with support for credit cards, Apple Pay, and Google Pay. Include webhook handling for payment events.',
      budget: 12000,
      timeline: '3 weeks',
    },
  ],
  intakeData: {
    companyName: 'Acme Corp',
    goals: [
      'Launch online store by Q1 2026',
      'Support 10,000 concurrent users',
      'Integrate with existing inventory system',
      'Mobile-first responsive design',
    ],
    budget: 100000,
    timeline: '4-5 months',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
  },
};

export const mockResponses: Record<string, string> = {
  draft_spec: `# Technical Specification: Payment Gateway Integration

## Overview
Integrate Stripe payment processing into the e-commerce platform with support for multiple payment methods.

## Requirements

### Functional Requirements
1. Accept credit/debit card payments
2. Support Apple Pay and Google Pay
3. Handle payment webhooks for status updates
4. Store payment metadata securely
5. Generate payment receipts

### Non-Functional Requirements
- PCI DSS compliance
- 99.9% uptime
- < 2s payment processing time
- Secure token handling

## Architecture

### Components
1. **Payment Service** - Handles Stripe API integration
2. **Webhook Handler** - Processes payment events
3. **Receipt Generator** - Creates PDF receipts
4. **Payment UI** - Checkout form components

### Data Flow
\`\`\`
User → Checkout Form → Payment Service → Stripe API
Stripe Webhook → Webhook Handler → Order Update → Email Receipt
\`\`\`

## Implementation Plan

### Phase 1: Setup (Week 1)
- Configure Stripe account
- Install Stripe SDK
- Set up webhook endpoints
- Create payment database schema

### Phase 2: Core Integration (Week 2)
- Implement payment form
- Add card payment processing
- Handle payment intents
- Error handling and validation

### Phase 3: Alternative Payments (Week 3)
- Add Apple Pay support
- Add Google Pay support
- Test payment methods
- Security audit

## Testing Strategy
- Unit tests for payment service
- Integration tests with Stripe test mode
- End-to-end checkout flow tests
- Security penetration testing

## Acceptance Criteria
- [ ] Users can complete checkout with credit card
- [ ] Apple Pay and Google Pay work on supported devices
- [ ] Webhooks update order status correctly
- [ ] Payment failures show clear error messages
- [ ] Receipts are generated and emailed
- [ ] All sensitive data is encrypted
- [ ] PCI compliance requirements met`,

  create_ticket: `I've created a new ticket based on your request:

**Title:** Implement Stripe Payment Gateway Integration

**Description:**
Integrate Stripe payment processing into the checkout flow with support for credit cards, Apple Pay, and Google Pay.

**Acceptance Criteria:**
- [ ] Stripe SDK installed and configured
- [ ] Payment form component created with card input
- [ ] Payment intent creation and confirmation flow
- [ ] Apple Pay button integration (iOS/Safari)
- [ ] Google Pay button integration (Android/Chrome)
- [ ] Webhook endpoint for payment status updates
- [ ] Error handling for failed payments
- [ ] Loading states during payment processing
- [ ] Success/failure notifications
- [ ] Receipt generation and email delivery
- [ ] Unit tests for payment service (>80% coverage)
- [ ] Integration tests with Stripe test mode
- [ ] Security review completed

**Estimated Effort:** 3 weeks (120 hours)

**Priority:** High

**Labels:** payment, integration, security

**Assigned to:** Backend Team

The ticket has been created in your project board. Would you like me to break this down into smaller subtasks?`,

  summarize_meeting: `# Meeting Summary: Payment Integration Kickoff

**Date:** October 19, 2025
**Duration:** 45 minutes
**Attendees:** Product Manager, Tech Lead, Backend Dev, Frontend Dev, Client (Acme Corp)

## Key Discussion Points

### 1. Payment Methods
- Primary: Credit/debit cards (Visa, Mastercard, Amex)
- Secondary: Apple Pay and Google Pay
- Future consideration: PayPal, Buy Now Pay Later options
- Client confirmed Stripe as preferred payment processor

### 2. Timeline & Milestones
- Week 1: Setup and configuration
- Week 2: Core card payment implementation
- Week 3: Alternative payment methods and testing
- Buffer: 3-5 days for security review

### 3. Technical Decisions
- Use Stripe Payment Intents API (not legacy Charges API)
- Implement webhook handling for async payment updates
- Store payment metadata in PostgreSQL
- Use Stripe Elements for PCI compliance
- Server-side payment confirmation for security

### 4. Security Requirements
- All payment data handled by Stripe (no card storage)
- Implement rate limiting on payment endpoints
- Add fraud detection via Stripe Radar
- Conduct security audit before production
- Set up monitoring and alerts for failed payments

### 5. User Experience
- Show clear loading states during payment
- Display helpful error messages
- Auto-retry failed payments (with user consent)
- Send email receipts immediately
- Mobile-optimized checkout flow

## Action Items

1. **Tech Lead** - Set up Stripe account and obtain API keys (Due: Oct 21)
2. **Backend Dev** - Create payment service architecture doc (Due: Oct 22)
3. **Frontend Dev** - Design checkout UI mockups (Due: Oct 23)
4. **Product Manager** - Document edge cases and error scenarios (Due: Oct 24)
5. **All** - Review Stripe documentation and best practices (Due: Oct 25)

## Risks & Concerns
- Tight timeline may require scope reduction
- Need to coordinate with inventory system for stock checks
- Apple Pay requires Apple Developer account setup
- Webhook reliability needs monitoring strategy

## Next Meeting
- Date: October 26, 2025
- Agenda: Review architecture and UI designs`,

  suggest_acceptance_criteria: `Based on the task description, here are suggested acceptance criteria:

## Functional Criteria

### Payment Processing
- [ ] User can enter credit card details in checkout form
- [ ] Card validation shows real-time feedback (number, expiry, CVV)
- [ ] Payment processes successfully with valid card
- [ ] Payment fails gracefully with invalid card
- [ ] User receives confirmation message on successful payment
- [ ] User sees clear error message on failed payment

### Alternative Payment Methods
- [ ] Apple Pay button appears on iOS/Safari devices
- [ ] Google Pay button appears on Android/Chrome browsers
- [ ] Alternative payment methods process correctly
- [ ] Fallback to card payment if alternative method unavailable

### Order Management
- [ ] Order status updates to "paid" after successful payment
- [ ] Order includes payment transaction ID
- [ ] Payment amount matches order total
- [ ] Currency is handled correctly
- [ ] Tax calculations are accurate

### Receipts & Notifications
- [ ] Email receipt sent immediately after payment
- [ ] Receipt includes all order details
- [ ] Receipt is properly formatted and branded
- [ ] Receipt PDF can be downloaded from order history

## Technical Criteria

### Security
- [ ] No card details stored in database
- [ ] All payment requests use HTTPS
- [ ] Payment tokens are single-use
- [ ] Rate limiting prevents abuse
- [ ] Sensitive data is encrypted at rest

### Performance
- [ ] Payment processing completes in < 3 seconds
- [ ] Checkout page loads in < 2 seconds
- [ ] No blocking operations on main thread
- [ ] Webhook processing is async

### Error Handling
- [ ] Network errors show retry option
- [ ] Insufficient funds error is user-friendly
- [ ] Card declined shows reason (if available)
- [ ] Timeout errors trigger automatic retry
- [ ] All errors are logged for debugging

### Testing
- [ ] Unit tests for payment service (>80% coverage)
- [ ] Integration tests with Stripe test mode
- [ ] E2E tests for complete checkout flow
- [ ] Tests for all error scenarios
- [ ] Load testing for concurrent payments

### Monitoring
- [ ] Payment success/failure metrics tracked
- [ ] Alerts set up for high failure rates
- [ ] Webhook delivery monitored
- [ ] Performance metrics collected

Would you like me to add any specific criteria or modify these?`,

  default: `I understand you're working on the e-commerce platform project. Based on the context I have access to, I can help you with:

1. **Draft Technical Specifications** - Create detailed specs for features
2. **Create Tickets** - Convert requirements into actionable tasks with acceptance criteria
3. **Summarize Meetings** - Generate structured meeting notes and action items
4. **Suggest Acceptance Criteria** - Define clear success criteria for tasks
5. **Analyze Feedback** - Process client feedback and identify action items
6. **Generate Change Requests** - Document scope changes formally

I have access to:
- Your repository files (ProductCard.tsx, products.ts API)
- Project proposals (E-commerce Platform, Payment Gateway Integration)
- Intake data (Acme Corp requirements and tech stack)

What would you like me to help you with?`,
};

export function useMockCopilot() {
  const [isLoading, setIsLoading] = useState(false);

  const generateResponse = async (
    message: string,
    action?: CopilotAction
  ): Promise<string> => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    if (action && mockResponses[action]) {
      return mockResponses[action];
    }

    // Simple keyword matching for demo
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('spec') || lowerMessage.includes('specification')) {
      return mockResponses.draft_spec;
    }
    if (lowerMessage.includes('ticket') || lowerMessage.includes('task')) {
      return mockResponses.create_ticket;
    }
    if (lowerMessage.includes('meeting') || lowerMessage.includes('summary')) {
      return mockResponses.summarize_meeting;
    }
    if (lowerMessage.includes('criteria') || lowerMessage.includes('acceptance')) {
      return mockResponses.suggest_acceptance_criteria;
    }

    return mockResponses.default;
  };

  return {
    generateResponse,
    isLoading,
    mockContext,
  };
}
