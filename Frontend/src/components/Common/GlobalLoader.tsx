import React from 'react';
import { useLoadingStore } from '../../store/useLoadingStore';

const GlobalLoader: React.FC = () => {
    const isLoading = useLoadingStore((state) => state.isLoading);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-sm transition-all duration-300">
            <div className="relative">
                {/* Outer Ring */}
                <div className="h-20 w-20 rounded-full border-4 border-gray-100 border-t-[#D4AF37] animate-spin"></div>

                {/* Inner Ring (Reverse Spin) */}
                <div className="absolute inset-2 h-16 w-16 rounded-full border-4 border-transparent border-b-[#1F2937] animate-spin-reverse opacity-70"></div>

                {/* Center Pulse */}
                <div className="absolute inset-[30%] h-[40%] w-[40%] bg-[#D4AF37] rounded-full animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
            </div>

            <div className="absolute mt-32 text-center">
                <p className="text-[#1F2937] font-medium tracking-widest text-xs uppercase animate-pulse">
                    Crafting Luxury...
                </p>
            </div>
        </div>
    );
};

export default GlobalLoader;
