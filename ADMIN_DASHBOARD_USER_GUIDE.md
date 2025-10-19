# Admin Dashboard - User Guide

## Quick Start

### Accessing the Admin Dashboard

1. **Login** as an admin user
2. **Navigate** to `/admin` or click "Admin" in the sidebar
3. **View** the overview dashboard with key metrics

---

## Dashboard Tabs

### 1. Overview Tab

**Purpose:** High-level system health and quick actions

**Features:**
- **KPI Cards:** Total Users, Active Projects, Monthly Revenue, Proposal Rate
- **Integration Health:** Status of all connected services
- **Quick Actions:** Shortcuts to common tasks
- **System Metrics:** Revenue, project value, billable hours

**Quick Actions:**
- Invite User
- New Template
- Connect Service
- View Audit Logs

---

### 2. Users & Teams Tab

**Purpose:** Manage team members and permissions

#### Invite a New User
1. Click **"Invite User"** button
2. Enter email address
3. Enter full name
4. Select role (Admin, Manager, Developer, Client)
5. Click **"Send Invitation"**

#### Update User Role
1. Find user in the table
2. Click the **⋮** (more) menu
3. Select **"Make Admin"** or **"Make Manager"**
4. Role updates immediately

#### Deactivate/Reactivate User
1. Find user in the table
2. Click the **⋮** menu
3. Select **"Deactivate"** or **"Reactivate"**
4. Confirm the action

#### Delete User
1. Find user in the table
2. Click the **⋮** menu
3. Select **"Delete User"**
4. Confirm deletion (⚠️ This action cannot be undone)

#### Search Users
- Use the search bar to filter by name or email
- Results update in real-time

**Role Types:**
- **Admin:** Full system access
- **Manager:** Project and team management
- **Developer:** Task and time tracking
- **Client:** Read-only portal access

**Status Types:**
- **Active:** User can log in and access the system
- **Inactive:** User account is disabled
- **Pending:** Invitation sent, awaiting acceptance

---

### 3. Templates Tab

**Purpose:** Manage reusable templates for proposals, SoWs, tasks, and contracts

#### Create a New Template
1. Click **"Create Template"** button
2. Enter template name
3. Select type (Proposal, SoW, Task, Contract)
4. Add description
5. Write template content with variables: `{{variable_name}}`
6. Click **"Create Template"**

#### Edit Template
1. Find template in the grid
2. Click the **⋮** menu
3. Select **"Edit"**
4. Make changes
5. Save

#### Duplicate Template
1. Find template in the grid
2. Click the **⋮** menu
3. Select **"Duplicate"**
4. Template is copied with "(Copy)" suffix

#### Delete Template
1. Find template in the grid
2. Click the **⋮** menu
3. Select **"Delete"**
4. Confirm deletion

#### Filter Templates
- Use the **type dropdown** to filter by template type
- Use the **search bar** to find templates by name or description

**Template Variables:**
- Use `{{variable_name}}` syntax in template content
- Variables are automatically detected and tracked
- Variables are replaced with actual values when template is used

**Template Types:**
- **Proposal:** Client project proposals
- **SoW:** Statement of Work documents
- **Task:** Task templates with acceptance criteria
- **Contract:** Legal agreements and contracts

---

### 4. Integrations Tab

**Purpose:** Manage external service connections

#### View Integration Status
- **Connected:** Integration is active and working
- **Disconnected:** Integration is not connected
- **Error:** Integration has encountered an issue

#### Sync Integration
1. Find integration in the table
2. Click the **🔄** (refresh) button
3. Wait for sync to complete
4. Check the "Last Sync" timestamp

#### Disconnect Integration
1. Find integration in the table
2. Click **"Disconnect"**
3. Confirm disconnection
4. Integration status changes to "Disconnected"

#### View Integration Logs
- Scroll to the **"Integration Logs"** section
- View recent sync events and errors
- Check timestamps and event types

**Supported Integrations:**
- **GitHub/GitLab:** Repository management and commit tracking
- **Vercel/Cloudflare:** Deployment and hosting
- **Google/Microsoft Calendar:** Meeting scheduling and sync
- **QuickBooks:** Billing and invoicing
- **Stripe:** Payment processing
- **Loom:** Video tutorials and documentation

**Health Status:**
- **Healthy:** 🟢 Integration is working normally
- **Warning:** 🟡 Minor issues detected
- **Error:** 🔴 Integration requires attention

---

### 5. Analytics Tab

**Purpose:** View system metrics and performance data

#### KPI Cards
- **Total Revenue:** Cumulative revenue with growth percentage
- **Active Users:** Currently active users
- **Active Projects:** Projects in progress
- **Billable Hours:** Total tracked billable time

#### Revenue Trends Chart
- View revenue and project count over time
- Select period: Monthly, Quarterly, or Yearly
- Hover over bars for detailed values

#### User Activity Chart
- Track active users and new user signups
- 30-day rolling view
- Compare active vs. new user trends

#### Proposal Metrics
- Total proposals created
- Accepted proposals
- Pending proposals
- Acceptance rate percentage

#### Project Metrics
- Total projects
- Active projects
- Average project value
- Total time tracked

**Using Analytics:**
1. Review KPI cards for quick insights
2. Change chart periods to view different timeframes
3. Hover over chart elements for detailed data
4. Use metrics to identify trends and opportunities

---

### 6. Audit Logs Tab

**Purpose:** Track all system activities and user actions

#### View Audit Logs
- All system events are logged automatically
- Includes user, action, resource, timestamp, and IP address

#### Filter Logs
1. **By Action:** Select Create, Update, Delete, or View
2. **By Resource:** Select Users, Projects, Proposals, Templates, or Integrations
3. **Search:** Enter keywords to find specific events

#### Export Logs
1. Apply desired filters (optional)
2. Click **"Export Logs"** button
3. CSV file downloads automatically
4. Open in Excel or other spreadsheet software

#### View Log Details
- Click the **👁** (eye) icon to view full event details
- See complete metadata and context

**Audit Log Information:**
- **Timestamp:** When the action occurred
- **User:** Who performed the action
- **Action:** What was done (create, update, delete, view)
- **Resource:** What was affected (user, project, template, etc.)
- **IP Address:** Where the action originated
- **Details:** Additional context and metadata

**Summary Statistics:**
- **Total Events:** All logged actions
- **Unique Users:** Number of users who performed actions
- **Today's Events:** Actions performed today
- **Critical Actions:** Destructive operations (deletes, removes)

---

## Best Practices

### User Management
- ✅ Regularly review user access and roles
- ✅ Deactivate users who no longer need access
- ✅ Use appropriate roles for each user
- ✅ Monitor last login dates to identify inactive accounts

### Template Management
- ✅ Create templates for common document types
- ✅ Use clear, descriptive names
- ✅ Document required variables
- ✅ Test templates before using in production
- ✅ Keep templates updated with latest standards

### Integration Management
- ✅ Monitor integration health regularly
- ✅ Sync integrations daily or as needed
- ✅ Address errors promptly
- ✅ Review integration logs for issues
- ✅ Keep API credentials secure

### Analytics Review
- ✅ Review KPIs weekly
- ✅ Track trends over time
- ✅ Identify bottlenecks and opportunities
- ✅ Share insights with stakeholders
- ✅ Use data to inform decisions

### Audit Logging
- ✅ Review audit logs regularly for security
- ✅ Export logs monthly for compliance
- ✅ Investigate suspicious activities
- ✅ Use filters to focus on critical actions
- ✅ Maintain audit trail for accountability

---

## Troubleshooting

### Integration Errors
**Problem:** Integration shows "Error" status  
**Solution:**
1. Check integration logs for error details
2. Verify API credentials are valid
3. Try disconnecting and reconnecting
4. Contact support if issue persists

### User Cannot Access System
**Problem:** User reports they cannot log in  
**Solution:**
1. Check user status (should be "Active")
2. Verify user has correct role
3. Reactivate user if needed
4. Resend invitation if status is "Pending"

### Template Not Working
**Problem:** Template variables not replacing correctly  
**Solution:**
1. Check variable syntax: `{{variable_name}}`
2. Ensure variable names match exactly
3. Test template with sample data
4. Edit and save template to refresh

### Analytics Not Updating
**Problem:** Charts show old data  
**Solution:**
1. Refresh the page
2. Check if data sync is running
3. Verify integrations are connected
4. Wait for next scheduled update

### Audit Logs Missing
**Problem:** Expected events not appearing in logs  
**Solution:**
1. Check filter settings (may be hiding events)
2. Verify date range
3. Clear search query
4. Reset all filters to "All"

---

## Keyboard Shortcuts

- **Search:** `/` - Focus search bar
- **Escape:** Close modals and dialogs
- **Tab:** Navigate between form fields
- **Enter:** Submit forms

---

## Mobile Usage

The Admin Dashboard is fully responsive and works on mobile devices:

- **Sidebar:** Collapses to hamburger menu
- **Tables:** Convert to card layout
- **Charts:** Adjust to screen width
- **Forms:** Stack vertically for easy input

---

## Security Notes

### Admin Responsibilities
- ⚠️ Admin access grants full system control
- ⚠️ Be cautious when deleting users or templates
- ⚠️ Review audit logs for unauthorized access
- ⚠️ Keep admin credentials secure
- ⚠️ Use 2FA if available

### Data Protection
- 🔒 All actions are logged in audit trail
- 🔒 User passwords are encrypted
- 🔒 API credentials are stored securely
- 🔒 Export data is for authorized use only

---

## Support

### Getting Help
- **Documentation:** Review this guide and related docs
- **Support:** Contact your system administrator
- **Issues:** Report bugs via support channel
- **Feature Requests:** Submit via feedback form

### Additional Resources
- `ADMIN_DASHBOARD_VERIFICATION.md` - Technical implementation details
- `design_rules.md` - Design system reference
- `BUILD_GUIDE.md` - Development guidelines

---

## Quick Reference

### Common Tasks

| Task | Steps |
|------|-------|
| Invite User | Users tab → Invite User → Fill form → Send |
| Create Template | Templates tab → Create Template → Fill form → Create |
| Sync Integration | Integrations tab → Find service → Click sync button |
| Export Audit Logs | Audit Logs tab → Apply filters → Export Logs |
| View Analytics | Analytics tab → Review charts and metrics |

### Status Indicators

| Color | Meaning |
|-------|---------|
| 🟢 Green | Success, Active, Healthy |
| 🟡 Yellow | Warning, Pending |
| 🔴 Red | Error, Critical, Inactive |
| 🔵 Blue | Info, Developer |
| 🟣 Purple | Manager, Special |

---

**Last Updated:** 2025-10-19  
**Version:** 1.0.0  
**For:** Autopilot Studio Admin Dashboard
