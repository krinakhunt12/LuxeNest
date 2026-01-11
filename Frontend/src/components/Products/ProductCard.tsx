import React from 'react';
import { ShoppingBag, Heart, Eye, Star, Package, Award } from 'lucide-react';
import { Product } from '../../types';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  const productId = (product as any)._id || product.id;
  const isWishlisted = isInWishlist(productId);

  const productImage = (product as any).images?.[0]?.url || product.image || 'https://via.placeholder.com/800';
  const categoryName = typeof product.category === 'object' ? (product.category as any).name : product.category;

  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, 1, product.colors?.[0]);
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = () => {
    toggleItem(product);
    if (!isWishlisted) {
      toast.success(`${product.name} added to wishlist!`);
    } else {
      toast.success(`${product.name} removed from wishlist!`);
    }
  };

  return (
    <div className="group bg-white relative animate-fade-in-up hover-lift">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2 z-20">
          {product.isNew && (
            <span className="bg-[#1F2937] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 badge-pop animate-delay-100">
              New
            </span>
          )}
          {product.isSale && (
            <span className="bg-[#D4AF37] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 badge-pop animate-delay-200">
              {discountPercentage > 0 ? `-${discountPercentage}%` : 'Sale'}
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#1F2937] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 flex items-center gap-1 badge-pop animate-delay-300">
              <Award size={10} className="animate-pulse" /> Best Seller
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="absolute top-4 right-4 z-20">
          {(product as any).stock > 0 || product.inStock ? (
            <span className="bg-green-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
              In Stock
            </span>
          ) : (
            <span className="bg-red-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 left-0 right-0 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <button
            onClick={handleAddToCart}
            disabled={(product as any).stock === 0}
            className={`w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-widest shadow-lg flex items-center justify-center hover:bg-black hover:text-white transition-all hover-scale ${(product as any).stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <ShoppingBag size={14} className="mr-2 transition-transform group-hover:scale-110" />
            {(product as any).stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>

        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 gap-2">
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full shadow-md transition-all hover-scale ${isWishlisted ? 'bg-red-500 text-white animate-bounce' : 'bg-white text-gray-500 hover:text-[#D4AF37]'}`}
          >
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} className="transition-all" />
          </button>
          <Link
            to={`/product/${productId}`}
            className="bg-white p-2 rounded-full shadow-md hover:text-[#D4AF37] transition-all hover-scale"
          >
            <Eye size={16} />
          </Link>
        </div>
      </div>

      <div className="pt-5 pb-2">
        <div className="text-center mb-2">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{categoryName}</p>
          {product.brand && (
            <p className="text-[9px] text-gray-500 mb-1">{product.brand}</p>
          )}
          <Link to={`/product/${productId}`}>
            <h3 className="text-sm font-medium hover:text-[#D4AF37] transition-colors mb-2">{product.name}</h3>
          </Link>
        </div>

        {/* Materials Preview */}
        {product.materials && product.materials.length > 0 && (
          <div className="px-2 mb-2">
            <div className="flex items-center justify-center gap-1 flex-wrap">
              <Package size={10} className="text-gray-400" />
              <span className="text-[9px] text-gray-500">
                {product.materials.slice(0, 2).join(', ')}
                {product.materials.length > 2 && ' +more'}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              fill={i < Math.floor(product.rating || 5) ? "#D4AF37" : "none"}
              color={i < Math.floor(product.rating || 5) ? "#D4AF37" : "#E5E7EB"}
            />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">({product.reviews || 0})</span>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-1">
            <span className="font-bold text-lg">${(product.price || 0).toFixed(2)}</span>
            {product.oldPrice && (
              <span className="text-gray-400 line-through text-sm">${product.oldPrice.toFixed(2)}</span>
            )}
          </div>
          {product.shippingTime && (
            <p className="text-[9px] text-gray-500">Ships in {product.shippingTime}</p>
          )}
          {product.stock !== undefined && (product as any).stock < 10 && (product as any).stock > 0 && (
            <p className="text-[9px] text-orange-500 font-semibold animate-pulse">Only {product.stock} left!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
