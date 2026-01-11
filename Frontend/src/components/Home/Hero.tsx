
import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'The Modern Living Collection',
    subtitle: 'Sophisticated comfort for the contemporary home',
    cta: 'Shop Living Room'
  },
  {
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Artisan Crafted Dining',
    subtitle: 'Elevate every meal with timeless pieces',
    cta: 'Explore Dining'
  },
  {
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Sanctuary of Rest',
    subtitle: 'Transform your bedroom into a peaceful retreat',
    cta: 'View Bedroom'
  }
];

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prev = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div className="relative h-[600px] md:h-[800px] overflow-hidden bg-gray-100">
      {SLIDES.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <img 
            src={slide.image} 
            alt={slide.title}
            className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-in-out ${index === current ? 'scale-100' : 'scale-105'}`}
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
            <div className={`transition-all duration-700 delay-300 transform ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h2 className="text-[#D4AF37] uppercase tracking-[0.3em] font-semibold mb-4 text-sm md:text-base animate-fade-in-down">New Collection 2024</h2>
              <h1 className="text-white text-4xl md:text-7xl font-bold mb-6 serif leading-tight animate-fade-in-up animate-delay-200">{slide.title}</h1>
              <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light animate-fade-in-up animate-delay-300">{slide.subtitle}</p>
              <Link 
                to="/shop" 
                className="inline-flex items-center bg-white text-black px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all group hover-scale animate-fade-in-up animate-delay-400"
              >
                {slide.cta} <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button 
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-2 border border-white/50 text-white rounded-full hover:bg-white hover:text-black transition-all hover-scale hover-glow"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-2 border border-white/50 text-white rounded-full hover:bg-white hover:text-black transition-all hover-scale hover-glow"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
        {SLIDES.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-12 h-1 transition-all hover-scale ${current === i ? 'bg-[#D4AF37] scale-110' : 'bg-white/40 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
