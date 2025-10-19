import { useQuery } from "@tanstack/react-query";
import type {
  ClientPortalProject,
  ClientPortalMilestone,
  Deliverable,
  SharedAsset,
  ClientPortalInvoice,
  MeetingMinute,
  ProjectUpdate,
} from "@/types/clientPortal";

// Mock data for development
const mockProject: ClientPortalProject = {
  id: "demo-project-1",
  name: "E-commerce Platform Redesign",
  description: "Complete redesign and modernization of the e-commerce platform with improved UX, mobile responsiveness, and performance optimization.",
  client_name: "Acme Corporation",
  status: "active",
  progress: 68,
  start_date: "2025-09-01T00:00:00Z",
  end_date: "2025-12-31T00:00:00Z",
  budget: 125000,
  spent: 85000,
  created_at: "2025-09-01T00:00:00Z",
  updated_at: "2025-10-19T00:00:00Z",
};

const mockMilestones: ClientPortalMilestone[] = [
  {
    id: "milestone-1",
    project_id: "demo-project-1",
    title: "Discovery & Planning",
    description: "Initial discovery phase including requirements gathering, user research, and technical planning",
    due_date: "2025-09-30T00:00:00Z",
    status: "completed",
    progress: 100,
    created_at: "2025-09-01T00:00:00Z",
    updated_at: "2025-09-30T00:00:00Z",
  },
  {
    id: "milestone-2",
    project_id: "demo-project-1",
    title: "Design Phase",
    description: "UI/UX design, wireframes, mockups, and design system creation",
    due_date: "2025-10-31T00:00:00Z",
    status: "completed",
    progress: 100,
    created_at: "2025-09-01T00:00:00Z",
    updated_at: "2025-10-31T00:00:00Z",
  },
  {
    id: "milestone-3",
    project_id: "demo-project-1",
    title: "Frontend Development",
    description: "Implementation of responsive UI components and integration with backend APIs",
    due_date: "2025-11-30T00:00:00Z",
    status: "in_progress",
    progress: 75,
    created_at: "2025-09-01T00:00:00Z",
    updated_at: "2025-10-19T00:00:00Z",
  },
  {
    id: "milestone-4",
    project_id: "demo-project-1",
    title: "Testing & Launch",
    description: "QA testing, bug fixes, performance optimization, and production deployment",
    due_date: "2025-12-31T00:00:00Z",
    status: "pending",
    progress: 0,
    created_at: "2025-09-01T00:00:00Z",
    updated_at: "2025-09-01T00:00:00Z",
  },
];

const mockDeliverables: Deliverable[] = [
  {
    id: "deliverable-1",
    project_id: "demo-project-1",
    milestone_id: "milestone-3",
    title: "Product Listing Page Component",
    description: "Responsive product listing page with filtering, sorting, and pagination functionality",
    type: "code",
    status: "pending_approval",
    file_url: "https://example.com/deliverables/product-listing.zip",
    submitted_at: "2025-10-18T14:30:00Z",
    created_at: "2025-10-18T14:30:00Z",
    updated_at: "2025-10-18T14:30:00Z",
  },
  {
    id: "deliverable-2",
    project_id: "demo-project-1",
    milestone_id: "milestone-3",
    title: "Shopping Cart Implementation",
    description: "Complete shopping cart functionality with add/remove items, quantity updates, and checkout flow",
    type: "code",
    status: "pending_approval",
    file_url: "https://example.com/deliverables/shopping-cart.zip",
    submitted_at: "2025-10-17T10:15:00Z",
    created_at: "2025-10-17T10:15:00Z",
    updated_at: "2025-10-17T10:15:00Z",
  },
  {
    id: "deliverable-3",
    project_id: "demo-project-1",
    milestone_id: "milestone-2",
    title: "Design System Documentation",
    description: "Complete design system with components, color palette, typography, and usage guidelines",
    type: "document",
    status: "approved",
    file_url: "https://example.com/deliverables/design-system.pdf",
    submitted_at: "2025-10-15T16:00:00Z",
    reviewed_at: "2025-10-16T09:30:00Z",
    reviewer_notes: "Excellent work! The design system is comprehensive and well-documented.",
    created_at: "2025-10-15T16:00:00Z",
    updated_at: "2025-10-16T09:30:00Z",
  },
];

const mockAssets: SharedAsset[] = [
  {
    id: "asset-1",
    project_id: "demo-project-1",
    name: "Project Kickoff Recording",
    type: "loom",
    url: "https://www.loom.com/share/example1",
    description: "Initial project kickoff meeting with stakeholders",
    uploaded_at: "2025-09-05T10:00:00Z",
    uploaded_by: "Project Manager",
  },
  {
    id: "asset-2",
    project_id: "demo-project-1",
    name: "Design Mockups - Homepage",
    type: "file",
    url: "https://example.com/assets/homepage-mockups.fig",
    description: "Figma mockups for the homepage redesign",
    size: 15728640,
    mime_type: "application/figma",
    uploaded_at: "2025-10-10T14:30:00Z",
    uploaded_by: "Design Team",
  },
  {
    id: "asset-3",
    project_id: "demo-project-1",
    name: "API Documentation",
    type: "document",
    url: "https://example.com/assets/api-docs.pdf",
    description: "Complete API documentation for backend integration",
    size: 2097152,
    mime_type: "application/pdf",
    uploaded_at: "2025-10-12T11:00:00Z",
    uploaded_by: "Backend Team",
  },
  {
    id: "asset-4",
    project_id: "demo-project-1",
    name: "User Testing Session",
    type: "loom",
    url: "https://www.loom.com/share/example2",
    description: "User testing session with feedback and insights",
    uploaded_at: "2025-10-14T16:45:00Z",
    uploaded_by: "UX Researcher",
  },
  {
    id: "asset-5",
    project_id: "demo-project-1",
    name: "Brand Guidelines",
    type: "document",
    url: "https://example.com/assets/brand-guidelines.pdf",
    description: "Updated brand guidelines and style guide",
    size: 5242880,
    mime_type: "application/pdf",
    uploaded_at: "2025-09-20T09:00:00Z",
    uploaded_by: "Design Team",
  },
  {
    id: "asset-6",
    project_id: "demo-project-1",
    name: "Performance Optimization Guide",
    type: "document",
    url: "https://example.com/assets/performance-guide.pdf",
    description: "Best practices and guidelines for performance optimization",
    size: 1048576,
    mime_type: "application/pdf",
    uploaded_at: "2025-10-16T13:20:00Z",
    uploaded_by: "Tech Lead",
  },
];

const mockInvoices: ClientPortalInvoice[] = [
  {
    id: "invoice-1",
    project_id: "demo-project-1",
    milestone_id: "milestone-1",
    invoice_number: "INV-2025-001",
    amount: 25000,
    status: "paid",
    due_date: "2025-10-15T00:00:00Z",
    paid_at: "2025-10-12T14:30:00Z",
    payment_method: "Bank Transfer",
    line_items: [
      {
        id: "item-1",
        description: "Discovery & Planning Phase",
        quantity: 1,
        unit_price: 25000,
        total: 25000,
      },
    ],
    created_at: "2025-10-01T00:00:00Z",
    updated_at: "2025-10-12T14:30:00Z",
  },
  {
    id: "invoice-2",
    project_id: "demo-project-1",
    milestone_id: "milestone-2",
    invoice_number: "INV-2025-002",
    amount: 35000,
    status: "paid",
    due_date: "2025-11-15T00:00:00Z",
    paid_at: "2025-11-10T10:15:00Z",
    payment_method: "Credit Card",
    line_items: [
      {
        id: "item-2",
        description: "Design Phase - UI/UX Design",
        quantity: 1,
        unit_price: 20000,
        total: 20000,
      },
      {
        id: "item-3",
        description: "Design Phase - Design System",
        quantity: 1,
        unit_price: 15000,
        total: 15000,
      },
    ],
    created_at: "2025-11-01T00:00:00Z",
    updated_at: "2025-11-10T10:15:00Z",
  },
  {
    id: "invoice-3",
    project_id: "demo-project-1",
    milestone_id: "milestone-3",
    invoice_number: "INV-2025-003",
    amount: 40000,
    status: "sent",
    due_date: "2025-11-30T00:00:00Z",
    line_items: [
      {
        id: "item-4",
        description: "Frontend Development - Phase 1",
        quantity: 1,
        unit_price: 40000,
        total: 40000,
      },
    ],
    created_at: "2025-11-15T00:00:00Z",
    updated_at: "2025-11-15T00:00:00Z",
  },
];

const mockMeetings: MeetingMinute[] = [
  {
    id: "meeting-1",
    project_id: "demo-project-1",
    title: "Sprint Planning - Week 8",
    date: "2025-10-15T14:00:00Z",
    attendees: ["John Doe (PM)", "Jane Smith (Client)", "Mike Johnson (Dev Lead)", "Sarah Williams (Designer)"],
    summary: "Discussed progress on frontend development milestone. Reviewed completed components including product listing and shopping cart. Identified upcoming tasks for payment integration and user authentication. Client provided positive feedback on current progress and design implementation.",
    action_items: [
      {
        id: "action-1",
        description: "Complete payment gateway integration",
        assignee: "Mike Johnson",
        due_date: "2025-10-22T00:00:00Z",
        status: "in_progress",
      },
      {
        id: "action-2",
        description: "Review and approve shopping cart deliverable",
        assignee: "Jane Smith",
        due_date: "2025-10-20T00:00:00Z",
        status: "pending",
      },
      {
        id: "action-3",
        description: "Prepare user authentication flow mockups",
        assignee: "Sarah Williams",
        due_date: "2025-10-25T00:00:00Z",
        status: "in_progress",
      },
    ],
    recording_url: "https://www.loom.com/share/meeting-recording-1",
    created_at: "2025-10-15T15:30:00Z",
    updated_at: "2025-10-15T15:30:00Z",
  },
  {
    id: "meeting-2",
    project_id: "demo-project-1",
    title: "Design Review Session",
    date: "2025-10-08T10:00:00Z",
    attendees: ["Jane Smith (Client)", "Sarah Williams (Designer)", "John Doe (PM)"],
    summary: "Comprehensive review of the design system and homepage mockups. Client approved the overall design direction with minor feedback on color contrast for accessibility. Discussed mobile responsiveness requirements and confirmed tablet breakpoint specifications.",
    action_items: [
      {
        id: "action-4",
        description: "Adjust color contrast for WCAG AA compliance",
        assignee: "Sarah Williams",
        due_date: "2025-10-12T00:00:00Z",
        status: "completed",
      },
      {
        id: "action-5",
        description: "Create tablet-specific mockups",
        assignee: "Sarah Williams",
        due_date: "2025-10-15T00:00:00Z",
        status: "completed",
      },
    ],
    recording_url: "https://www.loom.com/share/meeting-recording-2",
    created_at: "2025-10-08T11:30:00Z",
    updated_at: "2025-10-08T11:30:00Z",
  },
];

const mockUpdates: ProjectUpdate[] = [
  {
    id: "update-1",
    project_id: "demo-project-1",
    title: "Shopping Cart Component Submitted",
    description: "Complete shopping cart implementation has been submitted for your review",
    type: "deliverable",
    created_at: "2025-10-17T10:15:00Z",
  },
  {
    id: "update-2",
    project_id: "demo-project-1",
    title: "Product Listing Page Ready",
    description: "Product listing page with filtering and sorting is ready for approval",
    type: "deliverable",
    created_at: "2025-10-18T14:30:00Z",
  },
  {
    id: "update-3",
    project_id: "demo-project-1",
    title: "Frontend Development Milestone 75% Complete",
    description: "Great progress on frontend development - now at 75% completion",
    type: "milestone",
    created_at: "2025-10-19T09:00:00Z",
  },
  {
    id: "update-4",
    project_id: "demo-project-1",
    title: "Design System Approved",
    description: "Your design system documentation has been approved",
    type: "status",
    created_at: "2025-10-16T09:30:00Z",
  },
  {
    id: "update-5",
    project_id: "demo-project-1",
    title: "Invoice INV-2025-003 Sent",
    description: "New invoice for Frontend Development Phase 1 has been sent",
    type: "general",
    created_at: "2025-11-15T00:00:00Z",
  },
];

// Mock API functions
export function useMockClientPortalProject(projectId: string) {
  return useQuery({
    queryKey: ["client-portal-project", projectId],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockProject;
    },
  });
}

export function useMockClientPortalMilestones(projectId: string) {
  return useQuery({
    queryKey: ["client-portal-milestones", projectId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockMilestones;
    },
  });
}

export function useMockDeliverables(projectId: string) {
  return useQuery({
    queryKey: ["client-portal-deliverables", projectId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 450));
      return mockDeliverables;
    },
  });
}

export function useMockSharedAssets(projectId: string) {
  return useQuery({
    queryKey: ["client-portal-assets", projectId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockAssets;
    },
  });
}

export function useMockClientPortalInvoices(projectId: string) {
  return useQuery({
    queryKey: ["client-portal-invoices", projectId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockInvoices;
    },
  });
}

export function useMockMeetingMinutes(projectId: string) {
  return useQuery({
    queryKey: ["client-portal-meetings", projectId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 450));
      return mockMeetings;
    },
  });
}

export function useMockProjectUpdates(projectId: string) {
  return useQuery({
    queryKey: ["client-portal-updates", projectId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return mockUpdates;
    },
  });
}
