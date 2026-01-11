import React, { useState } from 'react';
import { useAdminOrders } from '../../hooks/useAdmin';
import Orders from './Orders';
import OrderDetailsModal from './OrderDetailsModal';
import toast from 'react-hot-toast';
import { logger } from '../../utils/logger';

const OrdersContainer: React.FC = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset to first page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const {
        orders,
        pagination,
        isLoading,
        updateStatus,
        refetch
    } = useAdminOrders({ page, search: debouncedSearch });

    const handleView = (orderId: string) => {
        const order = orders.find(o => (o._id || o.id) === orderId);
        if (order) {
            setSelectedOrder(order);
            setIsModalOpen(true);
            logger.info('Viewing order details', { orderId });
        } else {
            toast.error('Order details not found');
        }
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            await updateStatus({ id: orderId, status: newStatus });
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const handleDownloadCsv = () => {
        try {
            const headers = ['Order Number', 'Customer', 'Date', 'Status', 'Total Amount'];
            const csvRows = [headers.join(',')];

            for (const order of orders) {
                const row = [
                    order._id,
                    `"${(order.user?.name || order.shippingAddress?.fullName || 'Guest').replace(/"/g, '""')}"`,
                    new Date(order.createdAt).toLocaleDateString(),
                    order.orderStatus,
                    order.totalAmount
                ];
                csvRows.push(row.join(','));
            }

            const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "orders_export.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Orders exported successfully');
        } catch (error) {
            logger.error('Failed to export CSV', { error });
            toast.error('Failed to export CSV');
        }
    };

    // Format orders for the presentation component
    const formattedOrders = orders.map(order => ({
        id: order._id || order.id,
        customer: order.user?.name || order.shippingAddress?.fullName || 'Guest',
        date: new Date(order.createdAt).toLocaleDateString(),
        status: order.orderStatus,
        items: (order.items || order.orderItems)?.length || 0,
        total: order.totalAmount,
        rawData: order
    }));

    return (
        <>
            <Orders
                orders={formattedOrders}
                loading={isLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                pagination={pagination}
                onPageChange={setPage}
                onRefresh={refetch}
                onView={handleView}
                onStatusUpdate={handleStatusUpdate}
                onDownloadCsv={handleDownloadCsv}
            />

            <OrderDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                order={selectedOrder}
            />
        </>
    );
};

export default OrdersContainer;


