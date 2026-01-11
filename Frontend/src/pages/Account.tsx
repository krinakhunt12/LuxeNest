import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, User as UserIcon, Heart, Settings, LogOut, RefreshCw, X, Eye, XCircle } from "lucide-react";
import { ProfileSettings } from "./ProfileSettings";
import { Preferences } from "./Preferences";
import { userService } from "../services/userService";
import toast from "react-hot-toast";

type AccountSection = 'orders' | 'profile' | 'wishlist' | 'preferences';

export const Account: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AccountSection>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeSection === 'orders') {
      fetchOrders();
    }
  }, [activeSection]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await userService.getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancellingId(orderId);
      await userService.cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      fetchOrders(); // Refresh the list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const handleWishlistClick = () => {
    navigate('/wishlist');
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-700';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700';
      case 'PROCESSING': return 'bg-purple-100 text-purple-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const canCancel = (status: string) => {
    return ['PENDING', 'PROCESSING', 'CONFIRMED'].includes(status);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'orders':
        return (
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold serif">Recent Orders</h3>
              <button
                onClick={fetchOrders}
                disabled={loadingOrders}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                title="Refresh orders"
              >
                <RefreshCw size={16} className={loadingOrders ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
            {loadingOrders ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package size={48} className="mx-auto mb-4 opacity-20" />
                <p>No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b text-xs uppercase tracking-widest text-gray-400">
                    <tr>
                      <th className="pb-4 font-normal">Date</th>
                      <th className="pb-4 font-normal">Status</th>
                      <th className="pb-4 font-normal">Items</th>
                      <th className="pb-4 font-normal">Total</th>
                      <th className="pb-4 font-normal">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map((order) => (
                      <tr key={order._id || order.id}>
                        <td className="py-4 text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyle(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="py-4 text-gray-500">
                          {order.items?.length || 0} items
                        </td>
                        <td className="py-4 font-bold">
                          ${order.totalAmount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 hover:bg-gray-100 rounded-lg text-[#D4AF37] transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            {canCancel(order.orderStatus) && (
                              <button
                                onClick={() => handleCancelOrder(order._id || order.id)}
                                disabled={cancellingId === (order._id || order.id)}
                                className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors cursor-pointer disabled:opacity-30"
                                title="Cancel Order"
                              >
                                {cancellingId === (order._id || order.id) ? (
                                  <RefreshCw size={18} className="animate-spin" />
                                ) : (
                                  <XCircle size={18} />
                                )}
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                      <h3 className="text-xl font-bold serif">Order Details</h3>
                      <p className="text-sm text-gray-500 font-mono mt-1">
                        #{selectedOrder.orderId || (selectedOrder._id || selectedOrder.id).slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="p-6 space-y-8">
                    {/* Status Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Order Date</p>
                        <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p className="text-sm text-gray-500 mb-1">Status</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyle(selectedOrder.orderStatus)}`}>
                          {selectedOrder.orderStatus}
                        </span>
                        {canCancel(selectedOrder.orderStatus) && (
                          <button
                            onClick={async () => {
                              await handleCancelOrder(selectedOrder._id || selectedOrder.id);
                              setSelectedOrder(null);
                            }}
                            disabled={cancellingId === (selectedOrder._id || selectedOrder.id)}
                            className="mt-2 text-red-500 font-bold text-[10px] uppercase tracking-wider hover:underline cursor-pointer disabled:opacity-50"
                          >
                            {cancellingId === (selectedOrder._id || selectedOrder.id) ? 'Cancelling...' : 'Cancel Order'}
                          </button>
                        )}
                      </div>

                    </div>

                    {/* Items List */}
                    <div>
                      <h4 className="font-bold mb-4 text-gray-900 border-b pb-2">Items</h4>
                      <div className="space-y-4">
                        {selectedOrder.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex gap-4">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.name}</h3>
                                  <p className="ml-4">${item.price?.toFixed(2)}</p>
                                </div>
                                {item.selectedColor && (
                                  <p className="mt-1 text-sm text-gray-500">{item.selectedColor}</p>
                                )}
                              </div>
                              <div className="flex justify-between text-sm mt-auto">
                                <p className="text-gray-500">Qty {item.quantity}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Shipping Address */}
                      <div>
                        <h4 className="font-bold mb-3 text-gray-900 border-b pb-2">Shipping Address</h4>
                        <div className="text-sm text-gray-600 space-y-1 not-italic leading-relaxed">
                          <p className="font-medium text-gray-900">{selectedOrder.shippingAddress?.name}</p>
                          <p>{selectedOrder.shippingAddress?.addressLine1}</p>
                          {selectedOrder.shippingAddress?.addressLine2 && <p>{selectedOrder.shippingAddress?.addressLine2}</p>}
                          <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}</p>
                          <p>{selectedOrder.shippingAddress?.country}</p>
                          <p className="mt-2">Phone: {selectedOrder.shippingAddress?.phone}</p>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div>
                        <h4 className="font-bold mb-3 text-gray-900 border-b pb-2">Payment Info</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Method</span>
                            <span className="font-medium">{selectedOrder.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Payment Status</span>
                            <span className={`font-medium ${selectedOrder.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600 underline decoration-yellow-600/30'}`}>
                              {selectedOrder.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <p>Subtotal</p>
                        <p>${selectedOrder.subtotal?.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <p>Shipping</p>
                        <p>${selectedOrder.shippingCharges?.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <p>Tax</p>
                        <p>${selectedOrder.tax?.toFixed(2)}</p>
                      </div>
                      <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between text-base font-bold text-gray-900">
                        <p>Total</p>
                        <p>${selectedOrder.totalAmount?.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'profile':
        return <ProfileSettings />;
      case 'preferences':
        return <Preferences />;
      default:
        return null;
    }
  };

  return (
    <div className="py-24 bg-[#FAFAFA] min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold serif mb-8 px-4">My Account</h2>
            <button
              onClick={() => setActiveSection('orders')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'orders'
                ? 'bg-white shadow-sm font-bold text-[#D4AF37]'
                : 'hover:bg-white text-gray-500'
                }`}
            >
              <Package size={18} /> <span>Orders</span>
            </button>
            <button
              onClick={() => setActiveSection('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'profile'
                ? 'bg-white shadow-sm font-bold text-[#D4AF37]'
                : 'hover:bg-white text-gray-500'
                }`}
            >
              <UserIcon size={18} /> <span>Profile Settings</span>
            </button>
            <button
              onClick={handleWishlistClick}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white transition-all text-gray-500 rounded-lg"
            >
              <Heart size={18} /> <span>Wishlist</span>
            </button>
            <button
              onClick={() => setActiveSection('preferences')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'preferences'
                ? 'bg-white shadow-sm font-bold text-[#D4AF37]'
                : 'hover:bg-white text-gray-500'
                }`}
            >
              <Settings size={18} /> <span>Preferences</span>
            </button>
            <div className="pt-8 px-4"><Link to="/login" className="flex items-center space-x-2 text-red-500 font-bold text-xs uppercase tracking-widest"><LogOut size={16} /> <span>Logout</span></Link></div>
          </div>
          <div className="lg:col-span-3 space-y-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
