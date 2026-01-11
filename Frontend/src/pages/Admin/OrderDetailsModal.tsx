import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Package, Truck, CreditCard, Calendar, User, MapPin, Phone, Hash } from 'lucide-react';

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
    if (!order) return null;

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'bg-green-50 text-green-700 border-green-100';
            case 'SHIPPED': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'PROCESSING': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl transition-all border border-gray-100">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-[#1F2937] rounded-2xl flex items-center justify-center text-white">
                                            <Package size={24} />
                                        </div>
                                        <div>
                                            <Dialog.Title as="h3" className="text-2xl font-bold serif text-[#1F2937]">
                                                Order Details
                                            </Dialog.Title>
                                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                                                ID: {order._id || order.id}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {/* Left Column: Items */}
                                    <div className="md:col-span-2 space-y-6">
                                        <div>
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center">
                                                <Hash size={14} className="mr-2" />
                                                Order Items
                                            </h4>
                                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                {(order.items || order.orderItems || []).map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center space-x-4 bg-gray-50/50 p-4 rounded-3xl border border-gray-100 group hover:border-[#D4AF37]/30 transition-all">
                                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
                                                            <img
                                                                src={item.image || 'https://via.placeholder.com/150'}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-bold text-[#1F2937]">{item.name}</p>
                                                            <div className="flex items-center space-x-4 mt-1">
                                                                <span className="text-xs text-gray-400 font-medium">Qty: {item.quantity}</span>
                                                                {item.selectedColor && (
                                                                    <div className="flex items-center space-x-1">
                                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.selectedColor }} />
                                                                        <span className="text-xs text-gray-400 font-medium">{item.selectedColor}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-[#1F2937]">${(item.price * item.quantity).toLocaleString()}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">${item.price.toLocaleString()} each</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Summary */}
                                        <div className="bg-[#1F2937] text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-6 font-mono">Payment Summary</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="opacity-60">Subtotal</span>
                                                    <span className="font-bold">${(order.subtotal || order.totalAmount).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="opacity-60">Shipping</span>
                                                    <span className="font-bold text-[#D4AF37]">Free</span>
                                                </div>
                                                <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xl">
                                                    <span className="font-serif">Total Amount</span>
                                                    <span className="font-bold text-[#D4AF37]">${order.totalAmount?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Order Info */}
                                    <div className="space-y-6">
                                        {/* Status & Date */}
                                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                            <div className="mb-4">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(order.orderStatus)}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center text-sm">
                                                    <Calendar size={16} className="text-gray-400 mr-3" />
                                                    <span className="text-gray-600 font-medium">
                                                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <CreditCard size={16} className="text-gray-400 mr-3" />
                                                    <span className="text-gray-600 font-medium font-mono uppercase tracking-wider">{order.paymentMethod}</span>
                                                    <span className={`ml-2 px-2 py-0.5 rounded text-[8px] font-bold ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                        {order.paymentStatus}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Shipping Info */}
                                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] flex items-center">
                                                <Truck size={14} className="mr-2" />
                                                Shipping Details
                                            </h4>
                                            <div className="space-y-4">
                                                <div className="flex items-start">
                                                    <User size={16} className="text-gray-400 mr-3 mt-1" />
                                                    <div>
                                                        <p className="text-sm font-bold text-[#1F2937]">{order.shippingAddress?.name || order.user?.name}</p>
                                                        <div className="flex items-center mt-1 text-gray-500">
                                                            <Phone size={12} className="mr-1.5" />
                                                            <span className="text-xs font-medium">{order.shippingAddress?.phone || 'No phone provided'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <MapPin size={16} className="text-gray-400 mr-3 mt-1" />
                                                    <div className="text-xs text-gray-500 font-medium leading-relaxed">
                                                        <p>{order.shippingAddress?.addressLine1}</p>
                                                        {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress?.addressLine2}</p>}
                                                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                                                        <p>{order.shippingAddress?.zipCode}, {order.shippingAddress?.country}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Notes if any */}
                                        {order.notes && (
                                            <div className="bg-yellow-50/50 p-6 rounded-3xl border border-yellow-100">
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-yellow-600 mb-2">Customer Notes</h4>
                                                <p className="text-xs text-yellow-700 font-medium leading-relaxed italic">
                                                    "{order.notes}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default OrderDetailsModal;
