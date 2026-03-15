import React from 'react';
import Skeleton from '../Common/Skeleton';

const StatisticsSkeleton: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <Skeleton variant="text" height={48} className="w-64 mx-auto mb-4 bg-gray-700" />
          <Skeleton variant="rectangular" height={4} width={80} className="mx-auto mb-6 bg-gray-700" />
          <Skeleton variant="text" height={24} className="w-96 mx-auto bg-gray-700" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="text-center">
              {/* Icon Skeleton */}
              <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gray-700 mb-6">
                <Skeleton variant="circular" width={32} height={32} className="bg-gray-600" />
              </div>
              
              {/* Number Skeleton */}
              <Skeleton variant="text" height={48} className="w-24 mx-auto mb-2 bg-gray-700" />
              
              {/* Label Skeleton */}
              <Skeleton variant="text" height={20} className="w-32 mx-auto bg-gray-700" />
            </div>
          ))}
        </div>

        {/* Footer Status Skeleton */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex items-center space-x-6 sm:space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              <Skeleton variant="text" width={100} height={16} className="bg-gray-700" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              <Skeleton variant="text" width={100} height={16} className="bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSkeleton;
