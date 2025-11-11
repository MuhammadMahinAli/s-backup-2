# Community API Routes

This directory contains Express route handlers for the community features.

## Environment Setup

Make sure to set these environment variables in your `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=your_database_name
```

## API Endpoints

### 1. Create Post
**POST** `/api/post`

Create a new community post.

**Request Body:**
```json
{
  "nickname": "JohnDoe",
  "text": "This is my post content with at least 20 characters",
  "imageUrl": "https://example.com/image.jpg",  // optional
  "blurRequested": false,  // optional, default: false
  "topics": ["health", "support"]  // optional, default: []
}
```

**Validation:**
- `nickname`: required, string
- `text`: required, 20-1000 characters, cannot be empty
- `imageUrl`: optional, string
- `blurRequested`: optional, boolean
- `topics`: optional, array of strings

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nickname": "JohnDoe",
  "text": "This is my post content with at least 20 characters",
  "imageUrl": "https://example.com/image.jpg",
  "createdAt": "2025-10-10T12:00:00.000Z",
  "topics": ["health", "support"],
  "blurRequested": false,
  "contentType": "image",
  "commentCount": 0,
  "reportsCount": 0,
  "status": "auto"
}
```

**Errors:**
- `400`: Validation error (missing fields, invalid length)
- `500`: Server error

---

### 2. Get Feed
**GET** `/api/feed`

Get paginated list of posts with status='auto', sorted by creation date (newest first).

**Query Parameters:**
- `page`: Page number (default: 1, min: 1)
- `limit`: Items per page (default: 10, min: 1, max: 50)

**Example:**
```
GET /api/feed?page=1&limit=10
```

**Response:** `200 OK`
```json
{
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "nickname": "JohnDoe",
      "text": "Post content...",
      "createdAt": "2025-10-10T12:00:00.000Z",
      "topics": ["health"],
      "blurRequested": false,
      "contentType": "text",
      "commentCount": 5,
      "reportsCount": 0,
      "status": "auto"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

**Errors:**
- `500`: Server error

---

### 3. Create Comment
**POST** `/api/comment`

Add a comment to a post and increment the post's comment count.

**Request Body:**
```json
{
  "postId": "507f1f77bcf86cd799439011",
  "nickname": "JaneSmith",
  "text": "Great post!"
}
```

**Validation:**
- `postId`: required, valid MongoDB ObjectId
- `nickname`: required, string
- `text`: required, 5-500 characters

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "postId": "507f1f77bcf86cd799439011",
  "nickname": "JaneSmith",
  "text": "Great post!",
  "createdAt": "2025-10-10T12:05:00.000Z"
}
```

**Errors:**
- `400`: Validation error or invalid post ID
- `404`: Post not found
- `500`: Server error

---

### 4. Get Comments
**GET** `/api/comments`

Get all comments for a specific post, sorted by creation date (oldest first).

**Query Parameters:**
- `postId`: MongoDB ObjectId of the post (required)

**Example:**
```
GET /api/comments?postId=507f1f77bcf86cd799439011
```

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "postId": "507f1f77bcf86cd799439011",
    "nickname": "JaneSmith",
    "text": "Great post!",
    "createdAt": "2025-10-10T12:05:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "postId": "507f1f77bcf86cd799439011",
    "nickname": "BobJones",
    "text": "Thanks for sharing!",
    "createdAt": "2025-10-10T12:10:00.000Z"
  }
]
```

**Errors:**
- `400`: Missing or invalid post ID
- `500`: Server error

---

### 5. Report Post
**POST** `/api/report`

Report a post by incrementing its report count.

**Request Body:**
```json
{
  "postId": "507f1f77bcf86cd799439011"
}
```

**Validation:**
- `postId`: required, valid MongoDB ObjectId

**Response:** `200 OK`
```json
{
  "success": true,
  "reportsCount": 3
}
```

**Errors:**
- `400`: Missing or invalid post ID
- `404`: Post not found
- `500`: Server error

---

## Usage in Client Code

All API types are available in `@shared/api` for type-safe requests:

```typescript
import { 
  CreatePostRequest, 
  PostResponse, 
  FeedResponse,
  CreateCommentRequest,
  CommentResponse,
  ReportPostRequest,
  ReportPostResponse,
  ApiError 
} from '@shared/api';

// Example: Create a post
async function createPost(data: CreatePostRequest) {
  const response = await fetch('/api/post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error);
  }
  
  const post: PostResponse = await response.json();
  return post;
}

// Example: Get feed
async function getFeed(page = 1, limit = 10) {
  const response = await fetch(`/api/feed?page=${page}&limit=${limit}`);
  const data: FeedResponse = await response.json();
  return data;
}

// Example: Add comment
async function addComment(data: CreateCommentRequest) {
  const response = await fetch('/api/comment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  const comment: CommentResponse = await response.json();
  return comment;
}

// Example: Get comments
async function getComments(postId: string) {
  const response = await fetch(`/api/comments?postId=${postId}`);
  const comments: CommentResponse[] = await response.json();
  return comments;
}

// Example: Report post
async function reportPost(postId: string) {
  const response = await fetch('/api/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId }),
  });
  
  const result: ReportPostResponse = await response.json();
  return result;
}
```

## Testing

You can test these endpoints using curl or any HTTP client:

```bash
# Create a post
curl -X POST http://localhost:8080/api/post \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "TestUser",
    "text": "This is a test post with enough characters to meet the minimum",
    "topics": ["test"]
  }'

# Get feed
curl http://localhost:8080/api/feed?page=1&limit=10

# Create a comment (replace POST_ID with actual post ID)
curl -X POST http://localhost:8080/api/comment \
  -H "Content-Type: application/json" \
  -d '{
    "postId": "POST_ID",
    "nickname": "Commenter",
    "text": "Great post!"
  }'

# Get comments (replace POST_ID with actual post ID)
curl "http://localhost:8080/api/comments?postId=POST_ID"

# Report a post (replace POST_ID with actual post ID)
curl -X POST http://localhost:8080/api/report \
  -H "Content-Type: application/json" \
  -d '{"postId": "POST_ID"}'
```

