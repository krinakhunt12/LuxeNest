import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../../utils/logger';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logger.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/admin';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
                        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-8">
                            <ShieldAlert size={40} />
                        </div>

                        <h1 className="text-2xl font-bold text-[#1F2937] serif mb-4">
                            Something went wrong
                        </h1>

                        <p className="text-gray-500 mb-8 leading-relaxed">
                            We encountered an unexpected error in the admin dashboard. Our team has been notified.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full flex items-center justify-center space-x-2 bg-[#1F2937] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#D4AF37] transition-all shadow-lg"
                            >
                                <RefreshCw size={18} />
                                <span>Reload Page</span>
                            </button>

                            <button
                                onClick={this.handleReset}
                                className="w-full flex items-center justify-center space-x-2 bg-gray-50 text-[#1F2937] py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-100 transition-all"
                            >
                                <Home size={18} />
                                <span>Back to Dashboard</span>
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-8 pt-8 border-t border-gray-100 text-left">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-red-400 mb-2">Error Details</p>
                                <div className="bg-red-50 p-4 rounded-lg overflow-auto max-h-40">
                                    <p className="text-xs font-mono text-red-700">{this.state.error?.toString()}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
