import React, { useState, useEffect, Fragment } from 'react';
import { X, Upload, Plus, Trash2, ChevronDown, Loader2 } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import { useAdminProducts } from '../../hooks/useAdmin';

import { logger } from '../../utils/logger';

interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    product?: any; // If provided, we are editing
}

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, onSuccess, product }) => {
    const { categories: categoriesRaw, createProduct, updateProduct, isSaving } = useAdminProducts();
    const categories = Array.isArray(categoriesRaw) ? categoriesRaw : (categoriesRaw as any)?.data || [];

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        subCategory: '',
        isNew: false,
        isSale: false,
        isBestSeller: false,
        isPremium: false,
        isFeatured: false,
    });
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [showCustomColorInput, setShowCustomColorInput] = useState(false);
    const [customColorName, setCustomColorName] = useState('');

    // Predefined color options for furniture and interior design
    const availableColors = [
        { name: 'White', hex: '#FFFFFF', border: true },
        { name: 'Black', hex: '#000000' },
        { name: 'Gray', hex: '#808080' },
        { name: 'Charcoal', hex: '#36454F' },
        { name: 'Brown', hex: '#8B4513' },
        { name: 'Beige', hex: '#F5F5DC' },
        { name: 'Cream', hex: '#FFFDD0' },
        { name: 'Ivory', hex: '#FFFFF0' },
        { name: 'Navy', hex: '#000080' },
        { name: 'Walnut', hex: '#5C4033' },
        { name: 'Oak', hex: '#C19A6B' },
        { name: 'Mahogany', hex: '#C04000' },
        { name: 'Espresso', hex: '#3D2817' },
        { name: 'Taupe', hex: '#483C32' },
        { name: 'Sage', hex: '#9DC183' },
        { name: 'Olive', hex: '#808000' },
        { name: 'Teal', hex: '#008080' },
        { name: 'Burgundy', hex: '#800020' },
        { name: 'Gold', hex: '#FFD700' },
        { name: 'Silver', hex: '#C0C0C0' },
        { name: 'Bronze', hex: '#CD7F32' },
        { name: 'Copper', hex: '#B87333' },
        { name: 'Champagne', hex: '#F7E7CE' },
        { name: 'Slate', hex: '#708090' },
    ];

    // Function to detect color from name using a color mapping
    const detectColorFromName = (colorName: string): string => {
        const colorMap: { [key: string]: string } = {
            // Reds
            'red': '#FF0000', 'crimson': '#DC143C', 'maroon': '#800000', 'burgundy': '#800020',
            'wine': '#722F37', 'coral': '#FF7F50', 'salmon': '#FA8072',
            // Blues
            'blue': '#0000FF', 'navy': '#000080', 'royal': '#4169E1', 'sky': '#87CEEB',
            'teal': '#008080', 'turquoise': '#40E0D0', 'cyan': '#00FFFF', 'azure': '#007FFF',
            // Greens
            'green': '#008000', 'lime': '#00FF00', 'olive': '#808000', 'sage': '#9DC183',
            'mint': '#98FF98', 'emerald': '#50C878', 'forest': '#228B22', 'jade': '#00A86B',
            // Yellows/Golds
            'yellow': '#FFFF00', 'gold': '#FFD700', 'amber': '#FFBF00', 'mustard': '#FFDB58',
            'champagne': '#F7E7CE', 'honey': '#FFC30B', 'lemon': '#FFF44F',
            // Oranges
            'orange': '#FFA500', 'tangerine': '#F28500', 'peach': '#FFE5B4', 'apricot': '#FBCEB1',
            'rust': '#B7410E', 'terracotta': '#E2725B', 'copper': '#B87333',
            // Purples
            'purple': '#800080', 'violet': '#8F00FF', 'lavender': '#E6E6FA', 'plum': '#DDA0DD',
            'mauve': '#E0B0FF', 'lilac': '#C8A2C8', 'orchid': '#DA70D6',
            // Browns
            'brown': '#8B4513', 'tan': '#D2B48C', 'beige': '#F5F5DC', 'taupe': '#483C32',
            'walnut': '#5C4033', 'oak': '#C19A6B', 'mahogany': '#C04000', 'espresso': '#3D2817',
            'chocolate': '#7B3F00', 'caramel': '#C68E17', 'sand': '#C2B280', 'khaki': '#C3B091',
            // Grays/Blacks/Whites
            'white': '#FFFFFF', 'ivory': '#FFFFF0', 'cream': '#FFFDD0', 'pearl': '#EAE0C8',
            'black': '#000000', 'charcoal': '#36454F', 'gray': '#808080', 'grey': '#808080',
            'silver': '#C0C0C0', 'platinum': '#E5E4E2', 'slate': '#708090', 'ash': '#B2BEB5',
            // Pinks
            'pink': '#FFC0CB', 'blush': '#DE5D83', 'fuchsia': '#FF00FF', 'magenta': '#FF00FF',
            'rose': '#FF007F', 'dusty rose': '#DCAE96',
            // Metals
            'bronze': '#CD7F32', 'brass': '#B5A642', 'pewter': '#96A8A1',
        };

        const lowerName = colorName.toLowerCase().trim();

        // Check for exact match
        if (colorMap[lowerName]) {
            return colorMap[lowerName];
        }

        // Check for partial matches
        for (const [key, value] of Object.entries(colorMap)) {
            if (lowerName.includes(key) || key.includes(lowerName)) {
                return value;
            }
        }

        // Default to gray if no match found
        return '#808080';
    };


    useEffect(() => {
        if (isOpen) {
            if (product) {
                setFormData({
                    name: product.name || '',
                    description: product.description || '',
                    price: product.price?.toString() || '',
                    stock: product.stock?.toString() || '',
                    category: product.category?._id || product.category || '',
                    subCategory: product.subCategory || '',
                    isNew: product.isNew || false,
                    isSale: product.isSale || false,
                    isBestSeller: product.isBestSeller || false,
                    isPremium: product.isPremium || false,
                    isFeatured: product.isFeatured || false,
                });
                if (product.images) {
                    setPreviews(product.images.map((img: any) => img.url));
                }
                if (product.colors) {
                    setSelectedColors(product.colors);
                }
            } else {
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    stock: '',
                    category: '',
                    subCategory: '',
                    isNew: false,
                    isSale: false,
                    isBestSeller: false,
                    isPremium: false,
                    isFeatured: false,
                });
                setImages([]);
                setPreviews([]);
                setSelectedColors([]);
            }
        }
    }, [isOpen, product]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages(prev => [...prev, ...newFiles]);

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const toggleColor = (colorName: string) => {
        setSelectedColors(prev =>
            prev.includes(colorName)
                ? prev.filter(c => c !== colorName)
                : [...prev, colorName]
        );
    };

    const addCustomColor = () => {
        if (customColorName.trim() && !selectedColors.includes(customColorName.trim())) {
            setSelectedColors(prev => [...prev, customColorName.trim()]);
            setCustomColorName('');
            setShowCustomColorInput(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value.toString());
            });
            images.forEach(image => {
                data.append('images', image);
            });
            // Add colors as JSON string
            data.append('colors', JSON.stringify(selectedColors));

            if (product) {
                await updateProduct({ id: product._id || product.id, data });
            } else {
                await createProduct(data);
            }
            onSuccess();
            onClose();
        } catch (error) {
            // Error already handled
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col scale-in duration-300">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold serif text-[#1F2937]">
                            {product ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <p className="text-gray-500 text-sm">Fill in the details to {product ? 'update' : 'create'} the product.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close form">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Product Name</label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter product name"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Description</label>
                                <textarea
                                    required
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter product description"
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all font-medium resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Price ($)</label>
                                    <input
                                        required
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Stock</label>
                                    <input
                                        required
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Category & Images */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Category</label>
                                <Listbox
                                    value={formData.category}
                                    onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                                >
                                    <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full px-4 py-3 text-left bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all font-medium">
                                            <span className="block truncate capitalize text-gray-700">
                                                {categories.find((cat: any) => cat._id === formData.category)?.name || 'Select Category'}
                                            </span>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                                <ChevronDown size={18} className="text-gray-400" />
                                            </span>
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute z-50 w-full py-2 mt-2 overflow-auto bg-white border border-gray-100 rounded-2xl shadow-2xl max-h-60 focus:outline-none sm:text-sm">
                                                {categories.map((cat: any) => (
                                                    <Listbox.Option
                                                        key={cat._id}
                                                        className={({ active }) =>
                                                            `relative cursor-pointer select-none py-3 px-6 transition-colors ${active ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-[#1F2937]'
                                                            }`
                                                        }
                                                        value={cat._id}
                                                    >
                                                        {({ selected }) => (
                                                            <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>
                                                                {cat.name}
                                                            </span>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>


                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Images</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {previews.map((preview, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                aria-label="Remove image"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF37] hover:bg-gray-50 transition-all text-gray-400 hover:text-[#D4AF37]">
                                        <Upload size={24} className="mb-2" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Upload</span>
                                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            {/* Color Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                    Available Colors ({selectedColors.length} selected)
                                </label>
                                <div className="grid grid-cols-4 gap-3">
                                    {availableColors.map((color) => (
                                        <button
                                            key={color.name}
                                            type="button"
                                            onClick={() => toggleColor(color.name)}
                                            className={`relative group flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${selectedColors.includes(color.name)
                                                ? 'bg-[#D4AF37]/10 ring-2 ring-[#D4AF37]'
                                                : 'bg-gray-50 hover:bg-gray-100'
                                                }`}
                                            aria-label={`${selectedColors.includes(color.name) ? 'Remove' : 'Add'} ${color.name} color`}
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-full transition-transform ${selectedColors.includes(color.name) ? 'scale-110' : 'group-hover:scale-105'
                                                    } ${color.border ? 'border-2 border-gray-300' : ''}`}
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            <span className="text-[10px] font-bold text-gray-600 text-center">
                                                {color.name}
                                            </span>
                                            {selectedColors.includes(color.name) && (
                                                <div className="absolute top-1 right-1 w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}

                                    {/* Other Color Button */}
                                    <button
                                        type="button"
                                        onClick={() => setShowCustomColorInput(!showCustomColorInput)}
                                        className={`relative group flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${showCustomColorInput
                                            ? 'bg-[#D4AF37]/10 ring-2 ring-[#D4AF37]'
                                            : 'bg-gray-50 hover:bg-gray-100'
                                            }`}
                                        aria-label="Add custom color"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 flex items-center justify-center">
                                            <Plus size={20} className="text-white font-bold" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-600 text-center">
                                            Other
                                        </span>
                                    </button>
                                </div>

                                {/* Custom Color Input */}
                                {showCustomColorInput && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3 animate-in slide-in-from-top duration-300">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                            Enter Custom Color Name
                                        </label>
                                        <div className="flex gap-3">
                                            <div className="flex-1 relative">
                                                <input
                                                    type="text"
                                                    value={customColorName}
                                                    onChange={(e) => setCustomColorName(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomColor())}
                                                    placeholder="e.g., Dusty Rose, Sage Green, Navy Blue"
                                                    className="w-full px-4 py-3 pr-14 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all font-medium"
                                                />
                                                {customColorName && (
                                                    <div
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-gray-300"
                                                        style={{ backgroundColor: detectColorFromName(customColorName) }}
                                                        title={`Detected color: ${detectColorFromName(customColorName)}`}
                                                    />
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={addCustomColor}
                                                disabled={!customColorName.trim()}
                                                className="px-6 py-3 bg-[#1F2937] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#D4AF37] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            💡 Tip: Type any color name (e.g., "Burgundy", "Mint Green", "Charcoal") and we'll automatically detect the color!
                                        </p>
                                    </div>
                                )}

                                {/* Selected Custom Colors Display */}
                                {selectedColors.some(color => !availableColors.find(c => c.name === color)) && (
                                    <div className="mt-3 p-3 bg-blue-50 rounded-xl">
                                        <label className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 block">
                                            Custom Colors
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedColors
                                                .filter(color => !availableColors.find(c => c.name === color))
                                                .map((color) => (
                                                    <div
                                                        key={color}
                                                        className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-blue-200"
                                                    >
                                                        <div
                                                            className="w-6 h-6 rounded-full border-2 border-gray-300"
                                                            style={{ backgroundColor: detectColorFromName(color) }}
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">{color}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleColor(color)}
                                                            className="ml-1 text-red-500 hover:text-red-700"
                                                            aria-label={`Remove ${color} color`}
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Product Type Switches */}
                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Product Types</label>
                                <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <span className="text-sm font-bold text-gray-600 group-hover:text-[#1F2937] transition-colors">New Arrival</span>
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                name="isNew"
                                                checked={formData.isNew}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                            />
                                            <div className={`w-12 h-6 rounded-full transition-colors ${formData.isNew ? 'bg-[#D4AF37]' : 'bg-gray-200'}`}></div>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isNew ? 'translate-x-6' : ''}`}></div>
                                        </div>
                                    </label>

                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <span className="text-sm font-bold text-gray-600 group-hover:text-[#1F2937] transition-colors">On Sale</span>
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                name="isSale"
                                                checked={formData.isSale}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                            />
                                            <div className={`w-12 h-6 rounded-full transition-colors ${formData.isSale ? 'bg-[#D4AF37]' : 'bg-gray-200'}`}></div>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isSale ? 'translate-x-6' : ''}`}></div>
                                        </div>
                                    </label>

                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <span className="text-sm font-bold text-gray-600 group-hover:text-[#1F2937] transition-colors">Best Seller</span>
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                name="isBestSeller"
                                                checked={formData.isBestSeller}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                            />
                                            <div className={`w-12 h-6 rounded-full transition-colors ${formData.isBestSeller ? 'bg-[#D4AF37]' : 'bg-gray-200'}`}></div>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isBestSeller ? 'translate-x-6' : ''}`}></div>
                                        </div>
                                    </label>

                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <span className="text-sm font-bold text-gray-600 group-hover:text-[#1F2937] transition-colors">Premium Product</span>
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                name="isPremium"
                                                checked={formData.isPremium}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                            />
                                            <div className={`w-12 h-6 rounded-full transition-colors ${formData.isPremium ? 'bg-[#D4AF37]' : 'bg-gray-200'}`}></div>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isPremium ? 'translate-x-6' : ''}`}></div>
                                        </div>
                                    </label>

                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <span className="text-sm font-bold text-gray-600 group-hover:text-[#1F2937] transition-colors">Featured Product</span>
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                name="isFeatured"
                                                checked={formData.isFeatured}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                            />
                                            <div className={`w-12 h-6 rounded-full transition-colors ${formData.isFeatured ? 'bg-[#D4AF37]' : 'bg-gray-200'}`}></div>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isFeatured ? 'translate-x-6' : ''}`}></div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isSaving}
                            type="submit"
                            className="px-10 py-4 bg-[#1F2937] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#D4AF37] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 flex items-center"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={16} />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                product ? 'Update Product' : 'Create Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
