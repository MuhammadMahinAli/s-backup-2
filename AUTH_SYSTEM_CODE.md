# Authentication System - Code Reference

This document provides the complete code for all auth system components.

## 1. User Model

**File**: `server/models/User.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: 'student' | 'peer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  role: {
    type: String,
    enum: ['student', 'peer', 'admin'],
    default: 'student',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.index({ email: 1 });

UserSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const User = mongoose.model<IUser>('User', UserSchema);
```

---

## 2. Auth Utilities

**File**: `server/lib/auth.ts`

See full file at: [auth.ts](file:///h:/Ammu%20phone%20pics/mimi/new%20download/s-backup-2-master/s-backup-2-master/server/lib/auth.ts)

Key functions:
- `hashPassword(plain)` - Hash password with bcrypt
- `verifyPassword(plain, hash)` - Verify password
- `createAuthToken(user)` - Create JWT token
- `verifyAuthToken(token)` - Verify JWT token
- `extractTokenFromHeader(header)` - Extract Bearer token

---

## 3. Auth Middleware

**File**: `server/lib/authMiddleware.ts`

See full file at: [authMiddleware.ts](file:///h:/Ammu%20phone%20pics/mimi/new%20download/s-backup-2-master/s-backup-2-master/server/lib/authMiddleware.ts)

Key exports:
- `requireAuth` - Require authentication
- `requireRole(roles)` - Require specific role(s)
- `optionalAuth` - Attach user if authenticated
- `AuthRequest` - TypeScript interface for authenticated requests

---

## 4. Auth Routes

**File**: `server/routes/auth.ts`

See full file at: [auth.ts](file:///h:/Ammu%20phone%20pics/mimi/new%20download/s-backup-2-master/s-backup-2-master/server/routes/auth.ts)

Endpoints:
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Authenticate
- `GET /api/auth/me` - Get current user (placeholder)

---

## Quick Usage Examples

### 1. Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePass123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePass123"
  }'
```

### 3. Protected Route

```typescript
import { requireAuth, AuthRequest } from '../lib/authMiddleware';

router.get('/profile', requireAuth, async (req: AuthRequest, res) => {
  console.log('User:', req.user.email, req.user.role);
  res.json({ user: req.user });
});
```

### 4. Role-Based Route

```typescript
import { requireAuth, requireRole } from '../lib/authMiddleware';

router.get('/peer-only', 
  requireAuth, 
  requireRole('peer'), 
  async (req: AuthRequest, res) => {
    // Only peer advocates can access
  }
);
```

---

## Environment Variables

Add to `.env`:

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Frontend Integration

```typescript
// Signup
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, password }),
});
const { token, user } = await response.json();
localStorage.setItem('authToken', token);

// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
const { token, user } = await response.json();
localStorage.setItem('authToken', token);

// Protected Request
const token = localStorage.getItem('authToken');
const response = await fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

---

## Dependencies Installed

```json
{
  "dependencies": {
    "bcrypt": "^5.x",
    "jsonwebtoken": "^9.x",
    "cookie-parser": "^1.x"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.x",
    "@types/jsonwebtoken": "^9.x",
    "@types/cookie-parser": "^1.x"
  }
}
```
