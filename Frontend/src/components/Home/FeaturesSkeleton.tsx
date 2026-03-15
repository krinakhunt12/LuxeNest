import React from 'react';
import Skeleton from '../Common/Skeleton';

const FeaturesSkeleton: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-16">
          <Skeleton variant="text" height={48} className="w-64 mx-auto mb-4" />
          <Skeleton variant="rectangular" height={4} width={80} className="mx-auto mb-6" />
          <Skeleton variant="text" height={24} className="w-96 mx-auto" />
        </div>

        {/* Features Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="text-center p-8 rounded-2xl bg-white shadow-lg">
              {/* Icon Skeleton */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6 mx-auto">
                <Skeleton variant="circular" width={32} height={32} />
              </div>
              
              {/* Title Skeleton */}
              <Skeleton variant="text" height={24} className="w-32 mx-auto mb-3" />
              
              {/* Description Skeleton */}
              <div className="space-y-2">
                <Skeleton variant="text" height={16} className="w-full" />
                <Skeleton variant="text" height={16} className="w-5/6 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSkeleton;
