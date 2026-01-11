import React from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    RefreshCw,
    LayoutGrid,
    AlertTriangle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface CategoriesProps {
    categories: any[];
    loading: boolean;
    onDelete: (id: string) => void;
    onEdit: (category: any) => void;
    onAddNew: () => void;
    onRefresh: () => void;
    pagination?: {
        total: number;
        page: number;
        pages: number;
        limit: number;
    };
    onPageChange: (page: number) => void;
}



const Categories: React.FC<CategoriesProps> = ({
    categories,
    loading,
    onDelete,
    onEdit,
    onAddNew,
    onRefresh,
    pagination,
    onPageChange
}) => {

    const { t } = useTranslation();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Secion */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#1F2937] md:text-4xl serif">Management</h1>
                    <p className="text-gray-400 mt-2 text-sm font-medium">Manage your product categories and collections</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onRefresh}
                        className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-[#D4AF37] rounded-xl transition-all shadow-sm group"
                    >
                        <RefreshCw size={20} className={`group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={onAddNew}
                        className="px-6 py-3 bg-[#1F2937] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all flex items-center shadow-lg shadow-[#1F2937]/10"
                    >
                        <Plus size={18} className="mr-2" />
                        Add Category
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center">
                            <LayoutGrid className="text-[#D4AF37]" size={24} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Categories</span>
                    </div>
                    <p className="text-3xl font-bold text-[#1F2937]">{categories.length}</p>
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                <th className="px-8 py-5">Category</th>
                                <th className="px-6 py-5">Products</th>
                                <th className="px-6 py-5">Display Order</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-8 py-6"><div className="h-12 w-48 bg-gray-100 rounded-xl" /></td>
                                        <td className="px-6 py-6"><div className="h-6 w-12 bg-gray-100 rounded-lg" /></td>
                                        <td className="px-6 py-6"><div className="h-6 w-12 bg-gray-100 rounded-lg" /></td>
                                        <td className="px-6 py-6"><div className="h-6 w-16 bg-gray-100 rounded-full" /></td>
                                        <td className="px-8 py-6"><div className="h-10 w-10 bg-gray-100 rounded-lg ml-auto" /></td>
                                    </tr>
                                ))
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                <AlertTriangle size={32} className="text-gray-300" />
                                            </div>
                                            <div>
                                                <p className="text-[#1F2937] font-bold">No categories found</p>
                                                <p className="text-gray-400 text-sm">Create your first category to start organizing products</p>
                                            </div>
                                            <button
                                                onClick={onAddNew}
                                                className="mt-4 px-6 py-3 bg-[#1F2937] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all"
                                            >
                                                Create First Category
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cat) => (
                                    <tr key={cat._id || cat.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 group-hover:border-[#D4AF37]/30 transition-colors">
                                                    <img
                                                        src={cat.image || 'https://via.placeholder.com/150'}
                                                        alt={cat.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#1F2937] text-sm group-hover:text-[#D4AF37] transition-colors">{cat.name}</p>
                                                    <p className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">{cat.description || 'No description'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="text-sm font-bold text-gray-500">{cat.count || 0} items</span>
                                        </td>
                                        <td className="px-6 py-6 font-medium text-gray-500">#{cat.displayOrder || 0}</td>
                                        <td className="px-6 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${cat.isActive
                                                ? 'bg-green-50 text-green-600'
                                                : 'bg-red-50 text-red-600'
                                                }`}>
                                                {cat.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Menu as="div" className="relative inline-block text-left">
                                                <Menu.Button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                                                    <MoreVertical size={20} />
                                                </Menu.Button>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-2xl shadow-2xl border border-gray-100 focus:outline-none z-10 divide-y divide-gray-50">
                                                        <div className="py-2">
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <button
                                                                        onClick={() => onEdit(cat)}
                                                                        className={`${active ? 'bg-gray-50 text-[#D4AF37]' : 'text-[#1F2937]'} flex items-center w-full px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors`}
                                                                    >
                                                                        <Edit size={16} className="mr-3" />
                                                                        Edit Category
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                        </div>
                                                        <div className="py-2">
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <button
                                                                        onClick={() => onDelete(cat._id || cat.id)}
                                                                        className={`${active ? 'bg-red-50 text-red-600' : 'text-red-500'} flex items-center w-full px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors`}
                                                                    >
                                                                        <Trash2 size={16} className="mr-3" />
                                                                        Delete
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                        </div>
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
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

export default Categories;
