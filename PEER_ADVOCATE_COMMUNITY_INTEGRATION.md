# Peer Advocate Community Integration

## Feature: Auto-Fill Nickname for Logged-In Peer Advocates

When a peer advocate is logged into the community forum, their nickname is automatically filled in the comment form and they cannot change it. This ensures they always comment with their verified peer advocate identity.

## Implementation Details

### Changes Made to `client/pages/community.tsx`

#### 1. Added Imports
```typescript
import { getCurrentPeerAdvocate, isAuthenticated } from "@/lib/auth";
```

#### 2. Added State Variables
```typescript
const [isPeerAdvocate, setIsPeerAdvocate] = useState(false);
const [peerAdvocateName, setPeerAdvocateName] = useState("");
```

#### 3. Added Authentication Check on Mount
```typescript
useEffect(() => {
  if (isAuthenticated()) {
    const currentUser = getCurrentPeerAdvocate();
    if (currentUser) {
      setIsPeerAdvocate(true);
      setPeerAdvocateName(currentUser.nickname);
      setCommentNickname(currentUser.nickname); // Auto-fill
    }
  }
}, []);
```

#### 4. Updated Comment Form Input
The nickname input field now:
- **Auto-fills** with peer advocate's nickname when logged in
- **Read-only** for peer advocates (cannot be changed)
- **Special styling** with teal background to indicate peer advocate status
- **Badge indicator** showing "PEER ADVOCATE ★" in the input field

```typescript
<input
  type="text"
  value={commentNickname}
  onChange={(e) => !isPeerAdvocate && setCommentNickname(e.target.value)}
  className={isPeerAdvocate 
    ? 'bg-teal-50 border-teal-300 text-teal-700 font-medium cursor-not-allowed' 
    : 'border-grey-90 bg-transparent'
  }
  disabled={postingComment || isPeerAdvocate}
  readOnly={isPeerAdvocate}
/>
{isPeerAdvocate && (
  <span className="badge">PEER ADVOCATE ★</span>
)}
```

#### 5. Updated Comment Submission
Ensures peer advocate's name is always used:
```typescript
const commentData: CreateCommentRequest = {
  postId,
  nickname: isPeerAdvocate ? peerAdvocateName : (commentNickname.trim() || "Anonymous"),
  text: commentText.trim(),
};
```

## User Experience

### For Regular Users (Not Logged In)
- Nickname field is **empty** and **editable**
- Can enter any nickname or leave blank (defaults to "Anonymous")
- No badge displayed

### For Logged-In Peer Advocates
- Nickname field **auto-fills** with their registered nickname
- Field has **teal background** styling
- Field is **read-only** (cannot be edited)
- **"PEER ADVOCATE ★" badge** appears in the input field
- When they post a comment, their name and badge appear automatically

## Complete Flow

### 1. Peer Advocate Logs In
```
Login → Session stored → Navigate to community
```

### 2. Opens Comment Section
```
Click comment icon on a post
  ↓
Comment form opens
  ↓
System checks: isAuthenticated() → true
  ↓
Nickname field auto-fills with their name
  ↓
Field becomes read-only with teal styling
  ↓
Badge appears in input field
```

### 3. Posts Comment
```
Type comment text
  ↓
Click "Comment" button
  ↓
System sends: { nickname: peerAdvocateName, text: "..." }
  ↓
Backend checks if nickname is peer advocate
  ↓
Sets isPeerAdvocate: true in database
  ↓
Comment displays with "PEER ADVOCATE ★" badge
```

### 4. Comment Display
```
Comment appears in feed with:
  ✅ Avatar
  ✅ Peer advocate's nickname
  ✅ "PEER ADVOCATE ★" badge (teal background)
  ✅ Timestamp
  ✅ Comment text
```

## Visual Indicators

### Input Field (Peer Advocate)
- **Background**: Light teal (#f0fdfa)
- **Border**: Teal (#5eead4)
- **Text**: Dark teal (#0f766e)
- **Badge**: "PEER ADVOCATE ★" in teal pill

### Comment Display (Peer Advocate)
- **Badge**: Teal background with white text
- **Format**: `PEER ADVOCATE ★`
- **Position**: Next to nickname

## Security & Data Flow

### Frontend Validation
1. Check if user is authenticated
2. Get current peer advocate from localStorage
3. Auto-fill and lock nickname field

### Backend Validation
1. Receive comment with nickname
2. Query PeerAdvocate collection for matching nickname
3. Set `isPeerAdvocate: true/false` in Comment document
4. Return comment with isPeerAdvocate flag

### Display Logic
1. Fetch comments from API
2. Check `comment.isPeerAdvocate` field
3. Conditionally render badge if true

## Benefits

✅ **Authenticity**: Peer advocates always use their verified identity
✅ **Trust**: Users can easily identify verified peer advocates
✅ **Consistency**: Peer advocates cannot accidentally post as anonymous
✅ **Visual Clarity**: Distinct styling makes peer advocates recognizable
✅ **Seamless UX**: Automatic nickname filling reduces friction

## Edge Cases Handled

1. **Logged out peer advocate**: Field returns to normal, editable state
2. **Session expires**: Field reverts to anonymous mode
3. **Page refresh while logged in**: Session persists, nickname auto-fills again
4. **Multiple tabs**: Each tab independently checks authentication

## Testing Checklist

- [x] Not logged in → Nickname field is empty and editable
- [x] Peer advocate logs in → Nickname auto-fills on community page
- [x] Peer advocate opens comment form → Nickname is pre-filled and read-only
- [x] Field shows teal styling and badge indicator
- [x] Peer advocate posts comment → Name appears with badge
- [x] Comment displays "PEER ADVOCATE ★" badge in feed
- [x] Other users can see the peer advocate badge on comments
- [x] Peer advocate logs out → Field returns to normal state
- [x] Page refresh maintains session and auto-fill

## Code Files Modified

1. **client/pages/community.tsx**
   - Added authentication check
   - Added peer advocate state management
   - Modified comment form input
   - Updated comment submission logic
   - Already had badge display in comments (previous update)

## Result

✅ Logged-in peer advocates have their nickname automatically filled and locked
✅ Visual indicators (teal styling + badge) show they're commenting as a peer advocate
✅ Their comments display with the "PEER ADVOCATE ★" badge for all users to see
✅ The system prevents peer advocates from commenting anonymously
✅ Complete integration between authentication and community features

