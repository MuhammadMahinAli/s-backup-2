# Peer Advocate Authentication Flow

## Dynamic Button Display on Peer Advocates Page

The peer advocates page now displays different content based on authentication status.

### When NOT Logged In (Default State)
**Buttons Displayed:**
- ✅ "Become Peer Advocate" - Navigates to signup page
- ✅ "Login" - Navigates to login page

### When Logged In as Peer Advocate
**Display Changes:**
- ✅ Welcome message: "Welcome back, [nickname]!"
- ✅ Single button: "Go to Your Dashboard" - Navigates to dashboard
- ❌ "Become Peer Advocate" button hidden
- ❌ "Login" button hidden

## Complete User Flow

### 1. First Time User
```
Visit /peer-advocates
  ↓
See "Become Peer Advocate" and "Login" buttons
  ↓
Click "Become Peer Advocate"
  ↓
Fill signup form
  ↓
Account created in MongoDB
  ↓
Redirected to login page
  ↓
Login with credentials
  ↓
Session stored in localStorage
  ↓
Redirected to dashboard
```

### 2. Returning User (Already Logged In)
```
Visit /peer-advocates
  ↓
System checks localStorage
  ↓
User is authenticated ✓
  ↓
Shows: "Welcome back, [nickname]!"
  ↓
Shows: "Go to Your Dashboard" button
  ↓
Click button → Dashboard
```

### 3. Logout Flow
```
User in Dashboard
  ↓
Click Logout button (top-right)
  ↓
logoutPeerAdvocate() called
  ↓
localStorage cleared
  ↓
Navigate to /peer-advocates
  ↓
System checks localStorage
  ↓
User NOT authenticated ✗
  ↓
Shows: "Become Peer Advocate" and "Login" buttons
```

## Implementation Details

### Files Modified:
1. **client/pages/PeerAdvocates.tsx**
   - Added `isLoggedIn` state
   - Added `currentUser` state
   - Checks authentication on component mount
   - Conditionally renders buttons based on auth state

### Key Functions Used:
```typescript
// Check if user is authenticated
isAuthenticated(): boolean

// Get current logged-in user
getCurrentPeerAdvocate(): PeerAdvocate | null

// Logout (clears localStorage)
logoutPeerAdvocate(): void
```

### Authentication Check:
```typescript
useEffect(() => {
  // Check if user is logged in
  const loggedIn = isAuthenticated();
  setIsLoggedIn(loggedIn);
  
  if (loggedIn) {
    setCurrentUser(getCurrentPeerAdvocate());
  }
}, []);
```

### Conditional Rendering:
```tsx
{isLoggedIn ? (
  /* Show Dashboard Button */
  <div>
    <p>Welcome back, {currentUser?.nickname}!</p>
    <button onClick={() => navigate('/peer-advocate-dashboard')}>
      Go to Your Dashboard
    </button>
  </div>
) : (
  /* Show Signup and Login Buttons */
  <>
    <button onClick={() => navigate('/peer-advocate-signup')}>
      Become Peer Advocate
    </button>
    <button onClick={() => navigate('/peer-advocate-login')}>
      Login
    </button>
  </>
)}
```

## Session Persistence

- **Storage**: localStorage (key: `current_peer_advocate`)
- **Persists**: Across page refreshes
- **Cleared**: On logout or browser data clear

## Security Note

Authentication state is stored in localStorage. For production:
- Consider using httpOnly cookies
- Implement JWT tokens with expiration
- Add refresh token mechanism
- Server-side session validation

## Testing Checklist

- [x] Not logged in → Shows signup and login buttons
- [x] After signup → Redirected to login
- [x] After login → Redirected to dashboard
- [x] Visit peer advocates while logged in → Shows dashboard button
- [x] Click dashboard button → Goes to dashboard
- [x] Logout from dashboard → Returns to peer advocates page
- [x] After logout → Shows signup and login buttons again
- [x] Page refresh while logged in → Maintains session
- [x] Page refresh after logout → Shows login buttons

## Result

✅ The peer advocates page now dynamically adapts to user authentication state
✅ Logged-in users see a personalized experience
✅ Logged-out users see the signup/login options
✅ Smooth transition between states on logout

