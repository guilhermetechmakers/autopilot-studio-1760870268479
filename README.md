# Autopilot Studio

> Your Complete Business OS for AI Development Teams

Autopilot Studio is an end-to-end Business OS for AI development teams and agencies that automates the full service pipeline from lead intake through handover.

## 🚀 Features

- **AI-Assisted Intake** - Smart qualification and automated proposal generation
- **Proposals & E-Contracts** - Generate, customize, and e-sign contracts with full audit trails
- **One-Click Project Spin-up** - Instantly create project spaces with repos, milestones, and client portals
- **AI Copilot** - Context-aware assistant for specs, tickets, and meeting summaries
- **Launch Automation** - QA checklists, security gates, and one-click deployments
- **Billing & QuickBooks Sync** - Automated invoicing and accounting integration

## 🛠️ Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite with SWC plugin
- **Styling:** Tailwind CSS v3 with custom design system
- **UI Components:** Shadcn/ui with Radix UI primitives
- **Routing:** React Router v6
- **State Management:** TanStack React Query
- **Forms:** React Hook Form with Zod validation
- **Icons:** Lucide React
- **Notifications:** Sonner

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server (DO NOT RUN - handled by MCP server)
# npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design System

The application follows a modern, minimal design aesthetic with:

- **Color Palette:**
  - Primary background: Deep charcoal (#23272F)
  - Sidebar: Darker shade (#1A1D23)
  - Card backgrounds: Medium dark gray (#2C313A)
  - Accent colors: Soft yellow, muted green, pale blue, soft red, light purple

- **Typography:**
  - Font family: Inter
  - Clear hierarchy with bold headings and light body text
  - Generous spacing and consistent vertical rhythm

- **Components:**
  - Rounded corners (12-16px radius)
  - Subtle shadows for elevation
  - Smooth transitions and hover states
  - Collapsible sidebar navigation

## 📁 Project Structure

```
autopilot-studio/
├── src/
│   ├── api/                 # API layer and utilities
│   ├── components/
│   │   ├── layout/          # Layout components (DashboardLayout)
│   │   └── ui/              # Shadcn UI components (44 components)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities (cn, api)
│   ├── pages/               # Page components
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── Dashboard.tsx
│   │   └── ...
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main app with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles and design system
├── public/                  # Static assets
├── components.json          # Shadcn UI configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies and scripts
```

## 🎯 Implemented Pages

### Public Pages
- ✅ Landing Page - Marketing hub with features, pricing, and CTAs
- ✅ Login Page - Authentication with SSO options
- ✅ Signup Page - Account creation with validation
- ✅ Password Reset Page - Password recovery flow
- ✅ Email Verification Page - Email verification states
- ✅ 404 Not Found Page - Error page with navigation

### Protected Pages (Dashboard)
- ✅ Dashboard - Overview with stats, projects, and activity feed
- 🚧 Admin Dashboard - Admin controls (placeholder)
- 🚧 Intake Wizard - AI-assisted intake form (placeholder)
- 🚧 Proposal Generator - Proposal and SoW creation (placeholder)
- 🚧 Project Space - Project workspace (placeholder)
- 🚧 Tasks Page - Task management (placeholder)
- 🚧 Settings Page - User settings (placeholder)

## 🧩 UI Components

All 44 Shadcn UI components are installed and ready to use:

- Accordion, Alert Dialog, Aspect Ratio, Avatar
- Badge, Breadcrumb, Button
- Calendar, Card, Carousel, Checkbox, Collapsible, Command, Context Menu
- Dialog, Drawer, Dropdown Menu
- Form
- Hover Card
- Input, Input OTP
- Label
- Menubar
- Navigation Menu
- Pagination, Popover, Progress
- Radio Group, Resizable
- Scroll Area, Select, Separator, Sheet, Skeleton, Slider, Switch
- Table, Tabs, Textarea, Toast, Toggle, Toggle Group, Tooltip

## 🎨 Design Features

- **Animations:** Fade-in, slide-in, scale-in effects using Tailwind CSS
- **Responsive:** Mobile-first design with collapsible sidebar
- **Dark Theme:** Professional dark color scheme optimized for development tools
- **Accessibility:** Focus states, ARIA labels, keyboard navigation
- **Performance:** Optimized with lazy loading and code splitting

## 🔐 Security Features (Planned)

- JWT authentication with refresh tokens
- OAuth SSO (Google, GitHub, Microsoft)
- 2FA support
- RBAC (Role-Based Access Control)
- Audit logs for key actions
- Encrypted data at rest

## 🚀 Next Steps

1. **Backend Integration** - Connect to API endpoints
2. **Authentication** - Implement auth flows with JWT
3. **AI Integration** - Connect AI services for intake and copilot
4. **Complete Pages** - Build out remaining page functionality
5. **Testing** - Add unit and integration tests
6. **Deployment** - Set up CI/CD pipeline

## 📝 Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_URL=http://localhost:3000/api
```

## 🤝 Contributing

This project follows the boilerplate guidelines for React + TypeScript + Vite + Tailwind CSS + Shadcn UI.

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ by the Autopilot Studio team
