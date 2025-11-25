import { RequestHandler } from 'express';
import { PeerAdvocate } from '../models/PeerAdvocate';
import { z } from 'zod';
import { connectToDatabase } from '../lib/mongodb';

// Signup schema
const SignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  nickname: z.string().min(2, 'Nickname must be at least 2 characters').max(40, 'Nickname too long'),
});

// Login schema
const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Signup handler
export const signupPeerAdvocate: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { email, password, nickname } = SignupSchema.parse(req.body);

    // Check if email already exists
    const existingEmail = await PeerAdvocate.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Check if nickname already exists
    const existingNickname = await PeerAdvocate.findOne({ nickname });
    if (existingNickname) {
      return res.status(400).json({ error: 'Nickname already taken' });
    }

    // Create new peer advocate
    // Note: In production, password should be hashed using bcrypt
    const peerAdvocate = new PeerAdvocate({
      email,
      password, // TODO: Hash password in production
      nickname,
      profileImage: '/profile.jpg',
    });

    await peerAdvocate.save();

    // Return advocate data without password
    res.status(201).json({
      success: true,
      advocate: {
        email: peerAdvocate.email,
        nickname: peerAdvocate.nickname,
        profileImage: peerAdvocate.profileImage,
        bio: peerAdvocate.bio,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login handler
export const loginPeerAdvocate: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { email, password } = LoginSchema.parse(req.body);

    // Find peer advocate by email
    const peerAdvocate = await PeerAdvocate.findOne({ email });

    if (!peerAdvocate) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password (in production, use bcrypt.compare)
    if (peerAdvocate.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if account is active
    if (!peerAdvocate.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Return advocate data without password
    res.json({
      success: true,
      advocate: {
        _id: peerAdvocate._id,
        email: peerAdvocate.email,
        nickname: peerAdvocate.nickname,
        profileImage: peerAdvocate.profileImage,
        bio: peerAdvocate.bio,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all peer advocates (for displaying on peer advocates page)
export const getAllPeerAdvocates: RequestHandler = async (_req, res) => {
  try {
    await connectToDatabase();
    
    const advocates = await PeerAdvocate.find({ isActive: true })
      .select('nickname profileImage bio createdAt email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      advocates: advocates.map(a => ({
        nickname: a.nickname,
        profileImage: a.profileImage,
        bio: a.bio,
        memberSince: a.createdAt,
        email: a.email,
      })),
    });
  } catch (error) {
    console.error('Get advocates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Check if nickname is a peer advocate
export const checkPeerAdvocate: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { nickname } = req.query;

    if (!nickname || typeof nickname !== 'string') {
      return res.status(400).json({ error: 'Nickname is required' });
    }

    const advocate = await PeerAdvocate.findOne({ 
      nickname, 
      isActive: true 
    });

    res.json({
      isPeerAdvocate: !!advocate,
    });
  } catch (error) {
    console.error('Check advocate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

