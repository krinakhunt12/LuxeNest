import React, { useState, useEffect, Fragment } from 'react';
import { User, MapPin, Phone, Mail, Trash2, Edit2, Plus, Check, ChevronDown, Loader2 } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import { userService } from '../services/userService';

import { User as UserType, Address } from '../types';

export const ProfileSettings: React.FC = () => {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingAddress, setEditingAddress] = useState<string | null>(null);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        name: '',
        phone: '',
    });

    // Address form state
    const [addressForm, setAddressForm] = useState<Partial<Address>>({
        type: 'home',
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        isDefault: false,
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await userService.getProfile();
            setUser(data);
            setProfileForm({
                name: data.name,
                phone: data.phone,
            });
        } catch (err: any) {
            setError(err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError('');
            const updated = await userService.updateProfile(profileForm);
            setUser(updated);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError('');
            const addresses = await userService.addAddress(addressForm as Omit<Address, '_id'>);
            setUser(prev => prev ? { ...prev, addresses } : null);
            setShowAddAddress(false);
            resetAddressForm();
            setSuccess('Address added successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to add address');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateAddress = async (id: string) => {
        try {
            setSaving(true);
            setError('');
            await userService.updateAddress(id, addressForm);
            await loadProfile();
            setEditingAddress(null);
            resetAddressForm();
            setSuccess('Address updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update address');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            setSaving(true);
            setError('');
            await userService.deleteAddress(id);
            await loadProfile();
            setSuccess('Address deleted successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to delete address');
        } finally {
            setSaving(false);
        }
    };

    const handleSetDefaultAddress = async (id: string) => {
        try {
            setSaving(true);
            setError('');
            await userService.setDefaultAddress(id);
            await loadProfile();
            setSuccess('Default address updated!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to set default address');
        } finally {
            setSaving(false);
        }
    };

    const startEditAddress = (address: Address) => {
        setEditingAddress(address._id!);
        setAddressForm(address);
    };

    const resetAddressForm = () => {
        setAddressForm({
            type: 'home',
            name: '',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'India',
            isDefault: false,
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Success Message */}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                    <Check size={20} />
                    <span>{success}</span>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Personal Information */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold serif mb-6">Personal Information</h3>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={profileForm.name}
                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                value={profileForm.phone}
                                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#1F2937] text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all disabled:opacity-50 flex items-center"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={16} />
                                <span>Saving...</span>
                            </>
                        ) : (
                            'Update Profile'
                        )}
                    </button>
                </form>
            </div>

            {/* Addresses */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold serif">Saved Addresses</h3>
                    <button
                        onClick={() => setShowAddAddress(!showAddAddress)}
                        className="flex items-center space-x-2 text-[#D4AF37] font-bold text-sm uppercase tracking-widest hover:underline"
                    >
                        <Plus size={18} />
                        <span>Add New</span>
                    </button>
                </div>

                {/* Add Address Form */}
                {showAddAddress && (
                    <form onSubmit={handleAddAddress} className="mb-6 p-6 bg-gray-50 rounded-lg space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Address Type</label>
                                <Listbox
                                    value={addressForm.type}
                                    onChange={(value) => setAddressForm({ ...addressForm, type: value as Address['type'] })}
                                >
                                    <div className="relative">
                                        <Listbox.Button className="relative w-full px-4 py-3 text-left border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white transition-all">
                                            <span className="block truncate capitalize">{addressForm.type}</span>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <ChevronDown size={18} className="text-gray-400" />
                                            </span>
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 focus:outline-none sm:text-sm">
                                                {['home', 'work', 'other'].map((type) => (
                                                    <Listbox.Option
                                                        key={type}
                                                        className={({ active }) =>
                                                            `relative cursor-pointer select-none py-2 px-4 ${active ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-gray-900'
                                                            }`
                                                        }
                                                        value={type}
                                                    >
                                                        <span className="block truncate capitalize">{type}</span>
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={addressForm.name}
                                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={addressForm.phone}
                                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Address Line 1</label>
                                <input
                                    type="text"
                                    value={addressForm.addressLine1}
                                    onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Address Line 2</label>
                                <input
                                    type="text"
                                    value={addressForm.addressLine2}
                                    onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                                <input
                                    type="text"
                                    value={addressForm.city}
                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                                <input
                                    type="text"
                                    value={addressForm.state}
                                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">ZIP Code</label>
                                <input
                                    type="text"
                                    value={addressForm.zipCode}
                                    onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isDefault"
                                checked={addressForm.isDefault}
                                onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
                            />
                            <label htmlFor="isDefault" className="text-sm text-gray-700">Set as default address</label>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-[#1F2937] text-white px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all disabled:opacity-50 flex items-center"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={16} />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    'Save Address'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddAddress(false);
                                    resetAddressForm();
                                }}
                                className="border border-gray-300 text-gray-700 px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Address List */}
                <div className="space-y-4">
                    {user?.addresses && user.addresses.length > 0 ? (
                        user.addresses.map((address) => (
                            <div
                                key={address._id}
                                className={`p-6 border rounded-lg ${address.isDefault ? 'border-[#D4AF37] bg-amber-50' : 'border-gray-200'}`}
                            >
                                {editingAddress === address._id ? (
                                    <form onSubmit={(e) => { e.preventDefault(); handleUpdateAddress(address._id!); }} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Address Type</label>
                                                <Listbox
                                                    value={addressForm.type}
                                                    onChange={(value) => setAddressForm({ ...addressForm, type: value as Address['type'] })}
                                                >
                                                    <div className="relative">
                                                        <Listbox.Button className="relative w-full px-4 py-2 text-left border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white transition-all">
                                                            <span className="block truncate capitalize">{addressForm.type}</span>
                                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                                <ChevronDown size={18} className="text-gray-400" />
                                                            </span>
                                                        </Listbox.Button>
                                                        <Transition
                                                            as={Fragment}
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"
                                                        >
                                                            <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 focus:outline-none sm:text-sm">
                                                                {['home', 'work', 'other'].map((type) => (
                                                                    <Listbox.Option
                                                                        key={type}
                                                                        className={({ active }) =>
                                                                            `relative cursor-pointer select-none py-2 px-4 ${active ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-gray-900'
                                                                            }`
                                                                        }
                                                                        value={type}
                                                                    >
                                                                        <span className="block truncate capitalize">{type}</span>
                                                                    </Listbox.Option>
                                                                ))}
                                                            </Listbox.Options>
                                                        </Transition>
                                                    </div>
                                                </Listbox>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={addressForm.name}
                                                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={addressForm.phone}
                                                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Address Line 1</label>
                                                <input
                                                    type="text"
                                                    value={addressForm.addressLine1}
                                                    onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                                                <input
                                                    type="text"
                                                    value={addressForm.city}
                                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                                                <input
                                                    type="text"
                                                    value={addressForm.state}
                                                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">ZIP Code</label>
                                                <input
                                                    type="text"
                                                    value={addressForm.zipCode}
                                                    onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex space-x-4">
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="bg-[#1F2937] text-white px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all disabled:opacity-50 flex items-center"
                                            >
                                                {saving ? (
                                                    <>
                                                        <Loader2 className="animate-spin mr-2" size={16} />
                                                        <span>Saving...</span>
                                                    </>
                                                ) : (
                                                    'Save Changes'
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingAddress(null);
                                                    resetAddressForm();
                                                }}
                                                className="border border-gray-300 text-gray-700 px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase">
                                                        {address.type}
                                                    </span>
                                                    {address.isDefault && (
                                                        <span className="px-3 py-1 bg-[#D4AF37] text-white rounded-full text-xs font-bold uppercase">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="font-bold text-lg mb-1">{address.name}</h4>
                                                <p className="text-gray-600 text-sm mb-1">{address.addressLine1}</p>
                                                {address.addressLine2 && <p className="text-gray-600 text-sm mb-1">{address.addressLine2}</p>}
                                                <p className="text-gray-600 text-sm mb-1">
                                                    {address.city}, {address.state} {address.zipCode}
                                                </p>
                                                <p className="text-gray-600 text-sm mb-1">{address.country}</p>
                                                <p className="text-gray-600 text-sm flex items-center space-x-1">
                                                    <Phone size={14} />
                                                    <span>{address.phone}</span>
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => startEditAddress(address)}
                                                    className="p-2 text-gray-600 hover:text-[#D4AF37] transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAddress(address._id!)}
                                                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        {!address.isDefault && (
                                            <button
                                                onClick={() => handleSetDefaultAddress(address._id!)}
                                                className="mt-4 text-[#D4AF37] text-sm font-bold uppercase tracking-widest hover:underline"
                                            >
                                                Set as Default
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-8">No addresses saved yet. Add your first address above.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
