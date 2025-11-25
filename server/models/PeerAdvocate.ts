import mongoose from 'mongoose';

export interface IPeerAdvocate {
  email: string;
  password: string; // In production, this should be hashed
  nickname: string;
  profileImage: string;
  bio?: string;
  createdAt: Date;
  isActive: boolean;
}

const peerAdvocateSchema = new mongoose.Schema<IPeerAdvocate>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  profileImage: {
    type: String,
    default: '/profile.jpg',
  },
  bio: {
    type: String,
    default: 'I\'m here to support peers going through similar experiences.',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const PeerAdvocate = mongoose.model<IPeerAdvocate>('PeerAdvocate', peerAdvocateSchema);

