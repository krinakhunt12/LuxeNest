import React, { useState } from 'react';
import { useAdminProducts } from '../../hooks/useAdmin';
import Products from './Products';
import ProductForm from './ProductForm';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

const ProductsContainer: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const {
        products,
        pagination,
        isLoading,
        deleteProduct,
        deleteProductsBulk,
        refetch
    } = useAdminProducts({ page, search: debouncedSearch });


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);


    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
        }
    };

    const handleDeleteBulk = async (ids: string[]) => {
        await deleteProductsBulk(ids);
    };

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleUploadExcel = async (file: File) => {
        try {
            await adminService.uploadExcel(file);
            toast.success('Products imported successfully');
            refetch();
        } catch (error) {
            console.error('Failed to upload Excel', error);
            toast.error('Failed to import products');
        }
    };

    const handleDownloadTemplate = () => {
        const headers = ['Name', 'Price', 'Description', 'Category', 'Stock', 'Image', 'SKU'];
        const sampleRow = ['Modern Sofa', '999.99', 'A comfortable modern sofa', 'Living Room', '10', 'https://example.com/image.jpg', 'SOFA-001'];
        const csvContent = "data:text/csv;charset=utf-8," + [headers, sampleRow].map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "product_import_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <Products
                products={products}
                loading={isLoading}
                searchTerm={searchTerm}
                setSearchTerm={(term) => {
                    setSearchTerm(term);
                    setPage(1); // Reset to first page on search
                }}
                pagination={pagination}
                onPageChange={setPage}
                onDelete={handleDelete}
                onDeleteBulk={handleDeleteBulk}
                onEdit={handleEdit}
                onAddNew={handleAddNew}
                onRefresh={refetch}
                onUploadExcel={handleUploadExcel}
                onDownloadTemplate={handleDownloadTemplate}
            />


            <ProductForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => { }} // Success handled by hook mutation onSuccess
                product={editingProduct}
            />
        </>
    );
};

export default ProductsContainer;
