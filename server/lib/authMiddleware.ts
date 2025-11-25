import { Request, Response, NextFunction } from 'express';
import { verifyAuthToken, extractTokenFromHeader, TokenPayload } from './auth';
import { User } from '../models';

/**
 * Extended Express Request with authenticated user data
 */
export interface AuthRequest extends Request {
    user?: TokenPayload & { _id: string };
}

/**
 * Middleware to require authentication
 * Extracts and verifies JWT token from Authorization header or cookies
 * Attaches user data to req.user
 */
export async function requireAuth(
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // Try to extract token from Authorization header
        let token = extractTokenFromHeader(req.headers.authorization);

        // Fallback: try to get token from cookie
        if (!token && req.cookies?.authToken) {
            token = req.cookies.authToken;
        }

        if (!token) {
            res.status(401).json({
                ok: false,
                error: 'Authentication required. Please provide a valid token.',
            });
            return;
        }

        // Verify token
        const decoded = verifyAuthToken(token);

        // Optional: Load full user from database to ensure user still exists
        const user = await User.findById(decoded.userId).select('-passwordHash');

        if (!user) {
            res.status(401).json({
                ok: false,
                error: 'User not found. Token may be invalid.',
            });
            return;
        }

        // Attach user data to request
        req.user = {
            _id: user._id.toString(),
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            ok: false,
            error: error instanceof Error ? error.message : 'Invalid or expired token',
        });
    }
}

/**
 * Middleware factory to require specific role(s)
 * Must be used AFTER requireAuth middleware
 * 
 * @example
 * router.get('/admin', requireAuth, requireRole('admin'), handler);
 * router.get('/peer', requireAuth, requireRole(['peer', 'admin']), handler);
 */
export function requireRole(allowedRoles: string | string[]) {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                ok: false,
                error: 'Authentication required',
            });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                ok: false,
                error: `Access denied. Required role: ${roles.join(' or ')}`,
            });
            return;
        }

        next();
    };
}

/**
 * Optional middleware to attach user if token is present, but don't require it
 * Useful for routes that work for both authenticated and anonymous users
 */
export async function optionalAuth(
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        let token = extractTokenFromHeader(req.headers.authorization);

        if (!token && req.cookies?.authToken) {
            token = req.cookies.authToken;
        }

        if (token) {
            const decoded = verifyAuthToken(token);
            const user = await User.findById(decoded.userId).select('-passwordHash');

            if (user) {
                req.user = {
                    _id: user._id.toString(),
                    userId: user._id.toString(),
                    email: user.email,
                    role: user.role,
                };
            }
        }

        next();
    } catch (error) {
        // Silently fail for optional auth
        next();
    }
}
