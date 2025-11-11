import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  nickname: string;
  text: string;
  imageUrl?: string; // Legacy single image support (deprecated - use images array)
  images: Array<{ url: string; publicId: string }>; // Multi-image support
  authorAnonId?: string; // Anonymous author identifier from client (optional for backward compatibility)
  createdAt: Date;
  topics: string[];
  blurRequested: boolean;
  contentType: 'text' | 'image';
  commentCount: number;
  reportsCount: number;
  status: 'auto' | 'pending';
}

const PostSchema = new Schema<IPost>(
  {
    nickname: {
      type: String,
      required: [true, 'Nickname is required'],
      trim: true,
    },
    text: {
      type: String,
      required: [true, 'Text is required'],
      minlength: [20, 'Text must be at least 20 characters'],
      maxlength: [1000, 'Text must not exceed 1000 characters'],
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      // Legacy field - prefer using 'images' array for new posts
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
        },
      ],
      default: [],
    },
    authorAnonId: {
      type: String,
      required: false, // Optional for backward compatibility with existing posts
      index: true, // Index for efficient author queries
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    topics: {
      type: [String],
      default: [],
    },
    blurRequested: {
      type: Boolean,
      default: false,
    },
    contentType: {
      type: String,
      enum: ['text', 'image'],
      default: 'text',
    },
    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    reportsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['auto', 'pending'],
      default: 'auto',
    },
  },
  {
    timestamps: false, // We're managing createdAt manually
  }
);

// Create index on createdAt in descending order for efficient querying
PostSchema.index({ createdAt: -1 });

// Compound index for author-based queries with time sorting
PostSchema.index({ authorAnonId: 1, createdAt: -1 });

// Export the model
export const Post = mongoose.model<IPost>('Post', PostSchema);

