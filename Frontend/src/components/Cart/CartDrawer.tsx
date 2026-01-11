import React from 'react';
import { X, ShoppingBag, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string, color?: string) => void;
  onUpdateQty: (id: string, delta: number, color?: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onUpdateQty }) => {
  const navigate = useNavigate();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckoutClick = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto animate-fade-in' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0 animate-slide-in-right' : 'translate-x-full'}`}>
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <div className="flex items-center space-x-3">
            <ShoppingBag size={20} className="text-[#D4AF37]" />
            <h2 className="font-bold uppercase tracking-widest text-sm">Shopping Cart ({items.length})</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-500 mb-8">Your cart is currently empty.</p>
              <button
                onClick={onClose}
                className="bg-[#1F2937] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item, index) => (
                <div
                  key={`${item.id}-${item.selectedColor}`}
                  className="flex space-x-4 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-gray-100 hover-scale transition-transform">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between mb-1">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <button
                        onClick={() => onRemove(item.id, item.selectedColor)}
                        className="text-gray-400 hover:text-red-500 transition-all hover-scale animate-shake"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{item.selectedColor} | {item.materials?.[0] || 'Premium'}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center border border-gray-200">
                        <button
                          onClick={() => onUpdateQty(item.id, -1, item.selectedColor)}
                          className="px-2 py-1 hover:bg-gray-100 transition-colors"
                        >-</button>
                        <span className="px-3 py-1 text-xs">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQty(item.id, 1, item.selectedColor)}
                          className="px-2 py-1 hover:bg-gray-100 transition-colors"
                        >+</button>
                      </div>
                      <span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t space-y-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-gray-400 text-center italic">Shipping and taxes calculated at checkout.</p>
            <button
              onClick={handleCheckoutClick}
              className="w-full bg-[#D4AF37] text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#1F2937] transition-all flex items-center justify-center group"
            >
              Checkout <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
