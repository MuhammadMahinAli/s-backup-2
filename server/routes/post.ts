import { RequestHandler } from 'express';
import { z } from 'zod';
import { Post } from '../models';
import { connectToDatabase } from '../lib/mongodb';
import { CreatePostZ } from '../../shared/schemas';
import { checkRateLimit } from '../lib/rateLimiter';

/**
 * POST /api/post
 * Create a new post
 */
export const createPost: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();

    // Validate request body with Zod
    const parseResult = CreatePostZ.safeParse(req.body);
    
    if (!parseResult.success) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: parseResult.error.flatten() 
      });
      return;
    }

    const parsed = parseResult.data;

    // Read anon id from cookie header (preferred) or from body (fallback)
    const cookie = req.headers.cookie || '';
    const cookieMatch = cookie.match(/(?:^|; )shy_anon_id=([^;]+)/);
    const authorAnonId = cookieMatch 
      ? decodeURIComponent(cookieMatch[1]) 
      : parsed.authorAnonId;

    if (!authorAnonId) {
      res.status(400).json({ error: 'No anonymous ID found. Please enable cookies or provide authorAnonId.' });
      return;
    }

    // Check rate limit (max 5 posts per 10 minutes per anonymous ID)
    const rateLimitResult = checkRateLimit(authorAnonId);
    if (!rateLimitResult.allowed) {
      const resetInSeconds = Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000);
      res.status(429).json({ 
        error: 'Rate limit exceeded. Maximum 5 posts per 10 minutes.',
        remaining: rateLimitResult.remaining,
        resetIn: resetInSeconds,
        resetAt: new Date(rateLimitResult.resetAt).toISOString(),
      });
      return;
    }

    // Determine content type based on images
    const hasImages = parsed.images.length > 0 || (parsed.imageUrl && parsed.imageUrl.trim());
    const contentType = hasImages ? 'image' : 'text';

    // Create the post in database
    const post = await Post.create({
      nickname: parsed.nickname,
      text: parsed.text,
      images: parsed.images,
      imageUrl: parsed.imageUrl, // Legacy support
      authorAnonId,
      blurRequested: parsed.blurRequested,
      topics: parsed.topics,
      contentType,
    });

    // Add rate limit headers to response
    res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    res.setHeader('X-RateLimit-Reset', rateLimitResult.resetAt.toString());
    res.setHeader('X-RateLimit-Limit', '5');

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    
    // Handle Mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
      return;
    }

    // Handle Zod validation errors (shouldn't happen due to safeParse, but just in case)
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.flatten() });
      return;
    }
    
    res.status(500).json({ error: 'Failed to create post' });
  }
};

