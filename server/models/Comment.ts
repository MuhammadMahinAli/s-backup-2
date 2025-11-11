import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IComment extends Document {
  postId: Types.ObjectId;
  nickname: string;
  text: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post ID is required'],
    },
    nickname: {
      type: String,
      required: [true, 'Nickname is required'],
      trim: true,
    },
    text: {
      type: String,
      required: [true, 'Text is required'],
      minlength: [5, 'Text must be at least 5 characters'],
      maxlength: [500, 'Text must not exceed 500 characters'],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // We're managing createdAt manually
  }
);

// Create index on postId in ascending order for efficient querying
CommentSchema.index({ postId: 1 });

// Export the model
export const Comment = mongoose.model<IComment>('Comment', CommentSchema);

