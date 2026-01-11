import api from '../utils/api';
import { User, ApiResponse } from '../types';

interface LoginResponse {
    token: string;
    user: User;
}

interface RegisterResponse {
    token: string;
    user: User;
}

export const authService = {
    // Login
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
            email,
            password,
        });
        return response.data.data!;
    },

    // Admin Login
    async adminLogin(email: string, password: string): Promise<LoginResponse> {
        const response = await api.post<ApiResponse<LoginResponse>>('/auth/admin/login', {
            email,
            password,
        });
        return response.data.data!;
    },

    // Admin Register
    async adminRegister(name: string, email: string, phone: string, password: string): Promise<RegisterResponse> {
        const response = await api.post<ApiResponse<RegisterResponse>>('/auth/admin/register', {
            name,
            email,
            phone,
            password,
        });
        return response.data.data!;
    },

    // Register
    async register(name: string, email: string, phone: string, password: string): Promise<RegisterResponse> {
        const response = await api.post<ApiResponse<RegisterResponse>>('/auth/register', {
            name,
            email,
            phone,
            password,
        });
        return response.data.data!;
    },

    // Logout
    async logout(): Promise<void> {
        await api.post('/auth/logout');
    },

    // Get current user
    async getCurrentUser(): Promise<User> {
        const response = await api.get<ApiResponse<User>>('/auth/me');
        return response.data.data!;
    },

    // Refresh token
    async refreshToken(): Promise<string> {
        const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh');
        return response.data.data!.token;
    },
};
