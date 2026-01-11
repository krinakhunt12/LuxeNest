import api from '../utils/api';
import { Product, ApiResponse } from '../types';

export const wishlistService = {
    // Get user's wishlist
    async getWishlist(): Promise<Product[]> {
        const response = await api.get<ApiResponse<Product[]>>('/wishlist');
        return response.data.data || [];
    },

    // Add product to wishlist
    async addToWishlist(productId: string): Promise<Product[]> {
        const response = await api.post<ApiResponse<Product[]>>(`/wishlist/add/${productId}`);
        return response.data.data || [];
    },

    // Remove product from wishlist
    async removeFromWishlist(productId: string): Promise<void> {
        await api.delete(`/wishlist/remove/${productId}`);
    },

    // Move item from wishlist to cart
    async moveToCart(productId: string): Promise<void> {
        await api.post(`/wishlist/move-to-cart/${productId}`);
    },
};
