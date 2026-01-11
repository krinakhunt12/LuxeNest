import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Facebook, Chrome, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

export const Auth: React.FC<{ initialMode: 'login' | 'signup' }> = ({ initialMode }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/account');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        toast.success('Welcome back to LuxeNest!');
      } else {
        await signup(formData.name, formData.email, formData.phone, formData.password);
        toast.success('Account created successfully! Welcome to LuxeNest.');
      }
      // Navigation will happen automatically via useEffect when isAuthenticated changes
    } catch (err: any) {
      const message = err.message || (mode === 'login' ? 'Login failed' : 'Signup failed');
      toast.error(message, {
        duration: 4000,
        style: {
          background: '#FFF1F1',
          color: '#C53030',
          border: '1px solid #FEB2B2',
        },
      });
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 serif">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'login' ? 'Enter your credentials to access your account' : 'Join LuxeNest and transform your space'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs uppercase tracking-widest font-bold text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:z-10 sm:text-sm"
                  placeholder="Jane Doe"
                />
              </div>
            )}
            {mode === 'signup' && (
              <div>
                <label className="text-xs uppercase tracking-widest font-bold text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:z-10 sm:text-sm"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            )}
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:z-10 sm:text-sm"
                placeholder="jane@example.com"
              />
            </div>
            <div className="relative">
              <label className="text-xs uppercase tracking-widest font-bold text-gray-700">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 bottom-3 text-gray-400 hover:text-[#D4AF37]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded" />
              <label className="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>
            {mode === 'login' && (
              <div className="text-sm">
                <a href="#" className="font-medium text-[#D4AF37] hover:text-[#1F2937]">Forgot password?</a>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold uppercase tracking-widest rounded-lg text-white bg-[#1F2937] hover:bg-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{mode === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
                </div>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <Facebook className="text-blue-600" size={20} />
            </button>
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <Chrome className="text-red-500" size={20} />
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
            }}
            className="text-sm font-medium text-[#D4AF37] hover:text-[#1F2937]"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};