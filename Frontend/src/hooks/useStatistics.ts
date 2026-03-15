import { useQuery } from '@tanstack/react-query';

// Mock API functions - replace with actual API calls
const statisticsApi = {
  getStatistics: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      {
        id: 1,
        icon: 'Users',
        value: 50000,
        suffix: '+',
        label: 'Happy Customers',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        id: 2,
        icon: 'Package',
        value: 1200,
        suffix: '+',
        label: 'Premium Products',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        id: 3,
        icon: 'Star',
        value: 4.9,
        suffix: '/5',
        label: 'Average Rating',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      },
      {
        id: 4,
        icon: 'Award',
        value: 25,
        suffix: '+',
        label: 'Design Awards',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      }
    ];
  }
};

export const useStatistics = () => {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: statisticsApi.getStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
  });
};
