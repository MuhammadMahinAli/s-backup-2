// ============================================
// HOW TO USE <ShyChat /> IN YOUR APP
// ============================================

// ---------------------------------------------
// Example 1: Add to App.tsx (main entry point)
// ---------------------------------------------

import ShyChat from "@/components/ShyChat";

function App() {
  return (
    <div className="app">
      <h1>My App</h1>
      
      {/* Your app content here */}
      
      {/* Add ShyChat - it will appear as a floating button */}
      <ShyChat />
    </div>
  );
}

export default App;

// ---------------------------------------------
// Example 2: Add to Layout.tsx (appears on all pages)
// ---------------------------------------------

import { ReactNode } from "react";
import ShyChat from "./ShyChat";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <header>Header content</header>
      
      <main>{children}</main>
      
      <footer>Footer content</footer>
      
      {/* ShyChat appears on every page */}
      <ShyChat />
    </div>
  );
}

// ---------------------------------------------
// Example 3: Add to a specific page
// ---------------------------------------------

import ShyChat from "@/components/ShyChat";

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to SHY</h1>
      <p>Sexual Health for Youth</p>
      
      {/* ShyChat only on this page */}
      <ShyChat />
    </div>
  );
}

// ---------------------------------------------
// YOUR BACKEND SHOULD RETURN THIS FORMAT:
// ---------------------------------------------

// POST http://localhost:3000/api/chat
// Request:
{
  "sessionId": "shy-abc123xyz",
  "message": "Hello",
  "userMeta": {
    "locale": "en-US"
  }
}

// Response:
{
  "ok": true,
  "reply": "Hi! I'm the SHY bot. How can I help you with sexual health information today?"
}

// ---------------------------------------------
// THAT'S IT! 🎉
// ---------------------------------------------
// Just import and add <ShyChat /> to your component
// The chat button will appear in the bottom-right corner

