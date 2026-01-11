import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Plus,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    Filter,
    Package,
    AlertTriangle,
    RefreshCw,
    Upload,
    FileSpreadsheet,
    ChevronLeft,
    ChevronRight,
    Check
} from 'lucide-react';


interface ProductsProps {
    products: any[];
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    pagination?: {
        total: number;
        page: number;
        pages: number;
        limit: number;
    };
    onPageChange: (page: number) => void;
    onDelete: (id: string) => void;
    onEdit: (product: any) => void;
    onAddNew: () => void;
    onRefresh: () => void;
    onUploadExcel: (file: File) => void;
    onDownloadTemplate: () => void;
    onDeleteBulk: (ids: string[]) => void;
}

const Products: React.FC<ProductsProps> = ({
    products,
    loading,
    searchTerm,
    setSearchTerm,
    pagination,
    onPageChange,
    onDelete,
    onEdit,
    onAddNew,
    onRefresh,
    onUploadExcel,
    onDownloadTemplate,
    onDeleteBulk
}) => {

    const { t } = useTranslation();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(products.map(p => p._id || p.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
            onDeleteBulk(selectedIds);
            setSelectedIds([]);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onUploadExcel(file);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
            <p className="text-gray-400 font-medium animate-pulse">Scanning Inventory...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold serif text-[#1F2937]">{t('admin.products.title')}</h1>
                    <p className="text-gray-500 text-sm mt-1">{t('admin.products.subtitle')}</p>
                </div>
                <div className="flex space-x-3">
                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="flex items-center space-x-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-all shadow-sm border border-red-100 cursor-pointer"
                        >
                            <Trash2 size={18} />
                            <span>Delete ({selectedIds.length})</span>
                        </button>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".xlsx, .xls, .csv"
                        className="hidden"
                    />
                    <button
                        onClick={onRefresh}
                        className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-[#D4AF37] rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <button
                        onClick={onDownloadTemplate}
                        className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-100 text-blue-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-50 transition-all shadow-sm cursor-pointer"
                    >
                        <FileSpreadsheet size={18} />
                        <span>Template</span>
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-100 text-green-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-green-50 transition-all shadow-sm cursor-pointer"
                    >
                        <Upload size={18} />
                        <span>Import</span>
                    </button>
                    <button
                        onClick={onAddNew}
                        className="flex items-center space-x-2 px-6 py-3 bg-[#1F2937] text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                    >
                        <Plus size={20} />
                        <span>{t('admin.products.addNew')}</span>
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-2xl flex-1 max-w-md border border-gray-100 focus-within:border-[#D4AF37] focus-within:bg-white transition-all">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('admin.products.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full font-medium text-[#1F2937] placeholder-gray-400"
                        />
                    </div>
                    <button className="flex items-center space-x-2 px-5 py-3 bg-gray-50 text-gray-500 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors border border-gray-100 cursor-pointer">
                        <Filter size={18} />
                        <span>Filters</span>
                    </button>
                </div>
                <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                    <span>Showing</span>
                    <span className="text-[#1F2937]">
                        {pagination
                            ? `${(pagination.page - 1) * pagination.limit + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)}`
                            : products.length
                        }
                    </span>
                    <span>of</span>
                    <span className="text-[#1F2937]">{pagination ? pagination.total : products.length}</span>
                    <span>results</span>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                <th className="px-8 py-5 w-10">
                                    <input
                                        type="checkbox"
                                        checked={products.length > 0 && selectedIds.length === products.length}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] cursor-pointer"
                                    />
                                </th>
                                <th className="px-6 py-5 text-left">{t('admin.products.table.product')}</th>
                                <th className="px-6 py-5">{t('admin.products.table.category')}</th>
                                <th className="px-6 py-5">{t('admin.products.table.price')}</th>
                                <th className="px-6 py-5">{t('admin.products.table.stock')}</th>
                                <th className="px-6 py-5">{t('admin.products.table.status')}</th>
                                <th className="px-8 py-5 text-right">{t('admin.products.table.actions')}</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center text-gray-400">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Package size={32} className="opacity-20" />
                                        </div>
                                        <p className="text-sm font-medium">No products found matching "{searchTerm}"</p>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id || product._id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(product._id || product.id)}
                                                onChange={() => handleSelectOne(product._id || product.id)}
                                                className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 shadow-sm border border-gray-100">
                                                    <img
                                                        src={product.images?.[0]?.url || product.image || 'https://via.placeholder.com/800'}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[#1F2937] leading-tight group-hover:text-[#D4AF37] transition-colors">{product.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: {product._id?.slice(-6) || product.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 bg-gray-100/50 border border-gray-200 px-3 py-1.5 rounded-lg">
                                                {typeof product.category === 'object' ? product.category.name : product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-bold text-[#1F2937]">
                                            ${product.price.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center space-x-2">
                                                <span className={`text-sm font-bold ${product.stock <= 5 ? 'text-red-500' : 'text-gray-600'}`}>
                                                    {product.stock}
                                                </span>
                                                {product.stock <= 5 && <AlertTriangle size={14} className="text-red-500" />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold border ${product.stock > 0
                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                : 'bg-red-50 text-red-700 border-red-100'
                                                }`}>
                                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => onEdit(product)}
                                                    className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors bg-white shadow-sm border border-gray-100 cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>

                                                <button
                                                    onClick={() => onDelete(product.id || product._id)}
                                                    className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors bg-white shadow-sm border border-gray-100 cursor-pointer"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                            </div>
                                            <div className="group-hover:hidden transition-all">
                                                <MoreVertical size={18} className="text-gray-300 ml-auto" />
                                            </div>
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
                                    // Show first, last, and pages around current
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
                                        return <span key={pageNum} className="text-gray-300">...</span>;
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


export default Products;
