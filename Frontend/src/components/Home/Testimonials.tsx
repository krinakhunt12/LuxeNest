import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { useTestimonials } from '../../hooks/useTestimonials';
import TestimonialsSkeleton from './TestimonialsSkeleton';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  image: string;
}

const Testimonials: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const { data: testimonials, isLoading, error } = useTestimonials();

  useEffect(() => {
    if (testimonials && testimonials.length > 0) {
      const timer = setInterval(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [testimonials]);

  const next = () => {
    if (testimonials) {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }
  };
  
  const prev = () => {
    if (testimonials) {
      setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  const goToSlide = (index: number) => setCurrent(index);

  if (isLoading) {
    return <TestimonialsSkeleton />;
  }

  if (error || !testimonials || testimonials.length === 0) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Failed to load testimonials. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 serif">What Our Customers Say</h2>
          <div className="w-16 sm:w-20 h-1 bg-[#D4AF37] mx-auto mb-6 animate-scale-in"></div>
          <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl">
            Real stories from real customers who have transformed their spaces with LuxeNest.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-3xl">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((testimonial: Testimonial, index: number) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-12">
                    <div className="flex items-center justify-center mb-6">
                      <Quote className="text-[#D4AF37] animate-pulse" size={32} />
                    </div>
                    
                    <div className="flex justify-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="text-yellow-400 fill-current animate-scale-in" size={16} style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>

                    <p className="text-gray-700 text-center text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8 italic animate-fade-in-up">
                      "{testimonial.text}"
                    </p>

                    <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 sm:border-3 border-[#D4AF37] animate-scale-in"
                      />
                      <div className="text-center">
                        <h4 className="font-bold text-base sm:text-lg md:text-xl serif">{testimonial.name}</h4>
                        <p className="text-gray-500 text-xs sm:text-sm">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 md:-translate-x-6 p-2 sm:p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover-scale hover-glow z-10"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <button 
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 md:translate-x-6 p-2 sm:p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover-scale hover-glow z-10"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>

          {/* Indicators */}
          <div className="flex justify-center space-x-2 mt-6 sm:mt-8">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all hover-scale ${current === index ? 'bg-[#D4AF37] scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
