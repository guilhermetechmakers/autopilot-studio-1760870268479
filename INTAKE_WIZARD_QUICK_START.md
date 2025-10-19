# AI-Assisted Intake Wizard - Quick Start Guide

## 🚀 Getting Started

### Access the Intake Wizard

**Option 1: From Landing Page**
```
Navigate to: /
Click: "Book Intake" button
```

**Option 2: From Dashboard**
```
Navigate to: /dashboard
Click: "Start Intake" quick action button
```

**Option 3: From Sidebar**
```
Click: "Intake Wizard" in the sidebar navigation
```

**Option 4: Direct URL**
```
Navigate to: /intake
```

## 📝 Using the Wizard

### Step 1: Company Information
Fill in basic company and contact details:
- Company name (required)
- Company website
- Company size
- Industry
- Contact name (required)
- Contact email (required)
- Contact phone
- Contact role

**Tip**: After filling required fields, the intake is automatically created and will autosave.

### Step 2: Project Goals
Define your project objectives:
- Project name (required)
- Project description (required)
- Project goals (add multiple)
- Target audience
- Success metrics

**AI Feature**: Click "AI Suggest" to get AI-generated project goals based on your description.

### Step 3: Budget & Timeline
Set project constraints:
- Budget range (required)
- Budget notes
- Timeline (required)
- Timeline notes
- Preferred start date
- Target deadline

### Step 4: Technical Details
Specify technical requirements:
- Tech stack preferences (add multiple)
- Existing systems
- Integration requirements
- Technical constraints
- Stakeholders (add multiple with roles)
- Additional notes

**AI Feature**: Click "AI Suggest" to get tech stack recommendations.

### Step 5: Review & Qualify
Review your submission and get qualified:
1. Review project summary
2. Click "Qualify This Lead"
3. View qualification score and factors
4. See recommended next steps
5. Generate proposal or schedule discovery call

## 🤖 AI Assistant Features

### Getting AI Suggestions
1. Fill in relevant context (project description, goals, etc.)
2. Click "AI Suggest" button for specific fields
3. Review suggestions with confidence scores
4. Click "Apply" to add suggestion to form

### Answering AI Questions
1. AI will ask clarifying questions based on your input
2. Click "Answer" on any question
3. Type your response
4. Click "Submit"
5. Your answer is recorded and form is updated

### AI Suggestions Appear For:
- Project goals
- Success metrics
- Tech stack preferences
- Clarifying questions about missing information

## 💾 Autosave

The wizard automatically saves your progress:
- Saves every 2 seconds after changes
- Visual indicator shows "Saving..." or "Saved"
- Safe to navigate away and return
- All data is preserved

## 📊 Qualification System

### Qualification Factors (Weighted)
1. **Budget Alignment** (30%) - Does budget match typical projects?
2. **Timeline Feasibility** (20%) - Is timeline realistic?
3. **Project Clarity** (25%) - Are goals and description clear?
4. **Technical Fit** (15%) - Does tech match our expertise?
5. **Stakeholder Engagement** (10%) - Are decision makers identified?

### Qualification Statuses
- **Qualified** (75+ score): Ready for proposal generation
- **Needs Review** (60-74 score): Schedule discovery call
- **Disqualified** (<60 score): May not be a good fit

### Next Steps Based on Status

**Qualified Leads:**
- Generate automated proposal
- Schedule discovery call
- Assign project manager

**Needs Review:**
- Schedule discovery call to clarify
- Request additional details
- Review with sales team

**Disqualified:**
- Send polite decline with resources
- Add to nurture campaign
- Revisit in 6 months

## 🎯 Quick Actions After Qualification

### Generate Proposal
1. Complete qualification
2. If qualified, click "Generate Proposal"
3. Redirects to proposal generator with pre-filled data
4. Customize and send to client

### Schedule Discovery Call
1. Click "Schedule Discovery"
2. Opens meeting scheduler
3. Select preferred times
4. Send invitation to client

## 🔄 Editing Existing Intakes

To edit an existing intake:
```
Navigate to: /intake?id={intakeId}
```

- Form loads with saved data
- Completed steps are marked
- Navigate between any steps
- Changes autosave automatically

## 📱 Mobile Support

The wizard is fully responsive:
- Touch-friendly inputs
- Optimized layouts for mobile
- Swipe navigation (coming soon)
- All features work on mobile

## ⌨️ Keyboard Shortcuts

- **Tab**: Navigate between fields
- **Enter**: Submit current field (goals, tech stack)
- **Esc**: Close modals/dialogs
- **Arrow Keys**: Navigate step indicator

## 🎨 Visual Indicators

### Step Indicator Colors
- **Green checkmark**: Completed step
- **Blue ring**: Current step
- **Gray**: Incomplete step

### Badge Colors
- **Green**: High confidence AI suggestions, qualified status
- **Yellow**: Medium confidence, needs review status
- **Red**: Low confidence, disqualified status
- **Blue**: Info badges
- **Purple**: AI-related features

### Button Colors
- **Green**: Primary actions (Next, Generate Proposal)
- **Purple**: AI actions (Qualify, AI Suggest)
- **Blue**: Secondary actions (Schedule Discovery)
- **Gray**: Neutral actions (Previous, Cancel)

## 🐛 Common Issues

### "Please fill in all required fields"
**Solution**: Check that all fields marked with * are filled in the current step.

### AI suggestions not appearing
**Solution**: 
1. Ensure project description is filled
2. Wait for "Analyzing..." to complete
3. Try clicking "AI Suggest" again

### Autosave not working
**Solution**: 
1. Check internet connection
2. Ensure you completed Step 1 (creates intake record)
3. Look for "Saved" indicator

### Can't navigate to next step
**Solution**: Fill all required fields in current step before proceeding.

## 💡 Pro Tips

1. **Fill Description First**: AI suggestions work best with detailed project descriptions
2. **Use AI Suggestions**: They're based on successful similar projects
3. **Add Decision Makers**: Mark stakeholders as decision makers for better qualification
4. **Be Specific**: Detailed information leads to better qualification scores
5. **Review Before Qualifying**: Check all information in Step 5 before qualifying

## 🔗 Integration with Other Features

### Proposals
- Qualified intakes can generate proposals automatically
- Intake data pre-fills proposal fields
- Link back to intake from proposal

### Projects
- Approved proposals create projects
- Project links back to original intake
- Intake data flows through entire pipeline

### Calendar
- Discovery calls integrate with calendar
- Meeting invites sent automatically
- Syncs with Google/Outlook calendars

## 📈 Best Practices

1. **Complete All Steps**: Even optional fields improve qualification
2. **Use AI Assistance**: Leverage AI for better, faster intake
3. **Add Multiple Goals**: More goals = better project clarity
4. **Include Stakeholders**: Helps with project planning
5. **Be Honest About Budget**: Accurate budget leads to better matches
6. **Set Realistic Timelines**: Helps with resource planning

## 🎓 Training Resources

### Video Tutorials (Coming Soon)
- Introduction to Intake Wizard
- Using AI Assistant
- Understanding Qualification
- From Intake to Proposal

### Documentation
- Full implementation guide: `INTAKE_WIZARD_IMPLEMENTATION.md`
- Design system: `design_rules.md`
- API documentation: `src/api/intake.ts`

## 📞 Support

Need help?
1. Check this quick start guide
2. Review the full implementation documentation
3. Contact your team lead
4. Submit a support ticket

---

**Happy Intaking! 🎉**

Start capturing leads with AI-powered assistance today.
