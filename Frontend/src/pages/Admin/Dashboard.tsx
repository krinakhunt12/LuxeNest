import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    TrendingUp,
    Users,
    ShoppingBag,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';

interface DashboardProps {
    stats: any;
    loading: boolean;
    onExportReport: () => void;
    onGenerateInvoice: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
    stats,
    loading,
    onExportReport,
    onGenerateInvoice
}) => {
    const { t } = useTranslation();

    const statCards = [
        {
            name: t('admin.dashboard.stats.revenue'),
            value: `$${stats?.totalRevenue?.toLocaleString() || '0'}`,
            icon: DollarSign,
            color: 'bg-green-50 text-green-600',
            trend: '+12.5%',
            isUp: true
        },
        {
            name: t('admin.dashboard.stats.orders'),
            value: stats?.totalOrders || '0',
            icon: ShoppingBag,
            color: 'bg-blue-50 text-blue-600',
            trend: '+8.2%',
            isUp: true
        },
        {
            name: t('admin.dashboard.stats.customers'),
            value: stats?.totalCustomers || '0',
            icon: Users,
            color: 'bg-purple-50 text-purple-600',
            trend: '+15.3%',
            isUp: true
        },
        {
            name: t('admin.sidebar.products'),
            value: stats?.totalProducts || '0',
            icon: TrendingUp,
            color: 'bg-orange-50 text-orange-600',
            trend: '-2.4%',
            isUp: false
        },
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
            <p className="text-gray-400 font-medium animate-pulse">Synchronizing Dashboard...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold serif text-[#1F2937]">{t('admin.dashboard.title')}</h1>
                    <p className="text-gray-500 text-sm mt-1">{t('admin.dashboard.subtitle')}</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={onExportReport}
                        className="px-6 py-3 border border-gray-100 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-colors bg-white shadow-sm cursor-pointer"
                    >
                        Export Report
                    </button>
                    <button
                        onClick={onGenerateInvoice}
                        className="px-6 py-3 bg-[#1F2937] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                    >
                        Generate Invoice
                    </button>
                </div>
            </div>


            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="flex items-start justify-between relative z-10">
                            <div className={`p-3 rounded-xl transition-colors ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div className={`flex items-center text-xs font-bold ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.trend} {stat.isUp ? <ArrowUpRight size={14} className="ml-1" /> : <ArrowDownRight size={14} className="ml-1" />}
                            </div>
                        </div>
                        <div className="mt-4 relative z-10">
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{stat.name}</p>
                            <h3 className="text-2xl font-bold mt-1 text-[#1F2937]">{stat.value}</h3>
                        </div>
                        {/* Decorative background circle */}
                        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                ))}
            </div>

            {/* Charts / Table Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold serif text-[#1F2937]">{t('admin.dashboard.recentOrders')}</h3>
                        <button className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:underline">
                            {t('admin.dashboard.viewAll')}
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                    <th className="px-6 py-4">{t('admin.orders.table.id')}</th>
                                    <th className="px-6 py-4">{t('admin.orders.table.customer')}</th>
                                    <th className="px-6 py-4">{t('admin.orders.table.status')}</th>
                                    <th className="px-6 py-4">{t('admin.orders.table.date')}</th>
                                    <th className="px-6 py-4 text-right">{t('admin.orders.table.total')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats?.recentOrders?.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-xs font-bold text-gray-400 font-mono">#{order.id}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-[#1F2937]">{order.customer}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-100' :
                                                order.status === 'PROCESSING' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-[#1F2937] text-right">${order.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-[#1F2937] rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold serif mb-4">Stock Analytics</h3>
                        <p className="text-gray-400 text-sm mb-10 leading-relaxed">Inventory utilization is peaking. View replenishment recommendations.</p>
                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-3">
                                    <span className="text-gray-400">Bedroom Items</span>
                                    <span className="text-[#D4AF37]">78%</span>
                                </div>
                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#D4AF37] w-[78%] rounded-full"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-3">
                                    <span className="text-gray-400">Living Room Items</span>
                                    <span className="text-blue-400">45%</span>
                                </div>
                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[45%] rounded-full"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-3">
                                    <span className="text-gray-400">Office Items</span>
                                    <span className="text-green-400">92%</span>
                                </div>
                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[92%] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-12 py-4 bg-white text-[#1F2937] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#D4AF37] hover:text-white transition-all shadow-lg">
                        Manage Inventory
                    </button>

                    {/* Decorative mesh */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-[0.05] rounded-full blur-3xl -mr-32 -mt-32"></div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
