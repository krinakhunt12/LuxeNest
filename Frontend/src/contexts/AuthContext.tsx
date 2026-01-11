import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    adminLogin: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
    adminSignup: (name: string, email: string, phone: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const setUserIdCart = useCartStore((state) => state.setUserId);
    const setUserIdWishlist = useWishlistStore((state) => state.setUserId);

    // Update stores when user changes
    useEffect(() => {
        const userId = user ? user._id : null;
        setUserIdCart(userId);
        setUserIdWishlist(userId);
    }, [user, setUserIdCart, setUserIdWishlist]);

    // Check for existing auth on mount
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('authToken');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                } catch (error) {
                    console.error('Error parsing stored user:', error);
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const data = await authService.login(email, password);

            // Store token and user
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
        } catch (error: any) {
            throw new Error(error.message || 'Login failed');
        }
    };

    const adminLogin = async (email: string, password: string) => {
        try {
            const data = await authService.adminLogin(email, password);
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
        } catch (error: any) {
            throw new Error(error.message || 'Admin login failed');
        }
    };

    const signup = async (name: string, email: string, phone: string, password: string) => {
        try {
            const data = await authService.register(name, email, phone, password);

            // Store token and user
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
        } catch (error: any) {
            throw new Error(error.message || 'Signup failed');
        }
    };

    const adminSignup = async (name: string, email: string, phone: string, password: string) => {
        try {
            const data = await authService.adminRegister(name, email, phone, password);
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
        } catch (error: any) {
            throw new Error(error.message || 'Admin signup failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        adminLogin,
        signup,
        adminSignup,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
