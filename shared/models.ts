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

// Chat Session and Message types
export interface ChatSession {
  _id: string;
  userId?: string;
  sessionId: string;
  type: 'agent' | 'peer';
  peerAdvocateId?: string;
  status: 'open' | 'closed';
  createdAt: Date | string;
  updatedAt: Date | string;
  lastMessageAt?: Date | string;
}

export interface ChatMessage {
  _id: string;
  sessionId: string;
  userId?: string;
  peerAdvocateId?: string;
  role: 'user' | 'agent' | 'peer';
  source: 'agent' | 'peer';
  content: string;
  createdAt: Date | string;
  readAt?: Date | string;
}

// Request types for chat endpoints
export interface StartPeerChatRequest {
  userId?: string;
  peerAdvocateId?: string;
}

export interface StartPeerChatResponse {
  sessionId: string;
  peerAdvocateId?: string;
}

export interface SendPeerMessageRequest {
  content: string;
  from: 'user' | 'peer';
}

export interface SendPeerMessageResponse {
  ok: boolean;
  message: ChatMessage;
}

// Auth types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'peer' | 'admin';
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role?: 'student';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  ok: boolean;
  user?: User;
  token?: string;
  error?: string;
}



