import React, { useState, useEffect } from 'react';
import { Globe, DollarSign, Bell, Moon, Check, Loader2 } from 'lucide-react';
import { userService } from '../services/userService';
import { User, UserPreferences } from '../types';
import { useTranslation } from 'react-i18next';

export const Preferences: React.FC = () => {
    const { i18n } = useTranslation();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [preferences, setPreferences] = useState<UserPreferences>({
        language: 'en',
        currency: 'USD',
        emailNotifications: true,
        smsNotifications: false,
        theme: 'light',
    });

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            setLoading(true);
            const data = await userService.getProfile();
            setUser(data);
            if (data.preferences) {
                setPreferences(data.preferences);
                // Sync language with i18n
                if (data.preferences.language) {
                    i18n.changeLanguage(data.preferences.language);
                }
            }
        } catch (err: any) {
            // If not authenticated, load from localStorage
            const savedPrefs = localStorage.getItem('userPreferences');
            if (savedPrefs) {
                const parsed = JSON.parse(savedPrefs);
                setPreferences(parsed);
                if (parsed.language) {
                    i18n.changeLanguage(parsed.language);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSavePreferences = async () => {
        try {
            setSaving(true);
            setError('');

            // Save to localStorage (works for both authenticated and non-authenticated users)
            localStorage.setItem('userPreferences', JSON.stringify(preferences));

            // Change language
            i18n.changeLanguage(preferences.language);

            // If authenticated, save to backend
            if (user) {
                const updated = await userService.updatePreferences(preferences);
                setUser(updated);
            }

            setSuccess('Preferences saved successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to save preferences');
        } finally {
            setSaving(false);
        }
    };

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
    ];

    const currencies = [
        { code: 'USD', name: 'US Dollar', symbol: '$' },
        { code: 'EUR', name: 'Euro', symbol: '€' },
        { code: 'GBP', name: 'British Pound', symbol: '£' },
        { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    ];

    const themes = [
        { code: 'light', name: 'Light', icon: '☀️' },
        { code: 'dark', name: 'Dark', icon: '🌙' },
        { code: 'auto', name: 'Auto', icon: '🔄' },
    ];

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

            {/* Language Preference */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                    <Globe className="text-[#D4AF37]" size={24} />
                    <h3 className="text-xl font-bold serif">Language</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => setPreferences({ ...preferences, language: lang.code as UserPreferences['language'] })}
                            className={`p-4 border-2 rounded-lg text-left transition-all ${preferences.language === lang.code
                                ? 'border-[#D4AF37] bg-amber-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{lang.flag}</span>
                                    <span className="font-bold">{lang.name}</span>
                                </div>
                                {preferences.language === lang.code && (
                                    <Check className="text-[#D4AF37]" size={20} />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Currency Preference */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                    <DollarSign className="text-[#D4AF37]" size={24} />
                    <h3 className="text-xl font-bold serif">Currency</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currencies.map((currency) => (
                        <button
                            key={currency.code}
                            onClick={() => setPreferences({ ...preferences, currency: currency.code as UserPreferences['currency'] })}
                            className={`p-4 border-2 rounded-lg text-left transition-all ${preferences.currency === currency.code
                                ? 'border-[#D4AF37] bg-amber-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl font-bold">{currency.symbol}</span>
                                    <div>
                                        <div className="font-bold">{currency.code}</div>
                                        <div className="text-sm text-gray-500">{currency.name}</div>
                                    </div>
                                </div>
                                {preferences.currency === currency.code && (
                                    <Check className="text-[#D4AF37]" size={20} />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                    <Bell className="text-[#D4AF37]" size={24} />
                    <h3 className="text-xl font-bold serif">Notifications</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                            <h4 className="font-bold">Email Notifications</h4>
                            <p className="text-sm text-gray-500">Receive order updates and promotional emails</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={preferences.emailNotifications}
                                onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                            <h4 className="font-bold">SMS Notifications</h4>
                            <p className="text-sm text-gray-500">Receive order updates via SMS</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={preferences.smsNotifications}
                                onChange={(e) => setPreferences({ ...preferences, smsNotifications: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Theme Preference */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                    <Moon className="text-[#D4AF37]" size={24} />
                    <h3 className="text-xl font-bold serif">Theme</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {themes.map((theme) => (
                        <button
                            key={theme.code}
                            onClick={() => setPreferences({ ...preferences, theme: theme.code as UserPreferences['theme'] })}
                            className={`p-4 border-2 rounded-lg text-center transition-all ${preferences.theme === theme.code
                                ? 'border-[#D4AF37] bg-amber-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="text-3xl mb-2">{theme.icon}</div>
                            <div className="font-bold">{theme.name}</div>
                            {preferences.theme === theme.code && (
                                <Check className="text-[#D4AF37] mx-auto mt-2" size={20} />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSavePreferences}
                    disabled={saving}
                    className="bg-[#1F2937] text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-all disabled:opacity-50 flex items-center"
                >
                    {saving ? (
                        <>
                            <Loader2 className="animate-spin mr-2" size={16} />
                            <span>Saving...</span>
                        </>
                    ) : (
                        'Save Preferences'
                    )}
                </button>
            </div>
        </div>
    );
};
