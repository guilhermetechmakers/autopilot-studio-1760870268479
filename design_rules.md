# Design Rules for This Project

## Project Design Pattern: ---

## Visual Style

### Color Palette:
- Primary background: Deep charcoal (#23272F) for main UI, with slightly darker sidebar (#1A1D23)
- Accent colors: Soft yellow (#FFDF6E), muted green (#72D47A), pale blue (#60B4F7), soft red (#F47A7A), and light purple (#B98CF9) for tags, status, and avatars
- Card backgrounds: Medium dark gray (#2C313A), with subtle variations for elevation
- Text colors: High-contrast white (#FFFFFF) for headings, light gray (#B0B6C3) for secondary text, muted gray (#818899) for placeholders and hints
- Border and divider: Subtle, semi-transparent gray (#353A43)
- Interaction highlights: Accent colors used sparingly for status indicators, toggles, and active items
- No gradients; flat, solid color fills dominate

### Typography & Layout:
- Font family: Modern sans-serif (e.g., Inter, SF Pro, or similar)
- Font weights: Bold for headings, regular for body, medium for labels and card titles
- Hierarchy: Clear separation with larger, bold section headers, medium card titles, and light body text
- Spacing: Generous padding inside cards and list items (20–28px); consistent vertical rhythm
- Alignment: Left-aligned text and navigation; center-aligned elements for avatars and icons
- Typography treatments: All-caps for navigation sections, regular case for tasks and descriptions

### Key Design Elements

#### Card Design:
- Rounded corners (12–16px radius)
- Subtle, soft shadows for elevation
- No visible borders; separation through background contrast
- Hover state: Slightly lighter card shade, soft shadow intensification
- Visual hierarchy: Title at top, status/labels prominent, avatars and tags at bottom or side

#### Navigation:
- Persistent vertical sidebar, dark background, icons and text labels
- Active state: Accent color highlight (e.g., yellow or green bar/indicator)
- Collapsible sections: Chevron icons, smooth expand/collapse transitions
- Subdued inactive items, bold for selected/active

#### Data Visualization:
- Minimal data visualization; if present, simple linear progress bars (green/gray), pill-shaped and subtle
- Status tags: Rounded, filled with accent color, clear readable text
- No complex charts; focus on clarity and minimalism

#### Interactive Elements:
- Buttons: Rounded corners, medium fill (gray or accent); prominent primary actions
- Button hover: Slight color lift, soft shadow or subtle outline
- Form elements: Minimal, flat design; light border or fill for inputs
- Micro-interactions: Subtle icon shifts, soft background fade on hover

### Design Philosophy
This interface embodies:
- A modern, minimal, and professional aesthetic with a focus on clarity and efficiency
- Design principles: High contrast, generous spacing, clear hierarchy, and focused use of color for actionable and status-driven elements
- User experience goals: Reduce cognitive load, promote quick scanning, ensure ease of navigation, and build trust through a clean, organized, and visually calm environment

---

This project follows the "---

## Visual Style

### Color Palette:
- Primary background: Deep charcoal (#23272F) for main UI, with slightly darker sidebar (#1A1D23)
- Accent colors: Soft yellow (#FFDF6E), muted green (#72D47A), pale blue (#60B4F7), soft red (#F47A7A), and light purple (#B98CF9) for tags, status, and avatars
- Card backgrounds: Medium dark gray (#2C313A), with subtle variations for elevation
- Text colors: High-contrast white (#FFFFFF) for headings, light gray (#B0B6C3) for secondary text, muted gray (#818899) for placeholders and hints
- Border and divider: Subtle, semi-transparent gray (#353A43)
- Interaction highlights: Accent colors used sparingly for status indicators, toggles, and active items
- No gradients; flat, solid color fills dominate

### Typography & Layout:
- Font family: Modern sans-serif (e.g., Inter, SF Pro, or similar)
- Font weights: Bold for headings, regular for body, medium for labels and card titles
- Hierarchy: Clear separation with larger, bold section headers, medium card titles, and light body text
- Spacing: Generous padding inside cards and list items (20–28px); consistent vertical rhythm
- Alignment: Left-aligned text and navigation; center-aligned elements for avatars and icons
- Typography treatments: All-caps for navigation sections, regular case for tasks and descriptions

### Key Design Elements

#### Card Design:
- Rounded corners (12–16px radius)
- Subtle, soft shadows for elevation
- No visible borders; separation through background contrast
- Hover state: Slightly lighter card shade, soft shadow intensification
- Visual hierarchy: Title at top, status/labels prominent, avatars and tags at bottom or side

#### Navigation:
- Persistent vertical sidebar, dark background, icons and text labels
- Active state: Accent color highlight (e.g., yellow or green bar/indicator)
- Collapsible sections: Chevron icons, smooth expand/collapse transitions
- Subdued inactive items, bold for selected/active

#### Data Visualization:
- Minimal data visualization; if present, simple linear progress bars (green/gray), pill-shaped and subtle
- Status tags: Rounded, filled with accent color, clear readable text
- No complex charts; focus on clarity and minimalism

#### Interactive Elements:
- Buttons: Rounded corners, medium fill (gray or accent); prominent primary actions
- Button hover: Slight color lift, soft shadow or subtle outline
- Form elements: Minimal, flat design; light border or fill for inputs
- Micro-interactions: Subtle icon shifts, soft background fade on hover

### Design Philosophy
This interface embodies:
- A modern, minimal, and professional aesthetic with a focus on clarity and efficiency
- Design principles: High contrast, generous spacing, clear hierarchy, and focused use of color for actionable and status-driven elements
- User experience goals: Reduce cognitive load, promote quick scanning, ensure ease of navigation, and build trust through a clean, organized, and visually calm environment

---" design pattern.
All design decisions should align with this pattern's best practices.

## General Design Principles

## Color & Visual Design

### Color Palettes
**Create depth with gradients:**
- Primary gradient (not just solid primary color)
- Subtle background gradients
- Gradient text for headings
- Gradient borders on cards
- Dark mode with elevated surfaces

**Color usage:**
- 60-30-10 rule (dominant, secondary, accent)
- Consistent semantic colors (success, warning, error)
- Accessible contrast ratios (WCAG AA minimum)
- Test colors in both light and dark modes

### Typography
**Create hierarchy through contrast:**
- Large, bold headings (48-72px for heroes)
- Clear size differences between levels
- Variable font weights (300, 400, 600, 700)
- Letter spacing for small caps
- Line height 1.5-1.7 for body text
- Inter, Poppins, or DM Sans for modern feel

### Shadows & Depth
**Layer UI elements:**
- Multi-layer shadows for realistic depth
- Colored shadows matching element color
- Elevated states on hover
- Neumorphism for special elements (sparingly)
- Adjust shadow intensity based on theme (lighter in dark mode)

---

---

## Interactions & Micro-animations

### Button Interactions
**Every button should react:**
- Scale slightly on hover (1.02-1.05)
- Lift with shadow on hover
- Ripple effect on click
- Loading state with spinner or progress
- Disabled state clearly visible
- Success state with checkmark animation

### Card Interactions
**Make cards feel alive:**
- Lift on hover with increased shadow
- Subtle border glow on hover
- Tilt effect following mouse (3D transform)
- Smooth transitions (200-300ms)
- Click feedback for interactive cards

### Form Interactions
**Guide users through forms:**
- Input focus states with border color change
- Floating labels that animate up
- Real-time validation with inline messages
- Success checkmarks for valid inputs
- Error states with shake animation
- Password strength indicators
- Character count for text areas

### Page Transitions
**Smooth between views:**
- Fade + slide for page changes
- Skeleton loaders during data fetch
- Optimistic UI updates
- Stagger animations for lists
- Route transition animations

---

---

## Mobile Responsiveness

### Mobile-First Approach
**Design for mobile, enhance for desktop:**
- Touch targets minimum 44x44px
- Generous padding and spacing
- Sticky bottom navigation on mobile
- Collapsible sections for long content
- Swipeable cards and galleries
- Pull-to-refresh where appropriate

### Responsive Patterns
**Adapt layouts intelligently:**
- Hamburger menu → full nav bar
- Card grid → stack on mobile
- Sidebar → drawer
- Multi-column → single column
- Data tables → card list
- Hide/show elements based on viewport

---

---

## Loading & Empty States

### Loading States
**Never leave users wondering:**
- Skeleton screens matching content layout
- Progress bars for known durations
- Animated placeholders
- Spinners only for short waits (<3s)
- Stagger loading for multiple elements
- Shimmer effects on skeletons

### Empty States
**Make empty states helpful:**
- Illustrations or icons
- Helpful copy explaining why it's empty
- Clear CTA to add first item
- Examples or suggestions
- No "no data" text alone

---

---

## Consistency Rules

### Maintain Consistency
**What should stay consistent:**
- Spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- Border radius values
- Animation timing (200ms, 300ms, 500ms)
- Color system (primary, secondary, accent, neutrals)
- Typography scale
- Icon style (outline vs filled)
- Button styles across the app
- Form element styles

### What Can Vary
**Project-specific customization:**
- Color palette (different colors, same system)
- Layout creativity (grids, asymmetry)
- Illustration style
- Animation personality
- Feature-specific interactions
- Hero section design
- Card styling variations
- Background patterns or textures

---

---

## Technical Excellence

### Performance
- Optimize images (WebP, lazy loading)
- Code splitting for faster loads
- Debounce search inputs
- Virtualize long lists
- Minimize re-renders
- Use proper memoization

### Accessibility
- Keyboard navigation throughout
- ARIA labels where needed
- Focus indicators visible
- Screen reader friendly
- Sufficient color contrast (both themes)
- Respect reduced motion preferences

---

---

## Key Principles

1. **Be Bold** - Don't be afraid to try unique layouts and interactions
2. **Be Consistent** - Use the same patterns for similar functions
3. **Be Responsive** - Design works beautifully on all devices
4. **Be Fast** - Animations are smooth, loading is quick
5. **Be Accessible** - Everyone can use what you build
6. **Be Modern** - Use current design trends and technologies
7. **Be Unique** - Each project should have its own personality
8. **Be Intuitive** - Users shouldn't need instructions
9. **Be Themeable** - Support both dark and light modes seamlessly

---

