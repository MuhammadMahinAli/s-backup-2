/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Community API Types
 */

export interface PostImage {
  url: string;
  publicId: string;
}

// POST /api/post
export interface CreatePostRequest {
  nickname: string;
  text: string;
  imageUrl?: string; // Legacy (deprecated)
  images?: PostImage[]; // Multi-image support
  authorAnonId: string; // Anonymous author identifier
  blurRequested?: boolean;
  topics?: string[];
}

export interface PostResponse {
  _id: string;
  nickname: string;
  text: string;
  imageUrl?: string; // Legacy (deprecated)
  images?: PostImage[]; // Multi-image support
  authorAnonId?: string; // Anonymous author identifier
  createdAt: string;
  topics: string[];
  blurRequested: boolean;
  contentType: 'text' | 'image';
  commentCount: number;
  reportsCount: number;
  status: 'auto' | 'pending';
}

// GET /api/feed
export interface FeedResponse {
  posts: PostResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// POST /api/comment
export interface CreateCommentRequest {
  postId: string;
  nickname: string;
  text: string;
}

export interface CommentResponse {
  _id: string;
  postId: string;
  nickname: string;
  text: string;
  isPeerAdvocate: boolean;
  createdAt: string;
}

// POST /api/report
export interface ReportPostRequest {
  postId: string;
}

export interface ReportPostResponse {
  success: boolean;
  reportsCount: number;
}

// DELETE /api/post/:postId
export interface DeletePostResponse {
  success: boolean;
  message: string;
}

// Error responses
export interface ApiError {
  error: string;
}

/**
 * Peer Advocate API Types
 */

// Peer Advocate interface
export interface PeerAdvocateProfile {
  email: string;
  nickname: string;
  profileImage: string;
  bio?: string;
}

// POST /api/peer-advocate/signup
export interface SignupPeerAdvocateRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface SignupPeerAdvocateResponse {
  success: boolean;
  advocate: PeerAdvocateProfile;
}

// POST /api/peer-advocate/login
export interface LoginPeerAdvocateRequest {
  email: string;
  password: string;
}

export interface LoginPeerAdvocateResponse {
  success: boolean;
  advocate: PeerAdvocateProfile & { _id: string };
}

// GET /api/peer-advocate/all
export interface PeerAdvocateCard {
  nickname: string;
  profileImage: string;
  bio?: string;
  memberSince: string;
  email: string;
}

export interface GetAllPeerAdvocatesResponse {
  advocates: PeerAdvocateCard[];
}

// GET /api/peer-advocate/check
export interface CheckPeerAdvocateResponse {
  isPeerAdvocate: boolean;
}