# Landing Page - Video Integration Guide

## Overview
This guide explains how to integrate a Loom video (or other video service) into the Landing Page product tour section.

## Current Implementation

The Landing Page has a placeholder video section at lines 66-91 in `src/pages/LandingPage.tsx`:

```tsx
{/* Product Tour Video */}
<section className="container mx-auto px-4 py-12 md:py-20">
  <div className="max-w-5xl mx-auto">
    <Card className="bg-card border-border overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="aspect-video bg-gradient-to-br from-accent-green/20 to-accent-blue/20 flex items-center justify-center relative group cursor-pointer">
        {/* Video placeholder with play button */}
      </div>
    </Card>
  </div>
</section>
```

## Integration Options

### Option 1: Loom Embed (Recommended)

#### Step 1: Get Loom Embed Code
1. Record your product tour video in Loom
2. Click "Share" on your Loom video
3. Copy the embed code

#### Step 2: Replace Placeholder
Replace the video section in `src/pages/LandingPage.tsx` with:

```tsx
{/* Product Tour Video */}
<section className="container mx-auto px-4 py-12 md:py-20">
  <div className="max-w-5xl mx-auto">
    <Card className="bg-card border-border overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="aspect-video relative">
        <iframe
          src="https://www.loom.com/embed/YOUR_VIDEO_ID?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true"
          frameBorder="0"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          title="Autopilot Studio Product Tour"
        />
      </div>
    </Card>
  </div>
</section>
```

#### Loom Embed Options
- `hide_owner=true` - Hides the video owner
- `hide_share=true` - Hides share button
- `hide_title=true` - Hides video title
- `hideEmbedTopBar=true` - Hides the top bar
- `autoplay=true` - Auto-plays video (not recommended for accessibility)

### Option 2: YouTube Embed

```tsx
{/* Product Tour Video */}
<section className="container mx-auto px-4 py-12 md:py-20">
  <div className="max-w-5xl mx-auto">
    <Card className="bg-card border-border overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="aspect-video relative">
        <iframe
          src="https://www.youtube.com/embed/YOUR_VIDEO_ID?rel=0&modestbranding=1"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          title="Autopilot Studio Product Tour"
        />
      </div>
    </Card>
  </div>
</section>
```

### Option 3: Vimeo Embed

```tsx
{/* Product Tour Video */}
<section className="container mx-auto px-4 py-12 md:py-20">
  <div className="max-w-5xl mx-auto">
    <Card className="bg-card border-border overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="aspect-video relative">
        <iframe
          src="https://player.vimeo.com/video/YOUR_VIDEO_ID?title=0&byline=0&portrait=0"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          title="Autopilot Studio Product Tour"
        />
      </div>
    </Card>
  </div>
</section>
```

### Option 4: Self-Hosted Video with Custom Player

For more control, create a custom video component:

```tsx
// src/components/VideoPlayer.tsx
import { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
}

export function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative aspect-video bg-background rounded-lg overflow-hidden group">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        title={title}
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/40 group-hover:bg-background/20 transition-colors">
          <Button
            size="lg"
            onClick={togglePlay}
            className="rounded-full bg-accent-green/20 p-6 hover:bg-accent-green/30 hover:scale-110 transition-all"
          >
            <Play className="h-12 w-12 text-accent-green fill-accent-green" />
          </Button>
        </div>
      )}
    </div>
  );
}
```

Then use it in the Landing Page:

```tsx
import { VideoPlayer } from '@/components/VideoPlayer';

{/* Product Tour Video */}
<section className="container mx-auto px-4 py-12 md:py-20">
  <div className="max-w-5xl mx-auto">
    <Card className="bg-card border-border overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <VideoPlayer
        src="/videos/product-tour.mp4"
        poster="/images/video-poster.jpg"
        title="Autopilot Studio Product Tour"
      />
    </Card>
  </div>
</section>
```

## Video Content Recommendations

### Product Tour Script (2-3 minutes)
1. **Introduction (0:00-0:15)**
   - "Welcome to Autopilot Studio"
   - "The complete Business OS for AI development teams"

2. **Problem Statement (0:15-0:30)**
   - "Tired of manual project management?"
   - "Spending more time on admin than building?"

3. **Solution Overview (0:30-1:00)**
   - Show dashboard overview
   - Highlight key features

4. **Feature Walkthrough (1:00-2:30)**
   - AI-Assisted Intake demo
   - Proposal generation
   - Project spin-up
   - AI Copilot in action
   - Launch automation

5. **Call to Action (2:30-3:00)**
   - "Start your free trial today"
   - Show signup process

### Recording Tips
- **Keep it short**: 2-3 minutes max
- **Show, don't tell**: Focus on screen recordings
- **Use voiceover**: Professional narration
- **Add captions**: For accessibility
- **High quality**: 1080p minimum
- **Brand consistent**: Use your color scheme

## Performance Optimization

### Lazy Loading
For better initial page load, lazy load the video:

```tsx
import { lazy, Suspense } from 'react';

const VideoPlayer = lazy(() => import('@/components/VideoPlayer'));

{/* Product Tour Video */}
<section className="container mx-auto px-4 py-12 md:py-20">
  <div className="max-w-5xl mx-auto">
    <Card className="bg-card border-border overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <Suspense fallback={
        <div className="aspect-video bg-gradient-to-br from-accent-green/20 to-accent-blue/20 flex items-center justify-center">
          <div className="animate-pulse">Loading video...</div>
        </div>
      }>
        <VideoPlayer
          src="/videos/product-tour.mp4"
          poster="/images/video-poster.jpg"
          title="Autopilot Studio Product Tour"
        />
      </Suspense>
    </Card>
  </div>
</section>
```

### Intersection Observer
Load video only when it comes into view:

```tsx
import { useEffect, useRef, useState } from 'react';

function VideoSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-card border-border overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          {isVisible ? (
            <div className="aspect-video relative">
              <iframe
                src="https://www.loom.com/embed/YOUR_VIDEO_ID"
                frameBorder="0"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                title="Autopilot Studio Product Tour"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-accent-green/20 to-accent-blue/20 flex items-center justify-center">
              <div className="animate-pulse">Loading video...</div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
```

## Accessibility Considerations

### Required Attributes
- `title` - Descriptive title for screen readers
- `allowFullScreen` - Allow fullscreen mode
- `frameBorder="0"` - Remove default border

### Captions
- Always include captions/subtitles
- Loom supports auto-captions
- YouTube has auto-caption feature
- For self-hosted, use WebVTT format

### Keyboard Controls
- Ensure video player is keyboard accessible
- Tab navigation should work
- Space/Enter to play/pause
- Arrow keys for seeking (if applicable)

## Analytics Tracking

### Track Video Engagement

```tsx
// Add to video section
const handleVideoPlay = () => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', 'video_play', {
      video_title: 'Product Tour',
      video_location: 'Landing Page'
    });
  }
};

const handleVideoComplete = () => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', 'video_complete', {
      video_title: 'Product Tour',
      video_location: 'Landing Page'
    });
  }
};
```

## Testing Checklist

- [ ] Video loads correctly on desktop
- [ ] Video loads correctly on mobile
- [ ] Video plays without errors
- [ ] Fullscreen mode works
- [ ] Captions are available and readable
- [ ] Video doesn't autoplay (accessibility)
- [ ] Loading state displays properly
- [ ] Video is responsive (maintains aspect ratio)
- [ ] Performance is acceptable (doesn't block page load)
- [ ] Analytics tracking works

## Troubleshooting

### Video Not Loading
- Check video URL is correct
- Verify video is publicly accessible
- Check CORS settings for self-hosted videos
- Ensure iframe is not blocked by CSP

### Performance Issues
- Use lazy loading
- Compress video file
- Use appropriate video format (MP4, WebM)
- Consider using a CDN

### Mobile Issues
- Test on actual devices
- Ensure touch controls work
- Check mobile data usage
- Consider lower resolution for mobile

## Next Steps

1. Record your product tour video
2. Upload to Loom (or chosen platform)
3. Get embed code
4. Replace placeholder in `LandingPage.tsx`
5. Test on multiple devices
6. Add analytics tracking
7. Monitor engagement metrics

---

**Current Status**: Placeholder implemented, ready for video integration  
**Recommended Platform**: Loom (easiest integration)  
**Video Length**: 2-3 minutes  
**Priority**: Medium (can be added post-launch)
