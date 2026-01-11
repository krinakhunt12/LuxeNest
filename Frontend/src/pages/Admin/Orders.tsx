import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Listbox, Transition } from '@headlessui/react';
import {
    Search,
    Eye,
    Download,
    Filter,
    ShoppingBag,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    RefreshCw,
    ChevronDown,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface OrdersProps {
    orders: any[];
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onRefresh: () => void;
    onView: (orderId: string) => void;
    onStatusUpdate: (orderId: string, newStatus: string) => void;
    onDownloadCsv: () => void;
    pagination?: {
        total: number;
        page: number;
        pages: number;
        limit: number;
    };
    onPageChange: (page: number) => void;
}

const Orders: React.FC<OrdersProps> = ({
    orders,
    loading,
    searchTerm,
    setSearchTerm,
    onRefresh,
    onView,
    onStatusUpdate,
    onDownloadCsv,
    pagination,
    onPageChange
}) => {
    const { t } = useTranslation();

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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'DELIVERED': return <CheckCircle2 size={12} className="mr-1.5" />;
            case 'SHIPPED': return <Truck size={12} className="mr-1.5" />;
            case 'PENDING': return <Clock size={12} className="mr-1.5" />;
            case 'CANCELLED': return <XCircle size={12} className="mr-1.5" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold serif text-[#1F2937]">{t('admin.orders.title')}</h1>
                    <p className="text-gray-500 text-sm mt-1">{t('admin.orders.subtitle')}</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={onRefresh}
                        className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-[#D4AF37] rounded-xl shadow-sm transition-all cursor-pointer"
                        disabled={loading}
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>

                    <button
                        onClick={onDownloadCsv}
                        className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-100 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm cursor-pointer">
                        <Download size={18} />
                        <span>Download CSV</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex-1 max-w-md focus-within:ring-2 focus-within:ring-[#D4AF37]/10 transition-all">
                    <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2.5 rounded-xl flex-1 focus-within:bg-white border border-transparent focus-within:border-[#D4AF37]/20 transition-all">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('admin.orders.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full font-medium text-[#1F2937] placeholder-gray-400"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-5 py-3.5 bg-gray-50 text-gray-500 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors border border-gray-100 cursor-pointer">
                        <Filter size={18} />
                        <span>Filter Status</span>
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                <th className="px-8 py-5 border-b border-gray-100">{t('admin.orders.table.id')}</th>
                                <th className="px-6 py-5 border-b border-gray-100">{t('admin.orders.table.customer')}</th>
                                <th className="px-6 py-5 border-b border-gray-100">{t('admin.orders.table.date')}</th>
                                <th className="px-6 py-5 border-b border-gray-100">{t('admin.orders.table.status')}</th>
                                <th className="px-6 py-5 border-b border-gray-100">{t('admin.orders.table.items')}</th>
                                <th className="px-6 py-5 text-right border-b border-gray-100">{t('admin.orders.table.total')}</th>
                                <th className="px-8 py-5 text-center border-b border-gray-100">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center text-gray-400">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ShoppingBag size={32} className="opacity-20" />
                                        </div>
                                        <p className="text-sm font-medium">No orders found matching "{searchTerm}"</p>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id || order._id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <span className="text-xs font-bold text-[#D4AF37] font-mono bg-[#D4AF37]/5 px-2 py-1 rounded-md border border-[#D4AF37]/10">
                                                {order.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 border border-gray-100 group-hover:bg-[#1F2937] group-hover:text-white transition-colors">
                                                    {order.customer?.charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold text-[#1F2937]">{order.customer}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-500 font-medium">{order.date}</td>
                                        <td className="px-6 py-5">
                                            <Listbox
                                                value={order.status}
                                                onChange={(value) => onStatusUpdate(order.id, value)}
                                            >
                                                <div className="relative">
                                                    <Listbox.Button className={`inline-flex items-center px-4 py-2 rounded-full text-[10px] font-bold border transition-all hover:shadow-sm focus:outline-none ${getStatusStyle(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        <span className="uppercase tracking-widest">{order.status}</span>
                                                        <ChevronDown size={12} className="ml-2 opacity-50" />
                                                    </Listbox.Button>
                                                    <Transition
                                                        as={Fragment}
                                                        leave="transition ease-in duration-100"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0"
                                                    >
                                                        <Listbox.Options className="absolute z-20 mt-2 py-2 overflow-auto bg-white border border-gray-100 rounded-2xl shadow-xl max-h-60 focus:outline-none w-40">
                                                            {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                                                                <Listbox.Option
                                                                    key={status}
                                                                    className={({ active }) =>
                                                                        `relative cursor-pointer select-none py-2.5 px-4 transition-colors ${active ? 'bg-gray-50' : ''
                                                                        }`
                                                                    }
                                                                    value={status}
                                                                >
                                                                    {({ selected }) => (
                                                                        <div className="flex items-center">
                                                                            <div className={`w-2 h-2 rounded-full mr-3 ${status === 'DELIVERED' ? 'bg-green-500' :
                                                                                status === 'SHIPPED' ? 'bg-blue-500' :
                                                                                    status === 'PROCESSING' ? 'bg-purple-500' :
                                                                                        status === 'CANCELLED' ? 'bg-red-500' : 'bg-yellow-500'
                                                                                }`} />
                                                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${selected ? 'text-[#D4AF37]' : 'text-gray-600'}`}>
                                                                                {status}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </Listbox.Option>
                                                            ))}
                                                        </Listbox.Options>
                                                    </Transition>
                                                </div>
                                            </Listbox>
                                        </td>

                                        <td className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">{order.items} items</td>
                                        <td className="px-6 py-5 text-right">
                                            <span className="text-sm font-bold text-[#1F2937]">${order.total?.toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <button
                                                onClick={() => onView(order.id)}
                                                className="p-2.5 hover:bg-white rounded-xl text-gray-400 hover:text-[#1F2937] transition-all hover:shadow-md border border-transparent hover:border-gray-100 cursor-pointer"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {pagination && pagination.pages > 1 && (
                    <div className="px-8 py-5 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            Page {pagination.page} of {pagination.pages}
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => onPageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-[#D4AF37] disabled:opacity-30 disabled:hover:text-gray-400 transition-all shadow-sm cursor-pointer"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <div className="flex items-center space-x-1">
                                {[...Array(pagination.pages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    if (
                                        pageNum === 1 ||
                                        pageNum === pagination.pages ||
                                        (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                                    ) {
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => onPageChange(pageNum)}
                                                className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${pagination.page === pageNum
                                                    ? 'bg-[#1F2937] text-white shadow-md'
                                                    : 'bg-white border border-gray-100 text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    } else if (
                                        pageNum === pagination.page - 2 ||
                                        pageNum === pagination.page + 2
                                    ) {
                                        return <span key={pageNum} className="text-gray-300 px-1">...</span>;
                                    }
                                    return null;
                                })}
                            </div>

                            <button
                                onClick={() => onPageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.pages}
                                className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-[#D4AF37] disabled:opacity-30 disabled:hover:text-gray-400 transition-all shadow-sm cursor-pointer"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
