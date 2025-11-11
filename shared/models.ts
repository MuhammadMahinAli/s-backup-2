// Shared types for Post and Comment models
// These can be used by both client and server

export interface PostImage {
  url: string;
  publicId: string;
}

export interface Post {
  _id: string;
  nickname: string;
  text: string;
  imageUrl?: string; // Legacy single image (deprecated)
  images: PostImage[]; // Multi-image support
  authorAnonId?: string; // Anonymous author identifier (optional for backward compatibility)
  createdAt: Date | string;
  topics: string[];
  blurRequested: boolean;
  contentType: 'text' | 'image';
  commentCount: number;
  reportsCount: number;
  status: 'auto' | 'pending';
}

export interface Comment {
  _id: string;
  postId: string;
  nickname: string;
  text: string;
  createdAt: Date | string;
}

// Request types for creating new posts/comments
export interface CreatePostRequest {
  nickname: string;
  text: string;
  imageUrl?: string; // Legacy single image (deprecated)
  images?: PostImage[]; // Multi-image support
  authorAnonId: string; // Required: anonymous author identifier
  topics?: string[];
  blurRequested?: boolean;
  contentType?: 'text' | 'image';
}

export interface CreateCommentRequest {
  postId: string;
  nickname: string;
  text: string;
}

