import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';
import {
    Search,
    MoreVertical,
    User as UserIcon,
    Mail,
    Calendar,
    Shield,
    Filter,
    Download,
    RefreshCw
} from 'lucide-react';


interface UsersProps {
    users: any[];
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onRefresh: () => void;
}

const Users: React.FC<UsersProps> = ({
    users,
    loading,
    searchTerm,
    setSearchTerm,
    onRefresh
}) => {
    const { t } = useTranslation();

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
            <p className="text-gray-400 font-medium animate-pulse">Accessing Customer Directory...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold serif text-[#1F2937]">{t('admin.sidebar.customers')}</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your customer base and their permissions.</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={onRefresh}
                        className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-[#D4AF37] rounded-xl shadow-sm transition-all"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-100 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                        <Download size={18} />
                        <span>Export List</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex-1 max-w-md transition-all">
                    <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2.5 rounded-xl flex-1 focus-within:bg-white border border-transparent focus-within:border-[#D4AF37]/20 transition-all">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full font-medium text-[#1F2937] placeholder-gray-400"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-5 py-3.5 bg-gray-50 text-gray-500 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors border border-gray-100">
                        <Filter size={18} />
                        <span>Filter Roles</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                <th className="px-8 py-5 border-b border-gray-100">Customer</th>
                                <th className="px-6 py-5 border-b border-gray-100">Role</th>
                                <th className="px-6 py-5 border-b border-gray-100">Joined Date</th>
                                <th className="px-6 py-5 border-b border-gray-100">Orders</th>
                                <th className="px-8 py-5 text-center border-b border-gray-100">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-gray-400">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <UserIcon size={32} className="opacity-20" />
                                        </div>
                                        <p className="text-sm font-medium">No customers found matching "{searchTerm}"</p>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id || user._id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-11 h-11 rounded-2xl bg-[#1F2937]/5 flex items-center justify-center text-[#1F2937] font-bold border border-gray-100 relative group-hover:bg-[#1F2937] group-hover:text-white transition-all">
                                                    {user.name?.charAt(0)}
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[#1F2937] leading-tight">{user.name}</p>
                                                    <p className="text-xs text-gray-400 mt-1 flex items-center font-medium">
                                                        <Mail size={12} className="mr-1.5 opacity-50" /> {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold border ${user.role === 'ADMIN'
                                                ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                : 'bg-blue-50 text-blue-700 border-blue-100'
                                                }`}>
                                                <Shield size={10} className="mr-1.5" />
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm text-gray-500 flex items-center font-medium">
                                                <Calendar size={14} className="mr-2 opacity-30" />
                                                {user.joined}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-[#1F2937]">{user.orders}</span>
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-1.5">orders</span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <Menu as="div" className="relative inline-block text-left">
                                                <Menu.Button className="p-2.5 hover:bg-white rounded-xl text-gray-400 hover:text-[#1F2937] transition-all hover:shadow-md border border-transparent hover:border-gray-100 focus:outline-none">
                                                    <MoreVertical size={18} />
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
                                                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-100 rounded-2xl shadow-xl focus:outline-none z-50 py-2">
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button className={`${active ? 'bg-gray-50 text-[#D4AF37]' : 'text-gray-700'} group flex w-full items-center px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors`}>
                                                                    View Profile
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button className={`${active ? 'bg-gray-50 text-[#D4AF37]' : 'text-gray-700'} group flex w-full items-center px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors`}>
                                                                    Edit Permissions
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                        <hr className="my-1 border-gray-50" />
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button className={`${active ? 'bg-red-50 text-red-600' : 'text-red-500'} group flex w-full items-center px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors`}>
                                                                    Deactivate User
                                                                </button>
                                                            )}
                                                        </Menu.Item>
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
            </div>
        </div>
    );
};

export default Users;
