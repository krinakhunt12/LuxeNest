import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/Products/ProductCard";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlistStore } from "../store/useWishlistStore";
import { useCartStore } from "../store/useCartStore";
import toast from "react-hot-toast";

export const Wishlist: React.FC = () => {
  const { getItems, removeItem } = useWishlistStore();
  const addItemToCart = useCartStore(state => state.addItem);

  const wishlistItems = getItems();

  const handleMoveToCart = (product: any) => {
    addItemToCart(product, 1, product.colors[0]);
    removeItem(product.id);
    toast.success(`${product.name} moved to cart!`);
  };

  return (
    <div className="py-24 bg-white min-h-[60vh]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl font-bold serif mb-4">Your Wishlist</h1>
          <div className="w-20 h-1 bg-[#D4AF37] mx-auto"></div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="max-w-4xl mx-auto bg-gray-50 p-16 text-center rounded-2xl border-2 border-dashed border-gray-200 animate-fade-in-up">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Heart size={40} className="text-gray-200" />
            </div>
            <h2 className="text-2xl font-bold serif mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-10 max-w-md mx-auto">Discover our collection of premium furniture and save your favorites to view them later.</p>
            <Link to="/shop" className="bg-[#1F2937] text-white px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all flex items-center justify-center inline-flex group">
              Explore Collections <ShoppingBag size={18} className="ml-2 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistItems.map((p, index) => (
              <div
                key={p.id}
                className="relative group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={p as any} />
                <button
                  onClick={() => handleMoveToCart(p)}
                  className="absolute bottom-6 left-6 right-6 bg-[#D4AF37] text-white px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#1F2937] transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-2 transform translate-y-2 group-hover:translate-y-0 shadow-xl"
                >
                  <ShoppingBag size={16} />
                  <span>Move to Cart</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};