# Landing Page - Quick Reference

## 📍 Location
**File**: `src/pages/LandingPage.tsx`  
**Route**: `/` (root path)  
**Status**: ✅ Complete and Production Ready

## 🎯 Quick Facts

- **Lines of Code**: ~650
- **Sections**: 9 major sections
- **Components Used**: Button, Card (Shadcn UI)
- **Icons**: 15+ Lucide React icons
- **Animations**: Tailwind CSS keyframes
- **Build Status**: ✅ Passing (no errors)
- **TypeScript**: ✅ Fully typed
- **Responsive**: ✅ Mobile-first design

## 📋 Page Structure

```
┌─────────────────────────────────────┐
│ Navigation (Sticky)                 │
├─────────────────────────────────────┤
│ Hero Section                        │
│ - Headline with accent              │
│ - Subheadline                       │
│ - Dual CTAs                         │
│ - Trust logos                       │
├─────────────────────────────────────┤
│ Product Tour Video                  │
│ - Video placeholder (Loom ready)    │
├─────────────────────────────────────┤
│ Features Overview                   │
│ - 6 feature cards                   │
│ - Staggered animations              │
├─────────────────────────────────────┤
│ How It Works (4 Steps)              │
│ - Numbered workflow                 │
│ - Color-coded steps                 │
├─────────────────────────────────────┤
│ Testimonials                        │
│ - 3 customer quotes                 │
│ - 5-star ratings                    │
├─────────────────────────────────────┤
│ Pricing                             │
│ - 3 tiers (Starter/Pro/Enterprise)  │
│ - Feature comparison                │
├─────────────────────────────────────┤
│ Final CTA                           │
│ - Compelling headline               │
│ - Trust elements                    │
├─────────────────────────────────────┤
│ Footer                              │
│ - 4-column layout                   │
│ - Social links                      │
└─────────────────────────────────────┘
```

## 🎨 Design Tokens Used

### Colors
```css
--accent-green: 114 212 122    /* Primary CTA */
--accent-blue: 96 180 247      /* Secondary features */
--accent-purple: 185 140 249   /* Tertiary features */
--accent-yellow: 255 223 110   /* Highlights */
--background: 35 39 47         /* Main background */
--card: 44 49 58              /* Card background */
--border: 53 58 67            /* Borders */
```

### Typography
```css
Hero: text-4xl md:text-6xl lg:text-7xl
Section Headings: text-3xl md:text-4xl
Card Titles: text-xl
Body: text-base (16px)
Small: text-sm (14px)
```

### Spacing
```css
Section Padding: py-20 (80px)
Card Padding: p-6 (24px)
Gap: gap-6 (24px)
Container: max-w-6xl
```

## 🔗 Navigation Links

### Primary CTAs
- **Book Intake**: `/intake` (IntakeWizard)
- **Request Demo**: `/signup` (SignupPage)
- **Get Started**: `/signup` (SignupPage)
- **Login**: `/login` (LoginPage)

### Footer Links (To Be Implemented)
- Product: `/features`, `/pricing`, `/integrations`, `/docs`
- Company: `/about`, `/blog`, `/careers`, `/contact`
- Legal: `/privacy`, `/terms`, `/security`, `/cookies`

### Social Links
- Twitter: `https://twitter.com`
- GitHub: `https://github.com`
- LinkedIn: `https://linkedin.com`

## 🎬 Animations

### Page Load
```tsx
animate-fade-in-up        // Hero section
animate-bounce-in         // Badge
```

### Staggered Cards
```tsx
style={{ animationDelay: '0.1s' }}  // Card 2
style={{ animationDelay: '0.2s' }}  // Card 3
style={{ animationDelay: '0.3s' }}  // Card 4
```

### Hover Effects
```tsx
hover:scale-105           // Buttons, cards
hover:shadow-lg           // Cards
hover:bg-accent-green/90  // Primary buttons
transition-all duration-200/300
```

## 🧩 Key Components

### Feature Card
```tsx
<Card className="bg-card hover:shadow-lg hover:scale-105 transition-all duration-300">
  <CardHeader>
    <div className="rounded-lg bg-accent-green/10 p-3 w-fit mb-3">
      <Icon className="h-6 w-6 text-accent-green" />
    </div>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
</Card>
```

### Pricing Card
```tsx
<Card className="bg-card border-accent-green border-2">
  <CardHeader>
    <CardTitle>Professional</CardTitle>
    <div className="mt-6">
      <span className="text-5xl font-bold">$149</span>
      <span className="text-muted text-lg">/month</span>
    </div>
  </CardHeader>
  <CardContent>
    <ul className="space-y-3">
      <li className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-accent-green" />
        <span>Feature</span>
      </li>
    </ul>
    <Button className="w-full">Get Started</Button>
  </CardContent>
</Card>
```

### Testimonial Card
```tsx
<Card className="bg-card">
  <CardHeader>
    <div className="flex items-center gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-4 w-4 text-accent-yellow fill-accent-yellow" />
      ))}
    </div>
    <Quote className="h-8 w-8 text-accent-green/30 mb-2" />
    <CardDescription>Quote text...</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex items-center gap-3">
      <div className="rounded-full bg-accent-green/20 h-10 w-10">
        SM
      </div>
      <div>
        <p className="font-semibold">Name</p>
        <p className="text-xs text-muted">Title, Company</p>
      </div>
    </div>
  </CardContent>
</Card>
```

## 📱 Responsive Breakpoints

```tsx
// Mobile (default)
grid-cols-1
text-4xl
py-20

// Tablet (md: 768px)
md:grid-cols-2
md:text-6xl
md:py-32

// Desktop (lg: 1024px)
lg:grid-cols-3
lg:text-7xl
```

## ✅ Checklist for Customization

### Content Updates
- [ ] Replace company logos in trust section
- [ ] Add real customer testimonials
- [ ] Update pricing tiers and features
- [ ] Customize hero headline and subheadline
- [ ] Add actual Loom video embed
- [ ] Update social media links
- [ ] Add real company information in footer

### Optional Enhancements
- [ ] Add scroll-triggered animations
- [ ] Implement analytics tracking
- [ ] Add A/B testing for headlines
- [ ] Create FAQ section
- [ ] Add live chat widget
- [ ] Implement cookie consent banner
- [ ] Add meta tags for SEO
- [ ] Create Open Graph images

### Performance
- [ ] Optimize images (WebP format)
- [ ] Add lazy loading for video
- [ ] Implement code splitting
- [ ] Add service worker for caching
- [ ] Optimize font loading

## 🐛 Common Issues & Solutions

### Issue: Video not loading
**Solution**: Check video URL and ensure it's publicly accessible

### Issue: Animations not smooth
**Solution**: Ensure `prefers-reduced-motion` is respected:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

### Issue: Cards not aligning properly
**Solution**: Ensure consistent CardHeader and CardContent structure

### Issue: Mobile menu overlapping
**Solution**: Navigation is already responsive with flex layout

## 📊 Analytics Events to Track

```typescript
// Page views
gtag('event', 'page_view', { page_path: '/' });

// CTA clicks
gtag('event', 'cta_click', { 
  cta_location: 'hero',
  cta_text: 'Book Intake' 
});

// Video engagement
gtag('event', 'video_play', { 
  video_title: 'Product Tour' 
});

// Pricing tier selection
gtag('event', 'pricing_click', { 
  tier: 'professional' 
});

// Scroll depth
gtag('event', 'scroll', { 
  percent_scrolled: 75 
});
```

## 🔧 Quick Edits

### Change Primary CTA Text
**Line 53-55**: Update button text
```tsx
<Button>
  Your New CTA Text <ArrowRight className="ml-2 h-5 w-5" />
</Button>
```

### Update Hero Headline
**Line 43-46**: Modify headline
```tsx
<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
  Your New Headline
  <span className="text-accent-green"> With Accent</span>
</h1>
```

### Add/Remove Pricing Tier
**Lines 414-513**: Duplicate Card structure and update content

### Change Color Accent
**Find and replace**:
- `accent-green` → `accent-blue` (or other accent color)
- Update icon backgrounds: `bg-accent-green/10`
- Update text colors: `text-accent-green`

## 📞 Support

### Documentation
- Design Reference: `Design_reference.md`
- Implementation: `LANDING_PAGE_IMPLEMENTATION_COMPLETE.md`
- Video Guide: `LANDING_PAGE_VIDEO_INTEGRATION_GUIDE.md`

### Related Files
- Route Config: `src/App.tsx` (line 52)
- Styles: `src/index.css`
- Theme: `tailwind.config.js`
- Components: `src/components/ui/`

---

**Last Updated**: 2025-10-19  
**Version**: 1.0.0  
**Status**: Production Ready ✅
