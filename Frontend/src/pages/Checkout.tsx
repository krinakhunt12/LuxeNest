import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight, CreditCard, Loader2 } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useAuth } from "../contexts/AuthContext";
import { orderService, OrderInput } from "../services/orderService";
import toast from "react-hot-toast";

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getItems, getTotalPrice, clearCart } = useCartStore();
  const items = getItems();

  const [loading, setLoading] = useState(false);
  const [isPlaced, setIsPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: user?.phone || "",
    addressLine1: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const subtotal = getTotalPrice();
  const shipping = subtotal > 999 ? 0 : 50;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const orderInput: OrderInput = {
        items: items.map(item => ({
          product: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          selectedColor: item.selectedColor,
          image: item.image
        })),
        shippingAddress: {
          name: `${shippingData.firstName} ${shippingData.lastName}`,
          phone: shippingData.phone,
          addressLine1: shippingData.addressLine1,
          city: shippingData.city,
          state: shippingData.state,
          zipCode: shippingData.zipCode,
          country: "India"
        },
        paymentMethod: 'CARD' // Default for this demo
      };

      const result = await orderService.createOrder(orderInput);
      setOrderId(result.orderId);
      setIsPlaced(true);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (isPlaced) {
    return (
      <div className="py-40 text-center container mx-auto px-4">
        <div className="animate-in zoom-in duration-500">
          <CheckCircle2 size={80} className="text-green-500 mx-auto mb-8" />
          <h1 className="text-4xl md:text-6xl font-bold serif mb-4">Order Confirmed</h1>
          <p className="text-gray-500 text-lg mb-4">Thank you for choosing LuxeNest.</p>
          <p className="text-sm font-mono bg-gray-100 inline-block px-4 py-2 rounded mb-12">
            Order ID: {orderId}
          </p>
          <br />
          <Link to="/shop" className="bg-[#1F2937] text-white px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-40 text-center">
        <p className="text-gray-500 mb-8">Your cart is empty.</p>
        <Link to="/shop" className="bg-[#1F2937] text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="py-24 bg-[#FAFAFA] min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <h1 className="text-4xl font-bold serif mb-8">Checkout</h1>
              <div className="bg-white p-8 rounded-xl shadow-sm space-y-8">
                <div>
                  <h3 className="text-lg font-bold serif mb-6 pb-2 border-b">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="email"
                      type="email"
                      placeholder="Email address"
                      value={shippingData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 px-4 py-3 rounded outline-none focus:border-[#D4AF37]"
                      required
                    />
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Phone number"
                      value={shippingData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 px-4 py-3 rounded outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold serif mb-6 pb-2 border-b">Shipping Address</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      name="firstName"
                      type="text"
                      placeholder="First name"
                      value={shippingData.firstName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 px-4 py-3 rounded outline-none focus:border-[#D4AF37]"
                      required
                    />
                    <input
                      name="lastName"
                      type="text"
                      placeholder="Last name"
                      value={shippingData.lastName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 px-4 py-3 rounded outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>
                  <input
                    name="addressLine1"
                    type="text"
                    placeholder="Address line 1"
                    value={shippingData.addressLine1}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 px-4 py-3 rounded outline-none focus:border-[#D4AF37] mb-4"
                    required
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      name="city"
                      type="text"
                      placeholder="City"
                      value={shippingData.city}
                      onChange={handleInputChange}
                      className="col-span-1 border border-gray-200 px-4 py-3 rounded outline-none focus:border-[#D4AF37]"
                      required
                    />
                    <input
                      name="state"
                      type="text"
                      placeholder="State"
                      value={shippingData.state}
                      onChange={handleInputChange}
                      className="col-span-1 border border-gray-200 px-4 py-3 rounded outline-none focus:border-[#D4AF37]"
                      required
                    />
                    <input
                      name="zipCode"
                      type="text"
                      placeholder="Zip code"
                      value={shippingData.zipCode}
                      onChange={handleInputChange}
                      className="col-span-1 border border-gray-200 px-4 py-3 rounded outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold serif mb-6 pb-2 border-b">Payment Method</h3>
                  <div className="border border-gray-200 p-4 rounded bg-gray-50 flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <CreditCard size={20} className="text-gray-400" />
                      <span className="text-sm font-medium">Credit / Debit Card</span>
                    </div>
                    <div className="flex space-x-2">
                      <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-4" alt="Visa" />
                      <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-4" alt="Mastercard" />
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 text-blue-700 text-xs rounded mb-4">
                    This is a demo. No actual payment will be processed.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-xl shadow-sm sticky top-32">
              <h3 className="text-xl font-bold serif mb-8">Order Summary</h3>
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                {items.map(item => (
                  <div key={`${item.id}-${item.selectedColor}`} className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-50 rounded overflow-hidden">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                      </div>
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-gray-400 text-xs">Qty: {item.quantity} | {item.selectedColor}</p>
                      </div>
                    </div>
                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-bold">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-xl pt-4 border-t border-gray-100">
                  <span className="font-bold serif">Total</span>
                  <span className="font-bold text-[#D4AF37]">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1F2937] text-white py-5 font-bold uppercase tracking-widest text-xs hover:bg-[#D4AF37] transition-all flex items-center justify-center group disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>Place Order <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};