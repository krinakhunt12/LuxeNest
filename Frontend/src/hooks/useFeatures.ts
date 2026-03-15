import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

// Mock API functions - replace with actual API calls
const featuresApi = {
  getFeatures: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: 1,
        icon: 'Truck',
        title: 'Free Shipping',
        description: 'Complimentary delivery on all orders over $500',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        id: 2,
        icon: 'Shield',
        title: 'Premium Quality',
        description: 'Handpicked materials and exceptional craftsmanship',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        id: 3,
        icon: 'Heart',
        title: 'Designed with Love',
        description: 'Each piece created with passion and attention to detail',
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      },
      {
        id: 4,
        icon: 'Award',
        title: 'Award Winning',
        description: 'Recognized for excellence in design and innovation',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      },
      {
        id: 5,
        icon: 'Sparkles',
        title: 'Exclusive Designs',
        description: 'Unique pieces you won\'t find anywhere else',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      },
      {
        id: 6,
        icon: 'Clock',
        title: '24/7 Support',
        description: 'Dedicated customer service whenever you need us',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50'
      }
    ];
  },

  trackFeatureClick: async (featureId: number) => {
    // Simulate API call to track feature interaction
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, featureId };
  }
};

export const useFeatures = () => {
  return useQuery({
    queryKey: ['features'],
    queryFn: featuresApi.getFeatures,
    staleTime: 30 * 60 * 1000, // 30 minutes - features don't change often
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useFeatureInteraction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: featuresApi.trackFeatureClick,
    onSuccess: (data) => {
      toast.success(`Feature interaction tracked: ${data.featureId}`);
      // Optionally invalidate or update related queries
      queryClient.invalidateQueries({ queryKey: ['feature-analytics'] });
    },
    onError: (error) => {
      toast.error('Failed to track feature interaction');
      console.error('Feature interaction error:', error);
    },
  });
};
