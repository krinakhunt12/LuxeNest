import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    Layers
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';

const AdminLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { name: t('admin.sidebar.dashboard'), path: '/admin', icon: LayoutDashboard },
        { name: t('admin.sidebar.products'), path: '/admin/products', icon: Package },
        { name: 'Categories', path: '/admin/categories', icon: Layers },
        { name: t('admin.sidebar.orders'), path: '/admin/orders', icon: ShoppingBag },
        { name: t('admin.sidebar.customers'), path: '/admin/users', icon: Users },
    ];


    const handleLogout = async () => {
        await logout();
        navigate('/admin-login');
    };


    return (
        <div className="flex h-screen bg-[#FAFAFA] font-sans overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'
                    } bg-[#1F2937] text-white transition-all duration-300 flex flex-col z-50`}
            >
                <div className="p-6 flex items-center justify-between border-b border-gray-800">
                    <Link to="/" className={`serif font-bold text-xl tracking-tighter ${!isSidebarOpen && 'hidden'}`}>
                        LUXENEST<span className="text-[#D4AF37]">.</span>
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1 hover:bg-gray-800 rounded transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 mt-8 space-y-2 px-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.path === '/admin'
                            ? location.pathname === '/admin'
                            : location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group ${isActive
                                    ? 'bg-[#D4AF37] text-white shadow-lg'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-white'} />
                                {isSidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 w-full text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="text-sm font-medium">{t('admin.sidebar.logout')}</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Top Header */}
                <header className="bg-white h-20 border-b border-gray-200 flex items-center justify-between px-8 z-40">
                    <div className="flex items-center space-x-4 bg-gray-50 px-4 py-2 rounded-lg w-96">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="bg-transparent border-none outline-none text-sm w-full"
                        />
                    </div>

                    <div className="flex items-center space-x-6">
                        <button className="relative text-gray-400 hover:text-[#1F2937] transition-colors">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center space-x-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-[#1F2937]">{user?.name || 'Admin User'}</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-white font-bold serif">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-[#FAFAFA]">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
