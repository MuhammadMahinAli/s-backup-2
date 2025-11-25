import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'peer' | 'admin';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Load auth data from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Failed to parse stored user data:', error);
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Save to state and localStorage
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('authUser', JSON.stringify(data.user));

            // Redirect based on role
            if (data.user.role === 'peer') {
                navigate('/peer-advocate-dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const signup = async (name: string, email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            // Save to state and localStorage
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('authUser', JSON.stringify(data.user));

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        navigate('/');
    };

    const value: AuthContextType = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user && !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
