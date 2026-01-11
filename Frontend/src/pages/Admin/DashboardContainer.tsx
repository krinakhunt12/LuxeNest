import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { logger } from '../../utils/logger';
import Dashboard from './Dashboard';
import toast from 'react-hot-toast';

const DashboardContainer: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                logger.info('Fetching dashboard statistics...');
                const data = await adminService.getDashboardStats();
                setStats(data);
                logger.debug('Dashboard statistics fetched successfully', { data });
            } catch (error) {
                logger.warn('Failed to fetch dashboard stats', { error });
                setStats(null);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleExportReport = () => {
        try {
            if (!stats) return;

            const headers = ['Metric', 'Value'];
            const rows = [
                ['Total Customers', stats.totalCustomers],
                ['Total Products', stats.totalProducts],
                ['Total Orders', stats.totalOrders],
                ['Total Revenue', `$${stats.totalRevenue.toLocaleString()}`],
                ['', ''],
                ['Recent Orders', ''],
                ['Order ID', 'Customer', 'Status', 'Date', 'Amount']
            ];

            stats.recentOrders.forEach((order: any) => {
                rows.push([
                    order.id,
                    order.customer,
                    order.status,
                    order.date,
                    `$${order.amount}`
                ]);
            });

            const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `LuxeNest_Report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Report exported successfully');
        } catch (error) {
            toast.error('Failed to export report');
        }
    };

    const handleGenerateInvoice = async () => {
        try {
            if (!stats?.recentOrders?.length) {
                toast.error('No recent orders to generate invoice');
                return;
            }

            const latestOrderShort = stats.recentOrders[0];
            const fullOrder = await adminService.getOrderById(latestOrderShort.id);

            if (!fullOrder) {
                toast.error('Could not fetch order details');
                return;
            }

            // Simple beautiful print view in new window
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                const html = `
                    <html>
                        <head>
                            <title>Invoice - ${fullOrder._id}</title>
                            <style>
                                body { font-family: 'Inter', sans-serif; padding: 40px; color: #1F2937; }
                                .container { max-width: 800px; margin: 0 auto; border: 1px solid #E5E7EB; padding: 40px; border-radius: 20px; }
                                .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; }
                                .company-info h1 { margin: 0; font-size: 24px; color: #1F2937; }
                                .company-info p { margin: 5px 0; font-size: 12px; color: #6B7280; }
                                .invoice-info { text-align: right; }
                                .invoice-info h2 { margin: 0; color: #D4AF37; font-size: 32px; font-weight: 800; }
                                .section { margin-bottom: 30px; }
                                .section-title { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #9CA3AF; margin-bottom: 15px; }
                                .address-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; }
                                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                th { text-align: left; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #9CA3AF; padding: 10px 0; border-bottom: 1px solid #F3F4F6; }
                                td { padding: 15px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; }
                                .totals { margin-left: auto; width: 250px; margin-top: 30px; }
                                .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
                                .total-row.grand-total { border-top: 2px solid #D4AF37; margin-top: 10px; padding-top: 15px; font-weight: 900; font-size: 20px; color: #1F2937; }
                                @media print { body { padding: 0; } .container { border: none; } .no-print { display: none; } }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <div class="company-info">
                                        <h1>LUXENEST</h1>
                                        <p>Premium Hardware & Interior Solutions</p>
                                        <p>GSTIN: 24AAABC1234A1Z1</p>
                                    </div>
                                    <div class="invoice-info">
                                        <h2>INVOICE</h2>
                                        <p>#${fullOrder._id}</p>
                                        <p>Date: ${new Date(fullOrder.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div class="section address-grid">
                                    <div>
                                        <div class="section-title">Billed To</div>
                                        <strong>${fullOrder.user?.name || fullOrder.shippingAddress?.name}</strong>
                                        <p style="font-size: 12px; color: #6B7280; margin: 5px 0;">
                                            ${fullOrder.shippingAddress?.addressLine1}<br>
                                            ${fullOrder.shippingAddress?.addressLine2 ? fullOrder.shippingAddress.addressLine2 + '<br>' : ''}
                                            ${fullOrder.shippingAddress?.city}, ${fullOrder.shippingAddress?.state} ${fullOrder.shippingAddress?.zipCode}
                                        </p>
                                        <p style="font-size: 12px; color: #6B7280;">${fullOrder.user?.email}</p>
                                    </div>
                                    <div style="text-align: right;">
                                        <div class="section-title">Payment Method</div>
                                        <p style="font-weight: 700; font-size: 14px;">${fullOrder.paymentMethod}</p>
                                        <p style="font-size: 10px; background: #FFFBEB; color: #B45309; display: inline-block; padding: 4px 10px; border-radius: 5px; margin-top: 5px;">${fullOrder.paymentStatus}</p>
                                    </div>
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Description</th>
                                            <th style="text-align: center;">Price</th>
                                            <th style="text-align: center;">Qty</th>
                                            <th style="text-align: right;">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${fullOrder.items.map((item: any) => `
                                            <tr>
                                                <td>
                                                    <strong>${item.name}</strong><br>
                                                    <span style="font-size: 10px; color: #6B7280;">Color: ${item.selectedColor || 'N/A'}</span>
                                                </td>
                                                <td style="text-align: center;">$${item.price.toLocaleString()}</td>
                                                <td style="text-align: center;">${item.quantity}</td>
                                                <td style="text-align: right;">$${(item.price * item.quantity).toLocaleString()}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                                <div class="totals">
                                    <div class="total-row"><span>Subtotal</span><span>$${fullOrder.subtotal.toLocaleString()}</span></div>
                                    <div class="total-row"><span>Shipping</span><span style="color: #059669;">Free</span></div>
                                    <div class="total-row grand-total"><span>Total</span><span>$${fullOrder.totalAmount.toLocaleString()}</span></div>
                                </div>
                                <div style="margin-top: 60px; text-align: center; color: #9CA3AF; font-size: 10px;">
                                    <p>Thank you for choosing LuxeNest. For support, email us at support@luxenest.com</p>
                                    <p>This is a computer generated document and does not require signature.</p>
                                </div>
                            </div>
                            <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }</script>
                        </body>
                    </html>
                `;
                printWindow.document.write(html);
                printWindow.document.close();
            }
        } catch (error) {
            toast.error('Failed to generate invoice');
        }
    };

    return (
        <Dashboard
            stats={stats}
            loading={loading}
            onExportReport={handleExportReport}
            onGenerateInvoice={handleGenerateInvoice}
        />
    );
};


export default DashboardContainer;
