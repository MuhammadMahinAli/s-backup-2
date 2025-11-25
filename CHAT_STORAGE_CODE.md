# Chat Storage - Final Code Reference

This document provides the complete code for all new files created for the chat storage implementation.

## 1. ChatSession Model

**File**: `server/models/ChatSession.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IChatSession extends Document {
  userId: string;
  sessionId: string;
  type: 'agent' | 'peer';
  peerAdvocateId?: string;
  status: 'open' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
}

const ChatSessionSchema = new Schema<IChatSession>(
  {
    userId: {
      type: String,
      required: false,
      index: true,
      trim: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['agent', 'peer'],
      required: true,
      default: 'agent',
    },
    peerAdvocateId: {
      type: String,
      required: false,
      index: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    lastMessageAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: false,
  }
);

ChatSessionSchema.index({ userId: 1, createdAt: -1 });
ChatSessionSchema.index({ peerAdvocateId: 1, createdAt: -1 });
ChatSessionSchema.index({ type: 1, createdAt: -1 });

export const ChatSession = mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
```

---

## 2. ChatMessage Model

**File**: `server/models/ChatMessage.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  sessionId: string;
  userId?: string;
  peerAdvocateId?: string;
  role: 'user' | 'agent' | 'peer';
  source: 'agent' | 'peer';
  content: string;
  createdAt: Date;
  readAt?: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    userId: {
      type: String,
      required: false,
      index: true,
      trim: true,
    },
    peerAdvocateId: {
      type: String,
      required: false,
      index: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'agent', 'peer'],
      required: true,
    },
    source: {
      type: String,
      enum: ['agent', 'peer'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    readAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: false,
  }
);

ChatMessageSchema.index({ sessionId: 1, createdAt: 1 });
ChatMessageSchema.index({ userId: 1, createdAt: -1 });

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
```

---

## 3. Chat Session Management Routes

**File**: `server/routes/chat-sessions.ts`

```typescript
import { Router, Request, Response } from "express";
import { connectToDatabase } from "../lib/mongodb";
import { ChatSession, ChatMessage } from "../models";

const router = Router();

// GET /api/chat/sessions
router.get("/sessions", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string || req.body.userId;

    if (!userId) {
      return res.status(400).json({ 
        ok: false, 
        error: "userId is required" 
      });
    }

    await connectToDatabase();

    const filter: any = { userId };
    const typeFilter = req.query.type as string;
    if (typeFilter && (typeFilter === "agent" || typeFilter === "peer")) {
      filter.type = typeFilter;
    }

    const sessions = await ChatSession.find(filter)
      .sort({ lastMessageAt: -1, createdAt: -1 })
      .select("sessionId type status lastMessageAt peerAdvocateId createdAt updatedAt")
      .lean();

    return res.json({ ok: true, sessions });
  } catch (error) {
    console.error("❌ Error fetching chat sessions:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Failed to fetch chat sessions" 
    });
  }
});

// GET /api/chat/:sessionId/messages
router.get("/:sessionId/messages", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = req.query.userId as string || req.body.userId;
    const peerAdvocateId = req.query.peerAdvocateId as string;

    if (!sessionId) {
      return res.status(400).json({ 
        ok: false, 
        error: "sessionId is required" 
      });
    }

    await connectToDatabase();

    const session = await ChatSession.findOne({ sessionId }).lean();
    
    if (!session) {
      return res.status(404).json({ 
        ok: false, 
        error: "Session not found" 
      });
    }

    const hasAccess = 
      (userId && session.userId === userId) ||
      (peerAdvocateId && session.peerAdvocateId === peerAdvocateId);

    if (!hasAccess && userId && peerAdvocateId) {
      return res.status(403).json({ 
        ok: false, 
        error: "Access denied to this session" 
      });
    }

    const messages = await ChatMessage.find({ sessionId })
      .sort({ createdAt: 1 })
      .lean();

    return res.json({ ok: true, messages, session });
  } catch (error) {
    console.error("❌ Error fetching chat messages:", error);
    return res.status(500).json({ 
      ok: false, 
      error: "Failed to fetch chat messages" 
    });
  }
});

export default router;
```

---

## 4. Peer Chat Routes

**File**: `server/routes/peer-chat.ts`

```typescript
import { Router, Request, Response } from "express";
import { connectToDatabase } from "../lib/mongodb";
import { ChatSession, ChatMessage } from "../models";

const router = Router();

function generateRandomString(length: number = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// POST /api/peer-chat/start
router.post("/start", async (req: Request, res: Response) => {
  try {
    const { userId, peerAdvocateId } = req.body;
    await connectToDatabase();

    const sessionId = `peer-${Date.now()}-${generateRandomString()}`;

    const session = await ChatSession.create({
      sessionId,
      userId: userId || undefined,
      type: "peer",
      peerAdvocateId: peerAdvocateId || undefined,
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Created peer chat session:", sessionId);

    return res.json({
      ok: true,
      sessionId: session.sessionId,
      peerAdvocateId: session.peerAdvocateId,
    });
  } catch (error) {
    console.error("❌ Error starting peer chat:", error);
    return res.status(500).json({
      ok: false,
      error: "Failed to start peer chat session",
    });
  }
});

// POST /api/peer-chat/:sessionId/message
router.post("/:sessionId/message", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { content, from } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        ok: false,
        error: "Message content is required",
      });
    }

    if (from !== "user" && from !== "peer") {
      return res.status(400).json({
        ok: false,
        error: "Invalid 'from' value. Must be 'user' or 'peer'",
      });
    }

    await connectToDatabase();

    const session = await ChatSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({
        ok: false,
        error: "Session not found",
      });
    }

    if (session.type !== "peer") {
      return res.status(400).json({
        ok: false,
        error: "This endpoint is only for peer chat sessions",
      });
    }

    const role = from === "user" ? "user" : "peer";
    const messageData: any = {
      sessionId,
      role,
      source: "peer",
      content: content.trim(),
      createdAt: new Date(),
    };

    if (from === "user" && session.userId) {
      messageData.userId = session.userId;
    } else if (from === "peer" && session.peerAdvocateId) {
      messageData.peerAdvocateId = session.peerAdvocateId;
    }

    const message = await ChatMessage.create(messageData);

    await ChatSession.updateOne(
      { sessionId },
      {
        $set: {
          updatedAt: new Date(),
          lastMessageAt: new Date(),
        },
      }
    );

    console.log(`✅ Peer message sent in session ${sessionId} from ${from}`);

    return res.json({
      ok: true,
      message: message.toObject(),
    });
  } catch (error) {
    console.error("❌ Error sending peer chat message:", error);
    return res.status(500).json({
      ok: false,
      error: "Failed to send message",
    });
  }
});

export default router;
```

---

## 5. Updated Chat Endpoint (Key Changes)

**File**: `server/routes/chat.ts`

Key additions to the existing `/api/chat` endpoint:

```typescript
import { connectToDatabase } from "../lib/mongodb";
import { ChatSession, ChatMessage } from "../models";

// ... existing code ...

router.post("/chat", async (req, res) => {
  try {
    // ... existing validation ...
    
    const finalSessionId = String(sessionId || Date.now());
    const userId = req.body.userId || userMeta?.userId || undefined;

    await connectToDatabase();

    // 1. Ensure ChatSession exists
    try {
      let session = await ChatSession.findOne({ sessionId: finalSessionId });
      if (!session) {
        session = await ChatSession.create({
          sessionId: finalSessionId,
          userId,
          type: "agent",
          status: "open",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } catch (dbError) {
      console.error("⚠️ Failed to create/find ChatSession:", dbError);
    }

    // 2. Log user message
    try {
      await ChatMessage.create({
        sessionId: finalSessionId,
        userId,
        role: "user",
        source: "agent",
        content: chatInput,
        createdAt: new Date(),
      });
    } catch (dbError) {
      console.error("⚠️ Failed to log user message:", dbError);
    }

    // ... call n8n webhook ...

    // 3. Log agent reply
    try {
      await ChatMessage.create({
        sessionId: finalSessionId,
        userId,
        role: "agent",
        source: "agent",
        content: reply,
        createdAt: new Date(),
      });

      await ChatSession.updateOne(
        { sessionId: finalSessionId },
        { $set: { updatedAt: new Date(), lastMessageAt: new Date() } }
      );
    } catch (dbError) {
      console.error("⚠️ Failed to log agent reply:", dbError);
    }

    return res.status(n8nRes.ok ? 200 : 502).json({ ok: !!reply, reply });
  } catch (err) {
    // ... error handling ...
  }
});
```

---

## Quick API Reference

```bash
# List user's chat sessions
GET /api/chat/sessions?userId=USER_ID&type=agent

# Get messages for a session
GET /api/chat/:sessionId/messages?userId=USER_ID

# Start peer chat
POST /api/peer-chat/start
Body: { "userId": "...", "peerAdvocateId": "..." }

# Send peer message
POST /api/peer-chat/:sessionId/message
Body: { "content": "...", "from": "user" }
```
