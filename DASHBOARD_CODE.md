# User Dashboard - Complete Code Reference

This document contains all the code for the user dashboard implementation.

## 1. DashboardLayout Component

**File**: `client/components/dashboard/DashboardLayout.tsx`

```typescript
import { useState, ReactNode } from "react";
import { User, MessageSquare, LayoutDashboard, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activeSection, setActiveSection] = useState<"overview" | "chats">("chats");
  const navigate = useNavigate();

  // TODO: Replace with actual user data from auth context
  const userEmail = "student@example.com";
  const userName = "Student User";

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <img
                src="/tuki_logo.png"
                alt="SHY"
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="text-white font-bold text-lg">SHY</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SHY Dashboard</h1>
              <p className="text-xs text-gray-500">Sexual Health for Youth</p>
            </div>
          </div>

          {/* Right: User Info */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
          <nav className="space-y-2">
            {/* Overview Section */}
            <button
              onClick={() => setActiveSection("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeSection === "overview"
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Overview</span>
            </button>

            {/* My Chats Section */}
            <button
              onClick={() => setActiveSection("chats")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeSection === "chats"
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">My Chats</span>
            </button>
          </nav>

          {/* Logout Button at Bottom */}
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
          <div className="flex justify-around p-2">
            <button
              onClick={() => setActiveSection("overview")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
                activeSection === "overview"
                  ? "text-teal-600"
                  : "text-gray-600"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-xs font-medium">Overview</span>
            </button>
            <button
              onClick={() => setActiveSection("chats")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
                activeSection === "chats"
                  ? "text-teal-600"
                  : "text-gray-600"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs font-medium">My Chats</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6 pb-20 md:pb-6">
          {activeSection === "overview" ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Dashboard</h2>
                <p className="text-gray-600">
                  This is your personal space to manage your SHY experience. View your chat history,
                  connect with peer advocates, and access resources.
                </p>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 2. UserChats Component

**File**: `client/components/dashboard/UserChats.tsx`

Due to length, see the actual file at:
[UserChats.tsx](file:///h:/Ammu%20phone%20pics/mimi/new%20download/s-backup-2-master/s-backup-2-master/client/components/dashboard/UserChats.tsx)

Key features:
- Fetches sessions from `/api/chat/sessions`
- Tabs for agent vs peer chats
- Session list with cards
- Thread view with message bubbles
- Continue chat button for open sessions
- Loading, error, and empty states

---

## 3. Dashboard Page

**File**: `client/pages/dashboard.tsx`

```typescript
import DashboardLayout from "../components/dashboard/DashboardLayout";
import UserChats from "../components/dashboard/UserChats";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <UserChats />
    </DashboardLayout>
  );
}
```

---

## 4. Updated App.tsx

**File**: `client/App.tsx`

Added the dashboard route:

```typescript
// ... imports ...
import Dashboard from "./pages/dashboard";

const App = () => {
  // ... existing code ...
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Routes WITHOUT Layout */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* ... other routes ... */}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
```

---

## Quick Start

1. **Navigate to dashboard**:
   ```
   http://localhost:5173/dashboard
   ```

2. **View sessions**: Sessions will load automatically from the API

3. **Select a chat**: Click on any session to view messages

4. **Continue chatting**: Click "Continue this conversation" for open agent sessions

---

## TODO Items

1. Replace `userId = "demo-user-123"` with actual auth
2. Update `handleContinueAgentChat` navigation path
3. Integrate with ShyChat to restore sessions
4. Replace placeholder user data in DashboardLayout

---

## API Endpoints Used

- `GET /api/chat/sessions?userId={userId}` - Fetch user's sessions
- `GET /api/chat/{sessionId}/messages?userId={userId}` - Fetch messages for a session
