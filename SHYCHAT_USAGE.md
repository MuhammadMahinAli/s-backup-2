# ShyChat Component - Usage Guide

## Component Created

**File:** `client/components/ShyChat.tsx`

A reusable React component that provides a floating chat interface connected to your backend at `http://localhost:3000/api/chat`.

## Features

✅ **Floating Chat Bubble** - Bottom-right corner with tuki_logo.png  
✅ **Conversation State** - Array of `{ role: "user" | "bot", text: string }`  
✅ **Welcome Message** - Explains SHY on first render  
✅ **Typing Indicator** - Shows "typing..." while waiting for response  
✅ **Session Management** - Random sessionId: `shy-{random-string}`  
✅ **Locale Support** - Sends `navigator.language` in userMeta  
✅ **Error Handling** - User-friendly error messages  
✅ **Keyboard Support** - Press Enter to send  
✅ **Tailwind Styled** - Beautiful teal/cyan theme

## How to Use

### Option 1: Add to Your Existing App.tsx

If you want to use the new ShyChat component instead of the existing Chatbot:

```tsx
import ShyChat from "@/components/ShyChat";

function App() {
  return (
    <div className="app">
      {/* Your existing app content */}
      
      {/* Add ShyChat at the bottom */}
      <ShyChat />
    </div>
  );
}

export default App;
```

### Option 2: Add to Layout Component (Global)

To make it available on all pages, add to `client/components/Layout.tsx`:

```tsx
import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import ShyChat from "./ShyChat";  // Import ShyChat

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  // ... existing code ...
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header>...</header>
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer>...</footer>
      
      {/* Add ShyChat - appears on all pages */}
      <ShyChat />
    </div>
  );
}
```

### Option 3: Add to Specific Pages Only

If you only want it on certain pages:

**In `client/pages/Index.tsx`:**

```tsx
import ShyChat from "@/components/ShyChat";

export default function Index() {
  return (
    <div>
      {/* Your page content */}
      
      {/* ShyChat only on home page */}
      <ShyChat />
    </div>
  );
}
```

## API Configuration

The component connects to:
```
http://localhost:3000/api/chat
```

### Request Format

```json
{
  "sessionId": "shy-abc123xyz789",
  "message": "user's message",
  "userMeta": {
    "locale": "en-US"
  }
}
```

### Expected Response

```json
{
  "ok": true,
  "reply": "Bot's response text"
}
```

## Customization

### Change API Endpoint

In `client/components/ShyChat.tsx`, line 54:

```tsx
const response = await fetch("http://localhost:3000/api/chat", {
  // ... or use "/api/chat" for relative URL
```

### Modify Welcome Message

In `client/components/ShyChat.tsx`, lines 27-30:

```tsx
const welcomeMessage: Message = {
  role: "bot",
  text: "Your custom welcome message here...",
};
```

### Change Colors

The component uses Tailwind classes with teal/cyan theme:
- `from-teal-500 to-cyan-500` - Main gradient
- `border-teal-200` - Borders
- `bg-teal-500` - Accents

To change colors, find and replace these classes.

### Adjust Size

Chat window dimensions (line 52):
```tsx
<div className="... w-96 h-[600px] ...">
```

Floating button size (line 171):
```tsx
<button className="... w-16 h-16 ...">
```

## Session Management

The component generates a unique session ID on mount:

```tsx
const generateSessionId = () => {
  const randomString = Math.random().toString(36).substring(2, 15) + 
                       Math.random().toString(36).substring(2, 15);
  return `shy-${randomString}`;
};
```

Session ID format: `shy-{26-random-chars}`

The session persists for the lifetime of the component (until page reload).

## TypeScript Types

```tsx
interface Message {
  role: "user" | "bot";
  text: string;
}
```

## State Management

The component maintains:
- `isOpen` - Chat window visibility
- `messages` - Conversation history
- `inputMessage` - Current input value
- `isTyping` - Bot is responding
- `sessionId` - Unique session identifier

## Error Handling

The component handles:
1. **Network errors** - Shows friendly message
2. **API errors** - Shows retry message
3. **Image load failures** - Fallback to icon
4. **Empty messages** - Prevents sending

## Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels on buttons
- ✅ Keyboard navigation (Enter to send)
- ✅ Focus management
- ✅ Screen reader friendly

## Browser Compatibility

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Uses `navigator.language` (universal support)
- ✅ Fetch API (IE11+ with polyfill)

## Notes

- The chat state resets on page reload
- Session ID is regenerated on each page load
- Messages are not persisted (in-memory only)
- For production, consider adding conversation history persistence

## Comparison with Existing Chatbot Component

You now have TWO chatbot components:

| Feature | `Chatbot.tsx` | `ShyChat.tsx` |
|---------|--------------|---------------|
| API URL | `/api/chat` (relative) | `http://localhost:3000/api/chat` (absolute) |
| Message Format | `{ id, text, sender, timestamp }` | `{ role, text }` |
| Session ID | UUID generated once | `shy-{random}` |
| Quick Actions | Yes (3 buttons) | No |
| User Meta | `{ timestamp, source }` | `{ locale }` |

You can use either one or both, depending on your needs!

## Example: Complete Integration

Here's a complete example of adding ShyChat to your existing app:

**In `client/components/Layout.tsx`:**

```tsx
import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import ShyChat from "./ShyChat";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation Header */}
      <header className="w-full bg-[#D4EDF4] px-4 sm:px-6 lg:px-8 py-4 shadow-sm">
        {/* ... your existing header ... */}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Global Footer */}
      <footer className="bg-[#D4EDF4] px-4 sm:px-6 lg:px-18 py-16 lg:py-20">
        {/* ... your existing footer ... */}
      </footer>

      {/* ShyChat - Appears on all pages */}
      <ShyChat />
    </div>
  );
}
```

That's it! The chat will now appear on every page of your application.

## Testing

1. **Start your backend:**
   ```bash
   # Make sure your backend is running on port 3000
   ```

2. **Start your frontend:**
   ```bash
   pnpm dev
   ```

3. **Open browser:**
   ```
   http://localhost:8080
   ```

4. **Click the chat bubble** in the bottom-right corner

5. **Send a test message** and verify it reaches your backend

## Troubleshooting

### Chat bubble doesn't appear
- Check browser console for errors
- Verify component is imported and rendered
- Check z-index conflicts with other elements

### "Failed to fetch" error
- Ensure backend is running on port 3000
- Check CORS settings on backend
- Try using relative URL `/api/chat` instead

### Typing indicator doesn't disappear
- Check backend response format matches `{ ok: true, reply: "..." }`
- Verify no JavaScript errors in console
- Check network tab for failed requests

### Image doesn't load
- Verify `tuki_logo.png` exists in `public/` folder
- Component has fallback icon if image fails
- Check browser console for 404 errors

## Production Considerations

For production deployment:

1. **Update API URL** to your production backend
2. **Add conversation persistence** (localStorage or database)
3. **Implement analytics** to track usage
4. **Add rate limiting** to prevent abuse
5. **Consider session persistence** across page reloads
6. **Add authentication** if needed
7. **Optimize bundle size** with code splitting

---

**You're all set!** 🎉

The ShyChat component is ready to use in your application.

