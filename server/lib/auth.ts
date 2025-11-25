import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

/**
 * Hash a plain text password using bcrypt
 */
export async function hashPassword(plainPassword: string): Promise<string> {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Verify a plain text password against a bcrypt hash
 */
export async function verifyPassword(
    plainPassword: string,
    passwordHash: string
): Promise<boolean> {
    return await bcrypt.compare(plainPassword, passwordHash);
}

/**
 * User data to be encoded in JWT
 */
export interface TokenPayload {
    userId: string;
    email: string;
    role: 'student' | 'peer' | 'admin';
}

/**
 * Create a JWT token for authenticated user
 */
export function createAuthToken(user: TokenPayload): string {
    return jwt.sign(
        {
            userId: user.userId,
            email: user.email,
            role: user.role,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

/**
 * Verify and decode a JWT token
 * @throws Error if token is invalid or expired
 */
export function verifyAuthToken(token: string): TokenPayload {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token has expired');
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid token');
        }
        throw new Error('Token verification failed');
    }
}

/**
 * Extract token from Authorization header
 * Supports "Bearer <token>" format
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
        return parts[1];
    }

    return null;
}
