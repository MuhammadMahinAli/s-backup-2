/**
 * Shared Zod schemas for validation
 * Can be used by both client and server
 */

import { z } from 'zod';

// Image schema for post images
export const ImageZ = z.object({
  url: z.string().url('Invalid image URL'),
  publicId: z.string().min(1, 'Public ID is required')
});

// Post creation schema
export const CreatePostZ = z.object({
  nickname: z.string().trim().max(40, 'Nickname must not exceed 40 characters').default('Anonymous'),
  text: z.string().trim().min(20, 'Text must be at least 20 characters').max(1000, 'Text must not exceed 1000 characters'),
  images: z.array(ImageZ).max(4, 'Maximum 4 images allowed').default([]),
  blurRequested: z.boolean().optional().default(false),
  topics: z.array(z.string()).optional().default([]),
  // Legacy field (optional for backward compatibility)
  imageUrl: z.string().optional(),
  // Client may send this, but server will prefer reading from cookie
  authorAnonId: z.string().optional(),
});

// Comment creation schema
export const CreateCommentZ = z.object({
  postId: z.string().min(1, 'Post ID is required'),
  nickname: z.string().trim().max(40, 'Nickname must not exceed 40 characters').default('Anonymous'),
  text: z.string().trim().min(5, 'Comment must be at least 5 characters').max(500, 'Comment must not exceed 500 characters'),
});

// Report post schema
export const ReportPostZ = z.object({
  postId: z.string().min(1, 'Post ID is required'),
});

// Type exports for TypeScript inference
export type ImageSchema = z.infer<typeof ImageZ>;
export type CreatePostSchema = z.infer<typeof CreatePostZ>;
export type CreateCommentSchema = z.infer<typeof CreateCommentZ>;
export type ReportPostSchema = z.infer<typeof ReportPostZ>;

