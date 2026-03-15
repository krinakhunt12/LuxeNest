import { useQuery } from '@tanstack/react-query';

// Mock API functions - replace with actual API calls
const testimonialsApi = {
  getTestimonials: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    return [
      {
        id: 1,
        name: 'Sarah Mitchell',
        location: 'New York, NY',
        rating: 5,
        text: 'LuxeNest transformed my living room into a sanctuary of elegance. The quality is unmatched and the customer service was exceptional.',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 2,
        name: 'James Chen',
        location: 'San Francisco, CA',
        rating: 5,
        text: 'I\'ve never experienced such attention to detail in furniture. Every piece tells a story and brings so much character to my home.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 3,
        name: 'Emma Thompson',
        location: 'London, UK',
        rating: 5,
        text: 'The sustainable approach to luxury furniture is exactly what I was looking for. Beautiful pieces that I can feel good about purchasing.',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      },
      {
        id: 4,
        name: 'Michael Rodriguez',
        location: 'Miami, FL',
        rating: 5,
        text: 'From the moment I unboxed my dining set, I knew I made the right choice. The craftsmanship is absolutely stunning.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
      }
    ];
  }
};

export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: testimonialsApi.getTestimonials,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
