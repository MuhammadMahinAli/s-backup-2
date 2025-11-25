import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    requireRole?: 'student' | 'peer' | 'admin' | ('student' | 'peer' | 'admin')[];
}

export default function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
    const { user, loading, isAuthenticated } = useAuth();

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check role if required
    if (requireRole && user) {
        const allowedRoles = Array.isArray(requireRole) ? requireRole : [requireRole];

        if (!allowedRoles.includes(user.role)) {
            // Redirect to appropriate dashboard based on user's actual role
            if (user.role === 'peer') {
                return <Navigate to="/peer-advocate-dashboard" replace />;
            } else {
                return <Navigate to="/dashboard" replace />;
            }
        }
    }

    return <>{children}</>;
}
