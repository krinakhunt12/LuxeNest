import axios from 'axios';
import { useLoadingStore } from '../store/useLoadingStore';

const API_BASE_URL = 'https://luxenest-mshr.onrender.com/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
    timeout: 10000, // 10 second timeout
    decompress: true, // Enable gzip decompression
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Only show loading for user-initiated requests, not background refetches
        if (!(config as any).hideLoader && !(config as any).isBackground) {
            useLoadingStore.getState().startLoading();
        }

        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        useLoadingStore.getState().stopLoading();
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        // Only stop loading for user-initiated requests
        if (!(response.config as any).hideLoader && !(response.config as any).isBackground) {
            useLoadingStore.getState().stopLoading();
        }
        return response;
    },
    (error) => {
        // Only stop loading for user-initiated requests
        if (!(error.config as any).hideLoader && !(error.config as any).isBackground) {
            useLoadingStore.getState().stopLoading();
        }

        if (error.response) {
            // Handle specific error codes
            if (error.response.status === 401) {
                // Unauthorized - clear token and redirect to login
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }

            // Return error message from server
            return Promise.reject(error.response.data);
        }

        // Network error
        return Promise.reject({
            success: false,
            message: 'Network error. Please check your connection.',
        });
    }
);

export default api;

