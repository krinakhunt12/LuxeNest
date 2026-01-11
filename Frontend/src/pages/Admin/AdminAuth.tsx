import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, Mail, Lock, User as UserIcon, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

export const AdminAuth: React.FC<{ initialMode: 'login' | 'signup' }> = ({ initialMode }) => {
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { adminLogin, adminSignup, user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    // Redirect if already authenticated as Admin
    useEffect(() => {
        if (isAuthenticated && user?.role === 'ADMIN') {
            navigate('/admin');
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'login') {
                await adminLogin(formData.email, formData.password);
                toast.success('Admin access granted.');
            } else {
                await adminSignup(formData.name, formData.email, formData.phone, formData.password);
                toast.success('Admin account created successfully.');
            }
        } catch (err: any) {
            toast.error(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAFAFA]">
            {/* Left side: branding/intro */}
            <div className="lg:w-1/2 bg-[#1F2937] p-12 lg:p-24 flex flex-col justify-between text-white overflow-hidden relative">
                <div className="relative z-10">
                    <Link to="/" className="text-3xl font-bold tracking-tighter serif">
                        LuxeNest<span className="text-[#D4AF37]">.</span> Dashboard
                    </Link>
                    <div className="mt-20 max-w-md">
                        <h1 className="text-4xl md:text-6xl font-bold serif leading-tight mb-6">
                            Control your <span className="text-[#D4AF37]">Empire.</span>
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Experience the pinnacle of hospitality management. Real-time analytics, automated orders, and customer insights at your fingertips.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 mt-12 flex space-x-8">
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-[#D4AF37]">24/7</span>
                        <span className="text-xs uppercase tracking-widest text-gray-500">Live Monitoring</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-[#D4AF37]">99.9%</span>
                        <span className="text-xs uppercase tracking-widest text-gray-500">System Uptime</span>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#D4AF37] opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-500 opacity-5 rounded-full blur-3xl"></div>
            </div>

            {/* Right side: form */}
            <div className="lg:w-1/2 flex items-center justify-center p-8 md:p-16">
                <div className="max-w-md w-full">
                    <div className="mb-10">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#D4AF37] mb-6 shadow-sm">
                            <ShieldCheck size={28} />
                        </div>
                        <h2 className="text-3xl font-bold text-[#1F2937] serif">
                            {mode === 'login' ? 'Admin Login' : 'Admin Registration'}
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Please enter your authorized administrator credentials.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {mode === 'signup' && (
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Merchant Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter full name"
                                        className="w-full bg-white border border-gray-100 px-12 py-4 rounded-xl outline-none focus:border-[#D4AF37] transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {mode === 'signup' && (
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Business phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="e.g. +1 234 567 890"
                                        className="w-full bg-white border border-gray-100 px-12 py-4 rounded-xl outline-none focus:border-[#D4AF37] transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Official Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="admin@luxenest.com"
                                    className="w-full bg-white border border-gray-100 px-12 py-4 rounded-xl outline-none focus:border-[#D4AF37] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Security Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className="w-full bg-white border border-gray-100 px-12 py-4 rounded-xl outline-none focus:border-[#D4AF37] transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37]"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1F2937] text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#D4AF37] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0"
                        >
                            {loading ? 'Authenticating...' : mode === 'login' ? 'Access Dashboard' : 'Register Administrator'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                            className="text-sm font-medium text-gray-400 hover:text-[#1F2937] transition-colors"
                        >
                            {mode === 'login'
                                ? "New administrator? Apply for register"
                                : "Already registered? Login to dash"}
                        </button>
                    </div>

                    <div className="mt-12 text-center pt-8 border-t border-gray-100">
                        <Link to="/login" className="text-xs uppercase tracking-widest font-bold text-[#D4AF37] hover:underline">
                            Standard User Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAuth;
