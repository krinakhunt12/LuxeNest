import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';

export const useProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: () => userService.getProfile(),
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { name?: string; phone?: string }) => userService.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success('Profile updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update profile');
        }
    });
};

export const useUserOrders = () => {
    return useQuery({
        queryKey: ['user-orders'],
        queryFn: () => userService.getUserOrders(),
    });
};

export const useCancelOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => userService.cancelOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-orders'] });
            toast.success('Order cancelled successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to cancel order');
        }
    });
};

export const useUserPreferences = () => {
    return useQuery({
        queryKey: ['user-preferences'],
        queryFn: () => userService.getPreferences(),
    });
};

export const useUpdatePreferences = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (preferences: any) => userService.updatePreferences(preferences),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
            toast.success('Preferences updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update preferences');
        }
    });
};
