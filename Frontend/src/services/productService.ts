import api from '../utils/api';
import { ApiResponse } from '../types';

export const productService = {
    async getProducts(params?: any): Promise<any> {
        const response = await api.get<ApiResponse<any>>('/products', { params });
        return response.data;
    },

    async getProduct(id: string): Promise<any> {
        const response = await api.get<ApiResponse<any>>(`/products/${id}`);
        return response.data.data;
    },

    async getFeaturedProducts(): Promise<any[]> {
        const response = await api.get<ApiResponse<any[]>>('/products/featured');
        return response.data.data || [];
    },

    async getCategories(): Promise<any[]> {
        const response = await api.get<ApiResponse<any[]>>('/categories');
        return response.data.data || [];
    }
};
