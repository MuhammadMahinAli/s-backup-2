# Mongoose Models

This directory contains Mongoose models for the application.

## Models

### Post Model
Located in `Post.ts`

**Fields:**
- `nickname` (string, required) - User's nickname
- `text` (string, required, 20-1000 chars) - Post content
- `imageUrl` (string, optional) - URL to attached image
- `createdAt` (Date, default: now) - Creation timestamp
- `topics` (string[], default: []) - Associated topics
- `blurRequested` (boolean, default: false) - Whether content should be blurred
- `contentType` ('text'|'image', default: 'text') - Type of post
- `commentCount` (number, default: 0) - Number of comments
- `reportsCount` (number, default: 0) - Number of reports
- `status` ('auto'|'pending', default: 'auto') - Moderation status

**Indexes:**
- `createdAt: -1` (descending) - For efficient chronological queries

### Comment Model
Located in `Comment.ts`

**Fields:**
- `postId` (ObjectId, required, ref: 'Post') - Reference to parent post
- `nickname` (string, required) - Commenter's nickname
- `text` (string, required, 5-500 chars) - Comment content
- `createdAt` (Date, default: now) - Creation timestamp

**Indexes:**
- `postId: 1` (ascending) - For efficient post comment queries

## Usage Example

```typescript
import { connectToDatabase } from '../lib/mongodb';
import { Post, Comment } from '../models';

// Connect to database
await connectToDatabase();

// Create a new post
const post = await Post.create({
  nickname: 'JohnDoe',
  text: 'This is my first post with more than 20 characters',
  topics: ['general', 'introduction'],
  contentType: 'text'
});

// Create a comment
const comment = await Comment.create({
  postId: post._id,
  nickname: 'JaneSmith',
  text: 'Welcome to the community!'
});

// Update comment count
await Post.findByIdAndUpdate(post._id, { 
  $inc: { commentCount: 1 } 
});

// Query posts by date
const recentPosts = await Post.find()
  .sort({ createdAt: -1 })
  .limit(10);

// Query comments for a post
const postComments = await Comment.find({ postId: post._id })
  .sort({ createdAt: 1 });

// Populate post reference in comments
const commentsWithPost = await Comment.find()
  .populate('postId')
  .exec();
```

## Shared Types

Client-safe types are available in `shared/models.ts` for use in both client and server code.

```typescript
import { Post, Comment, CreatePostRequest, CreateCommentRequest } from '@shared/models';
```

