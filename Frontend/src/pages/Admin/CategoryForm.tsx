import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { useAdminCategories } from '../../hooks/useAdmin';

interface CategoryFormProps {
    isOpen: boolean;
    onClose: () => void;
    category?: any;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ isOpen, onClose, category }) => {
    const { createCategory, updateCategory, isSaving } = useAdminCategories();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true,
        displayOrder: 0
    });
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                description: category.description || '',
                isActive: category.isActive !== undefined ? category.isActive : true,
                displayOrder: category.displayOrder || 0
            });
            setImagePreview(category.image || '');
        } else {
            setFormData({
                name: '',
                description: '',
                isActive: true,
                displayOrder: 0
            });
            setImage(null);
            setImagePreview('');
        }
    }, [category, isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('isActive', String(formData.isActive));
        data.append('displayOrder', String(formData.displayOrder));
        if (image) {
            data.append('image', image);
        }

        try {
            if (category) {
                await updateCategory({ id: category._id || category.id, data });
            } else {
                await createCategory(data);
            }
            onClose();
        } catch (error) {
            console.error('Failed to save category', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between p-8 border-b">
                    <h2 className="text-2xl font-bold serif text-[#1F2937]">
                        {category ? 'Edit Category' : 'Add New Category'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Category Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all font-medium"
                                    placeholder="e.g. Living Room"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all font-medium h-32"
                                    placeholder="Brief category description..."
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-[#1F2937]">Active Status</p>
                                    <p className="text-xs text-gray-400">Toggle category visibility</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${formData.isActive ? 'bg-[#D4AF37]' : 'bg-gray-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? 'right-1' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-6">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Category Image</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all overflow-hidden group"
                            >
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                            <p className="text-xs font-bold uppercase tracking-widest">Change Image</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-4 bg-white rounded-2xl shadow-sm mb-3">
                                            <Upload className="text-[#D4AF37]" size={24} />
                                        </div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center px-4">
                                            Click to upload<br />category cover photo
                                        </p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Display Order</label>
                                <input
                                    type="number"
                                    value={formData.displayOrder}
                                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-4 pt-4 border-t">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 bg-[#1F2937] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={20} /> : null}
                            <span>{category ? 'Save Changes' : 'Create Category'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white border border-gray-100 text-[#1F2937] py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;
