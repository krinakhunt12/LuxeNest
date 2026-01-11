import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';

export const useProducts = (params?: any) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => productService.getProducts(params),
    });
};

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getProduct(id),
        enabled: !!id,
    });
};

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => productService.getCategories(),
    });
};

export const useFeaturedProducts = () => {
    return useQuery({
        queryKey: ['products', 'featured'],
        queryFn: () => productService.getFeaturedProducts(),
    });
};
