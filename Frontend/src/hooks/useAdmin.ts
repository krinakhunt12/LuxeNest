import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';
import { logger } from '../utils/logger';

export const useAdminProducts = (params: { page?: number; limit?: number; search?: string } = {}) => {
    const queryClient = useQueryClient();

    const productsQuery = useQuery({
        queryKey: ['admin', 'products', params],
        queryFn: () => adminService.getProducts(params),
    });


    const categoriesQuery = useQuery({
        queryKey: ['admin', 'categories'],
        queryFn: () => adminService.getCategories(),
    });

    const createProductMutation = useMutation({
        mutationFn: (data: FormData) => adminService.createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] }); // Also invalidate public products
            toast.success('Product created successfully');
            logger.info('Product created and caches invalidated');
        },
        onError: (error) => {
            logger.error('Failed to create product', { error });
            toast.error('Failed to create product');
        }
    });

    const updateProductMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) => adminService.updateProduct(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
            toast.success('Product updated successfully');
            logger.info('Product updated and caches invalidated');
        },
        onError: (error) => {
            logger.error('Failed to update product', { error });
            toast.error('Failed to update product');
        }
    });

    const deleteProductMutation = useMutation({
        mutationFn: (id: string) => adminService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product deleted successfully');
            logger.info('Product deleted and caches invalidated');
        },
        onError: (error) => {
            logger.error('Failed to delete product', { error });
            toast.error('Failed to delete product');
        }
    });

    const deleteProductsBulkMutation = useMutation({
        mutationFn: (ids: string[]) => adminService.deleteProductsBulk(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Products deleted successfully');
            logger.info('Products deleted in bulk and caches invalidated');
        },
        onError: (error) => {
            logger.error('Failed to delete products in bulk', { error });
            toast.error('Failed to delete products');
        }
    });

    return {
        products: productsQuery.data?.data || [],
        pagination: productsQuery.data?.pagination,
        isLoading: productsQuery.isLoading,
        isError: productsQuery.isError,
        refetch: productsQuery.refetch,
        categories: categoriesQuery.data || [],
        createProduct: createProductMutation.mutateAsync,
        updateProduct: updateProductMutation.mutateAsync,
        deleteProduct: deleteProductMutation.mutateAsync,
        deleteProductsBulk: deleteProductsBulkMutation.mutateAsync,
        isSaving: createProductMutation.isPending || updateProductMutation.isPending,
        isDeleting: deleteProductMutation.isPending || deleteProductsBulkMutation.isPending
    };



};

export const useAdminOrders = (params: { page?: number; limit?: number; search?: string } = {}) => {
    const queryClient = useQueryClient();

    const ordersQuery = useQuery({
        queryKey: ['admin', 'orders', params],
        queryFn: () => adminService.getOrders(params),
    });


    const updateOrderStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => adminService.updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
            toast.success('Order status updated');
        },
        onError: (error) => {
            logger.error('Failed to update order status', { error });
            toast.error('Failed to update order status');
        }
    });

    return {
        orders: ordersQuery.data?.data || [],
        pagination: ordersQuery.data?.pagination,
        isLoading: ordersQuery.isLoading,
        updateStatus: updateOrderStatusMutation.mutateAsync,
        isUpdating: updateOrderStatusMutation.isPending,
        refetch: ordersQuery.refetch
    };
};


export const useAdminUsers = () => {
    const usersQuery = useQuery({
        queryKey: ['admin', 'users'],
        queryFn: () => adminService.getUsers(),
    });

    return {
        users: usersQuery.data || [],
        isLoading: usersQuery.isLoading
    };
};

export const useAdminCategories = (params: { page?: number; limit?: number } = {}) => {
    const queryClient = useQueryClient();

    const categoriesQuery = useQuery({
        queryKey: ['admin', 'categories', params],
        queryFn: () => adminService.getCategories(params),
    });


    const createCategoryMutation = useMutation({
        mutationFn: (data: FormData) => adminService.createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category created successfully');
        },
        onError: (error) => {
            logger.error('Failed to create category', { error });
            toast.error('Failed to create category');
        }
    });

    const updateCategoryMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) => adminService.updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category updated successfully');
        },
        onError: (error) => {
            logger.error('Failed to update category', { error });
            toast.error('Failed to update category');
        }
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: (id: string) => adminService.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category deleted successfully');
        },
        onError: (error) => {
            logger.error('Failed to delete category', { error });
            toast.error('Failed to delete category');
        }
    });

    return {
        categories: categoriesQuery.data?.data || [],
        pagination: categoriesQuery.data?.pagination,
        isLoading: categoriesQuery.isLoading,
        createCategory: createCategoryMutation.mutateAsync,
        updateCategory: updateCategoryMutation.mutateAsync,
        deleteCategory: deleteCategoryMutation.mutateAsync,
        isSaving: createCategoryMutation.isPending || updateCategoryMutation.isPending,
        isDeleting: deleteCategoryMutation.isPending,
        refetch: categoriesQuery.refetch
    };
};


