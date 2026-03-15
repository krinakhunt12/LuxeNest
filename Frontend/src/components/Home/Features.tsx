import React from 'react';
import { Truck, Shield, Heart, Award, Sparkles, Clock } from 'lucide-react';
import { useFeatures, useFeatureInteraction } from '../../hooks/useFeatures';
import Skeleton from '../Common/Skeleton';
import FeaturesSkeleton from './FeaturesSkeleton';

const iconMap = {
  Truck,
  Shield,
  Heart,
  Award,
  Sparkles,
  Clock,
};

interface Feature {
  id: number;
  icon: string; // Changed from keyof typeof iconMap to string to match API response
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const Features: React.FC = () => {
  const { data: features, isLoading, error } = useFeatures();
  const featureInteraction = useFeatureInteraction();

  const handleFeatureClick = async (featureId: number) => {
    try {
      await featureInteraction.mutateAsync(featureId);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  if (isLoading) {
    return <FeaturesSkeleton />;
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center">
            <p className="text-red-600">Failed to load features. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 serif">Why Choose LuxeNest</h2>
          <div className="w-16 sm:w-20 h-1 bg-[#D4AF37] mx-auto mb-6 animate-scale-in"></div>
          <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl">
            Experience the perfect blend of luxury, comfort, and sustainability in every piece we create.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {features?.map((feature: Feature, index: number) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <div
                key={feature.id}
                onClick={() => handleFeatureClick(feature.id)}
                className="group text-center p-6 sm:p-8 lg:p-10 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex items-center justify-center w-14 sm:w-16 lg:w-20 h-14 sm:h-16 lg:h-20 rounded-full ${feature.bgColor} mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300 animate-float`}>
                  <Icon 
                    size={28} 
                    className={`${feature.color} sm:w-7 sm:h-7 lg:w-8 lg:h-8 animate-pulse`} 
                  />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 serif group-hover:text-[#D4AF37] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base group-hover:text-gray-800 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
