import React, { useState, useEffect, useRef } from 'react';
import { Users, Package, Star, Award } from 'lucide-react';
import { useStatistics } from '../../hooks/useStatistics';
import StatisticsSkeleton from './StatisticsSkeleton';

const iconMap = {
  Users,
  Package,
  Star,
  Award,
};

interface StatProps {
  end: number;
  duration: number;
  suffix?: string;
}

interface Stat {
  id: number;
  icon: string;
  value: number;
  suffix: string;
  label: string;
  color: string;
  bgColor: string;
}

const CountUp: React.FC<StatProps> = ({ end, duration, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      setCount(currentCount);

      if (now < endTime) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [hasStarted, end, duration]);

  return (
    <span ref={ref} className="font-bold">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const Statistics: React.FC = () => {
  const { data: stats, isLoading, error } = useStatistics();

  if (isLoading) {
    return <StatisticsSkeleton />;
  }

  if (error) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-400">Failed to load statistics. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 serif">Numbers That Speak</h2>
          <div className="w-16 sm:w-20 h-1 bg-[#D4AF37] mx-auto mb-6 animate-scale-in"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl">
            Our commitment to excellence is reflected in every metric that matters.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {stats?.map((stat: Stat, index: number) => {
            const Icon = iconMap[stat.icon as keyof typeof iconMap];
            return (
              <div
                key={stat.id}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-full ${stat.bgColor} mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300 animate-float`}>
                  <Icon size={32} className={`${stat.color} sm:w-8 sm:h-8`} />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-[#D4AF37]">
                  <CountUp end={stat.value} duration={2000} suffix={stat.suffix} />
                </div>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg font-medium">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm sm:text-base text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Statistics</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></div>
              <span>Updated Daily</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
