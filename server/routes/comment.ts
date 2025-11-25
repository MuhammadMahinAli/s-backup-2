import { RequestHandler } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { Comment, Post } from '../models';
import { PeerAdvocate } from '../models/PeerAdvocate';
import { connectToDatabase } from '../lib/mongodb';
import { CreateCommentZ } from '../../shared/schemas';

/**
 * POST /api/comment
 * Create a new comment and increment post's comment count
 */
export const createComment: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();

    // Validate request body with Zod
    const parseResult = CreateCommentZ.safeParse(req.body);
    
    if (!parseResult.success) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: parseResult.error.flatten() 
      });
      return;
    }

    const parsed = parseResult.data;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(parsed.postId)) {
      res.status(400).json({ error: 'Invalid post ID format' });
      return;
    }

    // Check if post exists
    const post = await Post.findById(parsed.postId);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Check if commenter is a peer advocate
    const peerAdvocate = await PeerAdvocate.findOne({ 
      nickname: parsed.nickname,
      isActive: true 
    });

    // Create the comment
    const comment = await Comment.create({
      postId: new Types.ObjectId(parsed.postId),
      nickname: parsed.nickname,
      text: parsed.text,
      isPeerAdvocate: !!peerAdvocate,
    });

    // Increment post's comment count
    await Post.findByIdAndUpdate(parsed.postId, {
      $inc: { commentCount: 1 },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    
    // Handle Mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
      return;
    }

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.flatten() });
      return;
    }
    
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

/**
 * GET /api/comments?postId=<id>
 * Get all comments for a specific post
 */
export const getComments: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();

    const { postId } = req.query;

    // Validate postId
    if (!postId || typeof postId !== 'string') {
      res.status(400).json({ error: 'Post ID is required' });
      return;
    }

    if (!Types.ObjectId.isValid(postId)) {
      res.status(400).json({ error: 'Invalid post ID' });
      return;
    }

    // Get comments sorted by createdAt ascending
    const comments = await Comment.find({ postId: new Types.ObjectId(postId) })
      .sort({ createdAt: 1 })
      .lean()
      .exec();

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

