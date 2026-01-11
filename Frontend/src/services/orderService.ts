import api from '../utils/api';
import { ApiResponse } from '../types';

export interface OrderInput {
    items: Array<{
        product: string;
        name: string;
        quantity: number;
        price: number;
        selectedColor: string;
        image: string;
    }>;
    shippingAddress: {
        name: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' | 'COD';
}

export const orderService = {
    async createOrder(orderData: OrderInput): Promise<any> {
        const response = await api.post<ApiResponse<any>>('/orders', orderData);
        return response.data.data;
    },

    async getMyOrders(): Promise<any[]> {
        const response = await api.get<ApiResponse<any[]>>('/orders');
        return response.data.data || [];
    },

    async getOrderById(id: string): Promise<any> {
        const response = await api.get<ApiResponse<any>>(`/orders/${id}`);
        return response.data.data;
    }
};
