import Hero from "../components/Home/Hero";
import { Link } from "react-router-dom";
import { useHomeData } from "../hooks/useProducts";
import ProductCard from "../components/Products/ProductCard";
import { ArrowRight } from "lucide-react";

export const Home: React.FC = () => {
  const { data: homeData, isLoading } = useHomeData();
  const categories = homeData?.categories || [];
  const featuredProducts = homeData?.featuredProducts || [];

  return (
    <div>
      <Hero />

      {/* Categories Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 serif">Shop by Category</h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto mb-6 animate-scale-in"></div>
            <p className="text-gray-500 max-w-xl mx-auto">Explore our meticulously curated collections designed to bring elegance and functionality to every room in your home.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {categories.map((cat: any, index: number) => (
                <Link
                  to={`/shop?cat=${cat._id || cat.id}`}
                  key={cat._id || cat.id}
                  className="relative group cursor-pointer overflow-hidden aspect-[4/3] animate-fade-in-up hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 serif tracking-wide">{cat.name}</h3>
                    <span className="text-xs uppercase tracking-[0.2em] font-medium mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">{cat.count || 0} Items</span>
                    <div className="px-6 py-2 border border-white text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all hover-scale">Explore</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 animate-fade-in-up">
            <div className="text-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 serif">New Arrivals</h2>
              <div className="w-20 h-1 bg-[#D4AF37] mb-6 animate-scale-in"></div>
            </div>
            <Link to="/shop" className="text-sm font-bold uppercase tracking-widest flex items-center group mb-6 md:mb-0 hover-scale transition-all">
              View All Collection <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
            </Link>
          </div>

          {productsLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {featuredProducts.slice(0, 8).map((p: any, index: number) => (
                <div
                  key={p._id || p.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};