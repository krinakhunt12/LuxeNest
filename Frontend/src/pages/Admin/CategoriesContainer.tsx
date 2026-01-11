import React, { useState } from 'react';
import { useAdminCategories } from '../../hooks/useAdmin';
import Categories from './Categories';
import CategoryForm from './CategoryForm';

const CategoriesContainer: React.FC = () => {
    const [page, setPage] = useState(1);
    const {
        categories,
        pagination,
        isLoading,
        deleteCategory,
        refetch
    } = useAdminCategories({ page });


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this category? All products in this category will become uncategorized.')) {
            await deleteCategory(id);
        }
    };

    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleRefresh = () => {
        // Categories list will automatically refetch via useAdminCategories
    };

    return (
        <>
            <Categories
                categories={categories}
                loading={isLoading}
                pagination={pagination}
                onPageChange={setPage}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onAddNew={handleAddNew}
                onRefresh={refetch}
            />


            <CategoryForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                category={editingCategory}
            />
        </>
    );
};

export default CategoriesContainer;
