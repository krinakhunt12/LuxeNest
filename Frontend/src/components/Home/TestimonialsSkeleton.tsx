import React from 'react';
import Skeleton from '../Common/Skeleton';

const TestimonialsSkeleton: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <Skeleton variant="text" height={48} className="w-64 mx-auto mb-4" />
          <Skeleton variant="rectangular" height={4} width={80} className="mx-auto mb-6" />
          <Skeleton variant="text" height={24} className="w-96 mx-auto" />
        </div>

        {/* Testimonial Card Skeleton */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-3xl">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-12">
              {/* Quote Icon Skeleton */}
              <div className="flex items-center justify-center mb-6">
                <Skeleton variant="circular" width={48} height={48} className="bg-gray-200" />
              </div>
              
              {/* Rating Stars Skeleton */}
              <div className="flex justify-center mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} variant="rectangular" width={20} height={20} className="mx-1 bg-gray-200" />
                ))}
              </div>

              {/* Testimonial Text Skeleton */}
              <div className="text-center mb-8 space-y-2">
                <Skeleton variant="text" height={24} className="w-full" />
                <Skeleton variant="text" height={24} className="w-11/12 mx-auto" />
                <Skeleton variant="text" height={24} className="w-4/5 mx-auto" />
              </div>

              {/* Author Info Skeleton */}
              <div className="flex items-center justify-center space-x-4">
                <Skeleton variant="circular" width={64} height={64} className="bg-gray-200" />
                <div className="text-center">
                  <Skeleton variant="text" height={20} width={120} className="mb-2" />
                  <Skeleton variant="text" height={16} width={100} />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows Skeleton */}
          <div className="flex justify-between mt-8">
            <Skeleton variant="circular" width={48} height={48} className="bg-gray-200" />
            <Skeleton variant="circular" width={48} height={48} className="bg-gray-200" />
          </div>

          {/* Indicators Skeleton */}
          <div className="flex justify-center space-x-2 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rectangular" width={12} height={12} className="bg-gray-300 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSkeleton;
