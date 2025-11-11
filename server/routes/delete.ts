import { RequestHandler } from 'express';
import { Types } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { Post, Comment } from '../models';
import { connectToDatabase } from '../lib/mongodb';

// Configure Cloudinary for server-side operations (delete images)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * DELETE /api/post/:postId
 * Delete a post and all its comments
 * - Verifies post belongs to the user (via anonymous ID cookie)
 * - Deletes images from Cloudinary
 * - Deletes post and comments from database
 */
export const deletePost: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();

    const { postId } = req.params;

    // Validate postId
    if (!postId || !Types.ObjectId.isValid(postId)) {
      res.status(400).json({ error: 'Invalid post ID' });
      return;
    }

    // Read anonymous ID from cookie
    const cookie = req.headers.cookie || '';
    const cookieMatch = cookie.match(/(?:^|; )shy_anon_id=([^;]+)/);
    const anonId = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;

    if (!anonId) {
      res.status(400).json({ error: 'No anonymous ID found. Unable to verify ownership.' });
      return;
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Verify the post belongs to this user
    if (post.authorAnonId !== anonId) {
      res.status(403).json({ error: 'Forbidden. You can only delete your own posts.' });
      return;
    }

    // Delete images from Cloudinary if they exist
    const images = post.images || [];
    if (images.length > 0) {
      try {
        const publicIds = images.map(img => img.publicId).filter(Boolean);
        if (publicIds.length > 0) {
          await cloudinary.api.delete_resources(publicIds);
          console.log(`Deleted ${publicIds.length} images from Cloudinary for post ${postId}`);
        }
      } catch (cloudinaryError) {
        console.error('Error deleting images from Cloudinary:', cloudinaryError);
        // Continue with post deletion even if Cloudinary cleanup fails
      }
    }

    // Delete legacy single image if present (and not in images array)
    if (post.imageUrl && images.length === 0) {
      try {
        // Extract public_id from URL if possible
        const urlMatch = post.imageUrl.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)/);
        if (urlMatch) {
          await cloudinary.uploader.destroy(urlMatch[1]);
          console.log(`Deleted legacy image from Cloudinary for post ${postId}`);
        }
      } catch (cloudinaryError) {
        console.error('Error deleting legacy image from Cloudinary:', cloudinaryError);
      }
    }

    // Delete all comments associated with this post
    await Comment.deleteMany({ postId: new Types.ObjectId(postId) });

    // Delete the post
    await Post.findByIdAndDelete(postId);

    res.json({ 
      success: true, 
      message: 'Post and associated comments deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

