import api from '../utils/api';
import { User, Address, ApiResponse } from '../types';

export const userService = {
    // Get user profile
    async getProfile(): Promise<User> {
        const response = await api.get<ApiResponse<User>>('/users/profile');
        return response.data.data!;
    },

    // Update user profile
    async updateProfile(data: { name?: string; phone?: string }): Promise<User> {
        const response = await api.put<ApiResponse<User>>('/users/profile', data);
        return response.data.data!;
    },

    // Get user preferences
    async getPreferences(): Promise<User> {
        const response = await api.get<ApiResponse<User>>('/users/preferences');
        return response.data.data!;
    },

    // Update user preferences
    async updatePreferences(preferences: Partial<User['preferences']>): Promise<User> {
        const response = await api.put<ApiResponse<User>>('/users/preferences', { preferences });
        return response.data.data!;
    },

    // Add new address
    async addAddress(address: Omit<Address, '_id'>): Promise<Address[]> {
        const response = await api.post<ApiResponse<Address[]>>('/users/addresses', address);
        return response.data.data!;
    },

    // Update existing address
    async updateAddress(id: string, address: Partial<Address>): Promise<Address> {
        const response = await api.put<ApiResponse<Address>>(`/users/addresses/${id}`, address);
        return response.data.data!;
    },

    // Delete address
    async deleteAddress(id: string): Promise<void> {
        await api.delete(`/users/addresses/${id}`);
    },

    // Set default address
    async setDefaultAddress(id: string): Promise<void> {
        await api.patch(`/users/addresses/${id}/default`);
    },

    // Get user orders
    async getUserOrders(): Promise<any[]> {
        const response = await api.get<ApiResponse<any[]>>('/orders');
        return response.data.data || [];
    },

    // Cancel order
    async cancelOrder(id: string): Promise<any> {
        const response = await api.patch<ApiResponse<any>>(`/orders/${id}/cancel`);
        return response.data.data;
    }
};

