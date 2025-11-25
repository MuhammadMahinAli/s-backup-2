import { Router, Request, Response } from 'express';
import { connectToDatabase } from '../lib/mongodb';
import { User } from '../models';
import { hashPassword, verifyPassword, createAuthToken } from '../lib/auth';

const router = Router();

/**
 * POST /api/auth/signup
 * Create a new user account
 */
router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                ok: false,
                error: 'Name, email, and password are required',
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                ok: false,
                error: 'Password must be at least 6 characters long',
            });
        }

        // Email format validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                ok: false,
                error: 'Please provide a valid email address',
            });
        }

        await connectToDatabase();

        // Check if email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                ok: false,
                error: 'Email already registered. Please use a different email or login.',
            });
        }

        // Only allow 'student' role for self-signup
        // Admin can create peer advocates through a different endpoint
        const userRole = role === 'student' ? 'student' : 'student';

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            passwordHash,
            role: userRole,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Create auth token
        const token = createAuthToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        console.log('✅ New user created:', user.email);

        // Return user data (without password) and token
        return res.status(201).json({
            ok: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error('❌ Error in /api/auth/signup:', error);
        return res.status(500).json({
            ok: false,
            error: 'Failed to create account. Please try again.',
        });
    }
});

/**
 * POST /api/auth/login
 * Authenticate user and return token
 */
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                error: 'Email and password are required',
            });
        }

        await connectToDatabase();

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                ok: false,
                error: 'Invalid email or password',
            });
        }

        // Verify password
        const isPasswordValid = await verifyPassword(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({
                ok: false,
                error: 'Invalid email or password',
            });
        }

        // Create auth token
        const token = createAuthToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        console.log('✅ User logged in:', user.email);

        // Return user data (without password) and token
        return res.status(200).json({
            ok: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error('❌ Error in /api/auth/login:', error);
        return res.status(500).json({
            ok: false,
            error: 'Login failed. Please try again.',
        });
    }
});

/**
 * GET /api/auth/me
 * Get current user info (requires authentication)
 */
router.get('/me', async (req: Request, res: Response) => {
    try {
        // This endpoint should be protected with requireAuth middleware
        // For now, returning a placeholder response
        return res.status(200).json({
            ok: true,
            message: 'This endpoint requires authentication middleware',
        });
    } catch (error) {
        console.error('❌ Error in /api/auth/me:', error);
        return res.status(500).json({
            ok: false,
            error: 'Failed to get user info',
        });
    }
});

export default router;
