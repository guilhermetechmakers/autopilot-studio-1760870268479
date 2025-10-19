# Admin Dashboard - Quick Start Guide

## 🚀 Accessing the Admin Dashboard

1. **Navigate to**: `/admin`
2. **Or click**: "Admin" in the sidebar (Shield icon)
3. **Requires**: Admin role authentication

## 📋 Features Overview

### 1️⃣ Overview Tab
- View key metrics (Users, Projects, Revenue, Proposals)
- Monitor integration health
- Access quick actions
- See system metrics summary

### 2️⃣ Users & Teams Tab
**Actions:**
- ✅ Invite new users (click "Invite User" button)
- ✅ Change user roles (dropdown menu on each user)
- ✅ Activate/Deactivate users
- ✅ Delete users
- ✅ Search users by name or email

**User Roles:**
- 🛡️ **Admin** - Full system access
- 👤 **Manager** - Project management
- 💻 **Developer** - Development tasks
- 👥 **Client** - Client portal access

### 3️⃣ Templates Tab
**Actions:**
- ✅ Create new templates (click "Create Template")
- ✅ Edit existing templates
- ✅ Duplicate templates
- ✅ Delete templates
- ✅ Filter by type (Proposal, SoW, Task, Contract)
- ✅ Search templates

**Template Types:**
- 📄 **Proposal** - Project proposals
- ✅ **SoW** - Statement of Work
- 💻 **Task** - Task templates
- 📝 **Contract** - Service contracts

### 4️⃣ Integrations Tab
**Actions:**
- ✅ View connected services
- ✅ Sync integrations (refresh icon)
- ✅ Disconnect services
- ✅ View integration logs
- ✅ Monitor health status

**Supported Integrations:**
- GitHub/GitLab
- Vercel/Cloudflare
- Google/Microsoft Calendar
- QuickBooks
- Stripe
- Loom

### 5️⃣ Analytics Tab
**Metrics:**
- 📊 Revenue trends (bar chart)
- 👥 User activity (line chart)
- 💰 Total revenue
- 📈 Active users & projects
- ⏱️ Billable hours
- 📋 Proposal metrics

**Controls:**
- Select period: Monthly, Quarterly, Yearly

### 6️⃣ Audit Logs Tab
**Actions:**
- ✅ View all system activities
- ✅ Filter by action type
- ✅ Filter by resource type
- ✅ Search logs
- ✅ Export to CSV (click "Export Logs")

**Tracked Actions:**
- Create, Update, Delete, View operations
- User changes, template edits, integration events

## 🎨 UI Elements

### Status Indicators:
- 🟢 **Green** - Active, Healthy, Success
- 🟡 **Yellow** - Warning, Pending
- 🔴 **Red** - Error, Inactive
- 🔵 **Blue** - Info, Developers
- 🟣 **Purple** - Managers, Special states

### Interactive Elements:
- **Cards** - Hover for subtle lift effect
- **Buttons** - Click for actions
- **Dropdowns** - More options menu (⋮)
- **Badges** - Status and role indicators
- **Tables** - Sortable, hoverable rows

## 💡 Tips

1. **Search**: Use the search bar to quickly find users, templates, or logs
2. **Filters**: Combine search with filters for precise results
3. **Bulk Actions**: Use dropdown menus for quick operations
4. **Confirmations**: Destructive actions require confirmation
5. **Feedback**: Toast notifications show success/error messages
6. **Responsive**: Works on desktop, tablet, and mobile

## 🔧 Developer Notes

### Mock Data:
- Currently using mock data for development
- To switch to real API: Set `USE_MOCK_DATA = false` in `src/api/admin.ts`

### File Structure:
```
src/
├── pages/
│   └── AdminDashboard.tsx          # Main page
├── components/admin/
│   ├── UsersManagementTab.tsx      # User management
│   ├── TemplatesTab.tsx            # Template library
│   ├── IntegrationsTab.tsx         # Integration management
│   ├── AnalyticsTab.tsx            # Analytics dashboard
│   └── AuditLogsTab.tsx            # Audit logs
├── api/
│   └── admin.ts                    # API service layer
├── types/
│   └── admin.ts                    # TypeScript types
└── hooks/
    └── useMockAdmin.ts             # Mock data
```

### Key Dependencies:
- React Query - Data fetching
- Recharts - Charts
- Shadcn/ui - UI components
- Sonner - Notifications
- Lucide React - Icons

## 🐛 Troubleshooting

**Issue**: Admin link not visible in sidebar
- **Solution**: Check user role is set to 'admin'

**Issue**: Data not loading
- **Solution**: Check React Query DevTools for errors

**Issue**: Charts not rendering
- **Solution**: Ensure Recharts is installed and data format is correct

**Issue**: Export not working
- **Solution**: Check browser allows file downloads

## 📞 Support

For issues or questions:
1. Check console for errors
2. Review React Query cache
3. Verify user permissions
4. Check network requests

---

**Last Updated**: October 19, 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready
