import React, { useState, useEffect } from 'react';

const BrandShowcase: React.FC = () => {
  const [currentPosition, setCurrentPosition] = useState(0);

  const brands = [
    { name: 'Architectural Digest', logo: 'AD' },
    { name: 'Elle Decor', logo: 'ED' },
    { name: 'Vogue Living', logo: 'VL' },
    { name: 'House Beautiful', logo: 'HB' },
    { name: 'Interior Design', logo: 'ID' },
    { name: 'Veranda', logo: 'V' },
    { name: 'Traditional Home', logo: 'TH' },
    { name: 'Better Homes', logo: 'BH' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPosition((prev) => (prev + 1) % brands.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [brands.length]);

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 serif">As Featured In</h2>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto animate-scale-in"></div>
          <p className="text-gray-500 mt-4">Trusted by leading design publications worldwide</p>
        </div>

        {/* Scrolling Brand Logos */}
        <div className="relative">
          <div className="flex overflow-hidden">
            <div 
              className="flex space-x-12 animate-slide-in-right"
              style={{ 
                transform: `translateX(-${currentPosition * 150}px)`,
                transition: 'transform 0.5s ease-in-out'
              }}
            >
              {[...brands, ...brands].map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className="flex-shrink-0 group cursor-pointer"
                >
                  <div className="w-32 h-20 bg-white rounded-lg shadow-md flex items-center justify-center hover:shadow-xl transition-all duration-300 hover-lift hover-scale">
                    <div className="text-2xl font-bold text-gray-400 group-hover:text-[#D4AF37] transition-colors duration-300">
                      {brand.logo}
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2 group-hover:text-gray-700 transition-colors duration-300">
                    {brand.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Static Grid Alternative */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {brands.slice(0, 8).map((brand, index) => (
            <div
              key={brand.name}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-lg transition-all duration-300 hover-lift">
                <div className="text-xl font-bold text-gray-400 group-hover:text-[#D4AF37] transition-colors duration-300 mb-2">
                  {brand.logo}
                </div>
                <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                  {brand.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-400 animate-pulse">
            Join thousands of satisfied customers who trust LuxeNest
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;
