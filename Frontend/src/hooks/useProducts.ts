import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';

export const useProducts = (params?: any) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => productService.getProducts(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    });
};

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getProduct(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => productService.getCategories(),
        staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
        gcTime: 30 * 60 * 1000, // 30 minutes
    });
};

export const useFeaturedProducts = () => {
    return useQuery({
        queryKey: ['products', 'featured'],
        queryFn: () => productService.getFeaturedProducts(),
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useHomeData = () => {
    return useQuery({
        queryKey: ['home-data'],
        queryFn: () => productService.getHomeData(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};
