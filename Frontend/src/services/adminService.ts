import api from '../utils/api';
import { ApiResponse } from '../types';

export const adminService = {
    async getDashboardStats(): Promise<any> {
        const response = await api.get<ApiResponse<any>>('/admin/dashboard');
        return response.data.data;
    },

    async getOrders(params?: { page?: number; limit?: number; search?: string }): Promise<{ data: any[]; pagination: any }> {
        const response = await api.get<ApiResponse<any[]>>('/admin/orders', { params });
        return {
            data: response.data.data || [],
            pagination: (response.data as any).pagination
        };
    },

    async getOrderById(id: string): Promise<any> {
        const response = await api.get<ApiResponse<any>>(`/admin/orders/${id}`);
        return response.data.data;
    },

    async updateOrderStatus(id: string, status: string): Promise<any> {
        const response = await api.post<ApiResponse<any>>(`/admin/orders/${id}`, { orderStatus: status });
        return response.data.data;
    },

    async getProducts(params?: { page?: number; limit?: number; search?: string }): Promise<{ data: any[]; pagination: any }> {
        const response = await api.get<ApiResponse<any[]>>('/admin/products', { params });
        return {
            data: response.data.data || [],
            pagination: (response.data as any).pagination
        };
    },


    async createProduct(productData: any): Promise<any> {
        const response = await api.post<ApiResponse<any>>('/products', productData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.data;
    },

    async updateProduct(id: string, productData: any): Promise<any> {
        const response = await api.put<ApiResponse<any>>(`/products/${id}`, productData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.data;
    },

    async deleteProduct(id: string): Promise<any> {
        const response = await api.delete<ApiResponse<any>>(`/products/${id}`);
        return response.data;
    },

    async deleteProductsBulk(ids: string[]): Promise<any> {
        const response = await api.post<ApiResponse<any>>('/admin/products/bulk-delete', { ids });
        return response.data;
    },


    async getUsers(): Promise<any[]> {
        const response = await api.get<ApiResponse<any[]>>('/admin/users');
        return response.data.data || [];
    },

    async getCategories(params?: { page?: number; limit?: number }): Promise<{ data: any[]; pagination: any }> {
        const response = await api.get<ApiResponse<any[]>>('/categories', { params });
        return {
            data: response.data.data || [],
            pagination: (response.data as any).pagination
        };
    },


    async createCategory(data: FormData): Promise<any> {
        const response = await api.post<ApiResponse<any>>('/categories', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.data;
    },

    async updateCategory(id: string, data: FormData): Promise<any> {
        const response = await api.put<ApiResponse<any>>(`/categories/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.data;
    },

    async deleteCategory(id: string): Promise<any> {
        const response = await api.delete<ApiResponse<any>>(`/categories/${id}`);
        return response.data;
    },

    async uploadExcel(file: File): Promise<any> {

        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<ApiResponse<any>>('/products/upload-excel', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};
