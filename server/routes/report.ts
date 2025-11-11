import { RequestHandler } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { Post } from '../models';
import { connectToDatabase } from '../lib/mongodb';
import { ReportPostZ } from '../../shared/schemas';

/**
 * POST /api/report
 * Report a post by incrementing its reportsCount
 */
export const reportPost: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();

    // Validate request body with Zod
    const parseResult = ReportPostZ.safeParse(req.body);
    
    if (!parseResult.success) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: parseResult.error.flatten() 
      });
      return;
    }

    const parsed = parseResult.data;

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(parsed.postId)) {
      res.status(400).json({ error: 'Invalid post ID format' });
      return;
    }

    // Check if post exists and increment reportsCount
    const post = await Post.findByIdAndUpdate(
      parsed.postId,
      { $inc: { reportsCount: 1 } },
      { new: true }
    );

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json({ success: true, reportsCount: post.reportsCount });
  } catch (error) {
    console.error('Error reporting post:', error);
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.flatten() });
      return;
    }
    
    res.status(500).json({ error: 'Failed to report post' });
  }
};

