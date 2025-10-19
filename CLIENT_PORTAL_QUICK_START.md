# Client Portal - Quick Start Guide

## 🚀 Access the Client Portal

### Development Mode
Navigate to: **`/client-portal/demo-project-1`**

Or click **"Client Portal"** in the sidebar navigation.

## 📋 Features Overview

### 1. **Overview Tab**
- Project summary with status and progress
- Milestone timeline
- Recent activity feed
- Budget tracking

### 2. **Deliverables Tab**
- Pending approvals (with badge count)
- Approve/Reject/Request Revision actions
- File downloads
- Review notes

### 3. **Assets Tab**
- Shared files and documents
- Loom video recordings
- External links
- Download capabilities

### 4. **Invoices Tab**
- Invoice listing with status
- Line item breakdown
- Payment processing
- PDF downloads

### 5. **Communications Tab**
- Meeting minutes with AI summaries
- Action items tracking
- Meeting recordings
- Attendee lists

## 🎨 Design Features

### Status Colors
- 🟢 **Green**: Active, Completed, Approved, Paid
- 🟡 **Yellow**: Pending Approval, Sent
- 🔵 **Blue**: In Progress, Launch
- 🔴 **Red**: Rejected, Overdue
- 🟣 **Purple**: Special items

### Interactive Elements
- **Hover Effects**: Cards lift with border glow
- **Loading States**: Skeleton loaders
- **Empty States**: Helpful icons and messages
- **Animations**: Smooth fade-in transitions

## 🔧 Technical Details

### File Structure
```
src/
├── pages/
│   └── ClientPortalPage.tsx          # Main page (1,100+ lines)
├── types/
│   └── clientPortal.ts                # TypeScript types
├── api/
│   └── clientPortal.ts                # API functions
└── hooks/
    └── useMockClientPortal.ts         # Mock data hooks
```

### Key Components Used
- `DashboardLayout` - Main layout wrapper
- `Tabs` - Section navigation
- `Card` - Content containers
- `Badge` - Status indicators
- `Progress` - Progress bars
- `Dialog` - Approval modal
- `Button` - Actions

## 📊 Mock Data

The portal includes realistic mock data:
- **Project**: E-commerce Platform Redesign
- **Budget**: $125,000 ($85,000 spent)
- **Progress**: 68%
- **Milestones**: 4 (2 completed, 1 in progress, 1 pending)
- **Deliverables**: 3 (2 pending approval, 1 approved)
- **Assets**: 6 (files, Loom videos, documents)
- **Invoices**: 3 (2 paid, 1 sent)
- **Meetings**: 2 with action items

## 🎯 User Flows

### Approve a Deliverable
1. Go to **Deliverables** tab
2. Find deliverable with "Pending Approval" badge
3. Click **"Approve"** button
4. Add optional notes in dialog
5. Click **"Approve"** to confirm
6. See success toast notification

### View Invoice Details
1. Go to **Invoices** tab
2. Click on any invoice card
3. View line items and total
4. Click **"Pay Now"** for pending invoices
5. Click **"Download PDF"** to save

### Access Shared Assets
1. Go to **Assets** tab
2. Browse grid of assets
3. Click external link icon to open
4. View asset details and metadata

## 🔄 API Integration

### Current Setup (Development)
Uses mock data hooks:
```typescript
useMockClientPortalProject(projectId)
useMockClientPortalMilestones(projectId)
useMockDeliverables(projectId)
// ... etc
```

### Production Setup
Replace with real API calls in `ClientPortalPage.tsx`:
```typescript
import {
  getClientPortalProject,
  getClientPortalMilestones,
  getDeliverables,
  // ... etc
} from "@/api/clientPortal";

// Then use with React Query:
const { data: project } = useQuery({
  queryKey: ["client-portal-project", projectId],
  queryFn: () => getClientPortalProject(projectId!),
  enabled: !!projectId,
});
```

## 🎨 Customization

### Change Colors
Edit `src/index.css`:
```css
--accent-green: 114 212 122;
--accent-yellow: 255 223 110;
--accent-blue: 96 180 247;
--accent-red: 244 122 122;
--accent-purple: 185 140 249;
```

### Modify Layout
Edit `src/pages/ClientPortalPage.tsx`:
- Adjust grid layouts
- Reorder tabs
- Add/remove sections
- Customize card designs

## 🐛 Troubleshooting

### Issue: Page not loading
- Check if `projectId` is valid
- Verify route is protected with `<ProtectedRoute>`
- Check browser console for errors

### Issue: Data not displaying
- Verify mock hooks are imported
- Check React Query DevTools
- Ensure `projectId` matches mock data

### Issue: Approval not working
- Check `submitApproval` API function
- Verify deliverable ID is correct
- Check toast notifications for errors

## 📱 Mobile Support

The portal is fully responsive:
- **Mobile**: Single column layout, stacked cards
- **Tablet**: 2-column grid for assets
- **Desktop**: Full 3-column layout

## ♿ Accessibility

- Keyboard navigation supported
- ARIA labels on interactive elements
- Focus indicators visible
- Color contrast meets WCAG AA
- Screen reader friendly

## 🚦 Status Indicators

### Project Status
- **Active**: Green - Project in progress
- **Launch**: Blue - Ready for launch
- **Completed**: Green - Project finished
- **On Hold**: Gray - Temporarily paused

### Deliverable Status
- **Pending Approval**: Yellow - Awaiting review
- **Approved**: Green - Accepted by client
- **Rejected**: Red - Not accepted
- **Revision Requested**: Yellow - Changes needed

### Invoice Status
- **Draft**: Gray - Not sent yet
- **Sent**: Yellow - Awaiting payment
- **Paid**: Green - Payment received
- **Overdue**: Red - Past due date

## 📞 Support

For issues or questions:
1. Check this guide
2. Review `CLIENT_PORTAL_IMPLEMENTATION.md`
3. Check browser console for errors
4. Verify API endpoints are correct

## ✅ Quick Checklist

Before going live:
- [ ] Replace mock data with real API calls
- [ ] Test all approval workflows
- [ ] Verify payment integration
- [ ] Test on mobile devices
- [ ] Check accessibility
- [ ] Verify all links work
- [ ] Test with real client data
- [ ] Configure branding/customization
- [ ] Set up notifications
- [ ] Test error scenarios

---

**Need help?** Check the full implementation guide: `CLIENT_PORTAL_IMPLEMENTATION.md`
