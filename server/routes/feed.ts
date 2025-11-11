import { RequestHandler } from 'express';
import { Post } from '../models';
import { connectToDatabase } from '../lib/mongodb';

/**
 * GET /api/feed
 * Get paginated posts with status='auto'
 * Query params: page (default 1), limit (default 10)
 */
export const getFeed: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();

    // Parse pagination parameters
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    // Get posts with status='auto' sorted by createdAt desc
    const [posts, total] = await Promise.all([
      Post.find({ status: 'auto' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Post.countDocuments({ status: 'auto' }),
    ]);

    res.json({
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
};

