import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Hammer, Sparkles, Quote } from "lucide-react";

export const About: React.FC = () => {
  return (
    <div className="bg-white overflow-hidden">
      {/* Cinematic Hero */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=90" 
            alt="Interior Gallery" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-8xl font-bold serif mb-6 tracking-tight animate-fade-in-up">The Art of Living Well</h1>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed">Defining modern elegance through timeless craftsmanship since 2010.</p>
        </div>
      </section>

      {/* Philosophy Section - Layered Grid */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden rounded-sm">
                <img 
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Design Detail" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 hidden md:block w-72 aspect-square bg-white p-4 shadow-2xl rounded-sm">
                <img 
                  src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Process" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-8 lg:pl-12">
              <h4 className="text-[#D4AF37] uppercase tracking-[0.3em] font-bold text-xs">Our Heritage</h4>
              <h2 className="text-4xl md:text-6xl font-bold serif leading-tight">Beyond Simple Furnishings.</h2>
              <div className="w-16 h-1 bg-[#1F2937]"></div>
              <p className="text-gray-600 text-lg leading-relaxed">
                LuxeNest was founded in a small London atelier with a singular vision: to bridge the gap between high-end architectural design and the comfort of a private sanctuary. 
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                We believe that furniture is more than utility; it is a silent narrator of your story. Every piece in our collection is curated to evoke emotion, inspire creativity, and stand as a testament to durability.
              </p>
              <div className="pt-4">
                <Link to="/shop" className="inline-flex items-center text-sm font-bold uppercase tracking-widest border-b-2 border-[#D4AF37] pb-2 hover:text-[#D4AF37] transition-all group">
                  Discover Our Collection <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Highlights */}
      <section className="bg-[#1F2937] text-white py-24 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <Sparkles className="w-full h-full text-white" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold serif mb-6">Meticulous Detail.</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              We partner with multi-generational master artisans who treat every join, every stitch, and every finish as a work of art.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group space-y-6">
              <div className="h-80 overflow-hidden bg-white/5 rounded-sm">
                <img 
                  src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Wood" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <h3 className="text-xl font-bold serif text-[#D4AF37]">Premium Wood Sourcing</h3>
              <p className="text-gray-400 text-sm leading-relaxed">From sustainable North American Oak to hand-oiled Walnut, our timber is chosen for grain character and longevity.</p>
            </div>
            <div className="group space-y-6 mt-8 md:mt-16">
              <div className="h-80 overflow-hidden bg-white/5 rounded-sm">
                <img 
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Textiles" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <h3 className="text-xl font-bold serif text-[#D4AF37]">Exquisite Textiles</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Our velvets, linens, and leathers are sourced from European mills that adhere to the highest ecological standards.</p>
            </div>
            <div className="group space-y-6">
              <div className="h-80 overflow-hidden bg-white/5 rounded-sm">
                <img 
                  src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Finishing" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <h3 className="text-xl font-bold serif text-[#D4AF37]">Sculptural Forms</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Modern silhouettes are mathematically designed for ergonomic perfection, blending science with aesthetic beauty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Vision */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full mb-8 text-[#D4AF37]">
                <Leaf size={32} />
              </div>
              <h3 className="text-xl font-bold serif mb-4">Sustainability First</h3>
              <p className="text-gray-500 text-sm leading-relaxed">We commit to a zero-waste manufacturing process and partner with reforestation projects for every major collection sold.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full mb-8 text-[#D4AF37]">
                <Hammer size={32} />
              </div>
              <h3 className="text-xl font-bold serif mb-4">Legacy Quality</h3>
              <p className="text-gray-500 text-sm leading-relaxed">We don't build for seasons; we build for lifetimes. Our 10-year structural warranty is a testament to our confidence.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full mb-8 text-[#D4AF37]">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-bold serif mb-4">Curated Design</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Every item in our shop undergoes a rigorous design review to ensure it meets the LuxeNest aesthetic standard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Note */}
      <section className="py-24 md:py-32 bg-[#F9FAFB] border-y">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="mx-auto mb-8 text-gray-200" size={60} />
            <p className="text-2xl md:text-3xl font-light italic leading-relaxed text-gray-700 mb-10">
              "LuxeNest was born from the idea that luxury shouldn't be cold. It should be warm, inviting, and deeply personal. We design for the quiet moments as much as the grand ones."
            </p>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mb-4 border-2 border-[#D4AF37]">
                <img src="https://picsum.photos/seed/founder/100/100" alt="Founder" />
              </div>
              <h5 className="font-bold text-lg">Julian Vance</h5>
              <p className="text-xs uppercase tracking-widest text-gray-400">Founder & Creative Director</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center">
        <h2 className="text-4xl font-bold serif mb-8">Ready to transform your home?</h2>
        <Link 
          to="/shop" 
          className="bg-[#1F2937] text-white px-12 py-5 text-sm font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all rounded-sm inline-block"
        >
          Shop All Collections
        </Link>
      </section>
    </div>
  );
};