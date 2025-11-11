# Common Components

This directory contains reusable UI components that can be used across different pages in the application.

## Components

### NewsCard
A reusable card component for displaying news articles with title, source, date, and read action.

**Props:**
- `title: string` - The news article title
- `source: string` - The news source
- `date: string` - Publication date
- `onReadArticle?: () => void` - Callback for read article action

### TopicCard
A card component for displaying educational topics with icons and descriptions.

**Props:**
- `icon: LucideIcon` - Icon component from Lucide React
- `title: string` - Topic title
- `description: string` - Topic description
- `onClick?: () => void` - Click handler

### VideoCard
A component for displaying video content with play functionality and transcript access.

**Props:**
- `title: string` - Video title
- `description: string` - Video description
- `duration: string` - Video duration
- `bgColor?: string` - Background color for video preview
- `iconColor?: string` - Play icon color
- `onPlay?: () => void` - Play button callback
- `onTranscript?: () => void` - Transcript button callback

### TimelineEvent
A component for displaying events in a timeline format.

**Props:**
- `title: string` - Event title
- `description: string` - Event description
- `isLeft?: boolean` - Whether the event appears on the left side of timeline
- `dotColor?: string` - Color of the timeline dot

### SectionHeader
A reusable header component for page sections.

**Props:**
- `title: string` - Section title
- `className?: string` - Additional CSS classes
- `textColor?: string` - Text color class

### TabSelector
A tab navigation component for switching between different views.

**Props:**
- `tabs: string[]` - Array of tab labels
- `activeTab: number` - Index of currently active tab
- `onTabChange: (index: number) => void` - Tab change handler

### ContactCard
A card component for displaying contact information.

**Props:**
- `phoneNumber: string` - Phone number
- `title: string` - Contact title/department
- `location: string` - Location information
- `bgColor?: string` - Background color
- `textColor?: string` - Text color

## Usage

Import components from the common directory:

```tsx
import { NewsCard, TopicCard, SectionHeader } from '../components/common';
```

All components are exported from the main index file for convenient importing.
