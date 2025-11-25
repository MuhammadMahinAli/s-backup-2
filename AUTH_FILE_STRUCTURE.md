# Auth File Structure - Reorganized

## Student Users (Dashboard Folder)
All student authentication and dashboard files are now in `client/components/dashboard/`:

```
client/components/dashboard/
├── Login.tsx           # Student login page (/login)
├── Signup.tsx          # Student signup page (/signup)
├── index.tsx           # Student dashboard page (/dashboard)
├── DashboardLayout.tsx # Dashboard layout with sidebar
├── UserChats.tsx       # Chat history component
└── ProtectedRoute.tsx  # Auth protection wrapper
```

## Peer Advocates (Pages Folder)
Peer advocate authentication remains in `client/pages/` as before:

```
client/pages/
├── peer-advocate-signup.tsx    # Peer signup
├── peer-advocate-login.tsx     # Peer login
└── peer-advocate-dashboard.tsx # Peer dashboard
```

## Routes

**Student Routes** (using components/dashboard):
- `/login` → `Login.tsx`
- `/signup` → `Signup.tsx`
- `/dashboard` → `index.tsx` (protected)

**Peer Advocate Routes** (using pages):
- `/peer-advocate-signup` → `peer-advocate-signup.tsx`
- `/peer-advocate-login` → `peer-advocate-login.tsx`
- `/peer-advocate-dashboard` → `peer-advocate-dashboard.tsx` (protected)

## Updated Imports in App.tsx

```typescript
// Student auth from components/dashboard
import Dashboard from "./components/dashboard";
import Login from "./components/dashboard/Login";
import Signup from "./components/dashboard/Signup";

// Peer advocate auth from pages (unchanged)
import PeerAdvocateSignup from "./pages/peer-advocate-signup";
import PeerAdvocateLogin from "./pages/peer-advocate-login";
import PeerAdvocateDashboard from "./pages/peer-advocate-dashboard";
```

All import paths have been updated to reflect the new structure!
