# Community API Setup Guide

This guide will help you set up and use the community API endpoints for posts and comments.

## ✅ What Was Created

### 1. MongoDB Connection (`server/lib/mongodb.ts`)
- Mongoose connection with hot-reload protection
- Environment variable validation
- Helper functions for database access

### 2. Mongoose Models (`server/models/`)
- **Post Model** - Community posts with validation
- **Comment Model** - Comments linked to posts
- Proper indexes for efficient queries

### 3. API Route Handlers (`server/routes/`)
- **post.ts** - Create new posts
- **feed.ts** - Get paginated feed
- **comment.ts** - Create and retrieve comments
- **report.ts** - Report posts

### 4. Shared Types (`shared/api.ts`)
- Type-safe request/response interfaces
- Usable in both client and server code

## 🚀 Quick Start

### Step 1: Install MongoDB

If you don't have MongoDB installed locally, you can:

**Option A: Local Installation**
- Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

**Option B: MongoDB Atlas (Cloud)**
- Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get your connection string

### Step 2: Configure Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB Configuration (Required)
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=community_db

# Optional
PORT=8080
PING_MESSAGE=pong
```

**For MongoDB Atlas**, use your connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=community_db
```

### Step 3: Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:8080`

### Step 4: Test the API

**Create a test post:**
```bash
curl -X POST http://localhost:8080/api/post \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "TestUser",
    "text": "This is my first test post with enough characters!",
    "topics": ["introduction"]
  }'
```

**Get the feed:**
```bash
curl http://localhost:8080/api/feed
```

## 📋 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/post` | Create a new post |
| GET | `/api/feed?page=1&limit=10` | Get paginated posts feed |
| POST | `/api/comment` | Add a comment to a post |
| GET | `/api/comments?postId=<id>` | Get all comments for a post |
| POST | `/api/report` | Report a post |

## 💻 Using in React Components

### Example: Community Page Component

```typescript
import { useState, useEffect } from 'react';
import { 
  FeedResponse, 
  PostResponse, 
  CreatePostRequest,
  CommentResponse 
} from '@shared/api';

export function CommunityPage() {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Load feed
  useEffect(() => {
    async function loadFeed() {
      const response = await fetch('/api/feed?page=1&limit=10');
      const data: FeedResponse = await response.json();
      setPosts(data.posts);
      setLoading(false);
    }
    loadFeed();
  }, []);

  // Create post
  async function handleCreatePost(formData: CreatePostRequest) {
    const response = await fetch('/api/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      const newPost: PostResponse = await response.json();
      setPosts([newPost, ...posts]);
    }
  }

  // Add comment
  async function handleAddComment(postId: string, nickname: string, text: string) {
    const response = await fetch('/api/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, nickname, text }),
    });
    
    if (response.ok) {
      // Reload comments or update UI
    }
  }

  // Report post
  async function handleReport(postId: string) {
    await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    });
    alert('Post reported');
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Community Feed</h1>
      {posts.map(post => (
        <div key={post._id}>
          <h3>{post.nickname}</h3>
          <p>{post.text}</p>
          <span>{post.commentCount} comments</span>
          <button onClick={() => handleReport(post._id)}>Report</button>
        </div>
      ))}
    </div>
  );
}
```

## 📝 Validation Rules

### Posts
- **nickname**: Required
- **text**: Required, 20-1000 characters, cannot be empty
- **imageUrl**: Optional
- **topics**: Optional array of strings
- **blurRequested**: Optional boolean

### Comments
- **postId**: Required, valid MongoDB ObjectId
- **nickname**: Required
- **text**: Required, 5-500 characters

## 🔧 Troubleshooting

### "Please define the MONGODB_URI environment variable"
- Make sure you have a `.env` file in the project root
- Check that `MONGODB_URI` and `MONGODB_DB` are set

### "Failed to connect to MongoDB"
- Check that MongoDB is running
- Verify your connection string is correct
- For Atlas, check IP whitelist settings

### "Post not found" errors
- Make sure you're using valid MongoDB ObjectIds
- Check that the post exists in the database

## 📚 Additional Resources

- [Full API Documentation](server/routes/README.md)
- [Mongoose Models Documentation](server/models/README.md)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

## 🎯 Next Steps

1. Set up your MongoDB instance
2. Configure environment variables
3. Test the API endpoints
4. Build your community page UI
5. Add authentication (optional)
6. Implement moderation features (optional)

Happy coding! 🚀

