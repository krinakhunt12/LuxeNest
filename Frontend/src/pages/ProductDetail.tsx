import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";
import { Heart, Star, ArrowRight } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import toast from "react-hot-toast";

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useProduct(id as string);
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);

  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  if (isLoading) return (
    <div className="py-40 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
      <p className="text-gray-400 font-medium">Loading product details...</p>
    </div>
  );

  if (isError || !product) return (
    <div className="py-40 text-center">
      <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
      <p className="text-gray-500">The product you are looking for does not exist or has been removed.</p>
    </div>
  );

  const isWishlisted = product ? isInWishlist(product._id || product.id) : false;

  const handleAddToCart = () => {
    addItem(product, qty, selectedColor);
    toast.success(`${qty}x ${product.name} (${selectedColor || 'Default'}) added to cart!`);
  };

  const handleToggleWishlist = () => {
    toggleItem(product);
    if (!isWishlisted) {
      toast.success(`${product.name} added to wishlist!`);
    } else {
      toast.success(`${product.name} removed from wishlist!`);
    }
  };

  // Safe image handling
  const mainImage = product.images?.[0]?.url || product.image || 'https://via.placeholder.com/600x600?text=No+Image';

  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 overflow-hidden relative rounded-lg shadow-sm">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
              <button
                onClick={handleToggleWishlist}
                className={`absolute top-6 right-6 p-4 rounded-full shadow-lg transition-all ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-[#D4AF37]'}`}
              >
                <Heart size={24} fill={isWishlisted ? "white" : "none"} />
              </button>
            </div>
            {/* Thumbnail Gallery (if multiple images) */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: any, idx: number) => (
                  <div key={idx} className="aspect-square rounded-md overflow-hidden cursor-pointer border hover:border-[#D4AF37]">
                    <img src={img.url} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-2">
                {typeof product.category === 'object' ? product.category?.name : product.category}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold serif mb-4">{product.name}</h1>
              <div className="flex items-center space-x-2 text-[#D4AF37]">
                <div className="flex">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} />)}
                </div>
                <span className="text-xs text-gray-400">({product.reviewsCount || 0} Customer Reviews)</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold">${product.price?.toFixed(2)}</span>
              {product.oldPrice && <span className="text-xl text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>}
            </div>

            <p className="text-gray-600 leading-relaxed max-w-lg">{product.description}</p>

            <div className="space-y-6">
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest font-bold">Select Color: <span className="text-gray-400 font-normal">{selectedColor}</span></label>
                  <div className="flex space-x-3">
                    {product.colors.map((color: string) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-[#D4AF37] scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: color.toLowerCase().replace(' ', '') }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4 pt-4">
                <div className="flex items-center border border-gray-200">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 hover:bg-gray-100">-</button>
                  <span className="px-6 py-3 font-bold">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="px-4 py-3 hover:bg-gray-100">+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-grow bg-[#1F2937] text-white py-4 px-8 font-bold uppercase tracking-widest text-xs hover:bg-[#D4AF37] transition-all flex items-center justify-center group"
                >
                  Add to Cart <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 text-xs text-gray-500 space-y-2">
              <p>SKU: {product.sku || 'N/A'}</p>
              <p>Category: {typeof product.category === 'object' ? product.category?.name : product.category}</p>
              {product.tags && <p>Tags: {product.tags.join(', ')}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};