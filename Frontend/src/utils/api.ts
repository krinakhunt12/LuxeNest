import axios from 'axios';
import { useLoadingStore } from '../store/useLoadingStore';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Start loading if not specifically disabled in config
        if (!(config as any).hideLoader) {
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
        if (!(response.config as any).hideLoader) {
            useLoadingStore.getState().stopLoading();
        }
        return response;
    },
    (error) => {
        if (!(error.config as any).hideLoader) {
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

